import { useEffect, useState } from 'react'
import { getVehicles } from '../services/vehicleApi'
import { getBookings } from '../services/bookingApi'
import { getMaintenanceRecords } from '../services/maintenanceApi'

const statusStyles = {
  ACTIVE: 'bg-primary',
  COMPLETED: 'bg-success',
  CANCELLED: 'bg-secondary',
}

function StatCard({ title, value, color }) {
  return (
    <div className="col-6 col-lg-4">
      <div className={`card border-${color} h-100`}>
        <div className="card-body">
          <div className="text-muted small">{title}</div>
          <div className="fs-2 fw-semibold">{value}</div>
        </div>
      </div>
    </div>
  )
}

function Dashboard() {
  const [vehicles, setVehicles] = useState([])
  const [bookings, setBookings] = useState([])
  const [maintenance, setMaintenance] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const [v, b, m] = await Promise.all([
          getVehicles(),
          getBookings(),
          getMaintenanceRecords(),
        ])
        setVehicles(v)
        setBookings(b)
        setMaintenance(m)
      } catch (err) {
        setError(`Could not load dashboard data: ${err.message}`)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Today as YYYY-MM-DD in local time, comparable with the dates from the API
  const today = new Date().toLocaleDateString('en-CA')

  // Vehicles with an active booking that covers today
  const rentedIds = new Set(
    bookings
      .filter((b) => b.status === 'ACTIVE' && b.startDate <= today && today <= b.endDate)
      .map((b) => b.vehicle?.id)
  )

  // Vehicles with a scheduled service dated today or earlier
  const maintenanceIds = new Set(
    maintenance
      .filter((m) => m.status === 'SCHEDULED' && m.serviceDate <= today)
      .map((m) => m.vehicle?.id)
  )

  // Each vehicle falls into exactly one group
  let rented = 0
  let inMaintenance = 0
  let unavailable = 0
  let available = 0
  vehicles.forEach((v) => {
    if (rentedIds.has(v.id)) rented++
    else if (maintenanceIds.has(v.id)) inMaintenance++
    else if (!v.available) unavailable++
    else available++
  })

  const total = vehicles.length
  const activeBookings = bookings.filter((b) => b.status === 'ACTIVE').length
  const revenue = bookings
    .filter((b) => b.status === 'COMPLETED')
    .reduce((sum, b) => sum + Number(b.totalPrice), 0)

  const percent = (n) => (total === 0 ? 0 : Math.round((n / total) * 100))

  const recentBookings = [...bookings].sort((a, b) => b.id - a.id).slice(0, 5)

  if (loading) {
    return <p className="text-muted">Loading dashboard...</p>
  }

  return (
    <div>
      <h2 className="mb-4">Dashboard</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-3 mb-4">
        <StatCard title="Total vehicles" value={total} color="dark" />
        <StatCard title="Available now" value={available} color="success" />
        <StatCard title="Rented now" value={rented} color="primary" />
        <StatCard title="In maintenance" value={inMaintenance} color="warning" />
        <StatCard title="Active bookings" value={activeBookings} color="primary" />
        <StatCard title="Revenue (completed)" value={revenue} color="success" />
      </div>

      <div className="card mb-4">
        <div className="card-header">Fleet utilization (today)</div>
        <div className="card-body">
          {total === 0 ? (
            <span className="text-muted">No vehicles yet.</span>
          ) : (
            <>
              <div className="progress" style={{ height: '24px' }}>
                <div className="progress-bar bg-success" style={{ width: `${percent(available)}%` }}>
                  {percent(available) > 0 && `Available ${percent(available)}%`}
                </div>
                <div className="progress-bar bg-primary" style={{ width: `${percent(rented)}%` }}>
                  {percent(rented) > 0 && `Rented ${percent(rented)}%`}
                </div>
                <div className="progress-bar bg-warning text-dark" style={{ width: `${percent(inMaintenance)}%` }}>
                  {percent(inMaintenance) > 0 && `Maintenance ${percent(inMaintenance)}%`}
                </div>
                <div className="progress-bar bg-secondary" style={{ width: `${percent(unavailable)}%` }}>
                  {percent(unavailable) > 0 && `Unavailable ${percent(unavailable)}%`}
                </div>
              </div>
              <div className="text-muted small mt-2">
                Rented = active booking covering today. Maintenance = scheduled service dated today or earlier.
                Unavailable = vehicle marked not available.
              </div>
            </>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-header">Recent bookings</div>
        <div className="table-responsive">
          <table className="table table-striped align-middle mb-0">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Vehicle</th>
                <th>Dates</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((b) => (
                <tr key={b.id}>
                  <td>{b.customer?.fullName}</td>
                  <td>{b.vehicle?.brand} {b.vehicle?.name}</td>
                  <td>{b.startDate} to {b.endDate}</td>
                  <td>{b.totalPrice}</td>
                  <td><span className={`badge ${statusStyles[b.status]}`}>{b.status}</span></td>
                </tr>
              ))}
              {recentBookings.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center text-muted">No bookings yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
