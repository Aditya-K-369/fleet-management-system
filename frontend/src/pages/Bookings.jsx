import { useState } from 'react'

// Sample data for the dropdowns. Later these will come from the API.
const sampleCustomers = [
  { id: 1, name: 'Ravi Kumar' },
  { id: 2, name: 'Anita Sharma' },
]

const sampleVehicles = [
  { id: 1, label: 'Toyota Innova (TS09AB1234)', dailyRate: 2500 },
  { id: 2, label: 'Maruti Swift (TS08CD5678)', dailyRate: 1200 },
  { id: 3, label: 'Hyundai Creta (TS10EF9012)', dailyRate: 2200 },
]

const initialBookings = [
  { id: 1, customerId: 1, vehicleId: 2, startDate: '2026-10-05', endDate: '2026-10-08', total: 3600, status: 'ACTIVE' },
]

const statusStyles = {
  ACTIVE: 'bg-primary',
  COMPLETED: 'bg-success',
  CANCELLED: 'bg-secondary',
}

const emptyForm = { customerId: '', vehicleId: '', startDate: '', endDate: '' }

function calcDays(start, end) {
  if (!start || !end) return 0
  const diff = (new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24)
  return Math.max(1, Math.round(diff))
}

function Bookings() {
  const [bookings, setBookings] = useState(initialBookings)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')

  const selectedVehicle = sampleVehicles.find((v) => v.id === Number(form.vehicleId))
  const days = calcDays(form.startDate, form.endDate)
  const previewTotal = selectedVehicle ? days * selectedVehicle.dailyRate : 0

  const customerName = (id) => sampleCustomers.find((c) => c.id === id)?.name ?? 'Unknown'
  const vehicleLabel = (id) => sampleVehicles.find((v) => v.id === id)?.label ?? 'Unknown'

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (form.endDate < form.startDate) {
      setError('End date cannot be before start date.')
      return
    }
    setBookings([
      ...bookings,
      {
        id: Date.now(),
        customerId: Number(form.customerId),
        vehicleId: Number(form.vehicleId),
        startDate: form.startDate,
        endDate: form.endDate,
        total: previewTotal,
        status: 'ACTIVE',
      },
    ])
    setForm(emptyForm)
  }

  const updateStatus = (id, status) => {
    setBookings(bookings.map((b) => (b.id === id ? { ...b, status } : b)))
  }

  return (
    <div>
      <h2 className="mb-4">Bookings</h2>

      <div className="card mb-4">
        <div className="card-header">New Booking</div>
        <div className="card-body">
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-6">
              <select className="form-select" name="customerId" value={form.customerId} onChange={handleChange} required>
                <option value="">Select customer</option>
                {sampleCustomers.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <select className="form-select" name="vehicleId" value={form.vehicleId} onChange={handleChange} required>
                <option value="">Select vehicle</option>
                {sampleVehicles.map((v) => (
                  <option key={v.id} value={v.id}>{v.label}</option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Start date</label>
              <input className="form-control" type="date" name="startDate" value={form.startDate} onChange={handleChange} required />
            </div>
            <div className="col-md-4">
              <label className="form-label">End date</label>
              <input className="form-control" type="date" name="endDate" value={form.endDate} onChange={handleChange} required />
            </div>
            <div className="col-md-4 d-flex align-items-end">
              <div>
                <div className="text-muted small">Estimated total</div>
                <div className="fs-5 fw-semibold">{previewTotal}</div>
              </div>
            </div>
            {error && (
              <div className="col-12">
                <div className="alert alert-danger py-2 mb-0">{error}</div>
              </div>
            )}
            <div className="col-12">
              <button className="btn btn-dark" type="submit">Create Booking</button>
            </div>
          </form>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead className="table-dark">
            <tr>
              <th>Customer</th>
              <th>Vehicle</th>
              <th>Dates</th>
              <th>Total</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td>{customerName(b.customerId)}</td>
                <td>{vehicleLabel(b.vehicleId)}</td>
                <td>{b.startDate} to {b.endDate}</td>
                <td>{b.total}</td>
                <td><span className={`badge ${statusStyles[b.status]}`}>{b.status}</span></td>
                <td className="text-end">
                  {b.status === 'ACTIVE' && (
                    <>
                      <button className="btn btn-sm btn-outline-success me-2" onClick={() => updateStatus(b.id, 'COMPLETED')}>
                        Complete
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => updateStatus(b.id, 'CANCELLED')}>
                        Cancel
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-muted">No bookings yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Bookings
