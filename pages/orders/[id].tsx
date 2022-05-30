import NextLink from 'next/link';
import { Box, Button, Card, CardContent, Chip, Divider, Grid, Link, Typography } from "@mui/material"
import { CartList, OrderSummary } from "../../components/cart"
import { ShopLayout } from "../../components/layouts"
import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';

const OrderPage = () => {
  return (
   <ShopLayout title={"Resumen de la order 4654654654"} pageDescription={"Resumen de la orden"}>
        <Typography variant="h1" component='h1'>Orden: ABC123</Typography>

        {/* <Chip 
            sx={{ my:2 }}
            label="Pendiente de pago"
            variant='outlined'
            color='error'
            icon={ <CreditCardOffOutlined /> }
        /> */}
        <Chip 
            sx={{ my:2 }}
            label="Orden ya fue pagada"
            variant='outlined'
            color='success'
            icon={ <CreditScoreOutlined /> }
        />

        <Grid container>
            <Grid item xs={ 12 } sm={ 7 }>
                <CartList />
            </Grid>
            <Grid item xs={ 12 } sm={ 5 }>
                <Card className='summary-card'>
                    <CardContent>
                        <Typography variant="h2">Resumen (3 productos)</Typography>

                        <Divider sx={{my:1}} />

                        <Box display='flex' justifyContent='space-between'>
                            <Typography variant='subtitle1' >Dirección de entrega</Typography>
                            <NextLink href='/checkout/address' passHref>
                                <Link underline='always'>Editar</Link>
                            </NextLink>
                        </Box>
                       
                        <Typography>Tanovich Facundo</Typography>
                        <Typography>321 Algun lugar</Typography>
                        <Typography>Posadas, Misiones</Typography>
                        <Typography>Argentina</Typography>
                        <Typography>+54 21321354654</Typography>

                        <Divider sx={{my:1}} />
                        <Box display='flex' justifyContent='end'>
                            <NextLink href='/cart' passHref>
                                <Link underline='always'>Editar</Link>
                            </NextLink>
                        </Box>

                        <OrderSummary />
                        <Box sx={{mt:3}}>
                            {/* TODO: boton para pagar */}
                            <h1>Pagar</h1>
                            <Chip 
                                sx={{ my:2 }}
                                label="Orden ya fue pagada"
                                variant='outlined'
                                color='success'
                                icon={ <CreditScoreOutlined /> }
                            />
                        </Box>
                    </CardContent>
                </Card>
            </Grid>

        </Grid>

   </ShopLayout>
  )
}

export default OrderPage