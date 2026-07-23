import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import './AppShell.css'

const AppShell = () => (
  <div className="app-shell">
    <Header />
    <main className="app-shell__main">
      <Outlet />
    </main>
  </div>
)

export default AppShell
