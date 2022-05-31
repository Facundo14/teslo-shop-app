import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { IProduct } from '../../../interfaces/products';
import { Product } from '../../../models';

type Data = 
| { ok: boolean, message: string }
| { ok: boolean, message: string, product: IProduct }

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return getProductBySlug(req, res);
    
        default:
            return res.status(405).json({
                ok: false,
                message: 'Method not allowed'
            })
    }
    
}

const getProductBySlug =  async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { slug } = req.query;
    await db.connect();

    const product = await Product.findOne({ slug })
                                .select('-_id')
                                .lean();
    
    await db.disconnect();

    if(!product) {
        return res.status(404).json({
            ok: false,
            message: 'Product not found'
        })
    }

    return res.status(200).json({
        ok: true,
        message: 'Product retrieved successfully',
        product
    })


}
