import { OUT_OF_STOCK_THRESHOLD, LOW_STOCK_THRESHOLD } from '../constants';

export function isOutOfStock(product) {
  return product.q > OUT_OF_STOCK_THRESHOLD;
}

export function isLowStock(product) {
  return product.q < LOW_STOCK_THRESHOLD;
}
