import React, { memo } from 'react';

const StockItem = memo(({ name, quantity }) => {
  if (quantity >= 5) {
    return '';
  }

  if (quantity > 0) {
    return `${name}: 재고 부족 (${quantity}개 남음) `;
  }

  return `${name}: 품절 `;
});

const StockInformation = memo(({ products }) => {
  return (
    <div id="stock-status" className="text-sm text-gray-500 mt-2">
      {products.map((product) => (
        <StockItem key={`stock-item-${product.id}`} {...product} />
      ))}
    </div>
  );
});

export default StockInformation;
