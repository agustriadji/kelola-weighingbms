// API utility with automatic token handling
export const apiCall = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token')
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  }

  return fetch(url, {
    ...options,
    headers,
  })
}

export const apiGet = (url: string) => apiCall(url)
export const apiPost = (url: string, data: any) => apiCall(url, {
  method: 'POST',
  body: JSON.stringify(data)
})
export const apiPut = (url: string, data: any) => apiCall(url, {
  method: 'PUT', 
  body: JSON.stringify(data)
})
export const apiDelete = (url: string) => apiCall(url, { method: 'DELETE' })