import { Link } from 'react-router-dom'
import './PeriodNavigator.css'

interface PeriodLink {
  label: string
  to: string
}

interface PeriodNavigatorProps {
  previous?: PeriodLink
  next?: PeriodLink
}

const PeriodNavigator = ({ previous, next }: PeriodNavigatorProps) => (
  <nav className="period-navigator" aria-label="Period navigation">
    {previous ? (
      <Link to={previous.to} aria-label={`Previous period: ${previous.label}`}>
        <span aria-hidden="true">←</span> {previous.label}
      </Link>
    ) : (
      <span />
    )}
    {next && (
      <Link to={next.to} aria-label={`Next period: ${next.label}`}>
        {next.label} <span aria-hidden="true">→</span>
      </Link>
    )}
  </nav>
)

export default PeriodNavigator
