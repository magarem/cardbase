import type { NextPage } from "next";
import { useEffect, useState, useRef } from "react";
import { useRouter } from 'next/router'
import { Accordion, AccordionDetails, AccordionSummary, BottomNavigation, BottomNavigationAction, Button, Card, CardMedia, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormControlLabel, FormLabel, IconButton, InputAdornment, InputLabel, Link, MenuItem, OutlinedInput, Paper, Radio, RadioGroup, Select, Typography } from "@mui/material";
import CardDataService from "../../../services/services";
import Upload from '../../../components/Upload'
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { useAuth } from '../../../context/AuthContext'
import Box from '@mui/material/Box';
import AlertDialog from '../../../components/AlertDialog'
import React from 'react';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
const ReactQuill = typeof window === 'object' ? require('react-quill') : () => false;
import { TagsInput } from "react-tag-input-component";
import FullFeaturedCrudGrid from "../../../components/dataGrid"
import MagaTabs from "../../../components/Tabs"
import { VisibilityOff, Visibility } from "@material-ui/icons";
import HighlightOff from '@mui/icons-material/HighlightOff';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
interface Props {
  setuser: Function,
  user: {
    uid: string,
    email: string
  }
}
interface Obj1 {
  [x: string]: any;
  id: any;
  card_id: any;
  img: any; 
  folder: string,
  title: string;
  body: string;
  order: number;
}

