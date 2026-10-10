import { useState } from 'react'

// Sample vehicles for the dropdown. Later these will come from the API.
const sampleVehicles = [
  { id: 1, label: 'Toyota Innova (TS09AB1234)' },
  { id: 2, label: 'Maruti Swift (TS08CD5678)' },
  { id: 3, label: 'Hyundai Creta (TS10EF9012)' },
]

const initialRecords = [
  { id: 1, vehicleId: 3, serviceDate: '2026-10-07', description: 'Brake pad replacement', cost: 4500, status: 'SCHEDULED' },
  { id: 2, vehicleId: 1, serviceDate: '2026-09-15', description: 'Oil change and filter', cost: 2200, status: 'COMPLETED' },
]

const statusStyles = {
  SCHEDULED: 'bg-warning text-dark',
  COMPLETED: 'bg-success',
}

const emptyForm = { vehicleId: '', serviceDate: '', description: '', cost: '' }

function Maintenance() {
  const [records, setRecords] = useState(initialRecords)
  const [form, setForm] = useState(emptyForm)

  const vehicleLabel = (id) => sampleVehicles.find((v) => v.id === id)?.label ?? 'Unknown'

  const totalCost = records
    .filter((r) => r.status === 'COMPLETED')
    .reduce((sum, r) => sum + r.cost, 0)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setRecords([
      ...records,
      {
        id: Date.now(),
        vehicleId: Number(form.vehicleId),
        serviceDate: form.serviceDate,
        description: form.description,
        cost: Number(form.cost),
        status: 'SCHEDULED',
      },
    ])
    setForm(emptyForm)
  }

  const markCompleted = (id) => {
    setRecords(records.map((r) => (r.id === id ? { ...r, status: 'COMPLETED' } : r)))
  }

  const handleDelete = (id) => {
    setRecords(records.filter((r) => r.id !== id))
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

      <div className="card mb-4">
        <div className="card-header">Schedule Service</div>
        <div className="card-body">
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-6">
              <select className="form-select" name="vehicleId" value={form.vehicleId} onChange={handleChange} required>
                <option value="">Select vehicle</option>
                {sampleVehicles.map((v) => (
                  <option key={v.id} value={v.id}>{v.label}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <input className="form-control" type="date" name="serviceDate" value={form.serviceDate} onChange={handleChange} required />
            </div>
            <div className="col-md-3">
              <input className="form-control" type="number" min="0" name="cost" placeholder="Cost" value={form.cost} onChange={handleChange} required />
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
            {records.map((r) => (
              <tr key={r.id}>
                <td>{vehicleLabel(r.vehicleId)}</td>
                <td>{r.serviceDate}</td>
                <td>{r.description}</td>
                <td>{r.cost}</td>
                <td><span className={`badge ${statusStyles[r.status]}`}>{r.status}</span></td>
                <td className="text-end">
                  {r.status === 'SCHEDULED' && (
                    <button className="btn btn-sm btn-outline-success me-2" onClick={() => markCompleted(r.id)}>
                      Mark done
                    </button>
                  )}
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(r.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {records.length === 0 && (
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
