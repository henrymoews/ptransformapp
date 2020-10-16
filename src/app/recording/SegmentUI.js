import React, { useReducer, useState } from 'react'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import { makeStyles } from '@material-ui/core/styles'
import Avatar from '@material-ui/core/Avatar'
import orange from '@material-ui/core/colors/orange'
import blue from '@material-ui/core/colors/blue'
import green from '@material-ui/core/colors/green'
import red from '@material-ui/core/colors/red'
import Segment, { PARKING_ALLOWED, PARKING_TYPE, SegmentType } from './Segment'
import FolderSpecialIcon from '@material-ui/icons/FolderSpecial'
import BlockIcon from '@material-ui/icons/Block'
import { PropertyNames } from './MainReason'

const useStyles = makeStyles({
  card: {
    maxWidth: '90%',
    margin: '20px auto 0'
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
    textAlign: 'center'
  },
  marginBottom: {
    marginBottom: 18,
  },
  marginBottomMedium: {
    marginBottom: 10,
  },
  propertyButtons: {
    marginLeft: 20,
    marginBottom: 18
  },
  avatarUnknown: {
    backgroundColor: orange[300],
  },
  avatarParking: {
    backgroundColor: blue[500],
  },
  avatarParkingTemp: {
    backgroundColor: blue[200],
  },
  avatarSpecial: {
    backgroundColor: green[500],
  },
  avatarNoParking: {
    backgroundColor: red[500],
  },
  cardActionLeft: {
    marginRight: 'auto',
  },
  cardActionRight: {
    marginLeft: 'auto',
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    // '& > *': {
    //   margin: theme.spacing(1),
    // },
  },
})

/**
 *
 * @param segment {Segment}
 * @param onEdit {function}
 * @param onDelete {function}
 * @param editMode {boolean}
 * @param onUpdated {function}
 * @param forNewSegment {boolean} whether the outerSegment will be appended in the end
 * @returns {node}
 * @constructor
 */
