import type { MonthlySummary } from '../../types/bookkeeping'
import { getMonthName } from '../../utils/dates'
import { formatMoney } from '../../utils/money'

interface MonthlyBalanceChartProps {
  summaries: MonthlySummary[]
}

const MonthlyBalanceChart = ({ summaries }: MonthlyBalanceChartProps) => {
  const largestBalance = Math.max(
    ...summaries.map((summary) => Math.abs(summary.balanceMinor)),
    1,
  )

  return (
    <div
      className="monthly-chart"
      role="img"
      aria-label="Bar chart of monthly balances"
    >
      {summaries.map((summary) => {
        const height =
          summary.balanceMinor === 0
            ? 0
            : Math.max(6, (Math.abs(summary.balanceMinor) / largestBalance) * 100)
        const monthName = getMonthName(summary.month)

        return (
          <div className="monthly-chart__month" key={summary.month}>
            <div className="monthly-chart__amount">
              {summary.balanceMinor === 0
                ? '—'
                : formatMoney(summary.balanceMinor)}
            </div>
            <div className="monthly-chart__track" aria-hidden="true">
              <div
                className={`monthly-chart__bar${
                  summary.balanceMinor < 0 ? ' monthly-chart__bar--negative' : ''
                }`}
                style={{ height: `${height}%` }}
                title={`${monthName}: ${formatMoney(summary.balanceMinor)}`}
              />
            </div>
            <span title={monthName}>{monthName.slice(0, 3)}</span>
          </div>
        )
      })}
    </div>
  )
}

export default MonthlyBalanceChart
