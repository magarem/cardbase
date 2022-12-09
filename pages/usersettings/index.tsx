import React from "react";
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Box, Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControl, IconButton, List, ListItem, ListItemAvatar, ListItemText, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import type { NextPage } from "next";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import CardDataService from "../../services/services";
import HomeIcon from '@mui/icons-material/Home';
import { Create, DeleteForever, Folder } from "@material-ui/icons";
import router from "next/router";
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { margin } from "@mui/system";
import '@fontsource/roboto/300.css';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

interface folderItem {
  key: string | null;
  value: string | null;
  order: number;
}

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const Usersettings: NextPage = (props) => {
 
  const [formCardFolder, setFormCardFolder] = useState<folderItem>({key:"", value:"", order: 0})
  const { user, getFolders, setFolders } = useAuth()
  const [flgDialogSetOpen, setFlgDialogSetOpen] = React.useState(false);

  const handleClickOpen = () => {
    setFormCardFolder({key: null, value: null, order: 1})
    setFlgDialogSetOpen(true);
  };

  const handleClose = () => {
    setFlgDialogSetOpen(false);
  };
  
  const save = (data: object) => {
    CardDataService.setUserFolders(user.uid, data)
    .then((x) => {
      console.log("Created new item successfully!");
    })
    .catch((e) => {
      console.log(e);
    });
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
      save(array)
      setFlgDialogSetOpen(false)
    }
  }
  
  const generateId = () => {
    return Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36)
  }

  // const itemRemove = (index: number, name: string) => {
  //   if (confirm('Excluir pasta ' + name + '?')){
  //     var array = [...user.folders]; 
  //     array.splice(index, 1);
  //     user.folders = array
  //     // setFolders(array);
  //     save(array)
  //   }
  // }
  
  const itemRemove = (obj: {key: string|null, value: string|null}) => {
    
    if (confirm('Excluir pasta ' + obj.value + '?')){
      user.folders = user.folders.filter((item: any) => item.key !== (obj.key as any))
      save(user.folders)
      setFlgDialogSetOpen(false)
    }
  }

  const itemEdit = (index: number) => {
    setFlgDialogSetOpen(true)
    // setOperation('Alterar')
    setFormCardFolder({key: user.folders[index].key, value: user.folders[index].value, order: user.folders[index].order})
  }
  return (
    <>
      <Dialog
        open={flgDialogSetOpen}
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
              <TextField
                name="formCardFolder_value"
                value={formCardFolder.value}
                placeholder="Nova pasta"
                onChange={(e)=>{setFormCardFolder({key: formCardFolder.key, value: e.target.value.substring(0,28).replace(' ','_').normalize('NFD').replace(/[\u0300-\u036f]/g, ""), order: formCardFolder.order})}}
              />
            </FormControl>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFlgDialogSetOpen(false)}>Cancelar</Button>
          {formCardFolder.key&&<Button onClick={() => itemRemove(formCardFolder)}>Excluir</Button>}
          <Button onClick={() => folderAdd()}>Salvar</Button>
        </DialogActions>
      </Dialog>

      <Typography variant="h5" gutterBottom mt={11} ml={1} mb={2}>
        {'Configurações'}
      </Typography>
      {/* <Button onClick={handleClickOpen}><ControlPointIcon/></Button> */}
      <Container  >
      <div>
      <Accordion>
        {/* <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Definições</Typography>
        </AccordionSummary> */}
        <AccordionDetails sx={{ mt: 0 }}>
          <Box ml={1} >
          {/* <FullFeaturedCrudGrid width={800} optColumKey user={user} stateExtra={stateExtra} setStateExtra={setStateExtra}/> */}

            {/* <TextField id="outlined-basic" label="Logotipo" variant="outlined" sx={{mr:5}} />
            <TextField id="outlined-basic" label="Logotipo" variant="outlined" />
            <TextField id="outlined-basic" label="Logotipo" variant="outlined" /><br/><br/> */}
          </Box>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography>Pastas</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ mt: -2 }}>
          <List dense={true}>
            {user.folders&&user.folders.map((item: any, index: any) => {
              return (
                <ListItem key={item.key} sx={{ mb: .5 }}>
                  <ListItemAvatar >
                    <Avatar>
                      {(item.key=='/')?
                      <HomeIcon/>:
                      <Folder  onClick={() => itemEdit(index)}/>
                      }
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    // onClick={() => itemEdit(index)}
                    onClick={()=>router.push('/'+item.value)}
                    primaryTypographyProps={{
                      fontSize: 16
                    }}
                    primary={capitalizeFirstLetter(item.value)}
                  />
                </ListItem>
              )})
            }
            <ListItem key='novo' sx={{ mb: .5 }}>
              <ListItemAvatar >
                <Avatar>
                  <ControlPointIcon onClick={handleClickOpen}/>
                </Avatar>
              </ListItemAvatar>
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>
    </div>
       
      </Container>
    </>
  )
}

export default Usersettings