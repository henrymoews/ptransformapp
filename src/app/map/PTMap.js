/**
 * Map taken and changed from here: https://github.com/alex3165/react-leaflet-draw/blob/HEAD/example/edit-control.js
 *
 * TODO: localize language: https://stackoverflow.com/a/53401594
 */

import React, { useEffect, useRef, useState } from 'react'
import { FeatureGroup, Map, Marker, Polyline, Polygon, TileLayer } from 'react-leaflet'
import L from 'leaflet'
import { EditControl } from 'react-leaflet-draw'
import { makeStyles } from '@material-ui/core/styles'

// work around broken icons when using webpack, see https://github.com/PaulLeCam/react-leaflet/issues/255

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-icon.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-shadow.png',
})

const MAP_HEIGHT = 'calc(100vh - 64px)'  // fullscreen - app bar height
const MIN_ZOOM_FOR_EDITING = 17
const DEFAULT_MAP_CENTER = [52.501389, 13.402500] // geographical center of Berlin

const DEFAULT_GEOJSON_FOR_NEW_SHAPES = {
  'type': 'FeatureCollection',
  'features': []
}

export default function PTMap ({selectedFeature, geojson, features, onSelectFeature, onCreateFeature}) {

  const [showEditControl, setShowEditControl] = useState(false)
  const [leafletGeojson, setLeafletGeoJson] =  useState(new L.GeoJSON(geojson))
  const editableFGRef = useRef(null)

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

  function _onMoveEnd (e) {
    setShowEditControl(e.sourceTarget._zoom >= MIN_ZOOM_FOR_EDITING)
    setFeaturesFromGeojson()
  }

  function _onDrawStart (e) {
    _onChange()
  }

  function _onDrawStop (e) {
    // user finished drawing
    console.log('on draw stop')
    _onChange(true)
  }

  function _onEditStop (e) {
    console.log('_onEditStop', e)
    _onChange(true)
  }

  function _onFeatureGroupReady (reactFGref) {

    if (!reactFGref) {
      // happens on leaving PTMap
      return
    }

    // store the ref for future access to content
    editableFGRef.current = reactFGref

    setFeaturesFromGeojson()
  }

  function _onChange (notify = false) {
    // editableFGRef.current contains the edited geometry, which can be manipulated through the leaflet API
    if (!editableFGRef.current) {
      return
    }

    if (notify) {
      const geojsonData = editableFGRef.current.leafletElement.toGeoJSON()
      console.log('geojson', geojsonData)
      onCreateFeature(geojsonData)
    }
  }

  function setFeaturesFromGeojson () {
    if  (editableFGRef.current == null) {
      // not yet ready
      return
    }

    // populate the leaflet FeatureGroup with the initialGeoJson layers
    const leafletGeoJSON = leafletGeojson
    const leafletFG = editableFGRef.current.leafletElement

    leafletGeoJSON.eachLayer(layer => {
      const isInBounds = leafletFG._map.getBounds().isValid() && leafletFG._map.getBounds().intersects(layer.getBounds());
      if (!isInBounds && leafletFG.hasLayer(layer._leaflet_id)) {
        leafletFG.removeLayer(layer)
        console.log('removing layer', layer)
      }
      else if (isInBounds && !leafletFG.hasLayer(layer._leaflet_id)) {
        leafletFG.addLayer(layer)
        console.log('adding layer', layer)
      }
    })
  }

  // function getFeatureShapes () {
  //   const shapes = features.map((feature, index) => {
  //     console.log('feature', feature)
  //     if (feature.type !== 'Feature') {
  //       console.log('other type')
  //       return null
  //     }
  //     switch (feature.geometry.type) {
  //       case 'LineString':
  //         return (
  //           <Polyline
  //             key={index}
  //             color={feature === selectedFeature ? 'red' : 'black'}
  //             onClick={() => onSelectFeature(feature)}
  //             positions={feature.geometry.coordinates.map(L.GeoJSON.coordsToLatLng)}
  //           />
  //         )
  //       case 'Polygon':
  //         return (
  //           <Polygon
  //             key={index}
  //             color={feature === selectedFeature ? 'red' : 'black'}
  //             onClick={() => onSelectFeature(feature)}
  //             positions={feature.geometry.coordinates.map(coords => coords.map(L.GeoJSON.coordsToLatLng))}
  //           />
  //         )
  //       case 'Point':
  //         console.log('marker pos ', feature.geometry.coordinates)
  //         return (
  //           <Marker
  //             key={index}
  //             color={feature === selectedFeature ? 'red' : 'black'}
  //             onClick={() => onSelectFeature(feature)}
  //             position={L.GeoJSON.coordsToLatLng(feature.geometry.coordinates)}
  //           />
  //         )
  //       default:
  //         console.log('skip not supported feature type')
  //         return null
  //     }
  //   }).filter(Boolean)
  //
  //   console.log('shapes', shapes)
  //   return shapes
  // }

  function getDrawOptions() {
    return {
      polyline: showEditControl,
      polygon: showEditControl,
      rectangle: false,
      circle: false,
        marker: false,
      circlemarker: false
    }
  }

  function getEditOptions() {
    return {
      edit: showEditControl,
      remove: showEditControl
    }
  }

  console.log('hidden? ' + !editableFGRef.current || editableFGRef.current.leafletElement._map._zoom <= 16)
  return (
    <Map
      center={DEFAULT_MAP_CENTER}
      zoom={11}
      maxZoom={19}
      zoomControl={true}
      style={{height: MAP_HEIGHT}}
      onMoveEnd={_onMoveEnd}
    >
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
          onDrawStop={_onDrawStop}
          // onEditStart={_onEditStart}
          onEditStop={_onEditStop}
          // onDeleteStart={() => console.log('on delete start')}
          // onDeleteStop={() => console.log('on delete stop')}
          draw={getDrawOptions()}
          edit={getEditOptions()}
        />
      </FeatureGroup>
    </Map>
  )

}
