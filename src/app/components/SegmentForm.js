import React, { useEffect, useReducer, useRef } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  Checkbox,
  FormControl, FormControlLabel, FormGroup, FormLabel, Input, InputAdornment, InputLabel,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableRow, TextField
} from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import Button from '@material-ui/core/Button'
import SplitButton from './SplitButton'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Paper from '@material-ui/core/Paper'
import {
  ALIGNMENT,
  createEmptySubsegment,
  getToggleNoParkingReasonFn,
  NO_PARKING_REASONS_AND_LABEL,
  setAlignmentDiagonal,
  setAlignmentParallel,
  setAlignmentPerpendicular,
  setCarCount,
  setDurationConstraint,
  setFee,
  setLengthInMeters,
  setMarked,
  setNoDurationConstraint,
  setNoTimeConstraint,
  setNotMarked,
  setParkingAllowed,
  setParkingNotAllowed,
  setStreetLocation,
  setTimeConstraint,
  setTimeConstraintReason,
  setUsageRestriction,
  setUsageWhenNoParking,
  setWithoutFee,
  STREET_LOCATION,
  USAGE_RESTRICTIONS,
  USAGE_WHEN_NO_PARKING,
} from '../recording/Subsegments'
import clsx from 'clsx'

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
  margin: {
    margin: theme.spacing(1),
  },
  withoutLabel: {
    marginTop: theme.spacing(3),
  },
  shortTextField: {
    width: '20ch',
  },
  textField: {
    width: '25ch',
  },
  wideTextField: {
    width: '35ch',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}))

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
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
    setSelectedSubsegment(null)
  }, [segment])

  /**
   * @param segmentCreationFunction A function with order_number as first parameter.
   */
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

  function getButtonVariant (highlighted) {
    return highlighted ? 'contained' : 'outlined'
  }

  /**
   *
   * @param subsegmentChangeFunction - A function that takes a subsegment as first argument. A optional second arg
   *   takes the event's value
   */
  function updateSubsegment (subsegmentChangeFunction) {
    return (event) => {
      subsegmentChangeFunction(selectedSubsegment, event?.target?.value || event?.target?.checked)
      setChanged()
    }
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

  function renderDetailsForParkingAllowed () {
    if (selectedSubsegment.parking_allowed) {
      return (
        <React.Fragment>
          {/*Marking and car count*/}
          <TableRow key={`${selectedSubsegment.id}_marked`}>
            <TableCell component="th" scope="row">
              Markierung
            </TableCell>
            <TableCell align="left">
              <ButtonGroup color="primary" aria-label="outlined primary button group">
                <Button variant={getButtonVariant(selectedSubsegment.marked)}
                        onClick={updateSubsegment(setMarked)}>
                  Markiert
                </Button>
                <Button variant={getButtonVariant(!selectedSubsegment.marked)}
                        onClick={updateSubsegment(setNotMarked)}>
                  Unmarkiert
                </Button>
              </ButtonGroup>

              {selectedSubsegment.marked
                ? <div>
                  <FormControl className={clsx(classes.margin, classes.withoutLabel, classes.shortTextField)}>
                    <Input
                      id="standard-adornment-weight"
                      value={selectedSubsegment.car_count}
                      onChange={updateSubsegment(setCarCount)}
                      endAdornment={<InputAdornment position="end">Stellplätze</InputAdornment>}
                      aria-describedby="car count"
                      inputProps={{
                        'aria-label': 'weight',
                      }}
                    />
                  </FormControl>
                </div>
                : null
              }

            </TableCell>
          </TableRow>

          {/* Time Constraint*/}
          <TableRow key={`${selectedSubsegment.id}_time_constraint`}>
            <TableCell component="th" scope="row">
              Beschränkung&nbsp;nach&nbsp;Zeit
            </TableCell>
            <TableCell align="left">
              <ButtonGroup color="primary" aria-label="outlined primary button group">
                <Button variant={getButtonVariant(selectedSubsegment.time_constraint)}
                        onClick={updateSubsegment(setTimeConstraint)}>
                  Ja
                </Button>
                <Button variant={getButtonVariant(!selectedSubsegment.time_constraint)}
                        onClick={updateSubsegment(setNoTimeConstraint)}>
                  Nein
                </Button>
              </ButtonGroup>

              {selectedSubsegment.time_constraint
                ? <FormControl className={clsx(classes.margin, classes.withoutLabel, classes.wideTextField)}>
                  <FormLabel component="legend">Wann besteht Parkverbot?</FormLabel>
                  <TextField id={`${selectedSubsegment.id}_time_constraint_reason`}
                             multiline variant={'outlined'} style={{width: '100%'}}
                             InputLabelProps={{shrink: true}}
                             rows={3}
                             rowsMax={5}
                             value={selectedSubsegment.time_constraint_reason}
                             onChange={updateSubsegment(setTimeConstraintReason)}
                  />
                </FormControl>
                : null
              }

              {selectedSubsegment.time_constraint
                ? <FormControl className={classes.formControl}>
                  <FormLabel component="legend">Nutzung bei Parkverbot</FormLabel>
                  <Select
                    labelId="select_usage_when_no_parking"
                    id="select_usage_when_no_parking"
                    value={selectedSubsegment.usage_when_no_parking}
                    onChange={updateSubsegment(setUsageWhenNoParking)}
                    // variant={'outlined'}
                  >
                    <MenuItem value={USAGE_WHEN_NO_PARKING.BUS_STOP}>Haltestelle</MenuItem>
                    <MenuItem value={USAGE_WHEN_NO_PARKING.BUS_LANE}>Busspur</MenuItem>
                    <MenuItem value={USAGE_WHEN_NO_PARKING.MARKET}>Markt</MenuItem>
                    <MenuItem value={USAGE_WHEN_NO_PARKING.LANE}>Fahrspur</MenuItem>
                    <MenuItem value={USAGE_WHEN_NO_PARKING.TAXI}>Taxi</MenuItem>
                    <MenuItem value={USAGE_WHEN_NO_PARKING.OTHER}>Sonstiges</MenuItem>
                  </Select>
                </FormControl>
                : null
              }

            </TableCell>
          </TableRow>

          {/*Alignment*/}
          <TableRow key={`${selectedSubsegment.id}_alignment`}>
            <TableCell component="th" scope="row">
              Parkwinkel
            </TableCell>
            <TableCell align="left">
              <ButtonGroup color="primary" aria-label="outlined primary button group">
                <Button variant={getButtonVariant(selectedSubsegment.alignment === ALIGNMENT.PARALLEL)}
                        onClick={updateSubsegment(setAlignmentParallel)}>
                  Parallel
                </Button>
                <Button variant={getButtonVariant(selectedSubsegment.alignment === ALIGNMENT.DIAGONAL)}
                        onClick={updateSubsegment(setAlignmentDiagonal)}>
                  Diagonal
                </Button>
                <Button variant={getButtonVariant(selectedSubsegment.alignment === ALIGNMENT.PERPENDICULAR)}
                        onClick={updateSubsegment(setAlignmentPerpendicular)}>
                  Quer
                </Button>
              </ButtonGroup>
            </TableCell>
          </TableRow>

          {/* Other properties*/}
          <TableRow key={`${selectedSubsegment.id}_fee`}>
            <TableCell component="th" scope="row">
              Weitere Eigenschaften
            </TableCell>
            <TableCell align="left">

              {/* Fee */}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedSubsegment.fee}
                    color={'primary'}
                    onChange={updateSubsegment(setFee)}
                  />
                }
                label="Mit Gebühr"/>

              {/* Duration constraint */}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedSubsegment.duration_constraint}
                    color={'primary'}
                    onChange={updateSubsegment(setDurationConstraint)}
                  />
                }
                label="Zeitlich beschränkte Parkdauer"/>

              {/* Street location */}
              <div>
                <FormControl className={classes.formControl}>
                  Parkposition:
                  <Select
                    id="select_parking_position"
                    value={selectedSubsegment.street_location}
                    onChange={updateSubsegment(setStreetLocation)}
                    variant={'outlined'}
                  >
                    <MenuItem value={STREET_LOCATION.STREET}>Straße</MenuItem>
                    <MenuItem value={STREET_LOCATION.CURB}>Bordstein</MenuItem>
                    <MenuItem value={STREET_LOCATION.SIDEWALK}>Gehweg</MenuItem>
                    <MenuItem value={STREET_LOCATION.PARKING_BAY}>Parkbucht</MenuItem>
                    <MenuItem value={STREET_LOCATION.MIDDLE}>"Middle"</MenuItem>
                    <MenuItem value={STREET_LOCATION.CAR_PARK}>"Car Park"</MenuItem>
                  </Select>
                </FormControl>
              </div>

              {/* usage restriction */}
              <div>
                <FormControl className={classes.formControl}>
                  Nutzergruppe:
                  <Select
                    labelId="demo-simple-select-label"
                    id="select_usage_restriction"
                    value={selectedSubsegment.usage_restrictions || USAGE_RESTRICTIONS.NO_RESTRICTION}
                    onChange={updateSubsegment(setUsageRestriction)}
                    variant={'outlined'}
                  >
                    <MenuItem value={USAGE_RESTRICTIONS.NO_RESTRICTION}>Alle Nutzer</MenuItem>
                    <MenuItem value={USAGE_RESTRICTIONS.HANDICAP}>Behinderung</MenuItem>
                    <MenuItem value={USAGE_RESTRICTIONS.RESIDENTS}>Anlieger</MenuItem>
                    <MenuItem value={USAGE_RESTRICTIONS.CAR_SHARING}>Car Sharing</MenuItem>
                    <MenuItem value={USAGE_RESTRICTIONS.GENDER}>nach Geschlecht</MenuItem>
                    <MenuItem value={USAGE_RESTRICTIONS.ELECTRIC_CARS}>E-Autos</MenuItem>
                    <MenuItem value={USAGE_RESTRICTIONS.OTHER}>Sonstige</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </TableCell>
          </TableRow>

        </React.Fragment>
      )
    }

    return null

  }

  function renderDetailsForParkingNotAllowed () {
    if (selectedSubsegment.parking_allowed === false) {
      return (
        <React.Fragment>

          {/*No parking reason*/}
          <TableRow key={`${selectedSubsegment.id}_noparking_reason`}>
            <TableCell component="th" scope="row">
              Gründe
            </TableCell>
            <TableCell align="left">
              <FormGroup>
                {Object.keys(NO_PARKING_REASONS_AND_LABEL).map(key => {
                  return (
                    <FormControlLabel
                      control={<Checkbox color={'primary'} checked={selectedSubsegment.no_parking_reasons?.[key]}
                                         onChange={updateSubsegment(getToggleNoParkingReasonFn(key))}/>}
                      label={NO_PARKING_REASONS_AND_LABEL[key]}
                    />
                  )
                })}
              </FormGroup>

            </TableCell>
          </TableRow>
        </React.Fragment>
      )
    }

    return null
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

          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableBody>

                {/*Parking allowed*/}
                <TableRow key={`${selectedSubsegment.id}_parking_allowed`}>
                  <TableCell component="th" scope="row">
                    Öffentliches Parken
                  </TableCell>
                  <TableCell align="left">
                    <ButtonGroup color="primary" aria-label="outlined primary button group">
                      <Button variant={getButtonVariant(selectedSubsegment.parking_allowed === true)}
                              onClick={updateSubsegment(setParkingAllowed)}>
                        Erlaubt
                      </Button>
                      <Button variant={getButtonVariant(selectedSubsegment.parking_allowed === false)}
                              onClick={updateSubsegment(setParkingNotAllowed)}>
                        Nie erlaubt
                      </Button>
                    </ButtonGroup>
                  </TableCell>
                </TableRow>

                {/*Length*/}
                <TableRow key={`${selectedSubsegment.id}_length`}>
                  <TableCell component="th" scope="row">
                    Länge
                  </TableCell>
                  <TableCell align="left">
                    <FormControl className={clsx(classes.margin, classes.withoutLabel, classes.textField)}>
                      <Input
                        id="standard-adornment-weight"
                        value={selectedSubsegment.length_in_meters}
                        onChange={updateSubsegment(setLengthInMeters)}
                        endAdornment={<InputAdornment position="end">m</InputAdornment>}
                        aria-describedby="length in meters"
                        inputProps={{
                          'aria-label': 'weight',
                        }}
                      />
                    </FormControl>
                  </TableCell>
                </TableRow>

                {renderDetailsForParkingAllowed()}
                {renderDetailsForParkingNotAllowed()}
              </TableBody>
            </Table>
          </TableContainer>
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
      <SplitButton optionsAndCallbacks={[
        {label: 'Abschnitt hinzufügen', callback: () => addSubsegment(createEmptySubsegment)},
        {label: 'Haltestelle', disabled: true},
        {label: 'Busspur', disabled: true},
        {label: 'Einfahrt', disabled: true}
      ]}/>
      {renderDetails()}
    </div>
  )
}