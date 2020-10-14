import React, { useState } from 'react'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import { makeStyles } from '@material-ui/core/styles'
import Avatar from '@material-ui/core/Avatar'
import orange from '@material-ui/core/colors/orange'
import blue from '@material-ui/core/colors/blue'
import green from '@material-ui/core/colors/green'
import red from '@material-ui/core/colors/red'
import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/Edit'
import Segment, { SegmentType } from './Segment'

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
  },
  pos: {
    marginBottom: 12,
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
  cardAction: {
    marginLeft: 'auto',
  },
})

/**
 *
 * @param segment {Segment}
 * @param onEdit {function}
 * @param editMode {boolean}
 * @param onUpdated {function}
 * @param forNewSegment {boolean} whether the segment will be appended in the end (has effect on button caption)
 * @returns {node}
 * @constructor
 */
export default function SegmentUI ({segment, onEdit, editMode, onUpdated, forNewSegment = false}) {

  const classes = useStyles()

  const [internalSegment, setInternalSegment] = useState(Segment.fromSegment(segment))

  function renderSegmentAvatar () {
    let className
    let textOrIcon

    switch (internalSegment.type) {
      case SegmentType.PARKING_ALLOWED:
        className = classes.avatarParking
        textOrIcon = 'P'
        break

      case SegmentType.PARKING_TEMPORARILY_ALLOWED:
        className = classes.avatarParkingTemp
        textOrIcon = 'Zeit'
        break

      case SegmentType.NO_PARKING_LANE:
        className = classes.avatarNoParking
        textOrIcon = 'Kein'
        break

      case SegmentType.SPECIAL_USE:
        className = classes.avatarSpecial
        textOrIcon = 'Sonder'
        break

      default:
        className = classes.avatarUnknown
        textOrIcon = '?'
        break
    }

    return (
      <Avatar aria-label="recipe" className={className}>
        {textOrIcon}
      </Avatar>
    )
  }

  function renderAvatarTitle () {
    if (editMode) {
      return null
    }
    switch (segment.type) {
      case SegmentType.PARKING_ALLOWED:
        return 'Parken erlaubt'
      case SegmentType.PARKING_TEMPORARILY_ALLOWED:
        return 'Parken temporär erlaubt'
      case SegmentType.NO_PARKING_LANE:
        return 'Keine Parkspur'
      case SegmentType.SPECIAL_USE:
        return 'Sondernutzung'
    }
    return null
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
      return (
        <CardContent>
          Edit Mode
        </CardContent>
      )
    }
  }

  function renderCardActions () {
    if (!editMode) {
      return null
    }
    return (
      <CardActions>
        <Button
          onClick={() => {
            const s = forNewSegment ? new Segment(SegmentType.SPECIAL_USE) : new Segment(SegmentType.NO_PARKING_LANE)
            onUpdated(s)
          }}
          className={classes.cardAction}
          color="primary"
          size="small"
        >
          {forNewSegment ? 'Fertig' : 'Weiter'}
        </Button>
      </CardActions>
    )
  }

  return (
    <Card className={classes.card}>
      {renderCardHeader()}
      {renderCardContent()}
      {renderCardActions()}
    </Card>
  )
}