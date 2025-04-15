import LoyaltyPoint from './LoyaltyPoint';

export default function CartTotal() {
  return /* HTML */ `
    <div id="Cart-total" class="text-xl font-bold my-4">${LoyaltyPoint()}</div>
  `;
}
