import type { NextPage } from "next";
import { useEffect, useState, useRef } from "react";
import { useRouter } from 'next/router'
import { Accordion, AccordionDetails, AccordionSummary, BottomNavigation, BottomNavigationAction, Button, Card, CardMedia, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormControlLabel, FormLabel, IconButton, InputAdornment, InputLabel, Link, MenuItem, OutlinedInput, Paper, Radio, RadioGroup, Select, Snackbar, Typography } from "@mui/material";
import CardDataService from "../../../services/services";
import Upload from '../../../components/Upload'
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { useAuth } from '../../../context/AuthContext'
import Box from '@mui/material/Box';
import AlertDialog from '../../../components/AlertDialog'
import React from 'react';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
const ReactQuill = typeof window === 'object' ? require('react-quill') : () => false;
// import { TagsInput } from "react-tag-input-component";
import FullFeaturedCrudGrid from "../../../components/dataGrid"
import MagaTabs from "../../../components/Tabs"
import { VisibilityOff, Visibility } from "@material-ui/icons";
import HighlightOff from '@mui/icons-material/HighlightOff';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import { async } from "@firebase/util";
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import * as linkify from "linkifyjs";
import linkifyHtml from "linkify-html";

import TagsInput from 'react-tagsinput'

import 'react-tagsinput/react-tagsinput.css'

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
  bodyHtml: string;
  order: number;
}

interface Obj2 {
  id: number;
  key: string;
  value: string;
  type: string;
  cover: string;
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
  const folder_key = getFolderKeyByValue(folder)
  const original_card_id = router.query.id
  const id = router.query.id

  const [uploadRefresh, setUploadRefresh] = useState(0);
  const cardObj = {id: "sem_titulo", card_id: "", img: [{}], folder: folder_key, title: "Sem título", body: "", bodyHtml: "", tags: "", order: -1 };
  const [state, setState] = useState<Obj1>(cardObj)
  const [mostra, setMostra] = useState(false)
  
  const tblObj: Obj2[] | (() => Obj2[] | undefined) | undefined = [];
  const tblObj2: Obj2[] = [{id:0, key:'', value:'', type:'', cover:''}];
  const [stateExtra, setStateExtra] = React.useState<Obj2[]| undefined>(tblObj)
  const [stateImg, setStateImg] = React.useState<Obj2[]>(tblObj2)
  const [stateAlertDialog, setStateAlertDialog] = React.useState({mostra: false, body: ''})

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
      const innerText = user.folders.find((item: { key: any; }) => item.key === value)?.value
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

  const checkMidiaType = (src: string) => {
    console.log(src);
    if (src.includes('you')){
      return 'youtube'
    } 
    if (src.includes('fb.watch')){
      return 'facebook'
    } else{
      return 'image'
    }
  }

  const bodyHtmlGen = () => {
    return linkifyHtml(state.body.replace(/\n/g, "<br />"), {
      target: {
        url: "_blank"}})
  }
  
  const saveCard = () => {
    setDesableSaveButton(true)
    const timestamp = new Date().getTime()

    setStateImg(stateImg.map((item)=>{
      item.cover=item.value
      item.type = checkMidiaType(item.value)
      if (item.type=='youtube') {
        item.cover='https://img.youtube.com/vi/'+item.value.split('be/')[1]+'/maxresdefault.jpg'
      } 
      if (item.type=='facebook') {
        item.cover='https://firebasestorage.googleapis.com/v0/b/receitas-5968d.appspot.com/o/videoPlaceholder.jpg?alt=media&token=a858d0f4-db7f-46e9-9b3b-0d8f574ee882'
      }
      return item
    }))

    let data = { img: stateImg, folder: state.folder, title: state.title, body: state.body, bodyHtml: bodyHtmlGen(), tags: selected.toString(), extra: stateExtra, order: timestamp };
    console.log(data);
    let card_id = state.card_id
    if (card_id == '') card_id = timestamp.toString()
    CardDataService.setCard(user.uid, card_id, data)
      .then((x) => {
        console.log("Created new item successfully!");
        // setMostra(true)
        // setTimeout(() => { setMostra(false) }, 1000)
        setState(cardObj)
        setBodyValue('')
        setStateAlertDialog({...stateAlertDialog, mostra: true})
        setDesableSaveButton(false)
        if (!stateAlertDialog.mostra) router.push(`/${folder}`)
      })
      .catch((e) => {
        console.log(e);
      });
  }

