import type { NextPage, GetServerSideProps } from 'next'

import { Box, Typography } from '@mui/material';

import { ShopLayout } from '../../components/layouts';
import { ProductList } from '../../components/products';
import { dbProducts } from '../../database';
import { IProduct } from '../../interfaces/products';

interface Props {
    products: IProduct[];
    foundProducts: boolean;
    query: string;
}

const SearchPage: NextPage<Props> = ({ products, foundProducts, query }) => {

  return (
    <ShopLayout title={'Teslo-Shop - Search'} pageDescription={'Encuentra los mejores productos de Teslo aqui'}>
        <Typography variant='h1' component='h1' >Buscar producto</Typography>

        {
            foundProducts 
                ? <Typography variant='h2' sx={{ mb: 1 }} textTransform="capitalize">Término: { query }</Typography>
                : (
                    <Box display='flex'>
                        <Typography variant='h2' sx={{ mb: 1 }} >No encontramos ningún producto</Typography>
                        <Typography variant='h2' sx={{ mb: 1 }} color="secondary" textTransform="capitalize">{ query }</Typography>
                    </Box>
                )

        }

        <ProductList products={ products }/>
    </ShopLayout>
  )
}


export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    
    const { query = '' } = params as { query: string };

    if(query.trim().length === 0){
        return {
            redirect: {
                destination: '/',
                permanent: true
            }
        }
    }

    //busco algo y no hay productos
    let products = await dbProducts.getProductsByTerm(query);

    const foundProducts = products.length > 0;

    //TODO: retornar productos que pueden intersarle desde la cookies
    if(!foundProducts){
        // products = await dbProducts.getAllProducts();
        products = await dbProducts.getProductsByTerm('Plaid')
    }

    return {
        props: {
            products,
            foundProducts,
            query
        }
    }
}

export default SearchPage
