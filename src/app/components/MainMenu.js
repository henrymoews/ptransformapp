import React from 'react'
import { NavLink } from 'react-router-dom'

import './components.css'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import MenuIcon from '@material-ui/icons/Menu'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import LoginForm from './LoginForm'
import { getUserDataFromCookie } from '../../helpers/auth'


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
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
          <MenuIcon />
        </IconButton>
        <LoginForm open={loginModalOpen} setOpen={setLoginModalOpen} />
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>
          <NavLink  activeClassName="is-active" to="/">
            Home
          </NavLink>
          </MenuItem>
          <MenuItem onClick={handleClose}><NavLink activeClassName="is-active" to="/welcome">
            Welcome
            </NavLink></MenuItem>
          <MenuItem onClick={handleClose}><NavLink activeClassName="is-active" to="/about">
           About
            </NavLink></MenuItem>
        </Menu>
        <Typography variant="h6" className={classes.title}>
          ParkplatzTransform
        </Typography>
        {!userData.loggedIn && <Button color="inherit" onClick={() => setLoginModalOpen(true)}>Login</Button>}
        {userData.loggedIn && userData.email}
      </Toolbar>
    </AppBar>
  );
}

export default MainMenu;
