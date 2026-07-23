import { Navigate, Route, Routes } from 'react-router-dom'
import HomeView from '../views/HomeView'
import MonthView from '../views/MonthView'
import YearView from '../views/YearView'
import AppShell from './AppShell'

const AppRoutes = () => (
  <Routes>
    <Route element={<AppShell />}>
      <Route index element={<HomeView />} />
      <Route path="years/:year" element={<YearView />} />
      <Route path="years/:year/months/:month" element={<MonthView />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  </Routes>
)

export default AppRoutes
