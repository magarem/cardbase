import type { NextPage } from "next";
import { useState, useEffect } from "react";
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CardDataService from "../services/services";
import { useRouter } from "next/router";
import Card from '../components/Card'
import { useAuth } from '../context/AuthContext'
import { Dialog, DialogContent, Link, Fab, Button, DialogActions, DialogContentText, DialogTitle, FormControl, TextField } from "@mui/material";
import React from "react";
import { SxProps } from '@mui/system';
import { ReactSortable } from "react-sortablejs";
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import { makeStyles } from '@material-ui/core/styles'

interface Props {
  setuser: Function,
  currentState2?: {
    img: string
  },
  user: {
    uid: string,
    email: string,
    displayName: string
  }
}
function Copyright(props: any) {
  return (
    <>
      <Typography mt={15} mb={10} variant="body2" component={'span'} color="text.secondary" align="center" {...props}>
        {'Copyright © '}
        <Link color="inherit" href="">
          ZenBase
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    </>
  );
}
function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
const fabStyle = {
  bottom: 40,
  right: 40,
  position: 'fixed',
};
const fabs = [{
    color: 'primary' as 'primary', sx: fabStyle as SxProps,
    icon: <CreateNewFolderIcon />, label: 'Add',
}]
interface folderItem {
  key: string;
  value: string;
  order: number;
}

const Home: NextPage<Props> = () => {

  const router = useRouter()
  const { user, setUser, flagMoveItens, foldersListUpdate } = useAuth()
  const [flgDialogSetOpen, setFlgDialogSetOpen] = React.useState(false);
  const [formCardFolder, setFormCardFolder] = useState<folderItem>({key:"", value:"", order: 0})
 
  const handleClose = (event: any, reason: string) => {
    setFlgDialogSetOpen(false);
  }
  
  const useStyles = makeStyles({
    dialog: {
      position: 'absolute',
      left: '50v',
      top: 50
    }
  });

  const classes = useStyles();

  const go = (url: string) => {
    router.push('/'+url)
  }

  const handleClickOpen = () => {
    setFormCardFolder({key: '', value: '', order: 1})
    setFlgDialogSetOpen(true);
  }

  const generateId = () => {
    return Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36)
  }

  const itemRemove = (obj: {key: string|null, value: string|null}) => { 
    if (confirm('Excluir pasta ' + obj.value + '?')){
      user.folders = user.folders.filter((item: any) => item.key !== (obj.key as any))
      save(user.folders)
      setFlgDialogSetOpen(false)
    }
  }

  const save = (data: object) => {
    CardDataService.setUserFolders(user.uid, data)
    .then((x) => {console.log("Created new item successfully!");})
    .catch((e) => {console.log(e);});
  }

  const folderAdd = () => {  
    if (formCardFolder.value){
      var array = user.folders
      if (formCardFolder.key){ // In case if a edition
        var foundIndex = array.findIndex((x: any) => x.key == formCardFolder.key);
        array[foundIndex] = formCardFolder;
      }else{ // In case if a new folder
        array = [ ...array, {key: generateId(), value: capitalizeFirstLetter(formCardFolder.value), order: new Date().getTime()} ]
      }
      console.log(array);
      // setFolders(array)
      user.folders = array
      // setFolders(array)
      setUser({...user, folders: array})
      save(array)
      setFlgDialogSetOpen(false)
    }
  }

  const itemEdit = (index: number) => {
    setFlgDialogSetOpen(true)
    console.log({key: user.folders[index].key, value: user.folders[index].value, order: user.folders[index].order});
    setFormCardFolder({key: user.folders[index].key, value: user.folders[index].value, order: user.folders[index].order})
  }
  
  const foldersListUpdate_ = (data: any) => {
    user.folders = data
    setUser({...user, folders: data})
    console.log(data);
  }

  const onDragDropEnds = (oldIndex: any, newIndex: any) => {
    if (oldIndex !== newIndex){
      console.log(user.folders);
      foldersListUpdate(user.folders)
    }
  }

  return (
    <>
     <Dialog
     classes={{
      paper: classes.dialog
    }}
      open={flgDialogSetOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      >
      <DialogTitle id="alert-dialog-title" component="span">
        Pasta
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description" component="span">
          <FormControl component="span">
            <TextField
              autoFocus
              fullWidth
              name="formCardFolder_value"
              value={formCardFolder.value}
              placeholder="Nome da nova pasta"
              onChange={(e)=>{setFormCardFolder({key: formCardFolder.key, value: e.target.value, order: formCardFolder.order})}}
              onKeyPress={(ev) => {
                console.log(`Pressed keyCode ${ev.key}`);
                if (ev.key === 'Enter') {
                  ev.preventDefault();
                  folderAdd()
                }
              }}
           />
          </FormControl>
        </DialogContentText>
      </DialogContent>
      <DialogActions style={{ justifyContent: "center" }}>
        {/* <Button variant="outlined"  onClick={() => setFlgDialogSetOpen(false)}>Cancelar</Button> */}
        {formCardFolder.key&&<Button variant="outlined" onClick={() => itemRemove(formCardFolder)} startIcon={<DeleteIcon />}>Excluir</Button>}
        <Button variant="outlined" onClick={() => folderAdd()} startIcon={<SaveIcon/>}>Salvar</Button>
      </DialogActions>
     </Dialog>
     {/* {JSON.stringify(user)} */}
     <ReactSortable 
      handle=".handle"
      className="grid-container3"
      list={user.folders.map((item: any)=>{ return {...item, id: item.key}})} 
      setList={(newlist) => foldersListUpdate_(newlist)}
      onEnd={({ oldIndex, newIndex }) => onDragDropEnds(oldIndex, newIndex)}
      >
      {user.folders.map((item: any, index: number) => {
        return (
          <Box key={item.key} >{/*className={flagMoveItens&&'handle'}*/}
            <Card 
              flagAction={flagMoveItens}
              width='170'
              title={item.value} 
              img={'https://firebasestorage.googleapis.com/v0/b/receitas-5968d.appspot.com/o/directory-150354_640.png?alt=media&token=9f7a9035-2b55-4287-a0b3-36084aeba27d'}
              // body='texto completo'
              cmdImage={()=>flagMoveItens||go(item.value)}
              cmdTitle={()=>user.isLogged&&itemEdit(index)}
            >
            </Card>
          </Box>
        )})
      }
      </ReactSortable>
      {user.isLogged&&
      <Fab sx={fabs[0].sx} aria-label={fabs[0].label} color={fabs[0].color} onClick={() => {
          handleClickOpen()
          }}>
        {fabs[0].icon}
      </Fab>
      }
      <br/><br/><br/><br/><br/><br/>
    </>
  );
};
export default Home