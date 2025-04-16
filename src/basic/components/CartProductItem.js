export default function CartProductItem({ id, name, val, q }) {
  return /* HTML */ `
    <div id="${id}" class="flex justify-between items-center mb-2">
      <span>${name} - ${val}원 x ${q}</span>
      <div>
        <button
          class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
          data-change="-1"
          data-product-id="${id}"
        >
          -
        </button>
        <button
          class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
          data-change="1"
          data-product-id="${id}"
        >
          +
        </button>
        <button
          class="remove-item bg-red-500 text-white px-2 py-1 rounded"
          data-product-id="${id}"
        >
          삭제
        </button>
      </div>
    </div>
  `;
}
