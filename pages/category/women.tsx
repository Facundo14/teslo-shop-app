import type { NextPage } from 'next'

import { Typography } from '@mui/material';

import { ShopLayout } from '../../components/layouts';
import { ProductList } from '../../components/products';
import { useProducts } from '../../hooks';
import { FullScreenLoading } from '../../components/ui';

const Women: NextPage = () => {

  const { products, isLoading } = useProducts('/products?gender=women');
  return (
    <ShopLayout title={'Teslo-Shop - Category:Women'} pageDescription={'Categoria mujeres'}>
      <Typography variant='h1' component='h1' >Mujeres</Typography>
      <Typography variant='h2' sx={{ mb: 1 }} >Productos para ellas</Typography>

      {
        isLoading 
          ? <FullScreenLoading />
          : <ProductList products={ products }/>
      }

    </ShopLayout>
  )
}

export default Women
