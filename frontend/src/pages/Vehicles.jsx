import { useState } from 'react'

const initialVehicles = [
  { id: 1, make: 'Toyota', model: 'Innova', plateNumber: 'TS09AB1234', type: 'SUV', dailyRate: 2500, status: 'AVAILABLE' },
  { id: 2, make: 'Maruti', model: 'Swift', plateNumber: 'TS08CD5678', type: 'Car', dailyRate: 1200, status: 'RENTED' },
  { id: 3, make: 'Hyundai', model: 'Creta', plateNumber: 'TS10EF9012', type: 'SUV', dailyRate: 2200, status: 'IN_MAINTENANCE' },
]

const statusStyles = {
  AVAILABLE: 'bg-success',
  RENTED: 'bg-primary',
  IN_MAINTENANCE: 'bg-warning text-dark',
}

const emptyForm = {
  make: '',
  model: '',
  plateNumber: '',
  type: 'Car',
  dailyRate: '',
  status: 'AVAILABLE',
}

function Vehicles() {
  const [vehicles, setVehicles] = useState(initialVehicles)
  const [form, setForm] = useState(emptyForm)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newVehicle = {
      ...form,
      id: Date.now(),
      dailyRate: Number(form.dailyRate),
    }
    setVehicles([...vehicles, newVehicle])
    setForm(emptyForm)
  }

  const handleDelete = (id) => {
    setVehicles(vehicles.filter((v) => v.id !== id))
  }

  return (
    <div>
      <h2 className="mb-4">Vehicles</h2>

      <div className="card mb-4">
        <div className="card-header">Add Vehicle</div>
        <div className="card-body">
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-3">
              <input className="form-control" name="make" placeholder="Make" value={form.make} onChange={handleChange} required />
            </div>
            <div className="col-md-3">
              <input className="form-control" name="model" placeholder="Model" value={form.model} onChange={handleChange} required />
            </div>
            <div className="col-md-3">
              <input className="form-control" name="plateNumber" placeholder="Plate number" value={form.plateNumber} onChange={handleChange} required />
            </div>
            <div className="col-md-3">
              <select className="form-select" name="type" value={form.type} onChange={handleChange}>
                <option>Car</option>
                <option>SUV</option>
                <option>Van</option>
                <option>Bike</option>
              </select>
            </div>
            <div className="col-md-3">
              <input className="form-control" type="number" min="0" name="dailyRate" placeholder="Daily rate" value={form.dailyRate} onChange={handleChange} required />
            </div>
            <div className="col-md-3">
              <select className="form-select" name="status" value={form.status} onChange={handleChange}>
                <option value="AVAILABLE">Available</option>
                <option value="RENTED">Rented</option>
                <option value="IN_MAINTENANCE">In maintenance</option>
              </select>
            </div>
            <div className="col-md-3">
              <button className="btn btn-dark" type="submit">Add Vehicle</button>
            </div>
          </form>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead className="table-dark">
            <tr>
              <th>Vehicle</th>
              <th>Plate</th>
              <th>Type</th>
              <th>Daily rate</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v) => (
              <tr key={v.id}>
                <td>{v.make} {v.model}</td>
                <td>{v.plateNumber}</td>
                <td>{v.type}</td>
                <td>{v.dailyRate}</td>
                <td>
                  <span className={`badge ${statusStyles[v.status]}`}>
                    {v.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="text-end">
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(v.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {vehicles.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-muted">No vehicles yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Vehicles
