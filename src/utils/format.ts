export const fmtMoney = (amount: number, currency = "GBP") => {
  const symbol = currency === "USD" ? "$" : currency === "EUR" ? "€" : "£"
  return `${symbol}${amount.toFixed(2)}`
}
