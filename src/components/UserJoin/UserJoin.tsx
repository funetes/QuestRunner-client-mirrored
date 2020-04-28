/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { RouteComponentProps } from 'react-router-dom';
import axios from 'axios';
import ValidText from './ValidText';
import { emailRegex, initToUpper } from '../../utils';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  bg: {
    width: '100vw',
    height: '100vh',
    backgroundImage:
      'url(https://cdn.discordapp.com/attachments/696555730949373952/702072403374899260/penmon___trwyn_du___lighthouse_milky_way_galaxy_night_sky-wallpaper-1920x1080.jpg)',
    backgroundPosition: 'center center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'white',
  },
}));

const UserJoin: React.FC<RouteComponentProps> = ({ history: { push } }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState({
    emailError: '',
    passwordError: '',
    confirmPassrowdError: '',
  });
  const [isvalid, setIsValid] = useState({
    passwordValid: false,
    emailValid: false,
    password2Valid: false,
  });
  const checkEamil = (value: string, id: string) => {
    if (id === 'email') {
      const isValidEmail = emailRegex.test(value);
      if (value.length === 0) {
        setError({
          ...error,
          emailError: '',
        });
        setIsValid({
          ...isvalid,
          emailValid: true,
        });
        return;
      }
      if (isValidEmail) {
        setError({
          ...error,
          emailError: '',
        });
        setIsValid({
          ...isvalid,
          emailValid: true,
        });
      } else {
        setError({
          ...error,
          emailError: 'email is not valid',
        });
        setIsValid({
          ...isvalid,
          emailValid: false,
        });
      }
    }
  };
  const checkPassword = (value: string, id: string) => {
    if (id === 'password') {
      if (value.length === 0) {
        setError({
          ...error,
          passwordError: '',
        });
        setIsValid({
          ...isvalid,
          passwordValid: true,
        });
        return;
      }
      if (value.length < 6) {
        setError({
          ...error,
          passwordError: 'password is at leaset 6 characters',
        });
        setIsValid({
          ...isvalid,
          passwordValid: false,
        });
      } else {
        setError({
          ...error,
          passwordError: '',
        });
        setIsValid({
          ...isvalid,
          passwordValid: true,
        });
      }
    }
  };
  const checkPassword2 = (value: string, id: string) => {
    if (id === 'password2') {
      if (value.length === 0) {
        setError({
          ...error,
          confirmPassrowdError: '',
        });
        setIsValid({
          ...isvalid,
          password2Valid: true,
        });
        return;
      }
      if (value !== password) {
        setError({
          ...error,
          confirmPassrowdError: 'not same password',
        });
        setIsValid({
          ...isvalid,
          password2Valid: false,
        });
      } else {
        setIsValid({
          ...isvalid,
          password2Valid: true,
        });
      }
    }
  };
  const checkValidate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value, id },
    } = e;
    checkEamil(value, id);
    checkPassword(value, id);
    checkPassword2(value, id);
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const setName = `set${initToUpper(e.target.id)}`;
    const {
      target: { value },
    } = e;
    switch (setName) {
      case 'setEmail':
        checkValidate(e);
        setEmail(value);
        break;
      case 'setUsername':
        setUsername(value);
        break;
      case 'setPassword':
        checkValidate(e);
        setPassword(value);
        break;
      default:
        break;
    }
  };
  // axios type을 어떤식으로 해야하지?

  interface Response {
    response: number;
  }

  const onSubmit = async (e: React.FormEvent<Element>) => {
    e.preventDefault();
    const res = await axios.post<Response>('url', {
      email,
      password,
      username,
    });
    console.log(res.data.response);
    const resNumber = res.data.response;
    if (resNumber === 200) {
      push('/userLoginPage');
      console.log('successfully added');
    } else if (resNumber === 302) {
      console.log('user already exists');
    } else {
      console.log('innternal error');
    }
    // console.log(email, password, username);
    // TODO : send request
    // 200 => rediect to sign in
    // 400 => userid duplicate or else
    // 500 => internal error try again
  };

  const classes = useStyles();

  return (
    <div className={classes.bg}>
      <Container className={classes.container} component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <form className={classes.form} noValidate onSubmit={onSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="off"
                  onChange={onChange}
                />
                {!isvalid.emailValid ? (
                  <ValidText error={error.emailError} />
                ) : null}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="username"
                  label="username"
                  name="uarname"
                  autoComplete="off"
                  onChange={onChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  onChange={onChange}
                />
                {!isvalid.passwordValid ? (
                  <ValidText error={error.passwordError} />
                ) : null}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password2"
                  label="Confirm Password"
                  type="password"
                  id="password2"
                  autoComplete="confirm-password"
                  onChange={checkValidate}
                />
                {!isvalid.password2Valid ? (
                  <ValidText error={error.confirmPassrowdError} />
                ) : null}
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign Up
            </Button>
          </form>
        </div>
      </Container>
    </div>
  );
};

export default UserJoin;