export function formatPriceChange(change: string) {
  const formattedChange = Number(change).toFixed(2);

  return formattedChange;
}
