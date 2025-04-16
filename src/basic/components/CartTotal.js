// services
import { calculateCartTotal } from '../services/product';

// components
import LoyaltyPoint from './LoyaltyPoint';

export default function CartTotal() {
  const { total, discountRate } = calculateCartTotal();

  return `<div id="cart-total" class="text-xl font-bold my-4">총액: ${total}원${discountRate > 0 ? `<span class="text-green-500 ml-2">(${discountRate}% 할인 적용)</span>` : ''}${LoyaltyPoint()}</div>`;
}
