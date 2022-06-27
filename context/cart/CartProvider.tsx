import { FC, useEffect, useReducer } from 'react';
import { ICartProduct } from '../../interfaces';
import { CartContext, cartReducer } from './';
import Cookie from 'js-cookie';

interface Props {
    children?: React.ReactNode | undefined
}

export interface CartState {
    cart: ICartProduct[];
    numberOfItems: number;
    subTotal: number;
    tax: number;
    total: number;
}

const CART_INITIAL_STATE: CartState = {
    cart: [],
    numberOfItems: 0,
    subTotal: 0,
    tax: 0,
    total: 0,
}

export const CartPovider:FC<Props> = ({ children }) => {

    const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

    // Effect read cart from cookie

    useEffect(() => {

        //Se usa un try y catch debido a que puede manipularse la cookie entonces si lo hace manda un arreglo vacio
        try {
            const cookieProducts = Cookie.get('cart') ? JSON.parse(Cookie.get('cart')!) : [];
            dispatch({ type: '[CART] - LoadCart from cookies | storage', payload: cookieProducts });
        } catch (error) {
            dispatch({ type: '[CART] - LoadCart from cookies | storage', payload: [] });
        }

    }, [])
    


    useEffect(() => {
        if (state.cart.length > 0) Cookie.set('cart', JSON.stringify(state.cart))
    }, [state.cart])


    useEffect(() => {

        const numberOfItems = state.cart.reduce((prev, current) => prev + current.quantity, 0);

        const subTotal = state.cart.reduce((prev, current) => prev + (current.price * current.quantity), 0);
        
        const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);

        const orderSummary = {
            numberOfItems,
            subTotal,
            tax: subTotal * taxRate,
            total: subTotal * (taxRate + 1)
        }

        dispatch({ type: '[CART] - Update order summary', payload: orderSummary });

    }, [state.cart])
    
    
    const addProductToCart = (product: ICartProduct) => {
        
        //!Mi forma
        // dispatch({
        //     type: '[CART] - Add Product | storage',
        //     payload: product
        // })

        //!La forma mal tambien
        // const productInCart = state.cart.find(item => item._id !== product._id && item.size !== product.size)
        // dispatch({
        //     type: '[CART] - Add Product | storage', payload: [...productInCart, product];
        // })

        //!La forma correcta
        const productInCart = state.cart.some(item => item._id === product._id);
        if(!productInCart) return dispatch({ type: '[CART] - Update product in cart', payload: [...state.cart, product] });

        const productInCartButDifferentSize = state.cart.some(item => item._id === product._id && item.size === product.size);
        if(!productInCartButDifferentSize) return dispatch({ type: '[CART] - Update product in cart', payload: [...state.cart, product] });

        //Acumular
        const updatedProducts = state.cart.map( item => {
            if(item._id !== product._id) return item;
            if(item.size !== product.size) return item;


            //Actualizar la cantidad
            item.quantity += product.quantity;
            return item;
        })

        dispatch({ type: '[CART] - Update product in cart', payload: updatedProducts });
    }

    const updateCartQuantity = (product: ICartProduct) => {
        dispatch({
            type: '[CART] - Change cart quantity',
            payload: product
        });
    }

    const removeCartProduct = (product: ICartProduct) => {
        dispatch({
            type: '[CART] - Remove product in cart',
            payload: product
        });
    }

    return (
        <CartContext.Provider value={{
            ...state,

            //Methods
            addProductToCart,
            updateCartQuantity,
            removeCartProduct
        }}>
            { children }
        </CartContext.Provider>
    )
}