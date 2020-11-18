/**
 * Map taken and changed from here: https://github.com/alex3165/react-leaflet-draw/blob/HEAD/example/edit-control.js
 *
 * TODO: localize language: https://stackoverflow.com/a/53401594
 */

import React, { useRef, useState } from 'react'
import { FeatureGroup, Map, TileLayer } from 'react-leaflet'
import L from 'leaflet'
import { EditControl } from 'react-leaflet-draw'

// work around broken icons when using webpack, see https://github.com/PaulLeCam/react-leaflet/issues/255

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-icon.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-shadow.png',
})

const MAP_HEIGHT = 'calc(100vh - 64px)'  // fullscreen - app bar height
const DEFAULT_MAP_CENTER = [52.501389, 13.402500] // geographical center of Berlin

export default function PTMap ({onChange, geojson}) {

  const editableFGRef = useRef(null)
  const [mapCenter, _unused] = useState(calcCenterFromPolyline(geojson) || DEFAULT_MAP_CENTER)

  // see http://leaflet.github.io/Leaflet.draw/docs/leaflet-draw-latest.html#l-draw-event for leaflet-draw events doc

  function _onEdited (e) {
    _onChange()
  }

  function _onCreated (e) {
    _onChange()
  }

  function _onDeleted (e) {
    _onChange()
  }

  function _onMounted (drawControl) {
  }

  function _onDrawStart (e) {
    // allow only one polyline and clear the previous one - if exist
    editableFGRef.current.leafletElement.clearLayers()
    _onChange()
  }

  // function _onEditStart (e) {
  //   console.log('_onEditStart', e)
  // }
  //
  // function _onEditStop (e) {
  //   console.log('_onEditStop', e)
  // }
  //
  // function _onDeleteStart (e) {
  //   console.log('_onDeleteStart', e)
  // }
  //
  // function _onDeleteStop (e) {
  //   console.log('_onDeleteStop', e)
  // }

  function _onFeatureGroupReady (reactFGref) {

    if (!reactFGref) {
      // happens on leaving PTMap
      return
    }

    // populate the leaflet FeatureGroup with the geoJson layers
    let leafletGeoJSON = new L.GeoJSON(geojson || getDefaultGeoJson())
    let leafletFG = reactFGref.leafletElement

    leafletGeoJSON.eachLayer((layer) => {
      leafletFG.addLayer(layer)
    })

    // store the ref for future access to content
    editableFGRef.current = reactFGref
  }

  function _onChange () {

    // editableFGRef.current contains the edited geometry, which can be manipulated through the leaflet API

    if (!editableFGRef.current || !onChange) {
      return
    }

    const geojsonData = editableFGRef.current.leafletElement.toGeoJSON()
    onChange(geojsonData)
  }

  return (
    <Map center={mapCenter} zoom={11} maxZoom={19} zoomControl={true} style={{height: MAP_HEIGHT}} >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
      />
      <FeatureGroup ref={(reactFGref) => {_onFeatureGroupReady(reactFGref)}}>
        <EditControl
          position='topright'
          onEdited={_onEdited}
          onCreated={_onCreated}
          onDeleted={_onDeleted}
          onMounted={_onMounted}
          onDrawStart={_onDrawStart}
          // onEditStart={_onEditStart}
          // onEditStop={_onEditStop}
          // onDeleteStart={_onDeleteStart}
          // onDeleteStop={_onDeleteStop}
          draw={{
            polyline: true,   // let's draw only polylines for now
            rectangle: false,
            polygon: false,
            circle: false,
            marker: false,
            circlemarker: false
          }}
          edit={{
            remove: false    // you cannot delete a polyline once created
          }}
        />
      </FeatureGroup>
    </Map>
  )

}

function getDefaultGeoJson () {
  return {
    'type': 'FeatureCollection',
    'features': []
  }
}

// TODO
function calcCenterFromPolyline (geojson) {
  if (!geojson || geojson.features.length === 0) {
    return null
  }
  return DEFAULT_MAP_CENTER
}