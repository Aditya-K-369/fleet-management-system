import { useState } from 'react'

const initialCustomers = [
  { id: 1, name: 'Ravi Kumar', phone: '9876543210', email: 'ravi@example.com', licenseNumber: 'TS0920230001' },
  { id: 2, name: 'Anita Sharma', phone: '9123456780', email: 'anita@example.com', licenseNumber: 'TS0820220045' },
]

const emptyForm = {
  name: '',
  phone: '',
  email: '',
  licenseNumber: '',
}

function Customers() {
  const [customers, setCustomers] = useState(initialCustomers)
  const [form, setForm] = useState(emptyForm)
  const [search, setSearch] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setCustomers([...customers, { ...form, id: Date.now() }])
    setForm(emptyForm)
  }

  const handleDelete = (id) => {
    setCustomers(customers.filter((c) => c.id !== id))
  }

  const filtered = customers.filter((c) =>
    `${c.name} ${c.phone} ${c.email} ${c.licenseNumber}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  return (
    <div>
      <h2 className="mb-4">Customers</h2>

      <div className="card mb-4">
        <div className="card-header">Add Customer</div>
        <div className="card-body">
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-3">
              <input className="form-control" name="name" placeholder="Full name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="col-md-3">
              <input className="form-control" name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required />
            </div>
            <div className="col-md-3">
              <input className="form-control" type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
            </div>
            <div className="col-md-3">
              <input className="form-control" name="licenseNumber" placeholder="License number" value={form.licenseNumber} onChange={handleChange} required />
            </div>
            <div className="col-12">
              <button className="btn btn-dark" type="submit">Add Customer</button>
            </div>
          </form>
        </div>
      </div>

      <input
        className="form-control mb-3"
        placeholder="Search customers..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>License</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.phone}</td>
                <td>{c.email}</td>
                <td>{c.licenseNumber}</td>
                <td className="text-end">
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(c.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-muted">No customers found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Customers
