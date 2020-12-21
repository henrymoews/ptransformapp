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

export async function getSegments(boundingBox = null, excludedSegmentIds = [], details = false) {
  const url = routes.segments
  const params = {
    details: details ? 1 : 0
  }
  if (boundingBox) {
    params.bbox = boundingBox
  }
  if (excludedSegmentIds.length > 0) {
    params.exclude = excludedSegmentIds.join(',')
  }
  const searchParams = new URLSearchParams(params)
  const response = await fetch(`${url}?${searchParams.toString()}`)
  return await response.json()
}

export async function getSegment(segmentId) {
  const response = await fetch(`${routes.segments}${segmentId}`)
  return await response.json()
}

export async function deleteSegments(segmentId) {
  const response = await fetch(`${routes.segments}${segmentId}`, {
    method: 'DELETE',
    headers: headers()
  })
  return await response.json()
}

export async function updateSegment(segment) {
  const response = await fetch(`${routes.segments}${segment.id}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(segment)
  })
  return await response.json()
}

