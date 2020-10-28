// import Store from '../Store/Store'

let USERNAME = localStorage.getItem('cred_user')
let PASSWORD = localStorage.getItem('cred_pw')

export function setCredentials (username, password) {
  USERNAME = username
  PASSWORD = password
  localStorage.setItem('cred_user', USERNAME)
  localStorage.setItem('cred_pw', PASSWORD)
  // Store.setValue('loggedIn', username && password)
}

export function removeCredentials () {
  USERNAME = null
  PASSWORD = null
  localStorage.removeItem('cred_user')
  localStorage.removeItem('cred_pw')
  // Store.setValue('loggedIn', false)
}

export function hasCredentials () {
  return USERNAME && PASSWORD
}

/**
 *
 * @param options {{url: string, params: object, method: string, body: string|object, expectsJsonResponse: boolean,
 *   sendsJsonBody: boolean, headers: object,  acceptedStatuses: Array<number>, useAuthorization: boolean,
 *   multipart: boolean, logoutOn401: boolean}}
 */
export async function httpRequest (options) {
  const {
    url,
    params = null,
    method = 'GET',
    body = null,
    expectsJsonResponse = null,
    sendsJsonBody = false,
    headers = {},
    acceptedStatuses = [200],
    useAuthorization = true,
    multipart = false,
    logoutOn401 = true
  } = options

  const urlToRequest = new URL(url, window.location.origin)

  if (params) {
    Object.keys(params).forEach(key => {
      urlToRequest.searchParams.set(key, params[key])
    })
  }

  if (body && sendsJsonBody && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json'
  }

  if (expectsJsonResponse && !headers['Accept']) {
    headers['Accept'] = 'application/json'
  }

  if (multipart) {
    headers['Content-Type'] = 'multipart/form-data'
  }

  if (useAuthorization) {
    headers['Authorization'] = 'Basic ' + btoa(`${USERNAME}:${PASSWORD}`)
  }

  const requestOptions = {
    body: sendsJsonBody ? JSON.stringify(body) : body,
    method: method,
    headers: new Headers(headers)
  }

  const response = await fetch(urlToRequest.href, requestOptions)

  if (acceptedStatuses.indexOf(response.status) >= 0) {
    if (expectsJsonResponse) {
      try {
        return response.json()
      } catch (error) {
        console.error('couldn\'t parse json from http response', error, response)
      }
    }
    return response
  }

  if (logoutOn401 && response.status === 401) {
    console.log('got 401 from server, switching to login page')
    removeCredentials()
    window.location.replace('/#/login')
    return null
  }
  throw new Error(response.status)
}