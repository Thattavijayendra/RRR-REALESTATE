export function formatPrice(amount: number): string {
  if (amount == null || Number.isNaN(amount)) return '₹0'
  // Use Indian number grouping
  const formatted = new Intl.NumberFormat('en-IN').format(Math.round(amount))
  return `₹${formatted}`
}

export function formatPriceShort(amount: number): string {
  if (amount == null || Number.isNaN(amount)) return '₹0'
  const abs = Math.abs(amount)
  if (abs >= 1e7) {
    const val = +(amount / 1e7).toFixed(abs / 1e7 >= 10 ? 0 : 1)
    return `₹${val} Cr`
  }
  if (abs >= 1e5) {
    const val = +(amount / 1e5).toFixed(abs / 1e5 >= 10 ? 0 : 1)
    return `₹${val} Lakh`
  }
  return formatPrice(amount)
}
