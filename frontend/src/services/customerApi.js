const API_URL = 'http://localhost:8080/api/customers'

// Shows the server's own message when there is one (validation, duplicates, not found...)
async function handleResponse(res) {
  if (!res.ok) {
    let message = `Request failed (${res.status})`
    try {
      const body = await res.json()
      if (body.message) message = body.message
    } catch {
      // no JSON body, keep the default message
    }
    throw new Error(message)
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
