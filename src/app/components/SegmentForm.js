import React, { useReducer } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { List, ListItem, ListItemSecondaryAction, ListItemText } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import Button from '@material-ui/core/Button'

const useStyles = makeStyles((theme) => ({
  list: {
    height: 300,
    'max-height': 'calc(100% - 400px)',
    'overflow-y': 'scroll'
  },

  marginTop: {
    marginTop: 10
  },

  centered: {
    left: '50%',
    transform: 'translateX(-50%)'
  },

  header: {
    margin: '20px auto',
    textAlign: 'center',
    fontEeight: 'bold',
    fontSize: 20
  },
}))

const STREET_LOCATION = {
  STREET: 'street',
  CURB: 'curb',
  SIDEWALK: 'sidewalk',
  PARKING_BAY: 'parking_bay',
  MIDDLE: 'middle',
  CAR_PARK: 'car_park'
}

const ALIGNMENT = {
  PARALLEL: 'parallel',
  PERPENDICULAR: 'perpendicular',
  DIAGONAL: 'diagonal'
}

const USAGE_RESTRICTIONS = {
  HANDICAP: 'handicap',
  RESIDENTS: 'residents',
  CAR_SHARING: 'car_sharing',
  GENDER: 'gender',
  ELECTRIC_CARS: 'electric_cars',
  OTHER: 'other'
}

const NO_PARKING_REASON = {
  PRIVATE_PARKING: 'private_parking',
  BUS_STOP: 'bus_stop',
  BUS_LANE: 'bus_lane',
  TAXI: 'taxi',
  TREE: 'tree',
  BIKE_RACKS: 'bike_racks',
  PEDESTRIAN_CROSSING: 'pedestrian_crossing',
  DRIVEWAY: 'driveway',
  LOADING_ZONE: 'loading_zone',
  STANDING_ZONE: 'standing_zone',
  EMERGENCY_EXIT: 'emergency_exit',
  LOWERED_CURB_SIDE: 'lowered_curb_side',
  LANE: 'lane'
}

function createDefaultSubsegment (orderNumber) {
  return {
    parking_allowed: true,
    order_number: orderNumber,
    length_in_meters: null,   // will be set on save
    car_count: 0,
    quality: 1,
    fee: false,
    street_location: STREET_LOCATION.STREET,
    marked: false,
    alignment: ALIGNMENT.PARALLEL,
    duration_constraint: false,
    usage_restrictions: null,
    time_constraint: false,
    time_constraint_reason: null,
    no_parking_reason: null,
  }
}

export default function SegmentForm ({segment, onSave}) {
  const classes = useStyles()
  const [selectedSubsegment, setSelectedSubsegment] = React.useState(0)
  const forceUpdate = useReducer((updateValue) => updateValue + 1, () => 0)[1]

  function addSubsegment () {
    if (!segment.properties) {
      segment.properties = {}
    }
    if (!segment.properties.subsegments) {
      segment.properties.subsegments = []
    }
    segment.properties.subsegments.push(createDefaultSubsegment(segment.properties.subsegments.length))

    forceUpdate()
  }

  function deleteSubsegment(subsegment) {
    segment.properties.subsegments = segment.properties.subsegments.filter(s => s !== subsegment)
    forceUpdate()
  }

  function renderList () {
    if (segment.properties && segment.properties.subsegments) {
      const listItems = segment.properties.subsegments.map((subsegment) => {
        return (
          <ListItem button selected={subsegment === selectedSubsegment}>
            <ListItemText
              primary="Abschnitt"
              secondary="Detailinfo"
            />
            <ListItemSecondaryAction>
              <IconButton onClick={() => deleteSubsegment(subsegment)} edge="end" aria-label="delete">
                <DeleteIcon/>
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        )
      })

      return (
        <List>{listItems}</List>
      )
    }
  }

  return (
    <div>
      <div className={classes.header}>Abschnitte</div>
      <div className={classes.list}>
        {renderList()}
      </div>
      <Button
        className={`${classes.centered} ${classes.marginTop}`}
        variant="outlined"
        onClick={addSubsegment}
      >
        Abschnitt hinzufügen
      </Button>

      <br />
      <br />
      Hier unten erscheinen dann die Details
    </div>
  )
}