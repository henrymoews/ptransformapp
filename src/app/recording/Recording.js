import React, { useState } from 'react'
import PTMap from '../map/PTMap'
import Paper from '@material-ui/core/Paper'
import MapOverlay from '../map/MapOverlay'
import Button from '@material-ui/core/Button'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import { emptySegments, nullNumber, nullPosition } from './TypeSupport'
import SegmentUI from './SegmentUI'
import Segment, { SegmentType } from './Segment'
import StartEndPointUI from './StartEndPointUI'

const STEPS = Object.freeze({
  CHOOSE_START_POINT: Symbol('CHOOSE_START_POINT'),
  ADD_SEGMENTS: Symbol('ADD_SEGMENTS'),
  CHOOSE_END_POINT: Symbol('CHOOSE_END_POINT'),
  FINISHED: Symbol('FINISHED')
})

function Recording () {

  const [startPosition, setStartPosition] = useState(nullPosition())
  const [endPosition, setEndPosition] = useState(nullPosition())
  const [segments, setSegments] = useState(emptySegments())
  const [segmentIndexInEditMode, setSegmentIndexInEditMode] = useState(-1)
  const [step, setStep] = useState(STEPS.CHOOSE_START_POINT)

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
    console.log('segments', segments, 'segments copy', segmentsCopy)
    setSegments(segmentsCopy)
  }

  function addSegment (segment) {
    setSegments([...segments, segment])
  }

  function renderChooseStartPoint () {
    return (
      <div>
        <PTMap onMarkerChanged={setStartPosition}/>
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

  function renderRecording () {
    const cards =
    [
      <StartEndPointUI key={'start'} isStart position={startPosition} onEdit={() => setStep(STEPS.CHOOSE_START_POINT)}/>,
      segments.map((segment, index) =>
        <SegmentUI
          key={`segment_${index}`}
          segment={segment}
          forNewSegment
          editMode={segmentIndexInEditMode === index}
          onEdit={() => setSegmentIndexInEditMode(index)}
          onUpdated={segment => {
            console.log('segment', segment)
            updateSegment(index, segment)
            setSegmentIndexInEditMode(-1)
          }}
        />
      )
    ]

    if (segmentIndexInEditMode < 0) {
      cards.push(
        <SegmentUI
          key={'new_segment'}
          editMode
          onUpdated={addSegment}
        />
      )
    }

    if (step === STEPS.FINISHED) {
      cards.push(<StartEndPointUI key={'end'} position={endPosition}/>)
    }
    return (
      <div>
        {cards}
      </div>
    )
  }

  function renderStep () {
    switch (step) {
      case STEPS.CHOOSE_START_POINT:
        return renderChooseStartPoint()

      case STEPS.ADD_SEGMENTS:
        return renderRecording()

      default:
        return 'Not yet implemented'
    }
  }

  return renderStep()
}

export default Recording
