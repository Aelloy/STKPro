export function generateStockNumber(lastStockNumber: string | undefined): string {
  if (!lastStockNumber) {
    return 'A000001';
  }

  const prefix = lastStockNumber.charAt(0);
  const number = parseInt(lastStockNumber.slice(1));

  if (number < 999999) {
    return `${prefix}${String(number + 1).padStart(6, '0')}`;
  }

  // If we reach the end of the current letter, move to the next one
  const nextPrefix = String.fromCharCode(prefix.charCodeAt(0) + 1);
  return `${nextPrefix}000001`;
}