export default function SegmentUI (
  {
    outerSegment,
    onEdit,
    onDelete,
    editMode,
    onUpdated,
    forNewSegment = false
  }) {

  const classes = useStyles()

  const [segment, setSegment] = useState(Segment.fromSegment(outerSegment))
  const [goingToDelete, setGoingToDelete] = useState(false)
  const forceUpdate = useReducer((updateValue) => updateValue + 1, () => 0)[1]

  function setOrUnsetParkingAllowed (newParkingAllowedType) {
    if (segment.parkingAllowed === newParkingAllowedType) {
      segment.parkingAllowed = PARKING_ALLOWED.UNKNOWN
    } else {
      segment.parkingAllowed = newParkingAllowedType
    }
    forceUpdate()
  }

  function toggleMainReason (boolPropertyName) {
    segment.mainReason.toggleProperty(boolPropertyName)
    forceUpdate()
  }

  function setMarked (isMarked) {
    segment.isMarked = isMarked
    forceUpdate()
  }

  function setParkingType (parkingType) {
    segment.parkingType = parkingType
    forceUpdate()
  }

  function renderSegmentAvatar () {
    let className
    let textOrIcon

    if (forNewSegment) {
      className = classes.avatarSpecial
      textOrIcon = '?'
    }

    else {
      switch (outerSegment.parkingAllowed) {
        case PARKING_ALLOWED.ALWAYS:
          className = classes.avatarParking
          textOrIcon = '?'
          break

        case PARKING_ALLOWED.TEMPORARILY:
          className = classes.avatarParkingTemp
          textOrIcon = '?'
          break

        case PARKING_ALLOWED.NEVER:
          className = classes.avatarNoParking
          textOrIcon = '?'
          break

        case PARKING_ALLOWED.UNKNOWN:
          className = classes.avatarSpecial
          textOrIcon = '?'
          break

        default:
          className = classes.avatarSpecial
          textOrIcon = '?'
      }
    }
    
    return (
      <Avatar aria-label="recipe" className={className}>
        {textOrIcon}
      </Avatar>
    )
  }

  function renderAvatarTitle () {
    if (forNewSegment) {
      return 'Abschnitt hinzufügen'
    }
    switch (segment.parkingAllowed) {
      case PARKING_ALLOWED.ALWAYS:
        return 'Parken erlaubt'
      case PARKING_ALLOWED.TEMPORARILY:
        return 'Parken mit zeitlicher Beschränkung'
      case PARKING_ALLOWED.NEVER:
        return 'Parken nicht erlaubt'
      default:
        return 'Unbekannte Parkmöglichkeit'
    }
  }

  function renderAvatarSubheader () {
    if (editMode) {
      return null
    }

    return 'Details in Kurzform später hier'
  }

  function renderCardHeader () {
    return (
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            {renderSegmentAvatar()}
          </Avatar>
        }
        onClick={onEdit}
        title={renderAvatarTitle()}
        subheader={renderAvatarSubheader()}
      />
    )
  }

  function renderCardContent () {
    if (editMode) {
      const parkingAllowedButtons = [
        <Button
          key={'always'}
          onClick={() => setOrUnsetParkingAllowed(PARKING_ALLOWED.ALWAYS)}
          variant={segment.parkingAllowed === PARKING_ALLOWED.ALWAYS ? 'contained' : 'outlined'}
        >
          Immer
        </Button>,
        <Button
          key={'temporarily'}
          onClick={() => setOrUnsetParkingAllowed(PARKING_ALLOWED.TEMPORARILY)}
          variant={segment.parkingAllowed === PARKING_ALLOWED.TEMPORARILY ? 'contained' : 'outlined'}
        >
          Zeitlich beschränkt
        </Button>,
        <Button
          key={'never'}
          onClick={() => setOrUnsetParkingAllowed(PARKING_ALLOWED.NEVER)}
          variant={segment.parkingAllowed === PARKING_ALLOWED.NEVER ? 'contained' : 'outlined'}
        >
          Nie
        </Button>
      ]
      return (
        <CardContent>
          <Typography className={classes.title} color="textSecondary" gutterBottom>
            Parken erlaubt
          </Typography>
          <ButtonGroup className={classes.marginBottom} size={'medium'} color="primary"
                       aria-label="outlined primary button group">
            {parkingAllowedButtons}
          </ButtonGroup>

          {renderParkingProperty()}
          {renderLength()}
          {renderMainReason()}
        </CardContent>
      )
    }
  }

  function renderParkingProperty () {
    if (segment.parkingAllowed === PARKING_ALLOWED.NEVER || segment.parkingAllowed === PARKING_ALLOWED.UNKNOWN) {
      return null
    }
    return (
      <div>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          Parkart
        </Typography>
        <ButtonGroup size={'medium'} color="primary" className={classes.marginBottomMedium}
                     aria-label="outlined primary button group">
          <Button
            key={'marked'}
            onClick={() => setMarked(true)}
            variant={segment.isMarked ? 'contained' : 'outlined'}
          >
            Markiert
          </Button>
          <Button
            key={'notMarked'}
            onClick={() => setMarked(false)}
            variant={!segment.isMarked ? 'contained' : 'outlined'}
          >
            Unmarkiert
          </Button>
        </ButtonGroup>
        <ButtonGroup size={'medium'} color="primary" className={classes.marginBottomMedium}
                     aria-label="outlined primary button group">
          <Button
            key={'laengs'}
            onClick={() => setParkingType(PARKING_TYPE.LAENGS)}
            variant={segment.parkingType === PARKING_TYPE.LAENGS ? 'contained' : 'outlined'}
          >
            Längs
          </Button>
          <Button
            key={'schraeg'}
            onClick={() => setParkingType(PARKING_TYPE.SCHRAEG)}
            variant={segment.parkingType === PARKING_TYPE.SCHRAEG ? 'contained' : 'outlined'}
          >
            Schräg
          </Button>
          <Button
            key={'quer'}
            onClick={() => setParkingType(PARKING_TYPE.QUER)}
            variant={segment.parkingType === PARKING_TYPE.QUER ? 'contained' : 'outlined'}
          >
            Quer
          </Button>
        </ButtonGroup>
      </div>
    )
  }

  function renderMainReason () {
    if (segment.parkingAllowed === PARKING_ALLOWED.ALWAYS || segment.parkingAllowed === PARKING_ALLOWED.UNKNOWN) {
      return null
    }
    return (
      <div>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          Hauptgrund für das Parkverbot
        </Typography>
        <ButtonGroup size={'medium'} color="primary" className={classes.marginBottomMedium}
                     aria-label="outlined primary button group">
          <Button
            key={'yes'}
            onClick={() => toggleMainReason(PropertyNames.IS_STOP)}
            variant={segment.mainReason.isStop ? 'contained' : 'outlined'}
          >
            Haltestelle
          </Button>
          <Button
            key={'yes'}
            onClick={() => toggleMainReason(PropertyNames.IS_BUSLANE)}
            variant={segment.mainReason.isBuslane ? 'contained' : 'outlined'}
          >
            Busspur
          </Button>
        </ButtonGroup>
        <ButtonGroup size={'medium'} color="primary" className={classes.marginBottomMedium}
                     aria-label="outlined primary button group">
          <Button
            key={'yes'}
            onClick={() => toggleMainReason(PropertyNames.IS_BIKELANE)}
            variant={segment.mainReason.isBikelane ? 'contained' : 'outlined'}
          >
            Fahrradspur
          </Button>
          <Button
            key={'yes'}
            onClick={() => toggleMainReason(PropertyNames.IS_TREE)}
            variant={segment.mainReason.isTree ? 'contained' : 'outlined'}
          >
            Baum
          </Button>
        </ButtonGroup>
      </div>
    )
  }

  function renderLength () {
    return (
      <div>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          Länge
        </Typography>
        Hier ein Textfeld / Schrittzähler / Autozähler
      </div>
    )
  }

  function renderCardActions () {
    if (!editMode) {
      return null
    }

    if (goingToDelete) {
      const reallyDeleteButton = (
        <Button
          onClick={onDelete}
          className={classes.cardActionRight}
          color="secondary"
          size="small"
        >
          Wirklich löschen
        </Button>
      )

      const cancelDeletionButton = (
        <Button
          onClick={() => setGoingToDelete(false)}
          className={classes.cardActionLeft}
          color="primary"
          size="small"
        >
          Abbrechen
        </Button>
      )

      return (
        <CardActions>
          {cancelDeletionButton}
          {reallyDeleteButton}
        </CardActions>
      )
    }

    const deleteButton = forNewSegment
      ? null
      : (
        <Button
          onClick={() => setGoingToDelete(true)}
          className={classes.cardActionLeft}
          color="secondary"
          size="small"
        >
          Abschnitt löschen
        </Button>
      )

    const saveButton = (
      <Button
        onClick={() => {onUpdated(segment)}}
        className={classes.cardActionRight}
        color="primary"
        size="small"
      >
        Speichern
      </Button>
    )

    return (
      <CardActions>
        {deleteButton}
        {saveButton}
      </CardActions>
    )
  }

  return (
    <Card className={classes.card}>
      {segment.parkingAllowed}
      {renderCardHeader()}
      {renderCardContent()}
      {renderCardActions()}
    </Card>
  )
}