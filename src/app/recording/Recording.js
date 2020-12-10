import React, { useReducer, useState, useRef, useEffect } from 'react'
import PTMap from '../map/PTMap'
import Paper from '@material-ui/core/Paper'
import MapOverlay from '../map/MapOverlay'
import Button from '@material-ui/core/Button'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import { emptySegments } from './TypeSupport'
import SubsegmentUI from './SubsegmentUI'
import Subsegment, { SegmentType } from './Subsegment'
import { makeStyles } from '@material-ui/core/styles'
import { postSegment, retrieveGeoJsonForBoundingBox } from '../../helpers/api'

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

  const [geoJson, setGeoJson] = useState(null)
  const [currentSubsegments, setCurrentSubsegments] = useState(emptySegments())
  const [subsegmentIndexInEditMode, setSubsegmentIndexInEditMode] = useState(-1)
  const [selectedSegmentId, setSelectedSegmentId] = useState(null)
  const forceUpdate = useReducer((updateValue) => updateValue + 1, () => 0)[1]
  const [isChanged, setIsChanged] = useState(false)

  useEffect(() => {
    async function load() {
      setGeoJson(await retrieveGeoJsonForBoundingBox())
    }
    load()
  }, [])

  function updateSubsegment (index, segment) {
    setCurrentSubsegments([segment])
    const segmentsCopy = [...currentSubsegments]
    segmentsCopy[index] = segment
    setCurrentSubsegments(segmentsCopy)
  }

  function removeSubsegment (segment) {
    setCurrentSubsegments(currentSubsegments.filter(s => s !== segment))
  }

  function addSubsegment (index = currentSubsegments.length) {
    console.log('newIndex', index, currentSubsegments)
    currentSubsegments.splice(index, 0, new Subsegment())
    setSubsegmentIndexInEditMode(index)
    forceUpdate()
  }

  async function onFeatureCreated (feature) {
    const createdFeature = await postSegment({ ...feature, properties: { subsegments: [] } })
    const newGeoJson = Object.assign({}, geoJson)
    newGeoJson.features.push(createdFeature)
    setGeoJson(newGeoJson)
    setSelectedSegmentId(createdFeature.id)
  }

  function onFeaturesEdited(changedGeojson) {
    // TODO: merge existing geoJson with new geoJson
    setSelectedSegmentId(null)
  }

  function cancelEditing () {
    setSelectedSegmentId(null)
  }

  function renderMapView () {
    console.log('selectedSegmentId', selectedSegmentId)
    return (
      <div>
        <PTMap
          key='map'
          selectedFeatureId={selectedSegmentId}
          onSelectFeatureById={setSelectedSegmentId}
          onFeaturesEdited={onFeaturesEdited}
          onFeatureCreated={onFeatureCreated}
          geoJson={geoJson}
        />
      </div>
    )
  }

  function renderFormView () {
    if (!selectedSegmentId) {
      return (
        <div>
          <div className={classes.verticalSpace} />
          <div className={classes.header}>Willkommen bei ParkplatzTransport</div>
          <div className={classes.subheader}>Wähle einen vorhandenen Abschnitt oder erstelle einen Neuen</div>
          <div className={classes.subheader}>Zoome in die Karte um die Bearbeitungswerkzeuge zu sehen</div>
        </div>

      )
    }
    return (
      <div>
        <div className={classes.header}>Streckenabschnitte</div>
        {renderSegments()}

        <div className={classes.verticalSpace}/>
        <div className={classes.buttonGroup}>
          <Button className={classes.bottomButton} key='cancel' variant={'text'}
                  color={'secondary'}
                  onClick={cancelEditing}
          >
            Abbrechen
          </Button>
          <Button className={classes.bottomButton} key='save' variant={'text'}
                  color={'primary'}
                  disabled={!isChanged}
                  onClick={() => {
                    // sendToServer()
                  }}
          >
            Speichern
          </Button>
        </div>
      </div>
    )
  }

  function renderSegments () {
    console.log('currentSubsegments', currentSubsegments)
    const cards =
      currentSubsegments.map((segment, index) =>
        [
          // <div style={{textAlign: 'center'}}>
          //   <Tooltip title="Abschnitt einfügen">
          //     <IconButton key={`segment_${index}_add`} component="span"
          //
          //                 onClick={() => addSubsegment(index)}>
          //       <AddCircleIcon/>
          //     </IconButton>
          //   </Tooltip>
          // </div>,
          <SubsegmentUI
            key={`segment_${index}${subsegmentIndexInEditMode === index ? '_edit' : ''}`}
            outerSegment={segment}
            editMode={subsegmentIndexInEditMode === index}
            onEdit={() => setSubsegmentIndexInEditMode(index)}
            onDelete={() => {
              removeSubsegment(segment)
              setSubsegmentIndexInEditMode(-1)
            }}
            onUpdated={updatedSegment => {
              updateSubsegment(index, updatedSegment)
            }}
            onDone={() => {
              setSubsegmentIndexInEditMode(-1)
            }}
          />
        ]
      )

    return (
      <div style={{marginTop: 20}} key={'currentSubsegments'}>
        {cards}
        <div className={classes.buttonGroup}>
          <Button className={classes.bottomButton} key="addSegment" variant={'contained'} onClick={() => addSubsegment()}
                  size={'small'} color={'primary'}>
            Abschnitt hinzufügen
          </Button>
        </div>
      </div>
    )
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
