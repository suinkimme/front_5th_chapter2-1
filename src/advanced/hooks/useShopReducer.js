import { useReducer } from 'react';
import { shopReducer, initialState } from '../reducers/shopReducer';

export const useShopReducer = () => {
  const [state, dispatch] = useReducer(shopReducer, initialState);

  return {
    products: state.products,
    cart: state.cart,
    dispatch,
  };
};
