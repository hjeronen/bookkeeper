export type TransactionDirection = 'income' | 'expense'

export interface Transaction {
  id: string
  date: string
  description: string
  direction: TransactionDirection
  amountMinor: number
  currency: string
  category: string
}

export interface FinancialSummary {
  incomeMinor: number
  expensesMinor: number
  balanceMinor: number
}

export interface MonthlySummary extends FinancialSummary {
  month: number
}

export interface YearlySummary extends FinancialSummary {
  year: number
}
