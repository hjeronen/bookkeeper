import { Link } from 'react-router-dom'
import { Table } from '../../common/Table'
import type { YearlySummary } from '../../types/bookkeeping'
import { formatMoney } from '../../utils/money'

interface YearHistoryTableProps {
  summaries: YearlySummary[]
}

const YearHistoryTable = ({ summaries }: YearHistoryTableProps) => (
  <div className="table-scroll">
    <Table>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Year</Table.HeaderCell>
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
        {summaries.map((summary) => (
          <Table.Row key={summary.year}>
            <Table.DataCell>
              <Link className="table-link" to={`/years/${summary.year}`}>
                {summary.year}
              </Link>
            </Table.DataCell>
            <Table.DataCell className="app-table__data-cell--numeric app-table__data-cell--positive">
              {formatMoney(summary.incomeMinor)}
            </Table.DataCell>
            <Table.DataCell className="app-table__data-cell--numeric app-table__data-cell--negative">
              {formatMoney(-summary.expensesMinor)}
            </Table.DataCell>
            <Table.DataCell className="app-table__data-cell--numeric app-table__data-cell--strong">
              {formatMoney(summary.balanceMinor)}
            </Table.DataCell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  </div>
)

export default YearHistoryTable
