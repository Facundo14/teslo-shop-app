import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { Product } from '../../../models';
import { IProduct } from '../../../interfaces/products';

type Data = 
| { ok: boolean, message: string }
| { ok: boolean, message: string, products: IProduct[] }

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return searchProducts(req, res);

        default:
            return res.status(405).json({
                ok: false,
                message: 'Method not allowed'
            });
    }
}

const searchProducts = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    let { q = '' } = req.query;

    if( q.length === 0){
        return res.status(400).json({
            ok: false,
            message: 'Query is empty'
        });
    }

    q = q.toString().toLowerCase();

    await db.connect();

    const products = await Product.find({ $text: { $search: q } })
                                .select('images inStock price slug title -_id')
                                .lean();

    await db.disconnect();

    if(!products) {
        return res.status(404).json({
            ok: false,
            message: 'Products not found'
        })
    }

    return res.status(200).json({
        ok: true,
        message: 'Products retrieved successfully',
        products
    })

}
