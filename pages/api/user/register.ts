import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database'
import { User } from '../../../models'
import bcrypt from 'bcryptjs';
import { jwt, validations } from '../../../utils';

type Data = 
| { ok: boolean,message: string }
| { ok: boolean, token: string, user: { name: string, role: string, email: string } }

export default function (req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'POST':
            return registerUser(req, res)

        default:
            return res.status(400).json({
                ok: false,
                message: 'Method not allowed',
            })
        }
}

const registerUser = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { email = '', password = '', name = '' } = req.body as { email: string, password: string, name: string };

    if(password.length < 6){
        return res.status(400).json({
            ok: false,
            message: 'La contraseña debe tener al menos 6 caracteres',
        });
    }

    if(name.length < 3){
        return res.status(400).json({
            ok: false,
            message: 'El nombre debe tener al menos 3 caracteres',
        });
    }

    if(!validations.isValidEmail(email)){
        return res.status(400).json({
            ok: false,
            message: 'El email no es válido',
        });
    }

    await db.connect();
    const user = await User.findOne({ email });

    if (user) {
        await db.disconnect();
        return res.status(400).json({
            ok: false,
            message: 'El usuario ya existe',
        });
    }

    const newUser = new User({
        email: email.toLowerCase(),
        password: bcrypt.hashSync(password),
        name,
        role: 'client',
    });

    try {
        await newUser.save({ validateBeforeSave: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: 'Error al registrar el usuario',
        });
    }

    const { _id, role } = newUser;

    const token = jwt.signToken(_id, email);
    
    return res.status(200).json({
        ok: true,
        token,
        user: {
            name, role, email
        }
    });
}
