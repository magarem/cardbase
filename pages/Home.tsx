import type { NextPage } from "next";
import { useState, useEffect } from "react";
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CardDataService from "../services/services";
import { useRouter } from "next/router";
import Card from '../components/Card'
import { useAuth } from '../context/AuthContext'
import { Dialog, DialogContent, Grid, Link, Fab, Button, DialogActions, DialogContentText, DialogTitle, FormControl, TextField } from "@mui/material";
import React from "react";
import AddIcon from '@mui/icons-material/Add';
import { SxProps } from '@mui/system';
import { ReactSortable } from "react-sortablejs";
import { AnyMxRecord } from "dns";
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import OpenWithIcon from '@mui/icons-material/OpenWith';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
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

type ss = {
  id?: any;
  img?: string;
  folder?: string;
  title?: string;
  body?: string;
  type?: string;
  order?: number
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
  key: string | null;
  value: string | null;
  order: number;
}
const Home: NextPage<Props> = () => {
  const router = useRouter()
  const { user, flagMoveItens, setFlagMoveItens, folderReload, getUserFolders, foldersListUpdate, folderReloadByGuest } = useAuth()
  // let folder = router.query.folder
  console.log({user});
  const [open, setOpen] = useState(false);
  const [flgDialogSetOpen, setFlgDialogSetOpen] = React.useState(false);
 
  const handleOpen = (obj: ss) => {
    // router.push("/" + folder + "/" + obj.id)
  }

  // const handleClose = () => setOpen(false);
  const handleClose = (event: any, reason: string) => {
    setFlgDialogSetOpen(false);
}
  const [currentState, setCurrentState] = useState<ss[]>([]);
  const [currentState2, setCurrentState2] = useState<ss>();
  const [userDataByGuest, setUserDataByGuest] = useState({});
  const [folders, setFolders] = useState<folderItem[]>([]);
  const [formCardFolder, setFormCardFolder] = useState<folderItem>({key:"", value:"", order: 0})

  const go = (url: string) => {
    router.push('/'+url)
  }

  const handleClickOpen = () => {
    setFormCardFolder({key: null, value: null, order: 1})
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
      setFolders(array)
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
    // data = [{id:'/', key:'/', value: 'Home'}, ...data]
    user.folders = data
    setFolders(data)
    console.log(data);
  }

  React.useEffect(() => {
    if (user.uid) folderReload()
  },[]) 

  React.useEffect(() => {
    if (user.uid) setFolders(user.folders)
  },[user.folders]) 

  const onDragDropEnds = (oldIndex: any, newIndex: any) => {
    if (oldIndex !== newIndex){
      console.log(folders);
      foldersListUpdate(folders)
    }
  }

  const mw = currentState2?.img ? "md" : "sm"
  // if (folder=='Home') folder='Início'
  return (
    <>
      <Dialog
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
                placeholder="Nova pasta"
                onChange={(e)=>{setFormCardFolder({key: formCardFolder.key, value: e.target.value.substring(0,28).replace(' ','_').normalize('NFD').replace(/[\u0300-\u036f]/g, ""), order: formCardFolder.order})}}
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
      {/* {JSON.stringify(user)}<br/>
      {JSON.stringify(stateFolder)} */}
       {/* <Typography variant="h5" gutterBottom mt={11} ml={0} mb={2}>
         Início
       </Typography> */}
       {/* <Box className="grid-container3"> */}
     {/* {JSON.stringify(user.folders)} */}
     
     {/* {JSON.stringify(user.folders)} */}
     <br/>
     {/* {JSON.stringify(flagMoveItens)} */}
     <ReactSortable 
      handle=".handle"
      className="grid-container3"
      list={folders.map((item: any)=>{ return {...item, id: item.key}})} 
      setList={(newlist) => foldersListUpdate_(newlist)}
      onEnd={({ oldIndex, newIndex }) => onDragDropEnds(oldIndex, newIndex)}
      >
      {folders.map((item: any, index: number) => {
        return (
          <Box key={item.key} >{/*className={flagMoveItens&&'handle'}*/}
            {/* <div className="container"> */}
            <Card 
              flagAction={flagMoveItens}
              // cls={flagMoveItens&&'trimiliqui'}
              // sx_={flagMoveItens&&{border: 2, borderColor: 'orange', borderRadius: '10px'}}
              width='170'
              title={item.value} 
              img={'https://firebasestorage.googleapis.com/v0/b/receitas-5968d.appspot.com/o/directory-150354_640.png?alt=media&token=9f7a9035-2b55-4287-a0b3-36084aeba27d'}
              // body='texto completo'
              cmdImage={()=>flagMoveItens||go(item.value)}
              cmdTitle={()=>flagMoveItens||itemEdit(index)}
            >
            </Card>
            {/* <IconButton className={flagMoveItens?'btnHandleDrag handle':'btnHandleDrag hide'}><OpenWithIcon /></IconButton></div> */}
          </Box>
        )})
      }
      </ReactSortable>
     {/* </Box> */}
      {/* {JSON.stringify(currentState)} */}
      {/* <CardsGrid user={user} handleOpen={handleOpen} currentState={currentState} setCurrentState={setCurrentState} /> */}
      {user.isLogged&&
      <>
      <Fab sx={fabs[0].sx} aria-label={fabs[0].label} color={fabs[0].color} onClick={() => {
          handleClickOpen()
          }}>
        {fabs[0].icon}
      </Fab>
      </>}
      <br/><br/><br/><br/><br/><br/>
      {/* <Copyright /> */}
    </>
  );
};
export default Home