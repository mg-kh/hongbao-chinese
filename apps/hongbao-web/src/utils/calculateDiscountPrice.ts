const calculateDiscountPrice = (
  price: number,
  discountPercent: number,
): number => {
  if (price < 0 || discountPercent < 0) {
    throw new Error("Price and discount must be non-negative");
  }

  const discountAmount = (price * discountPercent) / 100;
  return price - discountAmount;
};

export default calculateDiscountPrice;
