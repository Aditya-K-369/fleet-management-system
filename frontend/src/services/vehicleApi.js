const API_URL = 'http://localhost:8080/api/vehicles'

async function handleResponse(res) {
  if (!res.ok) {
    let message = `Request failed (${res.status})`
    try {
      const body = await res.json()
      if (body.message) message = body.message
    } catch {
      // response had no JSON body, keep the default message
    }
    throw new Error(message)
  }
  // DELETE returns 204 No Content
  return res.status === 204 ? null : res.json()
}

export async function getVehicles() {
  return handleResponse(await fetch(API_URL))
}

export async function createVehicle(vehicle) {
  return handleResponse(
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vehicle),
    })
  )
}

export async function updateVehicle(id, vehicle) {
  return handleResponse(
    await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vehicle),
    })
  )
}

export async function deleteVehicle(id) {
  return handleResponse(await fetch(`${API_URL}/${id}`, { method: 'DELETE' }))
}
