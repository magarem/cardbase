import React, { useEffect } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Box, Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControl, IconButton, List, ListItem, ListItemAvatar, ListItemText, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import type { NextPage } from "next";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import CardDataService from "../../services/services";
import HomeIcon from '@mui/icons-material/Home';
import { Create, DeleteForever, Folder } from "@material-ui/icons";
import { Router, useRouter } from "next/router";

import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { margin } from "@mui/system";
import '@fontsource/roboto/300.css';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FullFeaturedCrudGrid from "../../components/dataGrid"
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import FormTable from "../../components/SimpleCRUD/FormTable"
import DataGridSystem from '../../components/SimpleCRUD/DataGridSystem'
import MagaTable from '../../components/MagaTable'

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

let system = {
  tables:{
      variaveis_globais:{
          label: 'Variáveis',
          cols: [
              {name:'id', label:'id', type: 'string', hidden: true}, 
              {name:'chave', label:'Chave', type: 'string'}, 
              {name:'valor', label:'Valor', type: 'string'}, 
              {name:'imagem', label:'Imagem', type: 'file'}, 
          ]
      }
  },
  // rules: [
  //     {
  //         tabela_origem: 'users',
  //         tabela_origem_id: 'id',
  //         tabela_origem_valor:'nome',
  //         tabela_destino: 'users_groups',
  //         tabela_destino_field: 'user'
  //     },
  //     {
  //         tabela_origem: 'groups',
  //         tabela_origem_id: 'id',
  //         tabela_origem_valor:'nome',
  //         tabela_destino: 'users_groups',
  //         tabela_destino_field: 'group'
  //     }
  // ]
}

const Usersettings: NextPage = (props) => {
  const [systemState, setSystemState] = React.useState<any>(system)
  const [ret, setRet] = React.useState<any>(system.tables)
 
  const [formCardFolder, setFormCardFolder] = useState<folderItem>({key:"", value:"", order: 0})
  const { user, getFolders, setFolders } = useAuth()
  const [flgDialogSetOpen, setFlgDialogSetOpen] = React.useState(false);
  const [state, setState] = React.useState([{key:"", value:""}]);
  const router = useRouter()
  const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleCloseAlert = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
   if(!user.isLogged) router.push('/Home')
   if (user.uid){
    console.log(user.uid);
    
    CardDataService.getSettingsDefFields(user.uid)
    .then((ret_: any) => {
      console.log(ret_);
      // if (x) {
        console.log(Object.values(ret_))

        let clone: any = {...system} 
        Object.entries(ret_).map((x: any) => clone.tables[x[0]].rows = x[1])
        setSystemState({...clone})

        // setRet(Object.values(x))
        // console.log([...x.values()]);
      // }
    })
    .catch((e) => {
      console.log(e);
    });
   }
  }, [user.uid])

  const handleClickOpen = () => {
    setFormCardFolder({key: null, value: null, order: 1})
    setFlgDialogSetOpen(true);
  };

  const handleClose = () => {
    setFlgDialogSetOpen(false);
  };

  const saveDefFields = () => {
    console.log(user.uid, state);
    CardDataService.setSettingsDefFields(user.uid, ret)
    .then((x) => {
      setOpen(true)
      console.log("Created new item successfully!");
    })
    .catch((e) => {
      console.log(e);
    });
  }
  
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
  const cols: any[] = ['1', '2']
  console.log(user.username);
  const rows: any[] = [['Usuário', user.username], ['E-mail', user.email], ['UID', user.uid]]
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
      <Snackbar open={open} autoHideDuration={4000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity="success" sx={{ width: '100%' }}>
          Dados registrados com sucesso
        </Alert>
      </Snackbar>
      <Typography variant="h5" gutterBottom mt={11} ml={1} mb={2}>
        {'Configurações'}
      </Typography>
      {/* <Button onClick={handleClickOpen}><ControlPointIcon/></Button> */}
      <Container  >
      <div> 
        <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Info</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ mt: -3}}>
          <Box ml={0} >
          <MagaTable cols={cols} rows={rows}/>
        
          </Box>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Variáveis globais</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ mt: 0 }}>
          <Box ml={1} sx={{overflowY: 'auto'}}>
            {/* {JSON.stringify(state)} */}
            {/* <FullFeaturedCrudGrid width={'100%'} optColumKey user={user} stateExtra={state} setStateExtra={setState}/> */}
           {/* {JSON.stringify(ret)} */}
            <DataGridSystem user={user} system={systemState} setRet={setRet}/>
          
            <Button sx={{marginTop: 2}} onClick={saveDefFields} variant="contained">Salvar</Button>
            </Box>
        </AccordionDetails>
      </Accordion>
    </div>
       
      </Container>
    </>
  )
}

export default Usersettings