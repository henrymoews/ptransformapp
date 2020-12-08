//const baseURL = "https://parkplatztransform-api.herokuapp.com"
const baseURL = "http://localhost:8023"

export const routes = {
  users: `${baseURL}/users/`,
  usersVerify: `${baseURL}/users/verify/`,
  segments: `${baseURL}/segments/`
}

export const headers = {
  contentJSON: new Headers({ 'Content-Type': 'application/json' })
}

