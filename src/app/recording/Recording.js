import React, { useEffect, useReducer, useState } from 'react'
import PTMap from '../map/PTMap'
import Paper from '@material-ui/core/Paper'
import MapOverlay from '../map/MapOverlay'
import Button from '@material-ui/core/Button'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import IconButton from '@material-ui/core/IconButton'
import { emptySegments, nullNumber, nullPosition } from './TypeSupport'
import SegmentUI from './SegmentUI'
import Segment, { SegmentType } from './Segment'
import StartEndPointUI from './StartEndPointUI'
import { httpRequest } from '../utils/http'
import { makeStyles } from '@material-ui/core/styles'
import orange from '@material-ui/core/colors/orange'
import blue from '@material-ui/core/colors/blue'
import green from '@material-ui/core/colors/green'
import red from '@material-ui/core/colors/red'

const STEPS = Object.freeze({
  CHOOSE_START_POINT: Symbol('CHOOSE_START_POINT'),
  ADD_SEGMENTS: Symbol('ADD_SEGMENTS'),
  CHOOSE_END_POINT: Symbol('CHOOSE_END_POINT'),
  FINISHED: Symbol('FINISHED')
})

const useStyles = makeStyles({
  bottomButtons: {
    marginTop: 10,
    textAlign: 'center'
  },
  bottomButton: {
    marginLeft: 5,
    marginRight: 5
  }
})

