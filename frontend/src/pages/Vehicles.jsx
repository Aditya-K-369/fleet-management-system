import { useEffect, useState } from 'react'
import {
  getVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from '../services/vehicleApi'

const emptyForm = {
  name: '',
  brand: '',
  model: '',
  registrationNumber: '',
  rentalPricePerDay: '',
  seatingCapacity: '',
  available: true,
}

function Vehicles() {
  const [vehicles, setVehicles] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadVehicles = async () => {
    try {
      setVehicles(await getVehicles())
      setError('')
    } catch (err) {
      setError(`Could not load vehicles: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadVehicles()
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      ...form,
      rentalPricePerDay: Number(form.rentalPricePerDay),
      seatingCapacity: Number(form.seatingCapacity),
    }
    try {
      if (editingId) {
        await updateVehicle(editingId, payload)
      } else {
        await createVehicle(payload)
      }
      setForm(emptyForm)
      setEditingId(null)
      await loadVehicles()
    } catch (err) {
      setError(`Could not save vehicle: ${err.message}`)
    }
  }

  const handleEdit = (vehicle) => {
    setEditingId(vehicle.id)
    setForm({
      name: vehicle.name,
      brand: vehicle.brand,
      model: vehicle.model,
      registrationNumber: vehicle.registrationNumber,
      rentalPricePerDay: vehicle.rentalPricePerDay,
      seatingCapacity: vehicle.seatingCapacity,
      available: vehicle.available,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setForm(emptyForm)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this vehicle?')) return
    try {
      await deleteVehicle(id)
      await loadVehicles()
    } catch (err) {
      setError(`Could not delete vehicle: ${err.message}`)
    }
  }

  return (
    <div>
      <h2 className="mb-4">Vehicles</h2>

      {error && (
        <div className="alert alert-danger d-flex justify-content-between">
          <span>{error}</span>
          <button className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      <div className="card mb-4">
        <div className="card-header">{editingId ? 'Edit Vehicle' : 'Add Vehicle'}</div>
        <div className="card-body">
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-3">
              <input className="form-control" name="name" placeholder="Name (e.g. Swift)" value={form.name} onChange={handleChange} required />
            </div>
            <div className="col-md-3">
              <input className="form-control" name="brand" placeholder="Brand" value={form.brand} onChange={handleChange} required />
            </div>
            <div className="col-md-3">
              <input className="form-control" name="model" placeholder="Model" value={form.model} onChange={handleChange} required />
            </div>
            <div className="col-md-3">
              <input className="form-control" name="registrationNumber" placeholder="Registration number" value={form.registrationNumber} onChange={handleChange} required />
            </div>
            <div className="col-md-3">
              <input className="form-control" type="number" min="0" step="0.01" name="rentalPricePerDay" placeholder="Price per day" value={form.rentalPricePerDay} onChange={handleChange} required />
            </div>
            <div className="col-md-3">
              <input className="form-control" type="number" min="1" name="seatingCapacity" placeholder="Seats" value={form.seatingCapacity} onChange={handleChange} required />
            </div>
            <div className="col-md-3 d-flex align-items-center">
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="available" name="available" checked={form.available} onChange={handleChange} />
                <label className="form-check-label" htmlFor="available">Available</label>
              </div>
            </div>
            <div className="col-md-3">
              <button className="btn btn-dark me-2" type="submit">
                {editingId ? 'Update' : 'Add Vehicle'}
              </button>
              {editingId && (
                <button className="btn btn-outline-secondary" type="button" onClick={handleCancelEdit}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead className="table-dark">
            <tr>
              <th>Vehicle</th>
              <th>Model</th>
              <th>Registration</th>
              <th>Seats</th>
              <th>Price / day</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="7" className="text-center text-muted">Loading...</td>
              </tr>
            )}
            {!loading && vehicles.map((v) => (
              <tr key={v.id}>
                <td>{v.brand} {v.name}</td>
                <td>{v.model}</td>
                <td>{v.registrationNumber}</td>
                <td>{v.seatingCapacity}</td>
                <td>{v.rentalPricePerDay}</td>
                <td>
                  <span className={`badge ${v.available ? 'bg-success' : 'bg-secondary'}`}>
                    {v.available ? 'Available' : 'Unavailable'}
                  </span>
                </td>
                <td className="text-end">
                  <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(v)}>
                    Edit
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(v.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!loading && vehicles.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center text-muted">No vehicles yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Vehicles
