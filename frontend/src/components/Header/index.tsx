import './Header.css'
import NavBar from '../NavBar'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <header className="app-header">
      <div className="app-header__container">
        <Link className="app-header__brand" to="/">
          <span className="app-header__mark" aria-hidden="true">
            B
          </span>
          <span>Bookkeeper</span>
        </Link>
        <NavBar />
      </div>
    </header>
  )
}

export default Header
