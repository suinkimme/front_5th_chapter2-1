// 번개 세일 정보
const FLASH_SALE_PROBABILITY = 0.3;
const DISCOUNT_RATE = 0.8;

// 추천 상품 정보
const RECOMMEND_PRODUCT_DISCOUNT_RATE = 0.95;

const isFlashSale = (quantityLeft) =>
  Math.random() < FLASH_SALE_PROBABILITY && quantityLeft > 0;

// 번개 세일
export const triggerFlashSale = (products, handleUpdateProducts) => {
  const luckyItem = products[Math.floor(Math.random() * products.length)];

  if (isFlashSale(luckyItem.quantity)) {
    const discountedPrice = Math.round(luckyItem.price * DISCOUNT_RATE);
    handleUpdateProducts(luckyItem.id, discountedPrice);

    alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
  }
};

// 추천 상품
export const triggerRecommendProduct = (
  products,
  lastSelectedProductId,
  handleUpdateProducts
) => {
  if (!lastSelectedProductId) return;

  const suggest = products.find((product) => {
    return product.id !== lastSelectedProductId && product.quantity > 0;
  });

  if (!suggest) {
    return;
  }

  handleUpdateProducts(
    suggest.id,
    Math.round(suggest.price * RECOMMEND_PRODUCT_DISCOUNT_RATE)
  );
  alert(`${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
};
