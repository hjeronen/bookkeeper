export const formatMoney = (amountMinor: number, currency = 'EUR') =>
  new Intl.NumberFormat('fi-FI', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amountMinor / 100)
