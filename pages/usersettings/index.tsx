import { DeleteForever } from "@material-ui/icons";
import { Create } from "@material-ui/icons";
import { Folder } from "@material-ui/icons";
import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, IconButton, InputAdornment,  InputLabel,  List, ListItem, ListItemAvatar, ListItemText, MenuItem, Select, TextField } from "@mui/material";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import CardDataService from "../../services/services";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useRouter } from "next/router";
import React from "react";
interface a {
  key: string;
  value: string;
  order: number;
}
let aa = 0

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const Usersettings: NextPage = (props) => {
 
  console.log(props);
  const [cardFolder, setCardFolder] = useState<a>({key:"", value:"", order: 0})
  const [state, setState] = useState<any[]>([])
  const [operation, setOperation] = useState("Inserir")
  const { user, getFolders, setFolders } = useAuth()
  const [open2, setOpen2] = React.useState(false);

  const handleClickOpen = () => {
    setCardFolder({key:"", value:"", order: 0})
    setOpen2(true);
  };

  const handleClose = () => {
    setOpen2(false);
  };
  
  const router = useRouter()

  const save = (data: object) => {
    CardDataService.addUserSettings(user.uid, data)
    .then((x) => {
      console.log("Created new item successfully!");
      console.log(x)
    })
    .catch((e) => {
      console.log(e);
    });
  }

  useEffect(() => {
    console.log(getFolders());
    setState(getFolders())
  }, [])
  
  const folderAdd = () => {
    if (cardFolder.value){
      var array = state
      if (cardFolder.key){
        var foundIndex = array.findIndex(x => x.key == cardFolder.key);
        array[foundIndex] = cardFolder;
      }else{
        var array = [{key: generateId(), value: capitalizeFirstLetter(cardFolder.value), order: new Date().getTime()}, ...state]
      }
      console.log(array);
      setState(array);
      setFolders(array)
      save(array)
      setCardFolder({key:"", value:"", order: 0});
      setOpen2(false)
      router.push({
        pathname: '/usersettings',
        query: { name: 'Someone' }
    }, '/usersettings');
    }
  }
  
  const generateId = () => {
    return Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36)
  }

  const itemRemove = (index: number) => {
    if (confirm('Excluir pasta?')){
      var array = [...state]; 
      array.splice(index, 1);
      setState(array);
      save(array)
    }
  }
  const itemEdit = (index: number) => {
    setOpen2(true)
    setOperation('Alterar')
    setCardFolder({key: state[index].key, value: state[index].value, order: state[index].order})
  }
  const handleAdd = (index: number) => {
    setOperation('Nova pasta')
    setCardFolder({key: state[index].key, value: state[index].value, order: state[index].order})
  }
  
  return (
    <>
    <Dialog
        open={open2}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Pasta"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <FormControl fullWidth>
              <TextField name="cardFolder_key" value={cardFolder.key} hidden></TextField>
              <TextField
                name="cardFolder_value"
                value={cardFolder.value}
                placeholder="Nova pasta"
                onChange={(e)=>{setCardFolder({key: cardFolder.key, value: e.target.value, order: 0})}}
              />
                </FormControl>
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={()=>setOpen2(false)}>Cancelar</Button>
                <Button onClick={()=>folderAdd()}>Salvar</Button>
              </DialogActions>
            </Dialog>
        <h3>{'Configurações de usuário > Pastas'}</h3><br/>
        <Button onClick={handleClickOpen}>Nova pasta</Button>
        <div style={{width:350}}>
          <List dense={true}>
            {state&&state.map((item, index) => {
              return (
                  <ListItem key={item.key}
                    secondaryAction={
                      <>
                        <IconButton sx={{ margin: 1 }} edge="end" onClick={() => itemEdit(index)} aria-label="edit">
                          <Create />
                        </IconButton>
                        <IconButton edge="end" onClick={() => itemRemove(index)} aria-label="delete">
                          <DeleteForever />
                        </IconButton>
                      </>
                    }>
                    <ListItemAvatar >
                      <Avatar>
                        <Folder />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      onClick={() => itemEdit(index)}
                      primaryTypographyProps={{
                        fontSize: 16
                      }}
                      primary={item.value}
                    />
                  </ListItem>
              )})
            }
          </List>
          </div>
    </>
  )
}

export default Usersettings