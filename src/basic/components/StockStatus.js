import { store } from '../store';

function isLowStock(product) {
  return product.q < 5;
}

function getStockMessage(product) {
  if (product.q > 0) {
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
