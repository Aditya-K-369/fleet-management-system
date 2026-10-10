const API_URL = 'http://localhost:8080/api/maintenance'

async function handleResponse(res) {
  if (!res.ok) {
    if (res.status === 400) {
      throw new Error('Invalid details. Check all fields and make sure the cost is not negative.')
    }
    if (res.status === 404) {
      throw new Error('Vehicle or maintenance record not found.')
    }
    if (res.status === 409) {
      throw new Error('This record is already completed.')
    }
    throw new Error(`Request failed (${res.status})`)
  }
  // DELETE returns 204 No Content
  return res.status === 204 ? null : res.json()
}

export async function getMaintenanceRecords() {
  return handleResponse(await fetch(API_URL))
}

export async function createMaintenanceRecord(record) {
  return handleResponse(
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    })
  )
}

export async function completeMaintenanceRecord(id) {
  return handleResponse(await fetch(`${API_URL}/${id}/complete`, { method: 'PATCH' }))
}

export async function deleteMaintenanceRecord(id) {
  return handleResponse(await fetch(`${API_URL}/${id}`, { method: 'DELETE' }))
}
