/* eslint-disable no-shadow */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import {
  Grid, Paper, Popover, Typography,
} from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import AWS from 'aws-sdk';
// import dotenv from 'dotenv';
import RunnerA from '../../img/runnerA.gif';
// dotenv.config();
// require('dotenv').config();

// const { accessKeyId, secretAccessKey, bucketName } = process.env;
// accessKeyId, secretAccessKey, bucketName 값


const {ACCESSKEY_ID, SECRET_ACCESS_KEY, BUCKET_NAME} = process.env


const s3 = new AWS.S3({
  ACCESSKEY_ID,
  SECRET_ACCESS_KEY,
  useAccelerateEndpoint: false,
});

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
  },
  control: {
    backgroundColor: 'white !important',
  },
  image: {
    // height: '25vh',
    width: '10vw',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    backgroundColor: 'rgba(255,255,255,0)',
  },
  names: {
    textAlign: 'center',
    fontFamily: 'Gamja Flower, cursive',
    backgroundColor: 'rgba(255,255,255,0)',
    fontSize: '20px',
    textOverflow: 'ellipsis',
    width: '15vw',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  mottoback: {
    display: 'table',
    position: 'absolute',
    height: '50px',
    bottom: '0px',
    overflow: 'hidden',
  },
  mottos: {
    textAlign: 'center',
    fontFamily: 'Caveat, Nanum Brush Script, cursive',
    fontSize: '20px',
    width: '15vw',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  popover: {
    pointerEvents: 'none',
  },
  paper: {
    padding: theme.spacing(1),
  },
  mottolength: {
    width: 'auto',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
}));

interface threetype {
  profilePic: string;
  motto: string;
  experience: number;
  _id: string;
  username: string;
}

const TopThree: React.FC<threetype> = (props) => {
  const classes = useStyles();
  const [value, setValue] = React.useState('');
  const [mottoEl, setmottoEll] = React.useState(null);
  const [nameEl, setnameEl] = React.useState(null);

  const handlePopoverOpen = (event: any) => {
    setmottoEll(event.currentTarget);
  };

  const namehandlePopoverOpen = (event: any) => {
    setnameEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setmottoEll(null);
    setnameEl(null);

  };

  const open = Boolean(mottoEl);
  const nameopen = Boolean(nameEl);

  const getRankTop = () => {
    if (props.profilePic) {
      const params: any = {
        Bucket: BUCKET_NAME,
        Key: props._id,
      };
      s3.getObject(params, (err: AWS.AWSError, data: any) => {
        if (err) {
          return '';
        }
        const blob = new Blob([data.Body], { type: data.ContentType });
        const blobUrl = URL.createObjectURL(blob);
        setValue(blobUrl);
      });
    }
  };

  useEffect(() => {
    getRankTop();
  }, [props]);

  return (
    <div>
      <div className={classes.control}>
        {!props.profilePic ?
          <img className={classes.image} src={RunnerA} alt="" />
          : <img className={classes.image} src={value} alt="" />}
      </div>
      {!props.username ? <p /> : (
        <>
          <div
            className={classes.names}
            onMouseEnter={namehandlePopoverOpen}
            onMouseLeave={handlePopoverClose}
          >
            {props.username}
            님
          </div>
          <Popover
            id="mouse-over-popover"
            className={classes.popover}
            classes={{
              paper: classes.paper,
            }}
            open={nameopen}
            anchorEl={nameEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            onClose={handlePopoverClose}
            disableRestoreFocus
          >
            <Typography className={classes.mottolength}>
              {props.username}
            </Typography>
          </Popover>
        </>
      )}
      <div className={classes.mottoback}>
        {!props.motto ? null : (
          <div
            className={classes.mottos}
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
          >
            좌우명 :
            {props.motto}
          </div>
        )}
      </div>
      <Popover
        id="mouse-over-popover"
        className={classes.popover}
        classes={{
          paper: classes.paper,
        }}
        open={open}
        anchorEl={mottoEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography className={classes.mottolength}>
          {props.motto}
        </Typography>
      </Popover>
    </div>
  );
};

export default TopThree;
