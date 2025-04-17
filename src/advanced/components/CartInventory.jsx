import React, { memo } from 'react';

// components
import { CartItem } from '.';

const CartInventory = memo(
  ({
    cart,
    handleIncreaseCartItem,
    handleDecreaseCartItem,
    handleRemoveCartItem,
  }) => {
    return (
      <div id="cart-items">
        {cart.map((product) => (
          <CartItem
            key={product.id}
            {...product}
            handleIncreaseCartItem={handleIncreaseCartItem}
            handleDecreaseCartItem={handleDecreaseCartItem}
            handleRemoveCartItem={handleRemoveCartItem}
          />
        ))}
      </div>
    );
  }
);

export default CartInventory;
