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
const MIN_ZOOM_FOR_EDITING = 16
const DEFAULT_MAP_CENTER = [52.501389, 13.402500] // geographical center of Berlin

const SELECTED_FEATURE_COLOR = "red"
const UNSELECTED_FEATURE_COLOR = "#3388ff"  // default blue

const DEFAULT_GEOJSON_FOR_NEW_SHAPES = {
  'type': 'FeatureCollection',
  'features': []
}

export default function PTMap ({geoJson, onSelectFeatureById, selectedFeatureId, onFeaturesEdited, onFeatureCreated, onBoundsChanged}) {

  const [showEditControl, setShowEditControl] = useState(false)
  const editableFGRef = useRef(null)

  useEffect(() => {
    setFeaturesFromGeojson()
  }, [geoJson])


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
    onBoundsChanged(drawControl._map.getBounds())
  }

  function _onMoveEnd (e) {
    setShowEditControl(e.sourceTarget._zoom >= MIN_ZOOM_FOR_EDITING)
    setFeaturesFromGeojson()
    onBoundsChanged(e.sourceTarget.getBounds())
  }

  function _onDrawStart (e, f) {
    console.log('on draw start', e)
    console.log('on draw start2', f)
    _onChange()
  }

  function _onDrawStop (e) {
    // user finished drawing
    console.log('on draw stop', e)

    const geojsonData = editableFGRef.current.leafletElement.toGeoJSON()
    const newFeature = geojsonData.features[geojsonData.features.length -1]
    console.log('newFeature', newFeature)
    onFeatureCreated(newFeature)

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
      onFeaturesEdited(geojsonData)
    }
  }

  /**
   * TODO: In order to make editing lines work again, this function must not be doing anything
   *       after editing / drawing started.
   *       Also, getDrawOptions and getEditOptions must be stable during editing / drawing for not losing the tools
   *       on zoom change.
   */
  function setFeaturesFromGeojson () {
    if  (editableFGRef.current == null) {
      // not yet ready
      return
    }

    console.log('setting features from geojson', geoJson)
    const leafletGeojson = new L.GeoJSON(geoJson)


    // populate the leaflet FeatureGroup with the initialGeoJson layers
    const leafletFG = editableFGRef.current.leafletElement
    leafletFG.clearLayers()
    leafletGeojson.eachLayer(layer => {
      console.log('layer id', layer.feature.id, ' vs ', selectedFeatureId)
      layer.setStyle({color: layer.feature.id === selectedFeatureId ? SELECTED_FEATURE_COLOR : UNSELECTED_FEATURE_COLOR})
      const isInBounds = leafletFG._map.getBounds().isValid() && leafletFG._map.getBounds().intersects(layer.getBounds());
      // if (!isInBounds && leafletFG.hasLayer(layer._leaflet_id)) {
      //   layer.off("click")
      //   leafletFG.removeLayer(layer)
      //   // console.log('removing layer', layer)
      // }
      // else if (isInBounds && !leafletFG.hasLayer(layer._leaflet_id)) {
      if (isInBounds) {
        leafletFG.addLayer(layer)
        layer.off("click")
        layer.on("click", function (event) {
          onSelectFeatureById(layer.feature.id)
        });
        // console.log('adding layer', layer)
      }
    })
  }

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
      remove: false
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
      onZoomEnd={_onMoveEnd}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
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
