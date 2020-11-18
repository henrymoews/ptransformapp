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
import Tooltip from '@material-ui/core/Tooltip'
import { renderToStaticMarkup } from 'react-dom/server'

const STEPS = Object.freeze({
  CHOOSE_ROUTE: Symbol('CHOOSE_START_POINT'),
  MAIN_PAGE: Symbol('ADD_SEGMENTS'),
  FINISHED: Symbol('FINISHED')
})

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
  }
})

function Recording () {
  const classes = useStyles()

  const [route, setRoute] = useState([])
  const [segments, setSegments] = useState(emptySegments())
  const [segmentIndexInEditMode, setSegmentIndexInEditMode] = useState(-1)
  const [step, setStep] = useState(STEPS.MAIN_PAGE)
  const forceUpdate = useReducer((updateValue) => updateValue + 1, () => 0)[1]

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

  function renderEditMap () {
    return (
      <div>
        <PTMap key='map' onChange={(e) => console.log('onChange', e)} polyline={null}/>
        <MapOverlay centered bottom={30}>
          <Paper zDepth={2}>
            <div className={'mediumPadding alignCenter'}>
              <div className={'minorHeader'}>Bitte lege die Strecke fest</div>
              <div className={'text'}>Klicke dafür auf das Liniensymbol oben rechts</div>
              <div className={'minorMargin'}/>
              <Button
                variant="contained"
                color="primary"
                className={'button'}
                endIcon={<ArrowForwardIcon/>}
                onClick={() => setStep(STEPS.MAIN_PAGE)}
                // disabled={!route.length < 2}
              >
                Fertig
              </Button>
            </div>
          </Paper>
        </MapOverlay>
      </div>
    )
  }

  function renderEditMode () {
    return (
      <div>
        <div className={classes.header}>Strecke</div>
        {renderMapEditArea()}
        <div className={classes.header}>Streckenabschnitte</div>
        {renderSegments()}
        <div className={classes.header}>Abschließen</div>
        {renderFinishArea()}
      </div>
    )
  }

  function renderMapEditArea () {
    return (
      <div className={classes.buttonGroup}>
        <Button className={classes.bottomButton} key="addSegment" variant={'contained'}
                onClick={() => setStep(STEPS.CHOOSE_ROUTE)}
                size={'small'} color={'primary'}>
          Strecke setzen
        </Button>
      </div>
    )
  }

  function renderFinishArea () {
    return (
      <div className={classes.buttonGroup}>
        <Button className={classes.bottomButton} key="save" variant={'contained'}
                color={'secondary'}
                disabled
                onClick={() => {
                  // sendToServer()
                }}
        >
          Speichern
        </Button>
      </div>
    )
  }

  function renderSegments () {
    console.log('segments', segments)
    const cards =
      segments.map((segment, index) =>
        [
          <div style={{textAlign: 'center'}}>
            <Tooltip title="Abschnitt einfügen">
              <IconButton key={`segment_${index}_add`} component="span"

                          onClick={() => addSegment(index)}>
                <AddCircleIcon/>
              </IconButton>
            </Tooltip>
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
      )

    return (
      <div style={{marginTop: 20}} key={'segments'}>
        {cards}
        <div className={classes.buttonGroup}>
          <Button className={classes.bottomButton} key="addSegment" variant={'contained'} onClick={() => addSegment()}
                  size={'small'} color={'primary'}>
            Abschnitt hinzufügen
          </Button>
        </div>
      </div>
    )
  }

  function renderStep () {
    switch (step) {
      case STEPS.CHOOSE_ROUTE:
        return renderEditMap()

      case STEPS.MAIN_PAGE:
        return renderEditMode()

      default:
        return 'Not yet implemented'
    }
  }

  return renderStep()
}

export default Recording
