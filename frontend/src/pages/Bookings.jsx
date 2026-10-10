import { useEffect, useState } from 'react'
import { getBookings, createBooking, completeBooking, cancelBooking } from '../services/bookingApi'
import { getVehicles } from '../services/vehicleApi'
import { getCustomers } from '../services/customerApi'

const statusStyles = {
  ACTIVE: 'bg-primary',
  COMPLETED: 'bg-success',
  CANCELLED: 'bg-secondary',
}

const emptyForm = { customerId: '', vehicleId: '', startDate: '', endDate: '' }

function calcDays(start, end) {
  if (!start || !end) return 0
  const diff = (new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24)
  return Math.max(0, Math.round(diff))
}

function Bookings() {
  const [bookings, setBookings] = useState([])
  const [customers, setCustomers] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadAll = async () => {
    try {
      const [b, c, v] = await Promise.all([getBookings(), getCustomers(), getVehicles()])
      setBookings(b)
      setCustomers(c)
      setVehicles(v)
      setError('')
    } catch (err) {
      setError(`Could not load data: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAll()
  }, [])

  const bookableVehicles = vehicles.filter((v) => v.available)
  const selectedVehicle = vehicles.find((v) => v.id === Number(form.vehicleId))
  const days = calcDays(form.startDate, form.endDate)
  const previewTotal = selectedVehicle ? days * Number(selectedVehicle.rentalPricePerDay) : 0

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (days < 1) {
      setError('End date must be after start date.')
      return
    }
    try {
      await createBooking({
        customerId: Number(form.customerId),
        vehicleId: Number(form.vehicleId),
        startDate: form.startDate,
        endDate: form.endDate,
      })
      setForm(emptyForm)
      await loadAll()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleStatusChange = async (action, id) => {
    try {
      await action(id)
      await loadAll()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <h2 className="mb-4">Bookings</h2>

      {error && (
        <div className="alert alert-danger d-flex justify-content-between">
          <span>{error}</span>
          <button className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      <div className="card mb-4">
        <div className="card-header">New Booking</div>
        <div className="card-body">
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-6">
              <select className="form-select" name="customerId" value={form.customerId} onChange={handleChange} required>
                <option value="">Select customer</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>{c.fullName}</option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <select className="form-select" name="vehicleId" value={form.vehicleId} onChange={handleChange} required>
                <option value="">Select vehicle</option>
                {bookableVehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.brand} {v.name} ({v.registrationNumber}) - {v.rentalPricePerDay}/day
                  </option>
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
                <div className="text-muted small">Estimated total ({days} {days === 1 ? 'day' : 'days'})</div>
                <div className="fs-5 fw-semibold">{previewTotal}</div>
              </div>
            </div>
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
            {loading && (
              <tr>
                <td colSpan="6" className="text-center text-muted">Loading...</td>
              </tr>
            )}
            {!loading && bookings.map((b) => (
              <tr key={b.id}>
                <td>{b.customer?.fullName}</td>
                <td>{b.vehicle?.brand} {b.vehicle?.name} ({b.vehicle?.registrationNumber})</td>
                <td>{b.startDate} to {b.endDate}</td>
                <td>{b.totalPrice}</td>
                <td><span className={`badge ${statusStyles[b.status]}`}>{b.status}</span></td>
                <td className="text-end">
                  {b.status === 'ACTIVE' && (
                    <>
                      <button className="btn btn-sm btn-outline-success me-2" onClick={() => handleStatusChange(completeBooking, b.id)}>
                        Complete
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleStatusChange(cancelBooking, b.id)}>
                        Cancel
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {!loading && bookings.length === 0 && (
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
