import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database'
import { User } from '../../../models'
import { jwt } from '../../../utils';

type Data = 
| { ok: boolean, message: string }
| { ok: boolean, token: string, user: { name: string, role: string, email: string } }

export default function (req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'GET':
            return checkJWT(req, res)

        default:
            return res.status(400).json({
                ok: false,
                message: 'Method not allowed',
            })
        }
}

const checkJWT = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { token = '' } = req.cookies;

    let userId = '';

    try {
        userId = await jwt.isValidToken(token);
    } catch (error) {
        return res.status(401).json({
            ok: false,
            message: 'Token de autorizacón no es válido',
        });
    }
   
    await db.connect();
    const user = await User.findById(userId).lean();
    await db.disconnect();

    if (!user) {
        return res.status(400).json({
            ok: false,
            message: 'User no existe con ese id',
        });
    }


    const { _id, email, role, name } = user;

    return res.status(200).json({
        ok: true,
        token: jwt.signToken(_id, email),
        user: {
            name, role, email
        }
    });
}
