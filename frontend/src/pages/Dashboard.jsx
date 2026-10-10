// Sample data. Later this will be calculated from the API.
const vehicles = [
  { id: 1, status: 'AVAILABLE' },
  { id: 2, status: 'RENTED' },
  { id: 3, status: 'IN_MAINTENANCE' },
  { id: 4, status: 'AVAILABLE' },
  { id: 5, status: 'RENTED' },
]

const bookings = [
  { id: 1, customer: 'Ravi Kumar', vehicle: 'Maruti Swift', startDate: '2026-10-05', endDate: '2026-10-08', total: 3600, status: 'ACTIVE' },
  { id: 2, customer: 'Anita Sharma', vehicle: 'Toyota Innova', startDate: '2026-10-01', endDate: '2026-10-04', total: 7500, status: 'COMPLETED' },
  { id: 3, customer: 'Ravi Kumar', vehicle: 'Hyundai Creta', startDate: '2026-09-20', endDate: '2026-09-22', total: 4400, status: 'COMPLETED' },
]

const statusStyles = {
  ACTIVE: 'bg-primary',
  COMPLETED: 'bg-success',
  CANCELLED: 'bg-secondary',
}

function StatCard({ title, value, color }) {
  return (
    <div className="col-6 col-lg-3">
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
  const total = vehicles.length
  const count = (status) => vehicles.filter((v) => v.status === status).length
  const available = count('AVAILABLE')
  const rented = count('RENTED')
  const maintenance = count('IN_MAINTENANCE')

  const activeBookings = bookings.filter((b) => b.status === 'ACTIVE').length
  const revenue = bookings
    .filter((b) => b.status === 'COMPLETED')
    .reduce((sum, b) => sum + b.total, 0)

  const percent = (n) => (total === 0 ? 0 : Math.round((n / total) * 100))

  return (
    <div>
      <h2 className="mb-4">Dashboard</h2>

      <div className="row g-3 mb-4">
        <StatCard title="Total vehicles" value={total} color="dark" />
        <StatCard title="Available" value={available} color="success" />
        <StatCard title="Rented" value={rented} color="primary" />
        <StatCard title="In maintenance" value={maintenance} color="warning" />
        <StatCard title="Active bookings" value={activeBookings} color="primary" />
        <StatCard title="Revenue (completed)" value={revenue} color="success" />
      </div>

      <div className="card mb-4">
        <div className="card-header">Fleet utilization</div>
        <div className="card-body">
          <div className="progress" style={{ height: '24px' }}>
            <div className="progress-bar bg-success" style={{ width: `${percent(available)}%` }}>
              {percent(available) > 0 && `Available ${percent(available)}%`}
            </div>
            <div className="progress-bar bg-primary" style={{ width: `${percent(rented)}%` }}>
              {percent(rented) > 0 && `Rented ${percent(rented)}%`}
            </div>
            <div className="progress-bar bg-warning text-dark" style={{ width: `${percent(maintenance)}%` }}>
              {percent(maintenance) > 0 && `Maintenance ${percent(maintenance)}%`}
            </div>
          </div>
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
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td>{b.customer}</td>
                  <td>{b.vehicle}</td>
                  <td>{b.startDate} to {b.endDate}</td>
                  <td>{b.total}</td>
                  <td><span className={`badge ${statusStyles[b.status]}`}>{b.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
