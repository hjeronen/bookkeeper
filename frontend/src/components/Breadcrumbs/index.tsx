import { Link } from 'react-router-dom'
import './Breadcrumbs.css'

interface BreadcrumbItem {
  label: string
  to?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

const Breadcrumbs = ({ items }: BreadcrumbsProps) => (
  <nav className="breadcrumbs" aria-label="Breadcrumb">
    <ol>
      {items.map((item, index) => (
        <li key={`${item.label}-${index}`}>
          {item.to ? <Link to={item.to}>{item.label}</Link> : item.label}
        </li>
      ))}
    </ol>
  </nav>
)

export default Breadcrumbs
