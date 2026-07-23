import { Link, useParams } from 'react-router-dom'
import SummaryCard from '../../common/SummaryCard'
import { Table } from '../../common/Table'
import Breadcrumbs from '../../components/Breadcrumbs'
import PeriodNavigator from '../../components/PeriodNavigator'
import { transactions } from '../../services/transactionRepository'
import {
  getAvailableYears,
  getMonthlySummaries,
  getTransactionsForYear,
  summarizeTransactions,
} from '../../utils/bookkeeping'
import { getMonthName } from '../../utils/dates'
import { formatMoney } from '../../utils/money'
import './YearView.css'

const YearView = () => {
  const { year: yearParam } = useParams()
  const year = Number(yearParam)
  const availableYears = getAvailableYears(transactions)
  const yearIndex = availableYears.indexOf(year)

  if (!Number.isInteger(year) || yearIndex === -1) {
    return (
      <section className="empty-state">
        <p className="eyebrow">Year view</p>
        <h1>Year not found</h1>
        <p>There is no bookkeeping data for this year.</p>
        <Link className="text-link" to="/">
          Return to overview
        </Link>
      </section>
    )
  }

  const summary = summarizeTransactions(
    getTransactionsForYear(transactions, year),
  )
  const monthlySummaries = getMonthlySummaries(transactions, year)
  const olderYear = availableYears[yearIndex + 1]
  const newerYear = availableYears[yearIndex - 1]

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: `${year}` }]} />
      <header className="page-header page-header--with-actions">
        <div>
          <p className="eyebrow">Annual report</p>
          <h1>{year}</h1>
          <p className="page-header__description">
            Monthly totals for the selected bookkeeping year.
          </p>
        </div>
        <PeriodNavigator
          previous={
            olderYear
              ? { label: `${olderYear}`, to: `/years/${olderYear}` }
              : undefined
          }
          next={
            newerYear
              ? { label: `${newerYear}`, to: `/years/${newerYear}` }
              : undefined
          }
        />
      </header>

      <section className="summary-grid summary-grid--three" aria-label="Year summary">
        <SummaryCard
          label="Total income"
          amountMinor={summary.incomeMinor}
          tone="income"
        />
        <SummaryCard
          label="Total expenses"
          amountMinor={summary.expensesMinor}
          tone="expense"
        />
        <SummaryCard
          label="Year balance"
          amountMinor={summary.balanceMinor}
          tone="balance"
        />
      </section>

      <section className="section-card year-view__months" aria-labelledby="months-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Breakdown</p>
            <h2 id="months-title">Months</h2>
          </div>
        </div>
        <div className="table-scroll">
          <Table>
            <Table.Head>
              <Table.Row>
                <Table.HeaderCell>Month</Table.HeaderCell>
                <Table.HeaderCell className="app-table__header-cell--numeric">
                  Income
                </Table.HeaderCell>
                <Table.HeaderCell className="app-table__header-cell--numeric">
                  Expenses
                </Table.HeaderCell>
                <Table.HeaderCell className="app-table__header-cell--numeric">
                  Balance
                </Table.HeaderCell>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {monthlySummaries.map((month) => (
                <Table.Row key={month.month}>
                  <Table.DataCell>
                    <Link
                      className="table-link"
                      to={`/years/${year}/months/${month.month}`}
                    >
                      {getMonthName(month.month)}
                    </Link>
                  </Table.DataCell>
                  <Table.DataCell className="app-table__data-cell--numeric app-table__data-cell--positive">
                    {formatMoney(month.incomeMinor)}
                  </Table.DataCell>
                  <Table.DataCell className="app-table__data-cell--numeric app-table__data-cell--negative">
                    {formatMoney(-month.expensesMinor)}
                  </Table.DataCell>
                  <Table.DataCell className="app-table__data-cell--numeric app-table__data-cell--strong">
                    {formatMoney(month.balanceMinor)}
                  </Table.DataCell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </section>
    </div>
  )
}

export default YearView
