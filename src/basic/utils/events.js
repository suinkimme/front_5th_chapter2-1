export const triggerFlashSale = (products) => {
  const luckyItem = products[Math.floor(Math.random() * products.length)];

  if (Math.random() < 0.3 && luckyItem.quantity > 0) {
    const discountedPrice = Math.round(luckyItem.price * 0.8);
    const updatedProducts = products.map((product) =>
      product.id === luckyItem.id
        ? { ...product, price: discountedPrice }
        : product
    );

    alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
    return updatedProducts;
  }
};

export const triggerRecommendSale = (products, lastSelectedProductId) => {
  if (!lastSelectedProductId) return;

  const suggest = products.find((product) => {
    return product.id !== lastSelectedProductId && product.quantity > 0;
  });

  if (!suggest) {
    return;
  }

  alert(`${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
  suggest.price = Math.round(suggest.price * 0.95);

  const updatedProducts = products.map((product) =>
    product.id === suggest.id
      ? { ...product, price: Math.round(suggest.price * 0.95) }
      : product
  );

  return updatedProducts;
};
