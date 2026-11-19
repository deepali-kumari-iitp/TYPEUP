
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://127.0.0.1:8000/api/v1'

async function apiRequest(endpoint) {
  let response

  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`)
  } catch {
    throw new Error(
      'Unable to connect to TYPEUP server. Please check whether the backend is running.'
    )
  }

  if (!response.ok) {
    let message = `API request failed with status ${response.status}`

    try {
      const errorData = await response.json()
      message = errorData.detail || message
    } catch {
      // Keep the default error message.
    }

    throw new Error(message)
  }

  return response.json()
}

export const lessonService = {
  getAll: () => apiRequest('/lessons/'),

  getByDay: (dayNumber) => {
    if (
      !Number.isInteger(dayNumber) ||
      dayNumber < 1 ||
      dayNumber > 30
    ) {
      throw new Error('Day number must be between 1 and 30.')
    }

    return apiRequest(`/lessons/${dayNumber}`)
  },
}
