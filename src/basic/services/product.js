import { store } from '../store';

function decreaseProductStock(products, id) {
  return products.map((product) => {
    if (product.id === id) {
      return { ...product, q: --product.q };
    }

    return product;
  });
}

function increaseCartQuantity(products, id) {
  return products.map((product) => {
    if (product.id === id) {
      return { ...product, q: ++product.q };
    }

    return product;
  });
}

export function firstAddCart(selectedProduct) {
  const { products, cartProducts } = store.getState();

  const newProducts = decreaseProductStock(products, selectedProduct.id);

  store.setState({
    products: newProducts,
    cartProducts: [...cartProducts, { ...selectedProduct, q: 1 }],
  });
}

export function addCart(selectedProductId) {
  const { products, cartProducts } = store.getState();

  const newProducts = decreaseProductStock(products, selectedProductId);
  const newCartProducts = increaseCartQuantity(cartProducts, selectedProductId);

  store.setState({
    products: newProducts,
    cartProducts: newCartProducts,
  });
}

export function removeCart() {
  const { products, cartProducts } = store.getState();
}
