import { store } from '../store';

const LOW_STOCK_THRESHOLD = 5;
const OUT_OF_STOCK_THRESHOLD = 0;

function isLowStock(product) {
  return product.q < LOW_STOCK_THRESHOLD;
}

function getStockMessage(product) {
  if (product.q > OUT_OF_STOCK_THRESHOLD) {
    return `${product.name}: 재고 부족 (${product.q}개 남음)`;
  }

  return `${product.name}: 품절`;
}

export default function StockStatus() {
  const { products } = store.getState();
  const stockMessage = products
    .filter(isLowStock)
    .map(getStockMessage)
    .join('\n');

  return /* HTML */ `
    <div id="stock-status" class="text-sm text-gray-500 mt-2">
      ${stockMessage}
    </div>
  `;
}
