import React from 'react';

const CartItem = ({
  id,
  name,
  price,
  quantity,
  handleIncreaseCartItem,
  handleDecreaseCartItem,
  handleRemoveCartItem,
}) => {
  return (
    <div id={id} className="flex justify-between items-center mb-2">
      <span>
        {name} - {price}원 x {quantity}
      </span>
      <div>
        <button
          className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
          data-product-id={id}
          data-change="-1"
          onClick={() => handleDecreaseCartItem(id)}
        >
          -
        </button>
        <button
          className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
          data-product-id={id}
          data-change="1"
          onClick={() => handleIncreaseCartItem(id)}
        >
          +
        </button>
        <button
          className="remove-item bg-red-500 text-white px-2 py-1 rounded"
          data-product-id={id}
          onClick={() => handleRemoveCartItem(id)}
        >
          삭제
        </button>
      </div>
    </div>
  );
};

export default CartItem;