interface Obj2 {
  id: any,
  key: any;
  value: any;
}
const Create: NextPage<Props> = (props) => {
  const { user, getFolderKeyByValue, getFolders } = useAuth()
  const [desableSaveButton, setDesableSaveButton] = useState(false);
  const [bodyValue, setBodyValue] = useState('');
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);

  const [selected, setSelected] = useState<string[]>([]);
  
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const router = useRouter()
  let folder = router.query.folder
  if (folder == 'usersettings') folder = 'Home'
  const original_card_id = router.query.id
  const id = router.query.id

  const [uploadRefresh, setUploadRefresh] = useState(0);
  const cardObj = {id: "", card_id: "", img: [{}], folder: "", title: "", body: "", tags: "", order: -1 };
  const [state, setState] = useState<Obj1>(cardObj)
  const [stateFolder, setStateFolder] = useState([{key: String, value: String}])
  const [mostra, setMostra] = useState(false)
  
  const tblObj: Obj2[] | (() => Obj2[] | undefined) | undefined = [];
  const tblObj2: Obj2[] = [{id:0, key:'', value:''}];
  const [stateExtra, setStateExtra] = React.useState<Obj2[]| undefined>(tblObj)
  const [stateImg, setStateImg] = React.useState<Obj2[]>(tblObj2)

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    handleClose()
    const { name, value } = e.target;
    console.log(name, value)
    setState(prevState => ({
      ...prevState,
      [name]: value
    }));
    console.log(state)
    if (name == 'folder') {
      const innerText = getFolders().find((item: { key: any; }) => item.key === value)?.value
      console.log('inner text: ', innerText);
      // router.push( '/' + innerText + '/' + id + '/edit' )
      router.push(`/${innerText}/${id}/edit`)
    }
    if (name == 'card_id') {
      setState({...state, card_id: value.substring(0,30).replaceAll(' ','_').normalize('NFD').replace(/[\u0300-\u036f]/g, "")})// + '-' + new Date().getTime()
      console.log('inner text: ', state.card_id);
      // router.push( '/' + innerText + '/' + id + '/edit' )
      state.card_id = '111'
     
    }
    if (name == 'title') {
      state.title = value.substring(0,30)
     
    }
    if (name == 'title' && router.query.id=='new') {
      state.card_id = value.substring(0,30).replaceAll(' ','_').normalize('NFD').replace(/[\u0300-\u036f]/g, "")// + '-' + new Date().getTime()
      console.log('inner text: ', state.card_id);
      // router.push( '/' + innerText + '/' + id + '/edit' )
     
    }
  };
  
  const saveCard = () => {
    setDesableSaveButton(true)
    let data = { img: stateImg, folder: state.folder, title: state.title, body: bodyValue, tags: selected.toString(), extra: stateExtra, order: -1 };
    console.log({data});
    const timestamp = new Date().getTime()
    let card_id = state.card_id
    if (card_id == '') card_id = timestamp.toString()
    CardDataService.setCard(user.uid, card_id, data)
      .then((x) => {
        console.log("Created new item successfully!");
        setMostra(true)
        setTimeout(() => { setMostra(false) }, 1000)
        setState(cardObj)
        setBodyValue('')
        setDesableSaveButton(false)
        router.push(`/${folder}`)
      })
      .catch((e) => {
        console.log(e);
      });
  }
  
  const updateCard = () => {
    setDesableSaveButton(true)
    let data = {
      img: stateImg,
      title: state.title,
      folder: state.folder,
      body: bodyValue||'',
      order: state.order,
      tags: selected.toString(),
      extra: stateExtra
    };

    console.log(user.uid, data)

    if (state.card_id == original_card_id) {
      CardDataService.update(user.uid, state.card_id, {...data})
        .then((x) => {
          console.log("Update item successfully!");
          console.log(x)
          setUploadRefresh(uploadRefresh + 1)
          setMostra(true)
          setTimeout(() => {
            setMostra(false)
          }, 1000)
          setDesableSaveButton(false)
          router.push(`/${folder}`)
        })
        .catch((e) => {
          console.log(e);
        });
      }else{
        saveCard()
        CardDataService.delete(user.uid, original_card_id as string)
      }
  }

  const clearField = (field: string) => {
    setState({...state, [field]: ''})
  }

  useEffect(() => {
    if (user.uid) {
    console.log(router.query.id);
    const folder_key = getFolderKeyByValue(folder)
    setState({...state, folder: folder_key})
    if (id!=='new'){
      CardDataService.readById(user.uid, router.query.id as string).then((data) => {
        console.log(data)
        if (data) {
          setState({ id: router.query.id, card_id: router.query.id, folder: folder_key, title: data.title, body: data.body, img: data.img, order: data.order })
          if (data.img=='') data.img = []
          if (!Array.isArray(data.img)) data.img = [{value:data.img}]
          
          setStateImg(data.img)
          setBodyValue(data.body)
          setSelected(data.tags?.split(','))
          if (!data.extra) data.extra = [{key: "", value: ""}] 
          setStateExtra(data.extra)

        }
      })
    }
  }
  }, [user])

  const handleChange2 =
  (prop: keyof Obj1) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [prop]: event.target.value });
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        >
        <DialogTitle id="alert-dialog-title">
          {"Selecione a nova pasta"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Pasta</InputLabel>
              <Select
                fullWidth
                name="folder"
                defaultValue="/"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={state.folder}
                label="Pasta"
                onChange={handleChange}>
                  {getFolders().map((item: any)=>{
                    return (
                      <MenuItem key={item.key} value={item.key}>{item.value}</MenuItem>
                    )
                  })}
              </Select>
            </FormControl>
          </DialogContentText>
        </DialogContent>
      </Dialog>
      {/* <main className="py-10"> */}
        <AlertDialog time title="" body="" img="/static/ok.png" mostra={mostra} setMostra={setMostra}/>
        {/* {state.id?<h2 style={{marginLeft:20, marginTop:100}}>Editar</h2>:<h2>Criar</h2>}<br/> */}
      {/* </main> */}
      <Typography variant="h5" gutterBottom mt={11} ml={1} mb={3}>
        {/* <Link onClick={()=>router.push('/'+folder)} underline="hover">{folder}</Link>{' › '} <Link onClick={()=>router.push('/'+folder+'/'+state.card_id)} underline="hover">{state.title.substring(0,100)}</Link> {' › '} {state.id?<span>[Editar]</span>:<span>[Criar]</span>} */}
        <Link onClick={()=>router.push('/'+folder)} underline="hover">{folder}</Link>{' › '} {state.title.substring(0,100)} {' › '} {state.id?<span>[Editar]</span>:<span>[Criar]</span>}
      </Typography>
      <MagaTabs>
        <div data-tab="tab1">
          <TextField 
              id="outlined-basic"
              name="title"
              label="Titulo"
              variant="outlined"
              onChange={handleChange}
              value={state.title.substring(0,100)}
            /><br/><br/>
              <ReactQuill theme="snow" value={bodyValue} onChange={setBodyValue} />
        <Box sx={{ marginTop: 2, marginLeft: 0,  marginRight: 0}}>

              <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Extra</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ marginTop: 0, marginLeft: 0,  marginRight: 0}}>
                <FullFeaturedCrudGrid width={800} optColumKey user={user} stateExtra={stateExtra} setStateExtra={setStateExtra}/>
        </AccordionDetails>
      </Accordion>
      </Box>
            
        <br/>
        </div>
        <div data-tab="tab2">
          <Box sx={{ width: 760 }}>
            <FullFeaturedCrudGrid width={760} user={user} optColumKey={false} stateExtra={stateImg} setStateExtra={setStateImg}/>
          </Box>
        </div>
        <div data-tab="tab3">
          <TagsInput
              value={selected}
              onChange={setSelected}
              name="tags"
              placeHolder="Etiquetas"
            />
            <TextField
              name="order"
              label="Order"
              onChange={handleChange}
              value={state.order}
              hidden
            /><br/>
          <TextField 
              id="outlined-basic"
              name="card_id"
              label="Código"
              variant="outlined"
              onChange={handleChange}
              value={state.card_id}
            />
            <br/><br/>
            <Button style={{width: 233, height: 50}} variant="outlined" onClick={handleClickOpen}>
              {folder}
            </Button>
        </div>
      </MagaTabs>
      <br/><br/><br/><br/><br/>
      <Paper sx={{ paddingTop: '10px', bgcolor: '#000000', position: 'fixed', bottom: 0, left: 0, right: 0  }} elevation={3}>
        <BottomNavigation sx={{ 
          bgcolor: '#121212',
            '& .Mui-selected': {
              '& .MuiBottomNavigationAction-label': {
                fontSize: theme => theme.typography.caption,
                transition: 'none',
                fontWeight: 'bold',
                lineHeight: '20px'
              },
              '& .MuiSvgIcon-root, & .MuiBottomNavigationAction-label': {
                color: theme => theme.palette.secondary.main
              }
            }
          }}
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
          >
          <BottomNavigationAction label="Salvar" disabled={desableSaveButton} onClick={state.id?updateCard:saveCard} icon={<SaveAltIcon />} />
          <BottomNavigationAction label="Voltar" onClick={() => router.back()} icon={<ArrowBackIcon />} />
        </BottomNavigation>
        <br/>
      </Paper>
    </div>
  );
} 

export default Create;

// export async function getServerSideProps(context) {
//   if (!context.req.cookies['user']) {
//     const { res } = context;
//     res.setHeader("location", "/Login");
//     res.statusCode = 302;
//     res.end();
//     return;
//   }
//   return {
//     props: { user: JSON.parse(context.req.cookies['user']) }, // will be passed to the page component as props
//   }
// }