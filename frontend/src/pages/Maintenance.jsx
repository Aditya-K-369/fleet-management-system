import { useEffect, useState } from 'react'
import {
  getMaintenanceRecords,
  createMaintenanceRecord,
  completeMaintenanceRecord,
  deleteMaintenanceRecord,
} from '../services/maintenanceApi'
import { getVehicles } from '../services/vehicleApi'

const statusStyles = {
  SCHEDULED: 'bg-warning text-dark',
  COMPLETED: 'bg-success',
}

const emptyForm = { vehicleId: '', serviceDate: '', description: '', cost: '' }

function Maintenance() {
  const [records, setRecords] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadAll = async () => {
    try {
      const [r, v] = await Promise.all([getMaintenanceRecords(), getVehicles()])
      setRecords(r)
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

  const totalCost = records
    .filter((r) => r.status === 'COMPLETED')
    .reduce((sum, r) => sum + Number(r.cost), 0)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createMaintenanceRecord({
        vehicleId: Number(form.vehicleId),
        serviceDate: form.serviceDate,
        description: form.description,
        cost: Number(form.cost),
      })
      setForm(emptyForm)
      await loadAll()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleComplete = async (id) => {
    try {
      await completeMaintenanceRecord(id)
      await loadAll()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this maintenance record?')) return
    try {
      await deleteMaintenanceRecord(id)
      await loadAll()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Maintenance</h2>
        <div className="text-end">
          <div className="text-muted small">Completed service cost</div>
          <div className="fs-5 fw-semibold">{totalCost}</div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger d-flex justify-content-between">
          <span>{error}</span>
          <button className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      <div className="card mb-4">
        <div className="card-header">Schedule Service</div>
        <div className="card-body">
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-6">
              <select className="form-select" name="vehicleId" value={form.vehicleId} onChange={handleChange} required>
                <option value="">Select vehicle</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.brand} {v.name} ({v.registrationNumber})
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <input className="form-control" type="date" name="serviceDate" value={form.serviceDate} onChange={handleChange} required />
            </div>
            <div className="col-md-3">
              <input className="form-control" type="number" min="0" step="0.01" name="cost" placeholder="Cost" value={form.cost} onChange={handleChange} required />
            </div>
            <div className="col-12">
              <input className="form-control" name="description" placeholder="Description (e.g. oil change)" value={form.description} onChange={handleChange} required />
            </div>
            <div className="col-12">
              <button className="btn btn-dark" type="submit">Add Record</button>
            </div>
          </form>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead className="table-dark">
            <tr>
              <th>Vehicle</th>
              <th>Date</th>
              <th>Description</th>
              <th>Cost</th>
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
            {!loading && records.map((r) => (
              <tr key={r.id}>
                <td>{r.vehicle?.brand} {r.vehicle?.name} ({r.vehicle?.registrationNumber})</td>
                <td>{r.serviceDate}</td>
                <td>{r.description}</td>
                <td>{r.cost}</td>
                <td><span className={`badge ${statusStyles[r.status]}`}>{r.status}</span></td>
                <td className="text-end">
                  {r.status === 'SCHEDULED' && (
                    <button className="btn btn-sm btn-outline-success me-2" onClick={() => handleComplete(r.id)}>
                      Mark done
                    </button>
                  )}
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(r.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!loading && records.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-muted">No maintenance records yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Maintenance
