import { NavLink } from 'react-router-dom'
import { getAvailableYears } from '../../utils/bookkeeping'
import { transactions } from '../../services/transactionRepository'
import './NavBar.css'

const NavBar = () => {
  const latestYear = getAvailableYears(transactions)[0]

  return (
    <nav className="navbar" aria-label="Main navigation">
      <NavLink
        className={({ isActive }) =>
          `navbar__link${isActive ? ' navbar__link--active' : ''}`
        }
        to="/"
        end
      >
        Home
      </NavLink>
      {latestYear && (
        <NavLink
          className={({ isActive }) =>
            `navbar__link${isActive ? ' navbar__link--active' : ''}`
          }
          to={`/years/${latestYear}`}
        >
          Years
        </NavLink>
      )}
    </nav>
  )
}

export default NavBar
