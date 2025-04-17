export const actions = {
  INCREASE_CART_ITEM: 'INCREASE_CART_ITEM',
  DECREASE_CART_ITEM: 'DECREASE_CART_ITEM',
  REMOVE_CART_ITEM: 'REMOVE_CART_ITEM',
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
};

export const shopReducer = (state, action) => {
  switch (action.type) {
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

      return { ...state, products: updatedProducts, cart: updatedCart };
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

      // 장바구니에서 제거된 상품의 수량만큼 재고를 증가시킨다.
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
      };
    }

    default:
      return state;
  }
};
