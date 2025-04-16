import { store } from '../store';

export function findProductById(targetId) {
  const { products } = store.getState();
  return products.find((product) => product.id === targetId);
}

export function hasCartProductById(targetId) {
  const { cartProducts } = store.getState();
  return cartProducts.some((product) => product.id === targetId);
}
