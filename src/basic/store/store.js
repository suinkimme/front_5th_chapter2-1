const createObserver = () => {
  const listeners = new Set();
  const subscribe = (fn) => listeners.add(fn);
  const notify = () => listeners.forEach((listener) => listener());

  return { subscribe, notify };
};

const createStore = (initialState) => {
  const { subscribe, notify } = createObserver();

  let state = { ...initialState };

  const setState = (newState) => {
    state = { ...state, ...newState };
    notify();
  };

  const getState = () => ({ ...state });

  return { getState, setState, subscribe };
};

export const store = createStore({
  products: [],
  cartProducts: [],
  totalAmount: 0,
  cartProductsCount: 0,
  bonusPoints: 0,
});
