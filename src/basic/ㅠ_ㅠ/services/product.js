// store
import { store } from '../store';

// constants
import {
  DISCOUNT_MAP,
  INIT_DISCOUNT,
  BULK_DISCOUNT,
  BULK_DISCOUNT_SEPARATOR,
  ITEM_DISCOUNT_SEPARATOR,
} from '../constants';

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

export function calculateCartTotal() {
  const { cartProducts } = store.getState();

  const 할인_전_합계 = cartProducts.reduce(
    (acc, { val, q }) => acc + val * q,
    0
  );

  let 개별_할인_후_합계 = cartProducts.reduce((acc, product) => {
    const { id, val, q } = product;

    let discount = INIT_DISCOUNT;
    if (q >= ITEM_DISCOUNT_SEPARATOR && DISCOUNT_MAP[id]) {
      discount = DISCOUNT_MAP[id];
    }

    const discountedPrice = val * q * (1 - discount);
    return acc + discountedPrice;
  }, 0);

  const 총_구매_수량 = cartProducts.reduce((acc, { q }) => acc + q, 0);

  let 할인율 = (할인_전_합계 - 개별_할인_후_합계) / 할인_전_합계;

  // 총 구매 수량이 30개 이상일 때
  if (총_구매_수량 >= BULK_DISCOUNT_SEPARATOR) {
    const 대량_구입_할인_총합 = 개별_할인_후_합계 * BULK_DISCOUNT;
    const 개별_할인_총합 = 할인_전_합계 - 개별_할인_후_합계;

    if (대량_구입_할인_총합 > 개별_할인_총합) {
      개별_할인_후_합계 = 할인_전_합계 * (1 - BULK_DISCOUNT);
      할인율 = BULK_DISCOUNT;
    } else {
      할인율 = 개별_할인_총합 / 할인_전_합계;
    }
  }

  // 화요일 추가 할인
  const isTuesday = new Date().getDay() === 2;
  if (isTuesday) {
    개별_할인_후_합계 *= 0.9;
    할인율 = Math.max(할인율, 0.1);
  }

  return {
    total: Math.round(개별_할인_후_합계),
    discountRate: (할인율 * 100).toFixed(1) || 0,
  };
}
