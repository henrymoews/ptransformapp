const baseURL = "https://parkplatztransform-api.herokuapp.com"

export const routes = {
  users: `${baseURL}/users/`,
  usersVerify: `${baseURL}/users/verify/`,
  segments: `${baseURL}/segments/`
}

export const headers = {
  contentJSON: new Headers({ 'Content-Type': 'application/json' })
}

export async function postSegment(segment) {
  console.log('Not yet implemented: postSegments')
  const segmentToReturn = Object.assign({}, segment)
  segmentToReturn.id  = Math.floor(Math.random() * 1000)
  return segmentToReturn
}

export async function deleteSegments(segmentId) {
  console.log('Not yet implemented: deleteSegments')
}
