import React, { useState, useEffect, useCallback, useRef } from 'react';

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

// utils
import { triggerFlashSale, triggerRecommendProduct } from './utils';

const App = () => {
  const flashSaleTimeout = useRef(null);
  const flashSaleInterval = useRef(null);
  const recommendProductTimeout = useRef(null);
  const recommendProductInterval = useRef(null);

  const { products, cart, totalAmount, discountRate, bonusPoints, dispatch } =
    useShopReducer();

  const [selectedProductId, setSelectedProductId] = useState(products[0].id);

  const handleIncreaseCartItem = useCallback(
    (productId) => {
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
    },
    [products, dispatch]
  );

  const handleDecreaseCartItem = useCallback(
    (productId) => {
      dispatch({
        type: actions.DECREASE_CART_ITEM,
        payload: { id: productId },
      });
    },
    [dispatch]
  );

  const handleRemoveCartItem = useCallback(
    (productId) => {
      dispatch({
        type: actions.REMOVE_CART_ITEM,
        payload: { id: productId },
      });
    },
    [dispatch]
  );

  useEffect(() => {
    flashSaleTimeout.current = setTimeout(() => {
      flashSaleInterval.current = setInterval(() => {
        triggerFlashSale(products, (id, price) => {
          dispatch({ type: actions.UPDATE_PRODUCT, payload: { id, price } });
        });
      }, 30000);
    }, Math.random() * 10000);

    recommendProductTimeout.current = setTimeout(() => {
      recommendProductInterval.current = setInterval(() => {
        triggerRecommendProduct(
          products,
          lastSelectedProductId,
          (id, price) => {
            dispatch({ type: actions.UPDATE_PRODUCT, payload: { id, price } });
          }
        );
      }, 30000);
    }, Math.random() * 10000);

    return () => {
      clearTimeout(flashSaleTimeout);
      clearInterval(flashSaleInterval);
      clearTimeout(recommendProductTimeout);
      clearInterval(recommendProductInterval);
    };
  }, []);

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
        <CartTotalSummary
          totalAmount={totalAmount}
          discountRate={discountRate}
          bonusPoints={bonusPoints}
        />
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
