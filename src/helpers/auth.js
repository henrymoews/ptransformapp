import jwt_decode from 'jwt-decode';


function getAuthTokenExpiration(token) {
  const tokenTTL = 14 * 24 * 60 // 2 Weeks in minutes, same as backend
  const { iat } = jwt_decode(token)
  const tokenIssuedAt = new Date(iat * 1000)
  tokenIssuedAt.setUTCMinutes(tokenIssuedAt.getUTCMinutes() + tokenTTL)
  return (tokenIssuedAt).toUTCString()
}

export function getUserDataFromCookie() {
  const match = document.cookie.match(new RegExp('access_token=([^;]+)'))
  if (match?.length && match[0]) {
    const { sub } = jwt_decode(match[0])
    return {
      loggedIn: true,
      email: sub,
      token: match[1],
    }
  } else {
    return {
      loggedIn: false,
      email: null,
      token: null,
    }
  }
}

export function setAuthCookie(token) {
  const expires = getAuthTokenExpiration(token)
  document.cookie = `access_token=${token};expires=${expires};path=/`
}
