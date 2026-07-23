import { Link, useParams } from 'react-router-dom'
import SummaryCard from '../../common/SummaryCard'
import Breadcrumbs from '../../components/Breadcrumbs'
import PeriodNavigator from '../../components/PeriodNavigator'
import { transactions } from '../../services/transactionRepository'
import {
  getAvailableYears,
  getTransactionsForMonth,
  groupTransactionsByDay,
  summarizeTransactions,
} from '../../utils/bookkeeping'
import { getMonthName } from '../../utils/dates'
import DayGroup from './DayGroup'
import './MonthView.css'

const getAdjacentMonth = (year: number, month: number, offset: number) => {
  const date = new Date(year, month - 1 + offset, 1)
  return { year: date.getFullYear(), month: date.getMonth() + 1 }
}

const MonthView = () => {
  const { year: yearParam, month: monthParam } = useParams()
  const year = Number(yearParam)
  const month = Number(monthParam)
  const availableYears = getAvailableYears(transactions)
  const isValidPeriod =
    Number.isInteger(year) &&
    availableYears.includes(year) &&
    Number.isInteger(month) &&
    month >= 1 &&
    month <= 12

  if (!isValidPeriod) {
    return (
      <section className="empty-state">
        <p className="eyebrow">Month view</p>
        <h1>Month not found</h1>
        <p>The requested bookkeeping period is not available.</p>
        <Link className="text-link" to="/">
          Return to overview
        </Link>
      </section>
    )
  }

  const monthName = getMonthName(month)
  const monthTransactions = getTransactionsForMonth(transactions, year, month)
  const summary = summarizeTransactions(monthTransactions)
  const dayGroups = groupTransactionsByDay(monthTransactions)
  const previous = getAdjacentMonth(year, month, -1)
  const next = getAdjacentMonth(year, month, 1)

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: `${year}`, to: `/years/${year}` },
          { label: monthName },
        ]}
      />
      <header className="page-header page-header--with-actions">
        <div>
          <p className="eyebrow">Monthly ledger</p>
          <h1>
            {monthName} {year}
          </h1>
          <p className="page-header__description">
            Transactions grouped by the day they were recorded.
          </p>
        </div>
        <PeriodNavigator
          previous={
            availableYears.includes(previous.year)
              ? {
                  label: getMonthName(previous.month),
                  to: `/years/${previous.year}/months/${previous.month}`,
                }
              : undefined
          }
          next={
            availableYears.includes(next.year)
              ? {
                  label: getMonthName(next.month),
                  to: `/years/${next.year}/months/${next.month}`,
                }
              : undefined
          }
        />
      </header>

      <section className="summary-grid summary-grid--three" aria-label="Month summary">
        <SummaryCard
          label="Income"
          amountMinor={summary.incomeMinor}
          tone="income"
        />
        <SummaryCard
          label="Expenses"
          amountMinor={summary.expensesMinor}
          tone="expense"
        />
        <SummaryCard
          label="Month balance"
          amountMinor={summary.balanceMinor}
          tone="balance"
        />
      </section>

      <section className="month-view__ledger" aria-labelledby="daily-ledger-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Daily detail</p>
            <h2 id="daily-ledger-title">Recorded days</h2>
          </div>
          <span className="section-heading__period">
            {dayGroups.length} {dayGroups.length === 1 ? 'day' : 'days'}
          </span>
        </div>

        {dayGroups.length > 0 ? (
          <div className="day-list">
            {dayGroups.map(([date, items], index) => (
              <DayGroup
                date={date}
                items={items}
                defaultOpen={index === 0}
                key={date}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state empty-state--compact">
            <h3>No recorded transactions</h3>
            <p>There are no entries for {monthName.toLowerCase()}.</p>
          </div>
        )}
      </section>
    </div>
  )
}

export default MonthView
