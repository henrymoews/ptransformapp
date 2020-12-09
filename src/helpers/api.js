const baseURL = "https://parkplatztransform-api.herokuapp.com"

export const routes = {
  users: `${baseURL}/users/`,
  usersVerify: `${baseURL}/users/verify/`,
  segments: `${baseURL}/segments/`
}

export const headers = {
  contentJSON: new Headers({ 'Content-Type': 'application/json' })
}

