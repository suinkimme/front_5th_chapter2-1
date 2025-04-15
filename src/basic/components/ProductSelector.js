import { store } from '../store';

export default function ProductSelector() {
  const { products, selectedProduct } = store.getState();

  return /* HTML */ `
    <select id="product-select" class="border rounded p-2 mr-2">
      ${products
        .map((product) => {
          const { id, q, name, val } = product;
          return /* HTML */ `
            <option
              value="${id}"
              ${!q && 'disabled'}
              ${id === selectedProduct && 'selected'}
            >
              ${name} - ${val}원
            </option>
          `;
        })
        .join('')}
    </select>
  `;
}
