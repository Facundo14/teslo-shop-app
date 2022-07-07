import { isValidObjectId } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';
import { IPaypal } from '../../../interfaces';
import { db } from '../../../database';
import { Order } from '../../../models';

type Data = {
    message: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {


    switch (req.method) {
        case 'POST':
            return payOrder(req, res);
    
        default:
            return res.status(405).json({ message: 'Method not allowed' });
    }

    res.status(200).json({ message: 'Example' })
}

const getPaypalBearerToken = async() => {
    
    const PAYPAL_CLIENT = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const PAYPAL_SECRET = process.env.PAYPAL_SECRET;

    const base64Token = Buffer.from(`${PAYPAL_CLIENT}:${PAYPAL_SECRET}`, 'utf-8').toString('base64');

    const body = new URLSearchParams('grant_type=client_credentials');
    

    try {
        const { data } = await axios.post( process.env.PAYPAL_OAUTH_URL || '', body, {
            headers:{
                'Authorization': `Basic ${ base64Token }`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        } )

        return data.access_token;
        
    } catch (error) {
        if(axios.isAxiosError(error)){
            console.log(error.response?.data)
        } else {
            console.log(error)
        }

        return null;
    }


}

const payOrder = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    //TODO: Validar session del usuario
    
    const paypalBearerToken =  await getPaypalBearerToken();
    
    if(!paypalBearerToken){
        return res.status(500).json({ message: 'Error getting paypal bearer token' })
    }
    
    const { transactionId = '', orderId = ''} = req.body;
    
    //TODO: Validar Mongo ID

    const { data } = await axios.get<IPaypal.PaypalOrderStatusResponse>(`${process.env.PAYPAL_ORDERS_URL}/${ transactionId }`, {
        headers:{
            'Authorization': `Bearer ${ paypalBearerToken }`
        }
    });

    if(data.status !== 'COMPLETED'){
        return res.status(401).json({ message: 'Orden no reconocida' })
    }

    await db.connect();

    const dbOrder = await Order.findById(orderId);

    if(!dbOrder){
        await db.disconnect();
        return res.status(400).json({ message: 'Orden no existe en la base de datos' })   
    }

    if( dbOrder.total !== Number(data.purchase_units[0].amount.value) ){
        await db.disconnect();
        return res.status(400).json({ message: 'Los monstos de paypal y nuestra orden no coinciden' })
    }

    dbOrder.transactionId = transactionId;
    dbOrder.isPaid = true;


    await dbOrder.save();
    await db.disconnect();

    
    return res.status(200).json({ message: 'Orden Pagada' })
}
