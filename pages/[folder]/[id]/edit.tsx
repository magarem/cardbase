import type { NextPage } from "next";
import { useEffect, useState, useRef } from "react";
import { useRouter } from 'next/router'
import { BottomNavigation, BottomNavigationAction, Button, Card, CardMedia, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormControlLabel, FormLabel, InputLabel, MenuItem, Paper, Radio, RadioGroup, Select } from "@mui/material";
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
  img: string; 
  folder: string,
  title: string;
  body: string;
  order: number;
}

interface Obj2 {
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
  if (folder=='usersettings') folder = 'Home'
  const original_card_id = router.query.id
  const id = router.query.id

  const [uploadRefresh, setUploadRefresh] = useState(0);
  const cardObj = {id: "", card_id: "", img: "", folder: "", title: "", body: "", tags: "", order: -1 };
  const [state, setState] = useState<Obj1>(cardObj)
  const [stateFolder, setStateFolder] = useState([{key: String, value: String}])
  const [mostra, setMostra] = useState(false)
  
 
  const tblObj = [{key: "", value: ""}];
  const [stateExtra, setStateExtra] = React.useState<Obj2[]>(tblObj)


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
    if (name == 'title' && router.query.id=='new') {
      state.card_id = value.substring(0,30).replaceAll(' ','_').normalize('NFD').replace(/[\u0300-\u036f]/g, "")// + '-' + new Date().getTime()
      console.log('inner text: ', state.card_id);
      // router.push( '/' + innerText + '/' + id + '/edit' )
     
    }
  };
  
  const saveCard = () => {
    setDesableSaveButton(true)
    let data = { img: state.img||'', folder: state.folder, title: state.title, body: bodyValue, tags: selected.toString(), extra: stateExtra, order: -1 };
    console.log({data});
    const timestamp = new Date().getTime()
    console.log(state.card_id=='');
    let card_id = state.card_id
    if (card_id == '') card_id = timestamp.toString()
    CardDataService.setCard(user.uid, card_id, data)
      .then((x) => {
        console.log("Created new item successfully!");
        console.log(x)
        // setUploadRefresh(uploadRefresh + 1)
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
      img: state.img||'',
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

  useEffect(() => {
    const folder_key = getFolderKeyByValue(folder)
    setState({...state, folder: folder_key})
    if (id!=='new'){
      CardDataService.readById(user.uid, router.query.id as string).then((data) => {
        console.log(data)
        if (data) {
          setState({ id: router.query.id, card_id: router.query.id, folder: folder_key, title: data.title, body: data.body, img: data.img, order: data.order })
          setBodyValue(data.body)
          setSelected(data.tags?.split(','))
          if (!data.extra) data.extra = [{key: "", value: ""}] 
          setStateExtra(data.extra)
        }
      })
    }
  }, [router.query])

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
      <main className="py-10">
        <AlertDialog time title="" body="" img="/static/ok.png" mostra={mostra} setMostra={setMostra}/>
        <div className="w-full max-w-3xl px-3 mx-auto"><br/>
          <Grid container alignItems="center" justifyContent="center" spacing={{ xs: 2, md: 1 }} mb={12}>
            <Grid item={true} xs={12} sm={12} md={12} sx={{ padding: 0 }} style={{textAlign: "left"}}>
              <Box >
                {/* {JSON.stringify(stateExtra)} */}
                {state.id?<h2>Editar</h2>:<h2>Criar</h2>}<br/>
                <Button style={{width: 233, height: 50}} variant="outlined" onClick={handleClickOpen}>
                        {folder}
                      </Button><br/><br/>
                      <TextField 
                        id="outlined-basic"
                        
                        name="card_id"
                        label="card_id"
                        variant="outlined"
                        onChange={handleChange}
                        value={state.card_id}
                      />
                      <br/><br/>
                      <TextField 
                        id="outlined-basic"
                        
                        name="title"
                        label="Titulo"
                        variant="outlined"
                        onChange={handleChange}
                        value={state.title}
                      /><br/><br/>
                       <ReactQuill theme="snow" value={bodyValue} onChange={setBodyValue} />
                 <br/>
                 <TagsInput
                  value={selected}
                  onChange={setSelected}
                  name="tags"
                  placeHolder="Etiquetas"
                /><br/>
                       <Upload key={uploadRefresh} user={user} state={state} setState={setState} /> <br/><br/>
                    {state.img&&
                    <><Card sx={{ width: 200, maxHeight: 500 }}>
                        <CardMedia
                          component="img"
                          height="100%"
                          width="100%"
                          image={state.img}
                        />
                      </Card>
                      <br/>
                    </>
                    }
                
                  {/* <TextField 
                        id="outlined-basic"
                        fullWidth
                        name="tags"
                        label="Etiquetas"
                        variant="outlined"
                        onChange={handleChange}
                        value={state.tags}
                      /> */}
                  <TextField
                  name="order"
                  label="Order"
                  onChange={handleChange}
                  value={state.order}
                  hidden
                />
                <FullFeaturedCrudGrid stateExtra={stateExtra} setStateExtra={setStateExtra}/>
          <br/>
                <Grid sx={{marginBottom: "20px"}} container spacing={{ xs: 2, md: 1 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                  {/* <Grid item xs={12} sm={12} md={12} style={{textAlign: "center"}} >
                    <Box sx={{ m: 1 }} />
                  </Grid> */}
                </Grid>
              </Box>
            </Grid>
          </Grid>
          
        </div>
      </main>
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