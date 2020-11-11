import React, { useState } from 'react'

import { BrowserRouter as Router, Route } from 'react-router-dom'
import './App.css'
import PTMap from './map/PTMap'
import { STEPS } from './recording/Steps'
import Paper from '@material-ui/core/Paper'
import MapOverlay from './map/MapOverlay'
import Button from '@material-ui/core/Button'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import { makeStyles } from '@material-ui/core/styles'

import Recording from './recording/Recording'
import MainMenu from './components/MainMenu'
import Wellcome from './components/Wellcome'

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

function App() {

  const [appState, setAppState] = useState(APP_STATE.RECORDING)

  function renderAppState() {
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
      <Router>
        <Route path='/' component={MainMenu} />

        <Route path='/wellcome' component={Wellcome} />

        <Route exact path='/'>
          {renderAppState()}
        </Route>




      </Router>

    </div>
  )
}

export default App
