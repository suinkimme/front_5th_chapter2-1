// store
import { store } from '../store';

// components
import CartProductItem from './CartProductItem';

export default function CartProductList() {
  const { cartProducts } = store.getState();

  return /* HTML */ `
    <div id="cart-items">
      ${cartProducts.map((product) => CartProductItem(product)).join('')}
    </div>
  `;
}