  const updateCard =  () => {
    setDesableSaveButton(true)
    setStateImg(stateImg.map((item)=>{
      item.cover=item.value
      item.type = checkMidiaType(item.value)
      if (item.type=='youtube') {
        let cover_default = 'https://img.youtube.com/vi/'+item.value.split('be/')[1]+'/sddefault.jpg'
        item.cover = cover_default
      }
      if (item.type=='facebook') {
        item.cover='https://firebasestorage.googleapis.com/v0/b/receitas-5968d.appspot.com/o/videoPlaceholder.jpg?alt=media&token=a858d0f4-db7f-46e9-9b3b-0d8f574ee882'
      }
      return item
    }))

    let data = {
      img: stateImg,
      title: state.title,
      folder: state.folder,
      body: state.body||'',
      bodyHtml: bodyHtmlGen()||'',
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
          // setMostra(true)
          // setTimeout(() => {
          //   setMostra(false)
          // }, 1000)
          setStateAlertDialog({...stateAlertDialog, mostra: true})
          setDesableSaveButton(false)
          console.log(stateAlertDialog.mostra);
          
          if (!stateAlertDialog.mostra) router.push(`/${folder}`)
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

  const loadCardData = () => {
    CardDataService.readById(user.uid, id as string).then((data) => {
      console.log(data)
      if (data) {
        setState({ id: id, card_id: id, folder: folder_key, title: data.title, body: data.body, bodyHtml: data.bodyHtml, img: data.img, order: data.order })
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

  useEffect(() => {
    let a = true
    if (id!==(state.id||'new')&&a)loadCardData()
    return () => {()=>{a=false}}
  }, [])


  const handleChange2 =
  (prop: keyof Obj1) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [prop]: event.target.value });
  };

  return (
    <div>
      <AlertDialog time img="" title="Erro" body="Registro salvo com sucesso" mostra={stateAlertDialog.mostra} setMostra={(x)=>setStateAlertDialog({...stateAlertDialog, mostra:x})}/>
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
              {/* {JSON.stringify(user.folders, null, 2)} */}
              <Select
                fullWidth
                name="folder"
                defaultValue="principal"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={state.folder}
                label="Pasta"
                onChange={handleChange}>
                  {user.folders.map((item: any)=>{
                    return (
                      <MenuItem key={item.key} value={item.key}>{item.value}</MenuItem>
                    )
                  })}
              </Select>
            </FormControl>
          </DialogContentText>
        </DialogContent>
      </Dialog>
      {/* {JSON.stringify(stateAlertDialog)} */}
      {/* {state.bodyHtml} */}
      <AlertDialog time title="" body="" img="/static/ok.png" mostra={mostra} setMostra={setMostra}/>
      <Typography variant="h5" gutterBottom mt={11} ml={1} mb={3}>
        <Link onClick={()=>router.push('/'+folder)} underline="hover">{folder}</Link>{' › '} {state.id.substring(0,100)} {' › '} <EditIcon fontSize='small' sx={{marginTop:-1}}/>
      </Typography>
      <MagaTabs>
        <div data-tab="tab1" style={{marginTop: 0}}>
          <TextField 
              id="outlined-basic"
              name="title"
              label=""
              variant="outlined"
              fullWidth
              onChange={handleChange}
              value={state.title.substring(0,100)}
              inputProps={{style: {fontSize: 20}}} 
              sx={{marginBottom: 1.5}}
          /><br/>
          
           <TextareaAutosize 
              id="outlined-basic"
              name="body"
              style={{ fontSize: '18px', padding: 10, color: 'whitesmoke', width: '100%', backgroundColor: 'RGBA(18, 18, 18, 0)' }}
              // rows={5}
              minRows={3}
              maxRows={11}
              onChange={handleChange}
              value={state.body}
          />
          {/* <ReactQuill theme="snow" value={bodyValue} onChange={setBodyValue} /> */}
          <Box sx={{ marginTop: .5, marginLeft: 0, marginRight: 0}}>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header" >
                <Typography>Variáveis</Typography>
              </AccordionSummary>
              <AccordionDetails >
                <FullFeaturedCrudGrid width={800} optColumKey user={user} stateExtra={stateExtra} setStateExtra={setStateExtra}/>
              </AccordionDetails>
            </Accordion>
          </Box>
          <br/>
        </div>
        <div data-tab="tab2">
          <Box>
            <FullFeaturedCrudGrid width={'760'} user={user} optColumKey={false} stateExtra={stateImg} setStateExtra={setStateImg}/>
          </Box>
        </div>
        <div data-tab="tab3">
        <TagsInput value={selected} inputProps={{placeholder: 'Incluir'}} onChange={setSelected} />
          {/* <TagsInput
              value={selected}
              onChange={setSelected}
              name="tags"
              placeHolder="Etiquetas"
            /> */}
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
          <BottomNavigationAction label="Salvar" disabled={desableSaveButton} onClick={state.id?updateCard:saveCard} icon={<SaveIcon />} />
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