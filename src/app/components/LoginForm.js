import React from 'react';
import { useMutate } from 'restful-react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { routes, headers } from '../../api'

const FORM_STATE = Object.freeze({
  INITIAL: Symbol('INITIAL'),
  FAILURE: Symbol('FAILURE'),
  SUCCESS: Symbol('RECORDING')
})

export default function LoginForm({ open, setOpen }) {
  const [email, setEmail] = React.useState('')
  const [formState, setFormState] = React.useState(FORM_STATE.INITIAL)
  const { mutate } = useMutate({
    verb: 'POST',
    path: routes.users,
    headers: headers.contentJSON
  });

  const requestMagicLink = () => {
    mutate({ email }).catch((error) => {
      console.error(error)
      setFormState(FORM_STATE.FAILURE)
    }).then((response) => {
      if (response?.email) {
        setFormState(FORM_STATE.SUCCESS)
      } else {
        setFormState(FORM_STATE.FAILURE)
      }
    })
  }

  function renderInitial() {
    return (
      <React.Fragment>
        <DialogTitle id="form-dialog-title">Login</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To login to ParkplatzTransform, please enter your email address here.
          </DialogContentText>
          <TextField
            error={(email.length && !email.includes('@'))}
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            value={email}
            onChange={(event) => setEmail(event.currentTarget.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={requestMagicLink} color="primary" disabled={!(email.length && email.includes('@'))}>
            Request Link
          </Button>
        </DialogActions>
      </React.Fragment>
    );
  }

  function renderSuccess() {
    return (
      <div>
        <DialogTitle id="form-dialog-title">Success</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You will receive an email to {email} shortly. Please click the link in the email to complete the verification process. You can close this modal.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { 
            setOpen(false) 
            setFormState(FORM_STATE.INITIAL)
          }} color="primary">
            Done
          </Button>
        </DialogActions>
      </div>
    )
  }
  
  function renderFailure() {
    return (
      <div>
        <DialogTitle id="form-dialog-title">Verification Failed</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please check the email and try again. During development, emails need to be manually whitelisted before you can verify yourself.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormState(FORM_STATE.INITIAL)} color="primary">
            Try again
          </Button>
        </DialogActions>
      </div>
    )
  }

  const views = {
    [FORM_STATE.INITIAL]: renderInitial,
    [FORM_STATE.SUCCESS]: renderSuccess,
    [FORM_STATE.FAILURE]: renderFailure,
  }

  return (
    <div>
      <Dialog open={open} onClose={() => setOpen(false)} aria-labelledby="form-dialog-title">
        {views[formState]()}
      </Dialog>
    </div>
  )
}
