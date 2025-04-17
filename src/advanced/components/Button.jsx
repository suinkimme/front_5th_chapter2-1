import React, { memo } from 'react';

const Button = memo(({ text, handleClick }) => {
  return (
    <button
      id="add-to-cart"
      className="bg-blue-500 text-white px-4 py-2 rounded"
      onClick={handleClick}
    >
      {text}
    </button>
  );
});

export default Button;
