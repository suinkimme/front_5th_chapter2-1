import { calculateCartTotal } from '../services/product';

export default function LoyaltyPoint() {
  const { total } = calculateCartTotal();

  return `<span id="loyalty-points" class="text-blue-500 ml-2">(포인트: ${Math.floor(total / 1000)})</span>`;
}
