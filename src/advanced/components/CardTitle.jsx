import React, { memo } from 'react';

const CardTitle = memo(({ title }) => {
  return <h1 className="text-2xl font-bold mb-4">{title}</h1>;
});

export default CardTitle;
