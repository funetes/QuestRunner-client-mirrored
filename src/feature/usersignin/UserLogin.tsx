/* eslint-disable max-len */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
// eslint-disable-next-line no-unused-vars
import { RouteComponentProps } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { Snackbar } from '@material-ui/core';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import Image from '../../img/penmon.jpg';
import { RootState } from '..';
import { userLoginActions } from './userloginService';
import { storeActions } from '../store/storeService';
import { emailRegex, serverHttp } from '../common/utils';
import ValidText from '../userjoin/ValidText';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(25),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)',
    padding: '10%',
  },
  drawerPaper: {
    width: '100vw',
    height: '100vh',
    backgroundSize: 'cover',
    backgroundImage: `url(${Image})`,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  signUp: {
    marginTop: theme.spacing(2),
  },
  signUpButton: {
    color: 'rgba(70,70,70,0.9)',
  },
}));

function Alert(props: AlertProps) {
  return <MuiAlert elevation={3} variant="filled" {...props} />;
}

const UserLogin: React.FC<RouteComponentProps> = ({
  history: { push },
  location,
}) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [form, setValues] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState({
    emailError: '',
    clickError: '',
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const success: any = location.state;
  const changeUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError({ ...error, clickError: '' });
    setValues({ ...form, [e.target.id]: e.target.value });
    const isValidEmail = emailRegex.test(e.target.value);
    if (e.target.id === 'email') {
      if (!isValidEmail) {
        setError({
          ...error,
          emailError: 'email is not valid',
        });
      } else {
        setError({
          ...error,
          emailError: '',
        });
      }
    }
  };

  const submitClick = (e: React.FormEvent<Element>) => {
    e.preventDefault();
    // eslint-disable-next-line no-empty
    if (
      form.email.length === 0 ||
      form.password.length === 0 ||
      error.emailError.length !== 0
    ) {
      setError({
        ...error,
        clickError: 'please fill this form',
      });
    } else {
      axios
        .post(`${serverHttp}/userlogin`, {
          email: form.email,
          password: form.password,
        })
        .then((response) => {
          dispatch(
            userLoginActions.setLogin({
              isLogin: true,
              accessToken: response.data.accessToken,
              refreshToken: response.data.refreshToken,
            }),
          );
          return response.data;
        })
        .then((token) => {
          axios
            .get(`${serverHttp}/userinfo`, {
              headers: {
                Authorization: token.accessToken,
              },
            })
            .then((response) =>
              dispatch(userLoginActions.setUser({ user: response.data })),
            );
        })
        .then(() =>
          axios.get(`${serverHttp}/items/storeItems`).then((response) =>
            dispatch(
              storeActions.setStore({
                background: response.data.background,
                exp_bar: response.data.exp_bar,
                darkmode: response.data.darkmode,
              }),
            ),
          ),
        )
        .then(() => {
          setTimeout(() => push('/mainPage'), 1000);
        })
        .catch((err) => {
          setError({
            ...error,
            clickError: 'Incorrect email or password!',
          });
        });
    }
  };
  const handleCloseSnackbarFromLogin = () => {
    setOpenSnackbar(false);
  };

  useEffect(() => {
    if (success?.success === true) {
      setOpenSnackbar(true);
    }
  }, []);
  return (
    <div className={classes.drawerPaper}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Quest Runner
          </Typography>
          <form className={classes.form} noValidate onSubmit={submitClick}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="off"
                onChange={changeUser}
              />
              <ValidText error={error.emailError} />
            </Grid>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              id="password"
              onChange={changeUser}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              // color="text.disabled"
            >
              Sign In
            </Button>
            <ValidText error={error.clickError} />
            <Grid className={classes.signUp} container>
              <Grid item xs />
              <Grid item>
                <Button
                  className={classes.signUpButton}
                  onClick={() => {
                    push('/join');
                  }}
                >
                  Don't have an account? Sign Up
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbarFromLogin}
      >
        <Alert onClose={handleCloseSnackbarFromLogin} severity="success">
          successfuly registered. login please.
        </Alert>
      </Snackbar>
    </div>
  );
};

export default UserLogin;