function Recording () {
  const classes = useStyles()

  const [startPosition, setStartPosition] = useState(nullPosition())
  const [endPosition, setEndPosition] = useState(nullPosition())
  const [segments, setSegments] = useState(emptySegments())
  const [segmentIndexInEditMode, setSegmentIndexInEditMode] = useState(-1)
  const [step, setStep] = useState(STEPS.CHOOSE_START_POINT)
  const [startAddress, setStartAddress] = useState({position: null, name: null})
  const [endAddress, setEndAddress] = useState({position: null, name: null})
  const forceUpdate = useReducer((updateValue) => updateValue + 1, () => 0)[1]

  useEffect(() => {
    // noinspection JSIgnoredPromiseFromCall
    lookupAddressesIfChanged()
  }, [step])

  async function lookupAddressesIfChanged () {
    if (startAddress.position !== startPosition) {
      const name = await lookupAddress(startPosition)
      setStartAddress({position: startPosition, name: name})
    }
    if (endAddress.position !== endPosition) {
      const name = await lookupAddress(endPosition)
      setEndAddress({position: endPosition, name: name})
    }
  }

  async function lookupAddress (latLon) {
    const response = await httpRequest({
      url: 'https://nominatim.openstreetmap.org/reverse',
      expectsJsonResponse: true,
      params: {
        lat: latLon[0],
        lon: latLon[1],
        format: 'json'
      }
    })
    if (!response.address) {
      return null
    }

    const address = response.address

    let displayName = ''
    if (address.road) {
      displayName += address.road
      if (address.house_number) {
        displayName += ' ' + address.house_number + ', '
      }
    }
    displayName += address.suburb || address.town || address.country
    return displayName
  }

  function goToRecordingStep () {

    if (!startPosition) {
      console.error('No marker position set. This shouldn\'t have happened.')
      return
    }
    setStep(STEPS.ADD_SEGMENTS)
  }

  function updateSegment (index, segment) {
    setSegments([segment])
    const segmentsCopy = [...segments]
    segmentsCopy[index] = segment
    setSegments(segmentsCopy)
  }

  function removeSegment (segment) {
    setSegments(segments.filter(s => s !== segment))
  }

  function addSegment (index = segments.length) {
    console.log('newIndex', index, segments)
    segments.splice(index, 0, new Segment())
    setSegmentIndexInEditMode(index)
    forceUpdate()
  }

  function renderChooseStartPoint () {
    return (
      <div>
        <PTMap onMarkerChanged={setStartPosition} initialMarkerPosition={startPosition}/>
        <MapOverlay centered bottom={30}>
          <Paper zDepth={2}>
            <div className={'mediumPadding alignCenter'}>
              <div className={'minorHeader'}>Wo geht's los?</div>
              <div className={'text'}>Bitte setze den Marker an die Startposition.</div>
              <div className={'minorMargin'}/>
              <Button
                variant="contained"
                color="primary"
                className={'button'}
                endIcon={<ArrowForwardIcon/>}
                onClick={goToRecordingStep}
                disabled={!startPosition}
              >
                Weiter
              </Button>
            </div>
          </Paper>
        </MapOverlay>
      </div>
    )
  }

  function renderChooseEndPoint () {
    return (
      <div>
        <PTMap onMarkerChanged={setEndPosition} initialMarkerPosition={endPosition}/>
        <MapOverlay centered bottom={30}>
          <Paper zDepth={2}>
            <div className={'mediumPadding alignCenter'}>
              <div className={'minorHeader'}>Wo endet der Abschnitt?</div>
              <div className={'text'}>Bitte setze den Marker an die Endposition.</div>
              <div className={'minorMargin'}/>
              <Button
                variant="contained"
                color="primary"
                className={'button'}
                endIcon={<ArrowForwardIcon/>}
                onClick={goToRecordingStep}
                disabled={!endPosition}
              >
                Fertig
              </Button>
            </div>
          </Paper>
        </MapOverlay>
      </div>
    )
  }

  function renderRecording () {
    console.log('segments', segments)
    const cards =
      [
        <StartEndPointUI
          key={'start'}
          isStart
          position={startPosition}
          addressName={startAddress.name}
          onEdit={() => setStep(STEPS.CHOOSE_START_POINT)}
        />,
        segments.map((segment, index) =>
          [
            <div style={{textAlign: 'center'}}>
              <IconButton key={`segment_${index}_add`} component="span"
                          onClick={() => addSegment(index)}>
                <AddCircleIcon/>
              </IconButton>
            </div>,
            <SegmentUI
              key={`segment_${index}${segmentIndexInEditMode === index ? '_edit' : ''}`}
              outerSegment={segment}
              editMode={segmentIndexInEditMode === index}
              onEdit={() => setSegmentIndexInEditMode(index)}
              onDelete={() => {
                removeSegment(segment)
                setSegmentIndexInEditMode(-1)
              }}
              onUpdated={updatedSegment => {
                updateSegment(index, updatedSegment)
              }}
              onDone={() => {
                setSegmentIndexInEditMode(-1)
              }}
            />
          ]
        ),
        endPosition ?
          [
            <div style={{textAlign: 'center'}}>
              <IconButton key={`segment_add_before_end`} component="span"
                          onClick={() => addSegment()}>
                <AddCircleIcon/>
              </IconButton>
            </div>,
            <StartEndPointUI
              key={'end'}
              isStart={false}
              position={endPosition}
              addressName={endAddress.name}
              onEdit={() => setStep(STEPS.CHOOSE_END_POINT)}
            />
          ]
          : null
      ]

    if (step === STEPS.FINISHED) {
      cards.push(<StartEndPointUI key={'end'} position={endPosition}/>)
    }
    const buttons = []
    if (!endPosition) {
      buttons.push(
        <Button className={classes.bottomButton} key="addSegment" variant={'contained'} onClick={() => addSegment()}
                size={'small'} color={'primary'}>
          Abschnitt hinzufügen
        </Button>
      )
      buttons.push(
        <Button className={classes.bottomButton} key="endpoint" variant={'contained'}
                color={'secondary'}
                size={'small'}
                onClick={() => {
                  setStep(STEPS.CHOOSE_END_POINT)
                  setSegmentIndexInEditMode(-1)
                }}
        >
          Endpunkt
        </Button>
      )
    }
    else {
      buttons.push(
        <Button className={classes.bottomButton} key="save" variant={'contained'}
                color={'secondary'}
                disabled
                onClick={() => {
                  // sendToServer()
                }}
        >
          Abschicken (noch nicht implementiert)
        </Button>
      )
    }
    return (
      <div style={{marginTop: 20}}>
        {cards}
        <div className={classes.bottomButtons}>
          {buttons}
        </div>
      </div>
    )
  }

  function renderStep () {
    switch (step) {
      case STEPS.CHOOSE_START_POINT:
        return renderChooseStartPoint()

      case STEPS.ADD_SEGMENTS:
        return renderRecording()

      case STEPS.CHOOSE_END_POINT:
        return renderChooseEndPoint()

      default:
        return 'Not yet implemented'
    }
  }

  return renderStep()
}

export default Recording
