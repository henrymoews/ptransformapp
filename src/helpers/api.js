import { getUserDataFromCookie } from './auth'

const baseURL = 'https://parkplatztransform-api.herokuapp.com'

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
  const url = boundingBox ? `${routes.segments}?=${boundingBox}` : routes.segments
  const response = await fetch(url)
  return await response.json()
}

export async function deleteSegments(segmentId) {
  console.log('Not yet implemented: deleteSegments')
}
