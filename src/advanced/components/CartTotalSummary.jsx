import React, { memo } from 'react';

const CartTotalSummary = memo(({ totalAmount, discountRate, bonusPoints }) => {
  return (
    <div id="cart-total" className="text-xl font-bold my-4">
      총액: {totalAmount}원
      <span id="loyalty-points" className="text-blue-500 ml-2">
        (포인트: {bonusPoints})
      </span>
      {discountRate > 0 && (
        <span className="text-green-500 ml-2">
          ({(discountRate * 100).toFixed(1)}% 할인 적용)
        </span>
      )}
    </div>
  );
});

export default CartTotalSummary;
