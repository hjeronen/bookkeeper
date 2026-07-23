import type {
  FinancialSummary,
  MonthlySummary,
  Transaction,
  YearlySummary,
} from '../types/bookkeeping'

export const summarizeTransactions = (
  items: Transaction[],
): FinancialSummary => {
  const incomeMinor = items
    .filter((item) => item.direction === 'income')
    .reduce((total, item) => total + item.amountMinor, 0)
  const expensesMinor = items
    .filter((item) => item.direction === 'expense')
    .reduce((total, item) => total + item.amountMinor, 0)

  return {
    incomeMinor,
    expensesMinor,
    balanceMinor: incomeMinor - expensesMinor,
  }
}

export const getAvailableYears = (items: Transaction[]) =>
  [...new Set(items.map((item) => Number(item.date.slice(0, 4))))].sort(
    (a, b) => b - a,
  )

export const getTransactionsForYear = (
  items: Transaction[],
  year: number,
) => items.filter((item) => Number(item.date.slice(0, 4)) === year)

export const getTransactionsForMonth = (
  items: Transaction[],
  year: number,
  month: number,
) =>
  items.filter((item) => {
    const [itemYear, itemMonth] = item.date.split('-').map(Number)
    return itemYear === year && itemMonth === month
  })

export const getMonthlySummaries = (
  items: Transaction[],
  year: number,
): MonthlySummary[] =>
  Array.from({ length: 12 }, (_, index) => {
    const month = index + 1
    return {
      month,
      ...summarizeTransactions(getTransactionsForMonth(items, year, month)),
    }
  })

export const getYearlySummaries = (
  items: Transaction[],
): YearlySummary[] =>
  getAvailableYears(items).map((year) => ({
    year,
    ...summarizeTransactions(getTransactionsForYear(items, year)),
  }))

export const groupTransactionsByDay = (items: Transaction[]) =>
  Object.entries(
    items.reduce<Record<string, Transaction[]>>((groups, item) => {
      groups[item.date] = [...(groups[item.date] ?? []), item]
      return groups
    }, {}),
  ).sort(([firstDate], [secondDate]) => secondDate.localeCompare(firstDate))
