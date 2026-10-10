import { useEffect, useState } from 'react'
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from '../services/customerApi'

const emptyForm = {
  fullName: '',
  phone: '',
  email: '',
  licenseNumber: '',
}

function Customers() {
  const [customers, setCustomers] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadCustomers = async () => {
    try {
      setCustomers(await getCustomers())
      setError('')
    } catch (err) {
      setError(`Could not load customers: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCustomers()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await updateCustomer(editingId, form)
      } else {
        await createCustomer(form)
      }
      setForm(emptyForm)
      setEditingId(null)
      await loadCustomers()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleEdit = (customer) => {
    setEditingId(customer.id)
    setForm({
      fullName: customer.fullName,
      phone: customer.phone,
      email: customer.email,
      licenseNumber: customer.licenseNumber,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setForm(emptyForm)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this customer?')) return
    try {
      await deleteCustomer(id)
      await loadCustomers()
    } catch (err) {
      setError(err.message)
    }
  }

  const filtered = customers.filter((c) =>
    `${c.fullName} ${c.phone} ${c.email} ${c.licenseNumber}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  return (
    <div>
      <h2 className="mb-4">Customers</h2>

      {error && (
        <div className="alert alert-danger d-flex justify-content-between">
          <span>{error}</span>
          <button className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      <div className="card mb-4">
        <div className="card-header">{editingId ? 'Edit Customer' : 'Add Customer'}</div>
        <div className="card-body">
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-3">
              <input className="form-control" name="fullName" placeholder="Full name" value={form.fullName} onChange={handleChange} required />
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
              <button className="btn btn-dark me-2" type="submit">
                {editingId ? 'Update' : 'Add Customer'}
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
            {loading && (
              <tr>
                <td colSpan="5" className="text-center text-muted">Loading...</td>
              </tr>
            )}
            {!loading && filtered.map((c) => (
              <tr key={c.id}>
                <td>{c.fullName}</td>
                <td>{c.phone}</td>
                <td>{c.email}</td>
                <td>{c.licenseNumber}</td>
                <td className="text-end">
                  <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(c)}>
                    Edit
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(c.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!loading && filtered.length === 0 && (
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
