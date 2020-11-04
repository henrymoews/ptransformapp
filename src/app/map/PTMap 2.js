import React, { useState, useEffect, useRef } from 'react'
import { Map, Marker, Polyline, TileLayer } from 'react-leaflet'
import { Circle, FeatureGroup } from 'leaflet'
import {EditControl} from 'react-leaflet-draw'

const purpleOptions = {color: 'purple'}

function PTMap ({onRouteChanged, route}) {

  const [devicePosition, setDevicePosition] = useState(route.length > 0 ? route[0] : [52.530644, 13.383068])  // U
                                                                                                              // Naturkundemuseum
  const [markerPosition, setMarkerPosition] = useState(devicePosition)
  const markerRef = useRef(null)

  useEffect(() => {
    if (true /*initialMarkerPosition === null*/) {
      navigator.geolocation.getCurrentPosition(position => {
        if (position) {
          const newDevicePosition = [position.coords.latitude, position.coords.longitude]
          setDevicePosition(newDevicePosition)
          setMarkerPosition(newDevicePosition)
        }
      }, (error) => {
        window.alert('Deine Position wurde nicht automatisch erkannt.')
        setMarkerPosition(devicePosition)
      })
    }
  }, [])

  // useEffect(() => {
  //   onMarkerChanged(markerPosition)
  // }, [markerPosition])

  function updateMarkerPosition () {
    const marker = markerRef.current
    if (marker != null) {
      const latLng = marker.leafletElement.getLatLng()
      setMarkerPosition([latLng.lat, latLng.lng])
    }
  }

  const marker = markerPosition == null
    ? null
    : <Marker
      position={markerPosition}
      draggable
      onDragEnd={updateMarkerPosition}
      ref={markerRef}
    />

  const editComponent = (
    <FeatureGroup>
      <EditControl
        position='topright'
        onEdited={() => console.log('on edited')}
        onCreated={() => console.log('on created')}
        onDeleted={() => console.log('on deleted')}
        draw={{
          rectangle: false
        }}
      />
      <Circle center={[51.51, -0.06]} radius={200}/>
    </FeatureGroup>
  )

  return (
    <div>
      <Map center={devicePosition} zoom={18} maxZoom={19}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        />
        <Polyline pathOptions={purpleOptions} positions={route}/>
        {marker}
        {editComponent}
      </Map>
    </div>
  )
}

export default PTMap