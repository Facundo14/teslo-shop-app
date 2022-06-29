import { ICartProduct } from '../../interfaces';
import { CartState, ShippingAddress } from './';


type CartActionType = 
  | { type: '[CART] - LoadCart from cookies | storage',  payload: ICartProduct[]}
  | { type: '[CART] - Update product in cart',  payload: ICartProduct[]}
  | { type: '[CART] - Change cart quantity',  payload: ICartProduct}
  | { type: '[CART] - Remove product in cart',  payload: ICartProduct}
  | { type: '[CART] - loadAddress from Cookies',  payload: ShippingAddress}
  | { type: '[CART] - Update Address',  payload: ShippingAddress}
  | { 
      type: '[CART] - Update order summary',
      payload: {
        numberOfItems: number;
        subTotal: number;
        tax: number;
        total: number;
      }
    }

export const cartReducer = (state: CartState, action: CartActionType): CartState => {
   switch (action.type) {
      case '[CART] - LoadCart from cookies | storage':
        return {
          ...state,
          isLoaded:true,
          cart: [...action.payload]
        }

      case '[CART] - Update product in cart':
          return {
            ...state,
            cart: [...action.payload] 
          }

      case '[CART] - Change cart quantity':
          return {
            ...state,
            cart: state.cart.map(product => {
              if( product._id !== action.payload._id ) return product;
              if( product.size !== action.payload.size ) return product;
              
              return action.payload;
            })
          }
      
      case '[CART] - Remove product in cart':
        return {
          ...state,
          cart: state.cart.filter(product => !(product._id === action.payload._id && product.size === action.payload.size))
        }

      case '[CART] - Update order summary':
        return {
          ...state,
          ...action.payload
        }

      
      case '[CART] - Update Address':
      case '[CART] - loadAddress from Cookies':
        return {
          ...state,
          shippingAddress: action.payload
        }
        

      default:
         return state;
     }


}