import { FC, useEffect, useReducer } from 'react';
import { ICartProduct } from '../../interfaces';
import { CartContext, cartReducer } from './';
import Cookies from 'js-cookie';

interface Props {
    children?: React.ReactNode | undefined
}

export interface CartState {
    isLoaded: boolean;
    cart: ICartProduct[];
    numberOfItems: number;
    subTotal: number;
    tax: number;
    total: number;
    
    shippingAddress?: ShippingAddress
}

export interface ShippingAddress {
    firstName: string;
    lastName: string;
    address: string;
    address2?: string;
    zip: string;
    city: string;
    country: string;
    phone: string;
}

const CART_INITIAL_STATE: CartState = {
    isLoaded: false,
    cart: [],
    numberOfItems: 0,
    subTotal: 0,
    tax: 0,
    total: 0,
    shippingAddress: undefined
}

export const CartPovider:FC<Props> = ({ children }) => {

    const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

    // Effect read cart from cookie

    useEffect(() => {

        //Se usa un try y catch debido a que puede manipularse la cookie entonces si lo hace manda un arreglo vacio
        try {
            const cookieProducts = Cookies.get('cart') ? JSON.parse(Cookies.get('cart')!) : [];
            dispatch({ type: '[CART] - LoadCart from cookies | storage', payload: cookieProducts });
        } catch (error) {
            dispatch({ type: '[CART] - LoadCart from cookies | storage', payload: [] });
        }

    }, [])

    useEffect(() => {
        if(Cookies.get('firstName')){
            const shippingAddress = {
                firstName : Cookies.get('firstName') || '',
                lastName  : Cookies.get('lastName') || '',
                address   : Cookies.get('address') || '',
                address2  : Cookies.get('address2') || '',
                zip       : Cookies.get('zip') || '',
                city      : Cookies.get('city') || '',
                country   : Cookies.get('country') || '',
                phone     : Cookies.get('phone') || '',
            }
            dispatch({ type: '[CART] - loadAddress from Cookies', payload: shippingAddress});
        }
    }, [])
    
    


    useEffect(() => {
        if (state.cart.length > 0) Cookies.set('cart', JSON.stringify(state.cart))
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

    const updateAddress = (address: ShippingAddress) => {
        Cookies.set('firstName', address.firstName);
        Cookies.set('lastName', address.lastName);
        Cookies.set('address', address.address);
        Cookies.set('address2', address.address2 || '');
        Cookies.set('zip', address.zip);
        Cookies.set('city', address.city);
        Cookies.set('country', address.country);
        Cookies.set('phone', address.phone);
        
        dispatch({ type: '[CART] - Update Address', payload: address });
    }

    return (
        <CartContext.Provider value={{
            ...state,

            //Methods
            addProductToCart,
            updateCartQuantity,
            removeCartProduct,
            updateAddress
        }}>
            { children }
        </CartContext.Provider>
    )
}