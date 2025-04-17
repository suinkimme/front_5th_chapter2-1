import { useReducer } from 'react';
import { shopReducer, initialState } from '../reducers/shopReducer';

export const useShopReducer = () => {
  const [state, dispatch] = useReducer(shopReducer, initialState);

  return {
    products: state.products,
    cart: state.cart,
    totalQuantity: state.totalQuantity,
    totalAmountBeforeDiscount: state.totalAmountBeforeDiscount,
    totalAmount: state.totalAmount,
    discountRate: state.discountRate,
    bonusPoints: state.bonusPoints,
    dispatch,
  };
};
