import React, { useState } from 'react';

// components
import {
  CardTitle,
  ProductSelectBox,
  CartTotalSummary,
  Button,
  StockInformation,
  CartInventory,
} from './components';

// hooks
import { useShopReducer } from './hooks/useShopReducer';

// constants
import { actions } from './reducers/shopReducer';

const App = () => {
  const { products, cart, dispatch } = useShopReducer();

  const [selectedProductId, setSelectedProductId] = useState(products[0].id);

  const handleIncreaseCartItem = (productId) => {
    const product = products.find((product) => product.id === productId);
    if (product.quantity === 0) {
      alert('재고가 없습니다.');
      return;
    }

    dispatch({
      type: actions.INCREASE_CART_ITEM,
      payload: {
        id: productId,
      },
    });
  };

  const handleDecreaseCartItem = (productId) => {
    dispatch({
      type: actions.DECREASE_CART_ITEM,
      payload: { id: productId },
    });
  };

  const handleRemoveCartItem = (productId) => {
    dispatch({
      type: actions.REMOVE_CART_ITEM,
      payload: { id: productId },
    });
  };

  return (
    <div className="bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <CardTitle title="장바구니" />
        <CartInventory
          cart={cart}
          handleIncreaseCartItem={handleIncreaseCartItem}
          handleDecreaseCartItem={handleDecreaseCartItem}
          handleRemoveCartItem={handleRemoveCartItem}
        />
        <CartTotalSummary />
        <ProductSelectBox
          products={products}
          handleChange={setSelectedProductId}
        />
        <Button
          text="추가"
          handleClick={() => handleIncreaseCartItem(selectedProductId)}
        />
        <StockInformation products={products} />
      </div>
    </div>
  );
};

export default App;
