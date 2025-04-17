import { getDiscountTotal } from '../utils';
import { PRODUCT_DISCOUNT_RATE } from '../config';
export const actions = {
  INCREASE_CART_ITEM: 'INCREASE_CART_ITEM',
  DECREASE_CART_ITEM: 'DECREASE_CART_ITEM',
  REMOVE_CART_ITEM: 'REMOVE_CART_ITEM',
  UPDATE_PRODUCT: 'UPDATE_PRODUCT',
};

export const initialState = {
  products: [
    { id: 'p1', name: '상품1', price: 10000, quantity: 50 },
    { id: 'p2', name: '상품2', price: 20000, quantity: 30 },
    { id: 'p3', name: '상품3', price: 30000, quantity: 20 },
    { id: 'p4', name: '상품4', price: 15000, quantity: 0 },
    { id: 'p5', name: '상품5', price: 25000, quantity: 10 },
  ],
  cart: [],
  lastSelectedProductId: null,
  totalQuantity: 0,
  totalAmountBeforeDiscount: 0,
  totalAmount: 0,
  discountRate: 0,
  bonusPoints: 0,
};

const calculateCartTotal = (cartProducts) => {
  let totalQuantity = 0;
  let totalAmountBeforeDiscount = 0;
  let totalAmount = 0;

  cartProducts.forEach((product) => {
    const quantity = product.quantity;
    const totalAmountItem = product.price * quantity;

    totalQuantity += quantity;
    totalAmountBeforeDiscount += totalAmountItem;

    if (quantity < 10) {
      totalAmount += totalAmountItem;
      return;
    }

    totalAmount += totalAmountItem * (1 - PRODUCT_DISCOUNT_RATE[product.id]);
  });

  const { discountRate, discountedPrice } = getDiscountTotal(
    totalQuantity,
    totalAmount,
    totalAmountBeforeDiscount
  );

  const bonusPoints = Math.floor(discountedPrice / 1000);

  return {
    totalQuantity,
    totalAmountBeforeDiscount,
    totalAmount: discountedPrice,
    discountRate,
    bonusPoints,
  };
};

export const shopReducer = (state, action) => {
  switch (action.type) {
    case actions.UPDATE_PRODUCT: {
      const updatedProducts = state.products.map((product) => {
        if (product.id === action.payload.id) {
          return { ...product, price: action.payload.price };
        }
        return product;
      });

      return {
        ...state,
        products: updatedProducts,
        ...calculateCartTotal(state.cart),
      };
    }

    case actions.INCREASE_CART_ITEM: {
      const updatedProducts = state.products.map((product) => {
        if (product.id === action.payload.id && product.quantity > 0) {
          return { ...product, quantity: product.quantity - 1 };
        }
        return product;
      });

      const existing = state.cart.find(
        (product) => product.id === action.payload.id
      );
      let updatedCart;

      if (existing) {
        updatedCart = state.cart.map((product) => {
          if (product.id === action.payload.id) {
            return { ...product, quantity: product.quantity + 1 };
          }
          return product;
        });
      } else {
        const product = state.products.find(
          (product) => product.id === action.payload.id
        );
        updatedCart = [...state.cart, { ...product, quantity: 1 }];
      }

      return {
        ...state,
        products: updatedProducts,
        cart: updatedCart,
        lastSelectedProductId: action.payload.id,
        ...calculateCartTotal(updatedCart),
      };
    }

    case actions.DECREASE_CART_ITEM: {
      const updatedCart = state.cart
        .map((product) => {
          if (product.id === action.payload.id) {
            return { ...product, quantity: product.quantity - 1 };
          }
          return product;
        })
        .filter((product) => product.quantity > 0);

      const updatedProducts = state.products.map((product) => {
        if (product.id === action.payload.id) {
          return { ...product, quantity: product.quantity + 1 };
        }
        return product;
      });

      return {
        ...state,
        products: updatedProducts,
        cart: updatedCart,
        ...calculateCartTotal(updatedCart),
      };
    }

    case actions.REMOVE_CART_ITEM: {
      const existing = state.cart.find(
        (product) => product.id === action.payload.id
      );

      if (!existing) return state;

      const updatedCart = state.cart.filter(
        (product) => product.id !== action.payload.id
      );

      const updatedProducts = state.products.map((product) => {
        if (product.id === action.payload.id) {
          return { ...product, quantity: product.quantity + existing.quantity };
        }
        return product;
      });

      return {
        ...state,
        products: updatedProducts,
        cart: updatedCart,
        ...calculateCartTotal(updatedCart),
      };
    }

    default:
      return state;
  }
};
