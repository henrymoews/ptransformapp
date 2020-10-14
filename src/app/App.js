import React, { useState } from 'react'
import './App.css'
import PTMap from './map/PTMap'
import { STEPS } from './recording/Steps'
import Paper from '@material-ui/core/Paper'
import MapOverlay from './map/MapOverlay'
import Button from '@material-ui/core/Button'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import MenuIcon from '@material-ui/icons/Menu'
import Recording from './recording/Recording'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}))


const APP_STATE = Object.freeze({
  RECORDING: Symbol('RECORDING')
})

function App () {

  const [appState, setAppState] = useState(APP_STATE.RECORDING)

  function renderAppState () {
    switch (appState) {
      case APP_STATE.RECORDING:
        return <Recording />

      default:
        return 'Not yet implemented'
    }
  }

  const classes = useStyles()
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon/>
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            ParkplatzTransform
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
      {renderAppState()}
    </div>
  )
}

export default App
