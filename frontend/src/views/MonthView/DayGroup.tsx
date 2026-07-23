import { Table } from '../../common/Table'
import type { Transaction } from '../../types/bookkeeping'
import { summarizeTransactions } from '../../utils/bookkeeping'
import { formatDay } from '../../utils/dates'
import { formatMoney } from '../../utils/money'

interface DayGroupProps {
  date: string
  items: Transaction[]
  defaultOpen?: boolean
}

const DayGroup = ({ date, items, defaultOpen = false }: DayGroupProps) => {
  const summary = summarizeTransactions(items)

  return (
    <details className="day-group" open={defaultOpen}>
      <summary className="day-group__summary">
        <span className="day-group__date">
          <span>{formatDay(date)}</span>
          <small>
            {items.length} {items.length === 1 ? 'transaction' : 'transactions'}
          </small>
        </span>
        <span className="day-group__totals">
          <span>
            Income <strong>{formatMoney(summary.incomeMinor)}</strong>
          </span>
          <span>
            Expenses <strong>{formatMoney(summary.expensesMinor)}</strong>
          </span>
          <span>
            Balance <strong>{formatMoney(summary.balanceMinor)}</strong>
          </span>
        </span>
        <span className="day-group__chevron" aria-hidden="true">
          ↓
        </span>
      </summary>

      <div className="table-scroll">
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell>Description</Table.HeaderCell>
              <Table.HeaderCell>Category</Table.HeaderCell>
              <Table.HeaderCell className="app-table__header-cell--numeric">
                Amount
              </Table.HeaderCell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {items.map((item) => (
              <Table.Row key={item.id}>
                <Table.DataCell>{item.description}</Table.DataCell>
                <Table.DataCell>{item.category}</Table.DataCell>
                <Table.DataCell
                  className={`app-table__data-cell--numeric ${
                    item.direction === 'income'
                      ? 'app-table__data-cell--positive'
                      : 'app-table__data-cell--negative'
                  }`}
                >
                  {formatMoney(
                    item.direction === 'expense'
                      ? -item.amountMinor
                      : item.amountMinor,
                    item.currency,
                  )}
                </Table.DataCell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </details>
  )
}

export default DayGroup
