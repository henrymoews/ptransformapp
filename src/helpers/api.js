import { getUserDataFromCookie } from './auth'

const baseURL = 'https://parkplatztransform-api.herokuapp.com'
//const baseURL = 'http://localhost:8023'

export const routes = {
  users: `${baseURL}/users/`,
  usersVerify: `${baseURL}/users/verify/`,
  segments: `${baseURL}/segments/`
}

export const headers = () => new Headers({ 
  'Content-Type': 'application/json',
  'Authorization': `bearer ${getUserDataFromCookie()?.token}`
})

export async function postSegment(segment) {
  const response = await fetch(routes.segments, { 
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(segment)
  })
  return await response.json()
}

export async function getSegments(boundingBox) {
  const url = boundingBox ? `${routes.segments}?bbox=${boundingBox}` : routes.segments
  const response = await fetch(url)
  return await response.json()
}

export async function getSegment(segmentId) {
  const response = await fetch(`routes.segments${segmentId}`)
  return await response.json()
}

export async function deleteSegments(segmentId) {
  const response = await fetch(`routes.segments${segmentId}`, { 
    method: 'DELETE',
    headers: headers()
  })
  return await response.json()
}

export async function updateSegments(segmentId, segment) {
  const response = await fetch(`routes.segments${segmentId}`, { 
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(segment)
  })
  return await response.json()
}

