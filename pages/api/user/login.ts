import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database'
import { User } from '../../../models'
import bcrypt from 'bcryptjs';
import { jwt } from '../../../utils';

type Data = 
| { ok: boolean,message: string }
| { ok: boolean, token: string, user: { name: string, role: string, email: string } }

export default function (req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'POST':
            return loginUser(req, res)

        default:
            return res.status(400).json({
                ok: false,
                message: 'Method not allowed',
            })
        }
}

const loginUser = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { email = '', password = '' } = req.body;
    await db.connect();
    const user = await User.findOne({ email });
    await db.disconnect();

    if (!user) {
        return res.status(400).json({
            ok: false,
            message: 'User no encontrado',
        });
    }

    if(!bcrypt.compareSync(password, user.password!)){
        return res.status(400).json({
            ok: false,
            message: 'Correo o contraseña incorrectos',
        });
    }

    const { _id, role, name } = user;

    const token = jwt.signToken(_id, email);
    
    return res.status(200).json({
        ok: true,
        token,
        user: {
            name, role, email
        }
    });
}
