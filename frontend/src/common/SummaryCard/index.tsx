import { formatMoney } from '../../utils/money'
import './SummaryCard.css'

interface SummaryCardProps {
  label: string
  amountMinor: number
  tone?: 'default' | 'income' | 'expense' | 'balance'
}

const SummaryCard = ({
  label,
  amountMinor,
  tone = 'default',
}: SummaryCardProps) => (
  <article className={`summary-card summary-card--${tone}`}>
    <p className="summary-card__label">{label}</p>
    <p className="summary-card__value">{formatMoney(amountMinor)}</p>
  </article>
)

export default SummaryCard
