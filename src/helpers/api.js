import { getUserDataFromCookie } from './auth'

const baseURL = 'https://parkplatztransform-api.herokuapp.com'

const EXAMPLE_GEOJSON = {
  'type': 'FeatureCollection',
  'features': [
    {
      'type': 'Feature',
      'properties': {},
      'id': 13,
      'geometry': {
        'type': 'LineString',
        'coordinates': [
          [
            13.389807343482971,
            52.51038691206013
          ],
          [
            13.387414813041685,
            52.510253051808995
          ],
          [
            13.386899828910828,
            52.51079502006544
          ],
          [
            13.38684618473053,
            52.51092561382671
          ],
          [
            13.38683009147644,
            52.51099091056185
          ]
        ]
      }
    },
    // {
    //   'type': 'Feature',
    //   'properties': {},
    //   'geometry': {
    //     'type': 'LineString',
    //     'coordinates': [
    //       [
    //         13.386835455894468,
    //         52.51107253134428
    //       ],
    //       [
    //         13.389705419540405,
    //         52.51126515578991
    //       ]
    //     ]
    //   }
    // },
    // {
    //   'type': 'Feature',
    //   'properties': {},
    //   'geometry': {
    //     'type': 'LineString',
    //     'coordinates': [
    //       [
    //         13.391532003879547,
    //         52.50956415480001
    //       ],
    //       [
    //         13.3914515376091,
    //         52.51002287652146
    //       ],
    //       [
    //         13.391411304473877,
    //         52.51008001234361
    //       ],
    //       [
    //         13.391333520412445,
    //         52.510125720947855
    //       ],
    //       [
    //         13.391212821006775,
    //         52.51014041298913
    //       ],
    //       [
    //         13.391108214855194,
    //         52.51012735339714
    //       ],
    //       [
    //         13.391059935092926,
    //         52.510088174597854
    //       ],
    //       [
    //         13.391035795211792,
    //         52.5100261414276
    //       ],
    //       [
    //         13.39110016822815,
    //         52.509933091507996
    //       ],
    //       [
    //         13.391287922859192,
    //         52.50984167385129
    //       ],
    //       [
    //         13.391389846801758,
    //         52.509773110483955
    //       ],
    //       [
    //         13.39144617319107,
    //         52.50975352093079
    //       ],
    //       [
    //         13.391483724117277,
    //         52.509560889859564
    //       ]
    //     ]
    //   }
    // },
    // {
    //   'type': 'Feature',
    //   'properties': {},
    //   'geometry': {
    //     'type': 'Polygon',
    //     'coordinates': [
    //       [
    //         [
    //           13.388257026672363,
    //           52.50934540325395
    //         ],
    //         [
    //           13.38933527469635,
    //           52.509427027092514
    //         ],
    //         [
    //           13.389313817024231,
    //           52.50976005078283
    //         ],
    //         [
    //           13.389217257499695,
    //           52.5098351440114
    //         ],
    //         [
    //           13.389142155647276,
    //           52.50984167385129
    //         ],
    //         [
    //           13.389147520065308,
    //           52.509949416069546
    //         ],
    //         [
    //           13.389195799827576,
    //           52.50995268098114
    //         ],
    //         [
    //           13.389254808425903,
    //           52.50988085287029
    //         ],
    //         [
    //           13.389383554458616,
    //           52.509756785856936
    //         ],
    //         [
    //           13.389405012130737,
    //           52.509427027092514
    //         ],
    //         [
    //           13.390000462532042,
    //           52.50945967658549
    //         ],
    //         [
    //           13.389989733695984,
    //           52.50956415480001
    //         ],
    //         [
    //           13.389882445335386,
    //           52.50966210290056
    //         ],
    //         [
    //           13.38984489440918,
    //           52.510057158023685
    //         ],
    //         [
    //           13.389887809753418,
    //           52.5101093964518
    //         ],
    //         [
    //           13.38985025882721,
    //           52.51030202511892
    //         ],
    //         [
    //           13.387457728385924,
    //           52.51016816460925
    //         ],
    //         [
    //           13.388257026672363,
    //           52.50934540325395
    //         ]
    //       ]
    //     ]
    //   }
    // },
    // {
    //   'type': 'Feature',
    //   'properties': {},
    //   'geometry': {
    //     'type': 'Polygon',
    //     'coordinates': [
    //       [
    //         [
    //           13.389984369277954,
    //           52.510488123198826
    //         ],
    //         [
    //           13.391615152359009,
    //           52.510488123198826
    //         ],
    //         [
    //           13.391615152359009,
    //           52.511225978004965
    //         ],
    //         [
    //           13.389984369277954,
    //           52.511225978004965
    //         ],
    //         [
    //           13.389984369277954,
    //           52.510488123198826
    //         ]
    //       ]
    //     ]
    //   }
    // },
    // {
    //   "type": "Feature",
    //   "properties": {},
    //   "geometry": {
    //     "type": "Point",
    //     "coordinates": [
    //       13.390557020902632,
    //       52.50986983377473
    //     ]
    //   }
    // }
  ]
}

export const routes = {
  users: `${baseURL}/users/`,
  usersVerify: `${baseURL}/users/verify/`,
  segments: `${baseURL}/segments/`
}

export const headers = () => new Headers({ 
  'Content-Type': 'application/json',
  'Authorization': `bearer ${getUserDataFromCookie()?.token}`
})

/**
 * TODO: How does the bounding box look like
 * @param boundingBox
 */
export async function retrieveGeoJsonForBoundingBox(boundingBox) {
  return EXAMPLE_GEOJSON
}

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

