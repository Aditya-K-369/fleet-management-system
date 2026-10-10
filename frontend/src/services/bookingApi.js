const API_URL = 'http://localhost:8080/api/bookings'

async function handleResponse(res) {
  if (!res.ok) {
    if (res.status === 409) {
      throw new Error('This booking conflicts with an existing one (vehicle already booked for these dates, or the booking is no longer active).')
    }
    if (res.status === 400) {
      throw new Error('Invalid booking details. Check that the end date is after the start date.')
    }
    if (res.status === 404) {
      throw new Error('Customer, vehicle, or booking not found.')
    }
    throw new Error(`Request failed (${res.status})`)
  }
  return res.json()
}

export async function getBookings() {
  return handleResponse(await fetch(API_URL))
}

export async function createBooking(booking) {
  return handleResponse(
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking),
    })
  )
}

export async function completeBooking(id) {
  return handleResponse(await fetch(`${API_URL}/${id}/complete`, { method: 'PATCH' }))
}

export async function cancelBooking(id) {
  return handleResponse(await fetch(`${API_URL}/${id}/cancel`, { method: 'PATCH' }))
}
