import React from 'react';

// components
import {
  CardTitle,
  ProductSelectBox,
  CartTotalSummary,
  Button,
  StockInformation,
  CartInventory,
} from './components';

const App = () => {
  return (
    <div class="bg-gray-100 p-8">
      <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <CardTitle title="장바구니" />
        <CartInventory />
        <CartTotalSummary />
        <ProductSelectBox />
        <Button text="추가" handleClick={() => console.log('추가')} />
        <StockInformation />
      </div>
    </div>
  );
};

export default App;
