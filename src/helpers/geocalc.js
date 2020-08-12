/**
 * Taken from here: https://www.movable-type.co.uk/scripts/latlong.html
 * @param p1 [lat, lon]
 * @param p2 [lat, lon]
 * @returns {number}
 */
export function calcDistance(p1, p2) {
  const lat1 = p1[0]
  const lon1 = p1[1]
  const lat2 = p2[0]
  const lon2 = p2[1]
  const R = 6371e3 // metres
  const φ1 = lat1 * Math.PI / 180 // φ, λ in radians
  const φ2 = lat2 * Math.PI / 180
  const Δφ = (lat2 - lat1) * Math.PI / 180
  const Δλ = (lon2 - lon1) * Math.PI / 180

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  const d = R * c // in metres

  return d
}

export function calcDistanceOfPolyline (points) {
  if (points.length < 2) {
    return 0
  }

  let length = 0
  for (let i = 0; i < points.length - 1; i++) {
    length += calcDistance(points[i], points[i+1])
  }
  return length
}