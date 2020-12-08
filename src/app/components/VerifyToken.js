
import React from 'react';
import { useGet } from 'restful-react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

import { routes } from '../../api'
import { setAuthCookie } from '../../helpers/auth'
import { useLocation, Redirect } from 'react-router-dom'

function useQueryParams() {
  const params = new URLSearchParams(useLocation().search)
  const email = params.get('email')
  const code = params.get('code')

  return { email, code }
}

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    width: '100%',
    height: '100vh',
    justifyContent: 'center',
    alignItems: 'center',
    '& > * + *': {
      marginLeft: theme.spacing(3),
    }
  },
}));


export default function VerifyToken() {
  const [hasVerified, setHasVerified] = React.useState(false)
  const { email, code } = useQueryParams()
  const classes = useStyles()
  const { data, loading, error } = useGet({ 
    path: routes.usersVerify,
    queryParams: { email, code }
  })
  
  if (data?.access_token && !loading && !error && !hasVerified) {
    setAuthCookie(data.access_token)
    setHasVerified(true)
  }

  return (
    <div className={classes.container}>
    {loading && <React.Fragment><CircularProgress /><p>Verifying {email}</p></React.Fragment>}
    {error && <React.Fragment><p>Verification Failed</p></React.Fragment>}
    {hasVerified && <Redirect to="/" />}
    </div>
  );
}
