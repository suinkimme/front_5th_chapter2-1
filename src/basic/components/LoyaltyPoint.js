import { store } from '../store';

export default function LoyaltyPoint() {
  const { cartProducts } = store.getState();

  return /* HTML */ `
    <span id="loyalty-points" class="text-blue-500 ml-2">(포인트: )</span>
  `;
}
