import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
    ok: boolean,
    message: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
   
    switch (req.method) {
        
        default:
            return res.status(405).json({
                ok: false,
                message: 'Method not allowed'
            });
    }
}