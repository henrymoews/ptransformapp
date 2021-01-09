import React, { useState, useRef } from 'react'
import PTMap from '../map/PTMap'
import { emptyBoundsArray } from './TypeSupport'
import { makeStyles } from '@material-ui/core/styles'
import { getSegment, getSegments, postSegment, updateSegment } from '../../helpers/api'
import { bboxContainsBBox, bboxIntersectsBBox } from '../../helpers/geocalc'
import SegmentForm from '../components/SegmentForm'

const useStyles = makeStyles({
  buttonGroup: {
    marginTop: 10,
    textAlign: 'center'
  },
  bottomButton: {
    marginLeft: 5,
    marginRight: 5
  },
  header: {
    margin: '20px auto',
    textAlign: 'center',
    fontEeight: 'bold',
    fontSize: 20
  },
  subheader: {
    margin: '20px auto',
    textAlign: 'center',
    fontEeight: 'bold',
    fontSize: 16
  },
  container: {
    height: '100%',
    width: '100%',
    display: 'flex'
  },
  verticalSpace: {
    height: 30
  },
  mapArea: {
    width: '70%'
  },
  formArea: {
    width: '30%',
    minWidth: 300
  }
})

function Recording () {
  const classes = useStyles()

  const [segmentsById, setSegmentsById] = useState({})
  const [selectedSegmentId, setSelectedSegmentId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadedBoundingBoxesRef = useRef(emptyBoundsArray())

  async function onSegmentCreated (segment) {
    const createdSegment = await postSegment({...segment, properties: {subsegments: []}})
    addSegment(createdSegment)
    setSelectedSegmentId(createdSegment.id)
  }

  async function onBoundsChange (bounds) {
    const boundingBox = {
      swLng: bounds._southWest.lng,
      swLat: bounds._southWest.lat,
      neLng: bounds._northEast.lng,
      neLat: bounds._northEast.lat,
    }

    if (checkIfBoundingBoxWasRequestedBefore(boundingBox)) {
      console.log('was requested before')
      return
    }

    const topRight = `${boundingBox.neLng},${boundingBox.neLat}`
    const bottomRight = `${boundingBox.swLng},${boundingBox.neLat}`
    const bottomLeft = `${boundingBox.swLng},${boundingBox.swLat}`
    const topLeft = `${boundingBox.neLng},${boundingBox.swLat}`

    const knownSegmentIdsInBounds = getLoadedSegmentIdsInBounds(boundingBox)
    const boundingBoxString = `${topRight},${bottomRight},${bottomLeft},${topLeft},${topRight}`
    loadedBoundingBoxesRef.current.push(boundingBox)
    try {
      setIsLoading(true)
      const geoJson = await getSegments(boundingBoxString, knownSegmentIdsInBounds)
      addSegments(geoJson.features)
      setIsLoading(false)
    } catch (e) {
      loadedBoundingBoxesRef.current = loadedBoundingBoxesRef.current.filter(bbox => bbox !== boundingBox)
    }
  }

  function onSegmentEdited (changedGeojson) {
    // TODO: merge existing geoJson with new geoJson
    setSelectedSegmentId(null)
  }

  async function onSegmentSelect (id) {
    console.log('selected segment id', id)

    setSelectedSegmentId(id)

    const segment = segmentsById[id]
    if (segment && (!segment.properties || segment.properties.length === 0)) {
      setIsLoading(true)
      const segmentWithDetails = await getSegment(id)
      addSegment(segmentWithDetails)
      setSelectedSegmentId(segmentWithDetails.id)
      setIsLoading(false)
    }
  }

  function checkIfBoundingBoxWasRequestedBefore (boundingBox) {
    return loadedBoundingBoxesRef.current.some(bbox => bboxContainsBBox(bbox, boundingBox))
  }

  function getLoadedSegmentIdsInBounds (boundingBox) {
    return Object.values(segmentsById).filter(segment => {
      if (segment.bbox) {
        const swLng = segment.bbox[0]
        const swLat = segment.bbox[1]
        const neLng = segment.bbox[2]
        const neLat = segment.bbox[3]
        return bboxIntersectsBBox(boundingBox, {swLng, swLat, neLng, neLat})
      }
      return false
    }).map(segment => segment.id)
  }

  function addSegment (newOrUpdatedSegment) {
    addSegments([newOrUpdatedSegment])
  }

  function addSegments (newOrUpdatedSegments) {
    const newSegmentsById = Object.assign({}, segmentsById)
    for (const segment of newOrUpdatedSegments) {
      newSegmentsById[segment.id] = segment
    }

    console.log('from', newOrUpdatedSegments, 'to', newSegmentsById)

    setSegmentsById(newSegmentsById)
  }

  async function onSegmentChanged (segment) {
    await updateSegment(segment)
  }

  function renderMapView () {
    return (
      <div>
        <PTMap
          key='map'
          selectedSegmentId={selectedSegmentId}
          onSegmentSelect={onSegmentSelect}
          onSegmentEdited={onSegmentEdited}
          onSegmentCreated={onSegmentCreated}
          onBoundsChanged={onBoundsChange}
          segments={Object.values(segmentsById)}
        />
      </div>
    )
  }

  function renderFormView () {
    if (isLoading) {
      return (
        <div>Loading...</div>
      )
    }
    if (!selectedSegmentId) {
      return (
        <div>
          <div className={classes.verticalSpace}/>
          <div className={classes.header}>Willkommen bei ParkplatzTransport</div>
          <div className={classes.subheader}>Wähle einen vorhandenen Abschnitt oder erstelle einen Neuen</div>
          <div className={classes.subheader}>Zoome in die Karte um die Bearbeitungswerkzeuge zu sehen</div>
        </div>

      )
    }
    return <SegmentForm segment={segmentsById[selectedSegmentId]} onChanged={onSegmentChanged}/>
  }

  return (
    <div className={classes.container}>
      <div className={classes.mapArea}>
        {renderMapView()}
      </div>

      <div className={classes.formArea}>
        {renderFormView()}
      </div>

    </div>
  )
}

export default Recording
