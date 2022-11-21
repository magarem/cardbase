import { DeleteForever } from "@material-ui/icons";
import { Create } from "@material-ui/icons";
import { Folder } from "@material-ui/icons";
import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, IconButton, InputAdornment,  InputLabel,  List, ListItem, ListItemAvatar, ListItemText, MenuItem, Select, TextField } from "@mui/material";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import CardDataService from "../../services/services";
import HomeIcon from '@mui/icons-material/Home';
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
  const [formCardFolder, setFormCardFolder] = useState<a>({key:"", value:"", order: 0})
  const [cardFolder, setCardFolder] = useState<a>({key:"", value:"", order: 0})
  const [operation, setOperation] = useState("Inserir")
  const { user, getFolders, setFolders, folderReload } = useAuth()
  const [open2, setOpen2] = React.useState(false);

  const handleClickOpen = () => {
    setFormCardFolder({key:"", value:"", order: 1})
    setOpen2(true);
  };

  const handleClose = () => {
    setOpen2(false);
  };
  
  const router = useRouter()

  const save = (data: object) => {
    CardDataService.setUserFolders(user.uid, data)
    .then((x) => {
      console.log("Created new item successfully!");
      console.log(x)
      // setCardFolder({key:"", value:"", order: 1});
    })
    .catch((e) => {
      console.log(e);
    });
  }

  const folderAdd = () => {
    
    if (formCardFolder.value){
      var array = getFolders()
      if (formCardFolder.key){
        var foundIndex = array.findIndex((x: any) => x.key == formCardFolder.key);
        array[foundIndex] = formCardFolder;
      }else{
        array = [...getFolders(), {key: generateId(), value: capitalizeFirstLetter(formCardFolder.value), order: new Date().getTime()} ]
      }
      console.log(array);
      setFolders(array)
      save(array)
      // folderReload()
      setOpen2(false)
    //   router.push({
    //     pathname: '/usersettings',
    //     query: { name: 'Someone' }
    // }, '/usersettings');
    }
  }
  
  const generateId = () => {
    return Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36)
  }

  const itemRemove = (index: number, name: string) => {
    if (confirm('Excluir pasta ' + name + '?')){
      console.log({name});
      
      var array = [...getFolders()]; 
      array.splice(index, 1);
      setFolders(array);
      save(array)
    }
  }

  const itemEdit = (index: number) => {
    setOpen2(true)
    setOperation('Alterar')
    setFormCardFolder({key: getFolders()[index].key, value: getFolders()[index].value, order: getFolders()[index].order})
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
              {/* <TextField name="formCardFolder_key" value={formCardFolder.key} hidden></TextField> */}
              <TextField
                name="formCardFolder_value"
                value={formCardFolder.value}
                placeholder="Nova pasta"
                onChange={(e)=>{setFormCardFolder({key: formCardFolder.key, value: e.target.value.trim().substring(0,20).replace(' ','_').normalize('NFD').replace(/[\u0300-\u036f]/g, ""), order: formCardFolder.order})}}
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
      <span style={{width:350}}>
        <List dense={true}>
          {getFolders()&&getFolders().map((item: any, index: any) => {
            return (
              <ListItem key={item.key}
                secondaryAction={
                  <>
                    <IconButton sx={{ margin: 1 }} edge="end" onClick={() => itemEdit(index)} aria-label="edit" disabled={item.key=='/'}>
                    {(item.key!='/')&&
                      <Create />
                    }
                    </IconButton>
                    <IconButton edge="end" onClick={() => itemRemove(index, item.value)} aria-label="delete" disabled={item.key=='/'}>
                    {(item.key!='/')&&
                      <DeleteForever />
                    }
                    </IconButton>
                  </>
                }>
                <ListItemAvatar >
                  <Avatar>
                    {(item.key=='/')?
                    <HomeIcon/>:
                    <Folder />
                    }
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  // onClick={() => itemEdit(index)}
                  primaryTypographyProps={{
                    fontSize: 16
                  }}
                  primary={capitalizeFirstLetter(item.value)}
                />
              </ListItem>
            )})
          }
        </List>
      </span>
    </>
  )
}

export default Usersettings