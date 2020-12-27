import React, { useEffect, useReducer, useRef, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  FormControl, FormControlLabel,
  FormLabel,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText, Radio,
  RadioGroup
} from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import Button from '@material-ui/core/Button'
import SplitButton from './SplitButton'

const useStyles = makeStyles((theme) => ({
  list: {
    height: 300,
    'max-height': 'calc(100% - 400px)',
    'overflow-y': 'scroll'
  },

  marginTop: {
    marginTop: 10
  },

  marginLeft: {
    marginLeft: 15
  },

  marginLeftRight: {
    marginLeft: 10,
    marginRight: 10
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
  subheader: {
    margin: '20px auto',
    textAlign: 'center',
    fontEeight: 'bold',
    fontSize: 16
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

function createDefaultParkingSubsegment (orderNumber) {
  return {
    parking_allowed: true,
    order_number: orderNumber,
    length_in_meters: 0,
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

function createDefaultNonParkingSegment (orderNumber) {
  return {
    parking_allowed: false,
    order_number: orderNumber,
    length_in_meters: null,   // will be set on save
    car_count: 0,
    quality: 1,
    no_parking_reason: null,
  }
}

export default function SegmentForm ({segment, onChanged}) {
  const classes = useStyles()
  const [selectedSubsegment, setSelectedSubsegment] = React.useState(null)
  const [isChanged, setChanged] = useReducer((updateValue, changed = true) => {
    return changed ? updateValue + 1 : 0
  }, () => 0)

  const prevSegmentRef = useRef(segment)

  useEffect(() => {
    if (isChanged && prevSegmentRef.current?.id && segment?.id !== prevSegmentRef.current?.id) {
      onChanged(prevSegmentRef.current)
      prevSegmentRef.current = segment
      setChanged(false)
    }
  }, [segment])

  function addSubsegment (segmentCreationFunction) {
    if (!segment.properties) {
      segment.properties = {}
    }
    if (!segment.properties.subsegments) {
      segment.properties.subsegments = []
    }
    const subsegment = segmentCreationFunction(segment.properties.subsegments.length)
    segment.properties.subsegments.push(subsegment)
    setSelectedSubsegment(subsegment)
    setChanged()
  }

  function deleteSubsegment (subsegment) {
    segment.properties.subsegments = segment.properties.subsegments.filter(s => s !== subsegment)
    setChanged()
  }

  function renderList () {
    if (segment.properties && segment.properties.subsegments) {
      const listItems = segment.properties.subsegments.map((subsegment) => {
        return (
          <ListItem key={subsegment.order_number} button selected={subsegment === selectedSubsegment}
                    onClick={() => setSelectedSubsegment(subsegment)}>
            <ListItemText
              primary={subsegment.parking_allowed ? 'Parken' : 'Kein Parken'}
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

  function renderDetails () {
    if (!selectedSubsegment) {
      return (
        <div>
          <div className={classes.header}>Details</div>
          <div className={classes.subheader}>Wähle oder erstelle einen Unterabschnitt</div>
        </div>
      )
    }
    return (
      <div>
        <div className={classes.header}>Details</div>
        <div className={classes.marginLeftRight}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Parken ist</FormLabel>
          <RadioGroup aria-label="parking_allowed"
                      name="parking_allowed"
                      value={selectedSubsegment.parking_allowed}
                      className={classes.marginLeft}
                      onChange={() => {
                        selectedSubsegment.parking_allowed = !selectedSubsegment.parking_allowed
                        console.log('selectedSubsegment.parking_allowed', selectedSubsegment.parking_allowed)
                        setChanged()
                      }}
          >
            <FormControlLabel value={true} control={<Radio/>} label="(manchmal) erlaubt"/>
            <FormControlLabel value={false} control={<Radio/>} label="nie erlaubt"/>
          </RadioGroup>
        </FormControl>

        </div>

        <div className={classes.subheader}>{JSON.stringify(selectedSubsegment, null, ' ')}</div>
      </div>
    )
  }

  return (
    <div>
      <div className={classes.header}>Unterabschnitte</div>
      <div className={classes.list}>
        {renderList()}
      </div>
      <SplitButton caption={'Abschnitt hinzufügen'} optionsAndCallbacks={[
        {label: 'Parken', callback: () => addSubsegment(createDefaultParkingSubsegment)},
        {label: 'Kein Parken', callback: () => addSubsegment(createDefaultNonParkingSegment)},
        {label: 'Haltestelle', disabled: true},
        {label: 'Busspur', disabled: true},
        {label: 'Einfahrt', disabled: true}
      ]}/>
      {renderDetails()}
    </div>
  )
}