const API_URL = 'http://localhost:8080/api/customers'

async function handleResponse(res) {
  if (!res.ok) {
    if (res.status === 409) {
      throw new Error('A customer with this license number already exists.')
    }
    if (res.status === 404) {
      throw new Error('Customer not found. It may have been deleted.')
    }
    throw new Error(`Request failed (${res.status})`)
  }
  // DELETE returns 204 No Content
  return res.status === 204 ? null : res.json()
}

export async function getCustomers() {
  return handleResponse(await fetch(API_URL))
}

export async function createCustomer(customer) {
  return handleResponse(
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customer),
    })
  )
}

export async function updateCustomer(id, customer) {
  return handleResponse(
    await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customer),
    })
  )
}

export async function deleteCustomer(id) {
  return handleResponse(await fetch(`${API_URL}/${id}`, { method: 'DELETE' }))
}
