import React from 'react';

const Button = ({ text, handleClick }) => {
  return (
    <button
      id="add-to-cart"
      class="bg-blue-500 text-white px-4 py-2 rounded"
      onClick={handleClick}
    >
      {text}
    </button>
  );
};

export default Button;
