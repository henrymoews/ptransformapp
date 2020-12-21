export function geoJsonFromSegments (segments) {
  return {
    'type': 'FeatureCollection',
    'features': segments
  }
}