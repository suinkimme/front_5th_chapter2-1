export const initialState = {
  products: [
    { id: 'p1', name: '상품1', price: 10000, quantity: 50 },
    { id: 'p2', name: '상품2', price: 20000, quantity: 30 },
    { id: 'p3', name: '상품3', price: 30000, quantity: 20 },
    { id: 'p4', name: '상품4', price: 15000, quantity: 0 },
    { id: 'p5', name: '상품5', price: 25000, quantity: 10 },
  ],
  cart: [],
};

export const shopReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const updatedProducts = state.products.map((product) => {
        if (product.id === action.payload.id && product.quantity > 0) {
          return { ...product, quantity: product.quantity - 1 };
        }
        return product;
      });

      const existing = state.cart.fidn(
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

      return { ...state, products: updatedProducts, cart: updatedCart };
    }

    case 'REMOVE_FROM_CART': {
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
      };
    }

    default:
      return state;
  }
};
