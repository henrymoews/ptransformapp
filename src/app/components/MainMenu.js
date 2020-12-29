import React from 'react'

import './components.css'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'

import Typography from '@material-ui/core/Typography'

import LoginForm from './LoginForm'
import { getUserDataFromCookie } from '../../helpers/auth'
import TemporaryDrawer from './Drawer'

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

function MainMenu() {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [loginModalOpen, setLoginModalOpen] = React.useState(false)
  const userData = getUserDataFromCookie()

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <AppBar position='static'>
      <Toolbar>
        <TemporaryDrawer />
        <LoginForm open={loginModalOpen} setOpen={setLoginModalOpen} />

        <Typography variant='h6' className={classes.title}>
          ParkplatzTransform
        </Typography>
        {!userData.loggedIn && (
          <Button color='inherit' onClick={() => setLoginModalOpen(true)}>
            Login
          </Button>
        )}
        {userData.loggedIn && userData.email}
      </Toolbar>
    </AppBar>
  )
}

export default MainMenu
