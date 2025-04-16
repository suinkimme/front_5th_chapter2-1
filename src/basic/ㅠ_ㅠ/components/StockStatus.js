// store
import { store } from '../store';

// validate
import { isOutOfStock, isLowStock } from '../utils/validate';

function getStockMessage(product) {
  if (isOutOfStock(product)) {
    return `${product.name}: 재고 부족 (${product.q}개 남음)`;
  }

  return `${product.name}: 품절`;
}

export default function StockStatus() {
  const { products } = store.getState();
  const stockMessage = products
    .filter(isLowStock)
    .map(getStockMessage)
    .join(' ');

  return /* HTML */ `
    <div id="stock-status" class="text-sm text-gray-500 mt-2">
      ${stockMessage}
    </div>
  `;
}
