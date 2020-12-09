import React, { useReducer, useState, useRef } from 'react'
import PTMap from '../map/PTMap'
import Paper from '@material-ui/core/Paper'
import MapOverlay from '../map/MapOverlay'
import Button from '@material-ui/core/Button'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import { emptySegments } from './TypeSupport'
import SubsegmentUI from './SubsegmentUI'
import Subsegment, { SegmentType } from './Subsegment'
import { makeStyles } from '@material-ui/core/styles'
import { postSegment } from '../../helpers/api'

const EXAMPLE_GEOJSON = {
  'type': 'FeatureCollection',
  'features': [
    {
      'type': 'Feature',
      'properties': {},
      'id': 13,
      'geometry': {
        'type': 'LineString',
        'coordinates': [
          [
            13.389807343482971,
            52.51038691206013
          ],
          [
            13.387414813041685,
            52.510253051808995
          ],
          [
            13.386899828910828,
            52.51079502006544
          ],
          [
            13.38684618473053,
            52.51092561382671
          ],
          [
            13.38683009147644,
            52.51099091056185
          ]
        ]
      }
    },
    // {
    //   'type': 'Feature',
    //   'properties': {},
    //   'geometry': {
    //     'type': 'LineString',
    //     'coordinates': [
    //       [
    //         13.386835455894468,
    //         52.51107253134428
    //       ],
    //       [
    //         13.389705419540405,
    //         52.51126515578991
    //       ]
    //     ]
    //   }
    // },
    // {
    //   'type': 'Feature',
    //   'properties': {},
    //   'geometry': {
    //     'type': 'LineString',
    //     'coordinates': [
    //       [
    //         13.391532003879547,
    //         52.50956415480001
    //       ],
    //       [
    //         13.3914515376091,
    //         52.51002287652146
    //       ],
    //       [
    //         13.391411304473877,
    //         52.51008001234361
    //       ],
    //       [
    //         13.391333520412445,
    //         52.510125720947855
    //       ],
    //       [
    //         13.391212821006775,
    //         52.51014041298913
    //       ],
    //       [
    //         13.391108214855194,
    //         52.51012735339714
    //       ],
    //       [
    //         13.391059935092926,
    //         52.510088174597854
    //       ],
    //       [
    //         13.391035795211792,
    //         52.5100261414276
    //       ],
    //       [
    //         13.39110016822815,
    //         52.509933091507996
    //       ],
    //       [
    //         13.391287922859192,
    //         52.50984167385129
    //       ],
    //       [
    //         13.391389846801758,
    //         52.509773110483955
    //       ],
    //       [
    //         13.39144617319107,
    //         52.50975352093079
    //       ],
    //       [
    //         13.391483724117277,
    //         52.509560889859564
    //       ]
    //     ]
    //   }
    // },
    // {
    //   'type': 'Feature',
    //   'properties': {},
    //   'geometry': {
    //     'type': 'Polygon',
    //     'coordinates': [
    //       [
    //         [
    //           13.388257026672363,
    //           52.50934540325395
    //         ],
    //         [
    //           13.38933527469635,
    //           52.509427027092514
    //         ],
    //         [
    //           13.389313817024231,
    //           52.50976005078283
    //         ],
    //         [
    //           13.389217257499695,
    //           52.5098351440114
    //         ],
    //         [
    //           13.389142155647276,
    //           52.50984167385129
    //         ],
    //         [
    //           13.389147520065308,
    //           52.509949416069546
    //         ],
    //         [
    //           13.389195799827576,
    //           52.50995268098114
    //         ],
    //         [
    //           13.389254808425903,
    //           52.50988085287029
    //         ],
    //         [
    //           13.389383554458616,
    //           52.509756785856936
    //         ],
    //         [
    //           13.389405012130737,
    //           52.509427027092514
    //         ],
    //         [
    //           13.390000462532042,
    //           52.50945967658549
    //         ],
    //         [
    //           13.389989733695984,
    //           52.50956415480001
    //         ],
    //         [
    //           13.389882445335386,
    //           52.50966210290056
    //         ],
    //         [
    //           13.38984489440918,
    //           52.510057158023685
    //         ],
    //         [
    //           13.389887809753418,
    //           52.5101093964518
    //         ],
    //         [
    //           13.38985025882721,
    //           52.51030202511892
    //         ],
    //         [
    //           13.387457728385924,
    //           52.51016816460925
    //         ],
    //         [
    //           13.388257026672363,
    //           52.50934540325395
    //         ]
    //       ]
    //     ]
    //   }
    // },
    // {
    //   'type': 'Feature',
    //   'properties': {},
    //   'geometry': {
    //     'type': 'Polygon',
    //     'coordinates': [
    //       [
    //         [
    //           13.389984369277954,
    //           52.510488123198826
    //         ],
    //         [
    //           13.391615152359009,
    //           52.510488123198826
    //         ],
    //         [
    //           13.391615152359009,
    //           52.511225978004965
    //         ],
    //         [
    //           13.389984369277954,
    //           52.511225978004965
    //         ],
    //         [
    //           13.389984369277954,
    //           52.510488123198826
    //         ]
    //       ]
    //     ]
    //   }
    // },
    // {
    //   "type": "Feature",
    //   "properties": {},
    //   "geometry": {
    //     "type": "Point",
    //     "coordinates": [
    //       13.390557020902632,
    //       52.50986983377473
    //     ]
    //   }
    // }
  ]
}

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

  const [geoJson, setGeoJson] = useState(EXAMPLE_GEOJSON)
  const [currentSubsegments, setCurrentSubsegments] = useState(emptySegments())
  const [subsegmentIndexInEditMode, setSubsegmentIndexInEditMode] = useState(-1)
  const [selectedSegment, setSelectedSegment] = useState(null)
  const forceUpdate = useReducer((updateValue) => updateValue + 1, () => 0)[1]
  const [isChanged, setIsChanged] = useState(false)

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
    const createdFeature = await postSegment(feature)
    const newGeoJson = Object.assign({}, geoJson)
    newGeoJson.features.push(createdFeature)
    setGeoJson(newGeoJson)
  }

  function onFeaturesChanged(changedGeojson) {
    // merge existing geoJson with new geoJson
    console.log(geoJson, changedGeojson)
    for (const feature of changedGeojson.features) {
      console.log('feature', feature)
      geoJson.features.find(f => {
        console.log('f', f)
        return false
      })
    }
    // setSelectedSegment(segment)
  }

  function cancelEditing () {
    setSelectedSegment(null)
  }

  function renderMapView () {
    return (
      <div>
        <PTMap
          key='map'
          selectedFeature={selectedSegment}
          onSelectFeature={setSelectedSegment}
          onFeaturesEdited={onFeaturesChanged}
          onFeatureCreated={onFeatureCreated}
          geoJson={geoJson}
        />
      </div>
    )
  }

  function renderFormView () {
    if (!selectedSegment) {
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
