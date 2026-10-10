import { Routes, Route } from 'react-router-dom'
import AppNavbar from './components/AppNavbar'
import Dashboard from './pages/Dashboard'
import Vehicles from './pages/Vehicles'
import Bookings from './pages/Bookings'
import Customers from './pages/Customers'
import Maintenance from './pages/Maintenance'

function App() {
  return (
    <>
      <AppNavbar />
      <div className="container py-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/maintenance" element={<Maintenance />} />
        </Routes>
      </div>
    </>
  )
}

export default App
