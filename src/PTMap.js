import React, { useState, useEffect, useRef } from 'react'
import { Circle, Map, Marker, Polyline, Popup, TileLayer } from 'react-leaflet'

import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import { calcDistanceOfPolyline } from './helpers/geocalc'

const COLORS = [
  'red',
  'blue',
  'green',
  'yellow',
  'brown'
]

const overlayStyle = {
  position: 'fixed',
  zIndex: 1000,
}

const infoBoxStyle = {
  position: 'fixed',
  top: 100,
  right: 50,
  background: 'white',
  border: '1px solid black',
  padding: 10,
  borderRadius: 5
}

const buttonBoxStyle = {
  position: 'fixed',
  bottom: 100,
  left: '50%',
  transform: 'translate(-50%)',
  background: 'white',
  border: '1px solid black',
  padding: 10,
  borderRadius: 5
}

function PTMap () {

  const [devicePosition, setDevicePosition] = useState([52.530644, 13.383068])  // U Naturkundemuseum
  const [markerPosition, setMarkerPosition] = useState(devicePosition)  // U Naturkundemuseum
  const [accuracy, setAccuracy] = useState(0)  // 95% sure the position is in this radio in meters
  const [shouldAutosetMarker, setShouldAutosetMarker] = useState(true)
  const [isRunning, setIsRunning] = useState(false)

  const [recordings, setRecordings] = useState([])
  const [currentRecord, setCurrentRecord] = useState([])

  const markerRef = useRef(null)

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      if (position) {
        setDevicePosition([position.coords.latitude, position.coords.longitude])
        setAccuracy(position.coords.accuracy)
      }
    }, (error) => {
      window.alert('Fehler: ' + error.message)
    })

    const watchId = navigator.geolocation.watchPosition(position => {
      if (position) {
        const positionToSet = [position.coords.latitude, position.coords.longitude]
        setDevicePosition(positionToSet)
        setAccuracy(position.coords.accuracy)
      }
    })

    // clean up on component unmount
    return () => {
      navigator.geolocation.clearWatch(watchId)
    }
  }, [])

  useEffect(() => {
    if (shouldAutosetMarker) {
      setMarkerPosition(devicePosition)
    }
  }, [devicePosition])

  useEffect(() => {
    if (!isRunning && currentRecord.length > 0) {
      setRecordings([...recordings, currentRecord])
      setCurrentRecord([])
    }
  }, [isRunning])

  function onStart () {
    setIsRunning(true)
    setCurrentRecord([markerPosition])
  }

  function onIntermediatePoint () {
    setCurrentRecord([...currentRecord, markerPosition])
  }

  function onEnd () {
    if (currentRecord[currentRecord.length - 1] !== markerPosition) {
      setCurrentRecord([...currentRecord, markerPosition])
    }
    setIsRunning(false)
  }

  function updateMarkerPosition () {
    const marker = markerRef.current
    if (marker != null) {
      setShouldAutosetMarker(false)

      const latLng = marker.leafletElement.getLatLng()
      setMarkerPosition([latLng.lat, latLng.lng])

      setTimeout(() => {
        setShouldAutosetMarker(true)
      }, 10000)
    }
  }

  function getRecordings () {
    return [...recordings, currentRecord].filter(record => record.length >= 2)
  }

  function renderRecordings () {
    let counter = 0
    return getRecordings().map(record => {
      return (
        <Polyline key={`polyline_${counter}`} positions={record} color={COLORS[counter++ % COLORS.length]}
                  attribution={'Hui'}/>
      )
    })
  }

  function renderPolylineLengths () {
    let counter = 0
    return getRecordings().map(record => {
      return (
        <div key={`length_${counter}`} style={{color: COLORS[counter++ % COLORS.length]}}>
          {calcDistanceOfPolyline(record).toFixed(2)} m
        </div>
      )
    })
  }

  return (
    <div>
      <div style={overlayStyle}>
        <div style={infoBoxStyle}>
          Position: {devicePosition[0].toFixed(6)}, {devicePosition[1]}<br/>
          Genauigkeit: Radius {accuracy.toFixed(2)} m<br />
          Streckenlängen:<br/>
          {renderPolylineLengths()}
        </div>
        <div style={buttonBoxStyle}>
          <div>
            <ButtonGroup color="primary" aria-label="outlined primary button group">
              <Button disabled={isRunning} onClick={onStart}>Startpunkt</Button>
              <Button disabled={!isRunning} onClick={onIntermediatePoint}>Zwischenpunkt</Button>
              <Button disabled={!isRunning} onClick={onEnd}>Endpunkt</Button>
            </ButtonGroup>
          </div>
        </div>
      </div>
      <Map center={devicePosition} zoom={19} maxZoom={19}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        />
        <Marker
          position={markerPosition}
          draggable
          onDragEnd={updateMarkerPosition}
          ref={markerRef}
        >
          <Popup>A pretty CSS3 popup.<br/>Easily customizable.</Popup>
        </Marker>
        <Circle center={devicePosition} radius={accuracy} attribution={'foobar'}/>
        {renderRecordings()}
      </Map>
    </div>
  )
}

export default PTMap