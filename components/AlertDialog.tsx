import * as React from 'react';
import { SetStateAction } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
// import { IconName } from "react-icons/fc";
import { useEffect } from 'react';
// FcOk
import Image from 'next/image'

interface a {
  img: string
}

interface main {
  img: string;
  title: string;
  body: string;
  time: boolean;
  mostra: boolean;
  setMostra: (mostra: boolean) => void;
}

function ShowOk(props: a) {
  return <Image src={props.img}  />
}

export default function AlertDialog(props: main) {
 
  const handleClose = () => {
    props.setMostra(false)
  };

  useEffect(() => {
    if (props.time && !props.mostra){
      console.log('time to close')
      setTimeout(() => {
        props.setMostra(false)
      }, 4000)
    }
  }, [props])

  return (
    <div>
      <Dialog
        open={props.mostra}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description" >
        {/* <DialogTitle id="alert-dialog-title">
            {props.title}
        </DialogTitle> */}
        <DialogContent>
          {props.img &&
          <DialogContentText id="alert-dialog-description">
            <Image src={props.img} width="100" height="100"/>
          </DialogContentText>
          }
          {props.body &&
            <DialogContentText id="alert-dialog-description">
              {props.body}
            </DialogContentText>
          }
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={handleClose} autoFocus>
            Agree
          </Button>
        </DialogActions> */}
      </Dialog>
    </div>
  );
}
