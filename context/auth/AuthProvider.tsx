import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { FC, useEffect, useReducer } from 'react';
import { tesloApi } from '../../api';
import { IUser } from '../../interfaces';
import { AuthContext, authReducer } from './';

interface Props {
    children?: React.ReactNode | undefined
}

export interface AuthState {
    isLoggedIn: boolean;
    user?: IUser;
}

const AUTH_INITIAL_STATE: AuthState = {
    isLoggedIn: false,
    user: undefined,
}

export const AuthPovider:FC<Props> = ({ children }) => {

    const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE)
    const router = useRouter();

    useEffect(() => {
        checkToken();
    }, [])
    
    const checkToken = async () => {
        if(!Cookies.get('token')) {
            return;
        }
        try {

            //En axios manda la cookie con el header
            //Si es fetch no manda y hay que forzar
            const { data } = await tesloApi.get('/user/validate-token');
            const { token, user } = data;
            // console.log({data});
            
            Cookies.set('token', token);
            dispatch({ type: '[AUTH] - Login', payload: user });

            // if(data.ok){
            //     Cookies.set('token', token);
            //     dispatch({
            //         type: '[AUTH] - Login',
            //         payload: data.user
            //     })
            // }
    
            // if(!data.ok){
            //     Cookies.remove('token');
            // }
            
        } catch (error) {
            console.log(error);
            Cookies.remove('token');
        }
        
    }




    const loginUser = async(email: string, password: string): Promise<boolean> => {
        try {
            const { data } = await tesloApi.post('/user/login', { email, password });
            const { token, user } = data;
            
            Cookies.set('token', token);
            
            dispatch({ type: '[AUTH] - Login', payload: user });

            return true;

        } catch (error) {

            console.log('Error en las credenciales');

            return false;
        }
    }

    const logoutUser = () => {
        Cookies.remove('token');
        Cookies.remove('cart');
        router.reload();
    }

    const registerUser = async(name: string, email: string, password: string): Promise<{hasError: boolean; message?: string}> => {
        try {

            const { data } = await tesloApi.post('/user/register', { name, email, password });
            const { token, user } = data;
            
            Cookies.set('token', token);
            
            dispatch({ type: '[AUTH] - Login', payload: user });

            return {
                hasError: false,
            }
            
        } catch (error) {

            if(axios.isAxiosError(error)){
                const { message } = error.response?.data as {message : string}
                return {
                    hasError: true,
                    message
                }
            }

            return {
                hasError: true,
                message: 'Error al registrar el usuario'
            }
        }
    }


    return (
        <AuthContext.Provider value={{
            ...state,


            //Metods
            loginUser,
            logoutUser,
            registerUser
        }}>
            { children }
        </AuthContext.Provider>
    )
}