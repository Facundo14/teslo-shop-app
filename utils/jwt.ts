import jwt from 'jsonwebtoken';

export const signToken = ( _id: string, email: string) => {
    if(!process.env.JWT_SECRET_SEED){
        throw new Error('JWT_SECRET_SEED no definido');
    }

    return jwt.sign(
        //payload
        { _id, email },
        //Semilla 
        process.env.JWT_SECRET_SEED, 
        //Opciones
        {
            expiresIn: '1h'
        }
    );
}

export const isValidToken = (token: string): Promise<string> => {
    if(!process.env.JWT_SECRET_SEED){
        throw new Error('JWT_SECRET_SEED no definido');
    }

    return new Promise((resolve, reject) => {
        try {
            jwt.verify(token, process.env.JWT_SECRET_SEED || '', (err, payload) => {
                if(err) return reject('JWT no es válido');
                
                const { _id } = payload as { _id: string };
                
                return resolve(_id);
            });
        } catch (error) {
            reject('JWT no es válido');
        }
    });
}