import SummaryCard from '../../common/SummaryCard'
import { transactions } from '../../services/transactionRepository'
import {
  getAvailableYears,
  getMonthlySummaries,
  getTransactionsForYear,
  getYearlySummaries,
  summarizeTransactions,
} from '../../utils/bookkeeping'
import MonthlyBalanceChart from './MonthlyBalanceChart'
import YearHistoryTable from './YearHistoryTable'
import './HomeView.css'

const HomeView = () => {
  const availableYears = getAvailableYears(transactions)
  const calendarYear = new Date().getFullYear()
  const currentYear = availableYears.includes(calendarYear)
    ? calendarYear
    : availableYears[0]

  if (!currentYear) {
    return (
      <section className="empty-state">
        <p className="eyebrow">Overview</p>
        <h1>No bookkeeping data yet</h1>
        <p>Add transactions to see annual and monthly summaries.</p>
      </section>
    )
  }

  const currentSummary = summarizeTransactions(
    getTransactionsForYear(transactions, currentYear),
  )
  const previousSummary = summarizeTransactions(
    getTransactionsForYear(transactions, currentYear - 1),
  )
  const balanceChange =
    currentSummary.balanceMinor - previousSummary.balanceMinor

  return (
    <div className="home-view">
      <header className="page-header">
        <div>
          <p className="eyebrow">Financial overview</p>
          <h1>{currentYear} at a glance</h1>
          <p className="page-header__description">
            A concise view of income, expenses, and balance across your books.
          </p>
        </div>
      </header>

      <section className="summary-grid" aria-label={`${currentYear} summary`}>
        <SummaryCard
          label="Total income"
          amountMinor={currentSummary.incomeMinor}
          tone="income"
        />
        <SummaryCard
          label="Total expenses"
          amountMinor={currentSummary.expensesMinor}
          tone="expense"
        />
        <SummaryCard
          label="Current balance"
          amountMinor={currentSummary.balanceMinor}
          tone="balance"
        />
        <SummaryCard
          label={`Balance vs. ${currentYear - 1}`}
          amountMinor={balanceChange}
        />
      </section>

      <div className="home-view__content">
        <section className="section-card" aria-labelledby="monthly-balance-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Cash flow</p>
              <h2 id="monthly-balance-title">Monthly balance</h2>
            </div>
            <span className="section-heading__period">{currentYear}</span>
          </div>
          <MonthlyBalanceChart
            summaries={getMonthlySummaries(transactions, currentYear)}
          />
        </section>

        <section className="section-card" aria-labelledby="year-history-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">History</p>
              <h2 id="year-history-title">Yearly totals</h2>
            </div>
          </div>
          <YearHistoryTable summaries={getYearlySummaries(transactions)} />
        </section>
      </div>
    </div>
  )
}

export default HomeView
