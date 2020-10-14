import React, { useState, useEffect, useRef } from 'react'
import { Map, Marker, TileLayer } from 'react-leaflet'

function PTMap ({onMarkerChanged}) {

  const [devicePosition, setDevicePosition] = useState([52.530644, 13.383068])  // U Naturkundemuseum
  const [markerPosition, setMarkerPosition] = useState(null)  // U Naturkundemuseum
  const markerRef = useRef(null)

  useEffect(() => {
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
  }, [])

  useEffect(() => {
    onMarkerChanged(markerPosition)
  }, [markerPosition])

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

  return (
    <div>
      <Map center={devicePosition} zoom={19} maxZoom={19}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        />
        {marker}
      </Map>
    </div>
  )
}

export default PTMap