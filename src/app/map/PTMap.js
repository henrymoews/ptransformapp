/**
 * Map taken and changed from here: https://github.com/alex3165/react-leaflet-draw/blob/HEAD/example/edit-control.js
 */

import React, { useRef } from 'react'
import { Map, TileLayer, FeatureGroup } from 'react-leaflet'
import L from 'leaflet'
import { EditControl } from 'react-leaflet-draw'

// work around broken icons when using webpack, see https://github.com/PaulLeCam/react-leaflet/issues/255
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-icon.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-shadow.png',
})

let polyline

export default function EditControlExample ({onChange, onRouteChanged}) {

  const _editableFGRef = useRef(null)

  // see http://leaflet.github.io/Leaflet.draw/docs/leaflet-draw-latest.html#l-draw-event for leaflet-draw events doc

  function _onEdited (e) {

    let numEdited = 0
    e.layers.eachLayer((layer) => {
      numEdited += 1
    })
    console.log(`_onEdited: edited ${numEdited} layers`, e)

    _onChange()
  }

  function _onCreated (e) {
    let type = e.layerType
    let layer = e.layer
    if (type === 'marker') {
      // Do marker specific actions
      console.log('_onCreated: marker created', e)
    } else {
      console.log('_onCreated: something else created:', type, e)
      onRouteChanged(layer.editing.latlngs)
    }
    // Do whatever else you need to. (save to db; etc)

    _onChange()
  }

  function _onDeleted (e) {

    let numDeleted = 0
    e.layers.eachLayer((layer) => {
      numDeleted += 1
    })
    console.log(`onDeleted: removed ${numDeleted} layers`, e)

    _onChange()
  }

  function _onMounted (drawControl) {
    console.log('_onMounted', drawControl)
  }

  function _onEditStart (e) {
    console.log('_onEditStart', e)
  }

  function _onEditStop (e) {
    console.log('_onEditStop', e)
  }

  function _onDeleteStart (e) {
    console.log('_onDeleteStart', e)
  }

  function _onDeleteStop (e) {
    console.log('_onDeleteStop', e)
  }

  function _onFeatureGroupReady (reactFGref) {
    if (!reactFGref) {
      return
    }

    // populate the leaflet FeatureGroup with the geoJson layers

    let leafletGeoJSON = new L.GeoJSON(getGeoJson())
    let leafletFG = reactFGref.leafletElement

    leafletGeoJSON.eachLayer((layer) => {
      leafletFG.addLayer(layer)
    })

    // store the ref for future access to content
    _editableFGRef.current = reactFGref
  }

  function _onChange () {

    // _editableFG contains the edited geometry, which can be manipulated through the leaflet API
    if (!_editableFGRef.current || !onChange) {
      return
    }

    const geojsonData = _editableFGRef.current.leafletElement.toGeoJSON()
    onChange(geojsonData)
  }

  return (
    <Map center={[52.530644, 13.383068]} zoom={18} zoomControl={true}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FeatureGroup ref={(reactFGref) => {_onFeatureGroupReady(reactFGref)}}>
        <EditControl
          position='topright'
          onEdited={_onEdited}
          onCreated={_onCreated}
          onDeleted={_onDeleted}
          onMounted={_onMounted}
          onEditStart={_onEditStart}
          onEditStop={_onEditStop}
          onDeleteStart={_onDeleteStart}
          onDeleteStop={_onDeleteStop}
          draw={{
            rectangle: false,
            polygon: false,
            circle: false,
            marker: false,
            circlemarker: false
          }}
          edit={{
            remove: false
          }}
        />
      </FeatureGroup>
    </Map>
  )
}

function getGeoJson () {
  return {
    'type': 'FeatureCollection',
    'features': [
      {
        'type': 'Feature',
        'properties': {},
        'geometry': {
          'type': 'LineString',
          'coordinates': [
            //   [
            //     -122.47979164123535,
            //     37.830124319877235
            //   ],
            //   [
            //     -122.47721672058105,
            //     37.809377088502615
            //   ]
          ]
        }
      },
    ]
  }
}