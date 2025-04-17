import React from 'react';

const App = () => {
  return (
    <div class="bg-gray-100 p-8">
      <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 class="text-2xl font-bold mb-4">장바구니</h1>
        <div id="cart-items"></div>
        <div id="cart-total" class="text-xl font-bold my-4">
          총액: 0원
          <span id="loyalty-points" class="text-blue-500 ml-2">
            (포인트: 0)
          </span>
        </div>
        <select id="product-select" class="border rounded p-2 mr-2">
          <option value="p1">상품1 - 10000원</option>
          <option value="p2">상품2 - 20000원</option>
          <option value="p3">상품3 - 30000원</option>
          <option value="p4" disabled="">
            상품4 - 15000원
          </option>
          <option value="p5">상품5 - 25000원</option>
        </select>
        <button
          id="add-to-cart"
          class="bg-blue-500 text-white px-4 py-2 rounded"
        >
          추가
        </button>
        <div id="stock-status" class="text-sm text-gray-500 mt-2">
          상품4: 품절{' '}
        </div>
      </div>
    </div>
  );
};

export default App;
