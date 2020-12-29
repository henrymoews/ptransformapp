import React, { useEffect, useReducer, useRef } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  FormControl, Input, InputAdornment,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText, Table, TableBody, TableCell, TableContainer, TableRow
} from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import Button from '@material-ui/core/Button'
import SplitButton from './SplitButton'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Paper from '@material-ui/core/Paper'
import {
  createNonParkingSubsegment,
  createParkingSubsegment,
  setCarCount,
  setLengthInMeters,
  setLengthInMetersMandatory,
  setMarked,
  setNotMarked,
  setParkingAllowed,
  setParkingNotAllowed,
  toggleParkingAllowed
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
  textField: {
    width: '25ch',
  },
}))

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
      subsegmentChangeFunction(selectedSubsegment, event?.target?.value)
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
          <TableRow key={'marked'}>
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
                  Ohne Markierung
                </Button>
              </ButtonGroup>

              <br/>

              {selectedSubsegment.marked
                ? <FormControl className={clsx(classes.margin, classes.withoutLabel, classes.textField)}>
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
                : null
              }

            </TableCell>
          </TableRow>
        </React.Fragment>
      )
    }

    return null

  }

  function renderDetailsForParkingNotAllowed () {
    if (!selectedSubsegment.parking_allowed) {
      return (
        <React.Fragment>
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
                <TableRow key={'parking_allowed'}>
                  <TableCell component="th" scope="row">
                    Öffentliches Parken
                  </TableCell>
                  <TableCell align="left">
                    <ButtonGroup color="primary" aria-label="outlined primary button group">
                      <Button variant={getButtonVariant(selectedSubsegment.parking_allowed)}
                              onClick={updateSubsegment(setParkingAllowed)}>
                        Erlaubt
                      </Button>
                      <Button variant={getButtonVariant(!selectedSubsegment.parking_allowed)}
                              onClick={updateSubsegment(setParkingNotAllowed)}>
                        Nie erlaubt
                      </Button>
                    </ButtonGroup>
                  </TableCell>
                </TableRow>

                {/*Length*/}
                <TableRow key={'parking_allowed'}>
                  <TableCell component="th" scope="row">
                    Länge
                  </TableCell>
                  <TableCell align="left">
                    <FormControl className={clsx(classes.margin, classes.withoutLabel, classes.textField)}>
                      <Input
                        id="standard-adornment-weight"
                        value={selectedSubsegment.length_in_meters}
                        onChange={updateSubsegment(selectedSubsegment.parking_allowed ? setLengthInMetersMandatory : setLengthInMeters)}
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
      <SplitButton caption={'Abschnitt hinzufügen'} optionsAndCallbacks={[
        {label: 'Parken', callback: () => addSubsegment(createParkingSubsegment)},
        {label: 'Kein Parken', callback: () => addSubsegment(createNonParkingSubsegment)},
        {label: 'Haltestelle', disabled: true},
        {label: 'Busspur', disabled: true},
        {label: 'Einfahrt', disabled: true}
      ]}/>
      {renderDetails()}
    </div>
  )
}