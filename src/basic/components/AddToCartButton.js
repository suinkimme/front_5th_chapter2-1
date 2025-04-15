export default function AddToCartButton({ text }) {
  return /* HTML */ `
    <button id="add-to-cart" class="bg-blue-500 text-white px-4 py-2 rounded">
      ${text}
    </button>
  `;
}
