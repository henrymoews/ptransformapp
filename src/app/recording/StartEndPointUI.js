import React from 'react'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import { makeStyles } from '@material-ui/core/styles'
import Avatar from '@material-ui/core/Avatar'
import red from '@material-ui/core/colors/red'
import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/Edit'
import FlagOutlinedIcon from '@material-ui/icons/FlagOutlined'
import FlagIcon from '@material-ui/icons/Flag';

const useStyles = makeStyles({
  card: {
    maxWidth: '90%',
    margin: '0 auto 0'
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
  avatar: {
    backgroundColor: red[500],
  },
})

export default function StartEndPointUI ({position, addressName = null, isStart = false, onEdit}) {

  const classes = useStyles()

  const flagIcon = isStart ? <FlagOutlinedIcon/> : <FlagIcon />
  const title = isStart ? 'Startpunkt' : 'Endpunkt'
  const subtitle = addressName ? 'Nahe ' + addressName : null

  return (
    <Card className={classes.card} onClick={onEdit}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            {flagIcon}
          </Avatar>
        }
        title={title}
        subheader={subtitle}
      />
    </Card>
  )

}