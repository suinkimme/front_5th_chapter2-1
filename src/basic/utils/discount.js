const BULK_DISCOUNT_THRESHOLD = 30;
const DISCOUNT_RATE_INFO = {
  tuesday: 0.1,
  regular: 0.1,
  bulk: 0.25,
};
export const isTuesday = () => {
  const today = new Date();
  return today.getDay() === 2;
};

export const getDiscountTotal = (itemCount, discountedTotal, subtotal) => {
  if (isTuesday()) {
    return calculateDiscountTuesday(discountedTotal);
  }

  return itemCount < BULK_DISCOUNT_THRESHOLD
    ? calculateRegularDiscount(discountedTotal, subtotal)
    : calculateBulkDiscount(discountedTotal, subtotal);
};

const calculateDiscountTuesday = (discountedTotal) => {
  return {
    discountRate: DISCOUNT_RATE_INFO.tuesday,
    discountedPrice: discountedTotal,
  };
};

const calculateRegularDiscount = (discountedTotal, subtotal) => {
  return {
    discountRate: (subtotal - discountedTotal) / subtotal,
    discountedPrice: discountedTotal,
  };
};

const calculateBulkDiscount = (discountedTotal, subtotal) => {
  const bulkDiscount = discountedTotal * DISCOUNT_RATE_INFO.bulk;
  const discountAmount = subtotal - discountedTotal;

  const discountPrice =
    bulkDiscount > discountAmount
      ? discountedTotal * (1 - DISCOUNT_RATE_INFO.bulk)
      : discountAmount - discountAmount;

  return {
    discountRate: DISCOUNT_RATE_INFO.bulk,
    discountedPrice: discountPrice,
  };
};
