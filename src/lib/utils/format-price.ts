export function formatPrice(price: string) {
  const formattedPrice = Number(price).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });

  return formattedPrice;
}
