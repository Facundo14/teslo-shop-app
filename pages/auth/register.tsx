import React, { useContext, useState } from 'react'
import { useForm } from 'react-hook-form';
import NextLink from 'next/link';
import { Box, Button, Chip, Grid, Link, TextField, Typography } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';
import { AuthLayout } from '../../components/layouts';
import { validations } from '../../utils';
import { tesloApi } from '../../api';
import { AuthContext } from '../../context';
import { useRouter } from 'next/router';



type FormData = {
    name: string;
    email: string;
    password: string;
}

const RegisterPage = () => {

    const router = useRouter();
    const destination = router.query.p?.toString() || '/';

    const { registerUser } = useContext(AuthContext);

    const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();

    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');


    const onRegisterForm = async( {email, password, name}: FormData ) => {
        setShowError(false);

        const { hasError, message} = await registerUser(name, email, password);

        if(hasError) {
            setShowError(true);
            setErrorMessage(message!);

            setTimeout(() => {
                setShowError(false);
            }, 3000);

            return;
        }

        router.replace(destination);
    }

    return (
        <AuthLayout title={'Registro'}>
            <form onSubmit={ handleSubmit( onRegisterForm ) }>
                <Box sx={{ width:350, padding:'10px 20px'}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant='h1' component="h1" >Registrarse</Typography>
                            <Chip 
                                label={errorMessage} 
                                color='error'
                                icon={ <ErrorOutline /> } 
                                className='fadeIn'
                                sx={{ display: showError ? 'flex' : 'none', marginTop: '10px' }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField 
                                label='Nombre completo' 
                                variant='filled' 
                                fullWidth 
                                {
                                    ...register('name',{
                                        required: 'El nombre es requerido',
                                        minLength: {
                                            value: 3,
                                            message: 'El nombre debe tener al menos 3 caracteres'
                                        }
                                    })
                                }
                                error={ !!errors.name }
                                helperText={ errors.name?.message }
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField 
                                type='email'
                                label='Correo' 
                                variant='filled' 
                                fullWidth 
                                {
                                    ...register('email', {
                                        required: 'Este campo es requerido',
                                        validate: validations.isEmail
                                    })
                                }
                                error={ !!errors.email }
                                helperText={ errors.email?.message }
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField 
                                label='Contraseña' 
                                type='password' 
                                variant='filled' 
                                fullWidth 
                                {
                                    ...register('password',{
                                        required: 'Este campo es requerido',
                                        minLength: { value: 6, message: 'La contraseña debe tener al menos 6 caracteres' },
                                    })
                                }
                                error={ !!errors.password }
                                helperText={ errors.password?.message }
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Button 
                                color='secondary' 
                                className='circular-btn' 
                                size='large' 
                                fullWidth 
                                type='submit'
                            >
                                Registrarse
                            </Button>
                        </Grid>

                        <Grid item xs={12} display='flex' justifyContent='end'>
                            <NextLink href={`/auth/login?p=${ destination }`} passHref>
                                <Link underline='always'>
                                    ¿Ya tienes cuenta?
                                </Link>
                            </NextLink>
                        </Grid>
                    </Grid>
                </Box>
            </form>
        </AuthLayout>
    )
}

export default RegisterPage