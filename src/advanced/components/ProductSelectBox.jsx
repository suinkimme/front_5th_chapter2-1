import React, { memo } from 'react';

const ProductSelectBox = memo(({ products, handleChange }) => {
  return (
    <select
      id="product-select"
      className="border rounded p-2 mr-2"
      onChange={(e) => handleChange(e.target.value)}
    >
      {products.map((product) => (
        <option
          key={`product-select-option-${product.id}`}
          value={product.id}
          disabled={product.quantity === 0}
        >
          {product.name} - {product.price}원
        </option>
      ))}
    </select>
  );
});

export default ProductSelectBox;
