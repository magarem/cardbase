import type { NextPage } from "next";
import { useEffect, useState, useRef } from "react";
import { useRouter } from 'next/router'
import { BottomNavigation, BottomNavigationAction, Button, Card, CardMedia, Container, createTheme, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormControlLabel, FormLabel, ImageList, ImageListItem, InputLabel, Link, MenuItem, Paper, Radio, RadioGroup, Select, Stack, ThemeProvider, Typography, useMediaQuery } from "@mui/material";
import CardDataService from "../../../services/services";
import Upload from '../../../components/Upload'
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { useAuth } from '../../../context/AuthContext'
import Box from '@mui/material/Box';
import AlertDialog from '../../../components/AlertDialog'
import React from 'react';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
const ReactQuill = typeof window === 'object' ? require('react-quill') : () => false;
import { TagsInput } from "react-tag-input-component";
import FullFeaturedCrudGrid from "../../../components/dataGrid"
// import Image from 'next/image'
import MagaTable from "../../../components/table"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import '@fontsource/roboto/300.css';
import SwipeableTextMobileStepper from "../../../components/Carousel"
import MagaSlide from "../../../components/MagaSlide"
import { AnyCnameRecord } from "dns";
import FullScreenDialog from "../../../components/DialogFullScreen";
import YouTube from "react-youtube";
import ReactPlayer from 'react-player'

interface Props {
  setuser: Function
  user: {
    uid: string,
    email: string
  }
}
interface Obj1 {
  id: any;
  card_id: any;
  img: any; 
  folder: string,
  title: string;
  body: string;
  bodyHtml: string;
  attachedFiles: any,
  order: number;
}

interface Obj2 {
  key: any;
  value: any;
}

interface ObjMidia {
  id: number;
  key: string;
  value: string;
  type: string;
  cover: string;
}

const opts = {
  height: "390",
  width: "640",
  playerVars: {
    autoplay: false,
  },
};

const ShowCard: NextPage<Props> = () => {
  const { user, getFolderKeyByValue } = useAuth()

  const router = useRouter()
  let folder = router.query.folder
  if (folder=='usersettings') folder = 'Home'
  const original_card_id = router.query.id
  const id = router.query.id

  const cardObj = {id: "", card_id: "", img: [], folder: "", title: "", body: "", bodyHtml: "", tags: "", attachedFiles: [], order: -1 };
  const [state, setState] = useState<Obj1[]>([cardObj])
  const [data, setData] = useState<Obj1>(cardObj)
  const midiaObj = {id:0, key:'', value:'', type: '', cover:''}
  const [open, setOpen] = useState<ObjMidia>(midiaObj)
 
  const tblObj = [{key: "", value: ""}];
  const [stateExtra, setStateExtra] = React.useState<Obj2[]>(tblObj)

  const callLink = (link: string) =>{
    router.push(link)
  }
  
  const handleRemove = (id: string) => {
    callLink('/' + folder)
  };
  
  const delete_card = (user: string, id: string) => {
    if (window.confirm("Confirma exclusão?")) {
      CardDataService.delete(user, id)
      handleRemove(id)
    }
  }

  const handleClose = () => {
    setOpen(midiaObj);
  };

  const cols: any[] = ['', '']
  const rows: any[] = []

  const theme = createTheme({
    typography: {
      subtitle1: {
        fontSize: 12,
      },
      body1: {
        fontFamily: 'roboto',
        fontSize: 20,
        fontWeight: 500,
      },
      button: {
        fontStyle: 'italic',
      },
    },
  });

  const ImageZoom = () => {
    return (
      <>
      <FullScreenDialog state={JSON.stringify(open)!==JSON.stringify(midiaObj)} handleClose={handleClose} >
      <Box
        sx={{marginTop:{md:3}}}
        display="flex"
        justifyContent="center"
        alignItems="center"
        // minHeight="100vh"
      >
        {(open.type=='youtube'||open.type=='facebook')?
        // <YouTube videoId={open.value.split('be/')[1]} opts={opts} onReady={_onReady} />
        <ReactPlayer url={open.value}/>
        :
      <Box
        component="img"
        sx={{
          // height: 233,
          width: '100%',
           maxHeight: { xs: '100%', md: 600},
           maxWidth: { xs: '100%', md: 500 },
        }}
        src={open.value}
        />
      }
      </Box>
      <br/>
        <Container><br/>
          <TextField
            id="outlined-textarea"
            label="Endereço da imagem"
            placeholder="Placeholder"
            fullWidth
            value={(open.value) as string}
            multiline
          />
        </Container>
        </FullScreenDialog>
      </>
    )
  }

  // useEffect(() => {
  if (data.id !== router.query.id) {
    console.log(router.query.id);
    const folder_key = getFolderKeyByValue(folder)
    const username = location.href.split('//')[1].split('.')[0]
    CardDataService.readUserData(null, username).then(async (ret: any)=>{
      const uid = ret.uid
      console.log(uid, router.query.id)
      CardDataService.readById(uid, router.query.id as string).then((data: any) => {
        console.log(data)
        if (data) {
          setData({...data, id: router.query.id})
          console.log(data.extra);
          data.extra.map((item: any)=>{
              rows.push([item.key, item.value])
          })
          setState(rows)
          console.log(rows);
        }
      })
    })
  }
  // }, [router.query.id])
  const isMd = useMediaQuery('(min-width:600px)');

  return (
    <>{ open ? <ImageZoom/> : null }
      <Box justifyContent="center">
        <Box justifyContent="center" sx={{paddingBottom:20}}>
          <Typography variant="h5" gutterBottom mt={11} ml={0} mb={2}>
            <Link onClick={()=>router.push('/'+folder)} underline="hover">{folder}</Link>{' › '} {data.title}
          </Typography>       
          {data.id.length>1&&
            <Box sx={{ width: '100%'}}>
              <ImageList sx={{ width: '100%'}} cols={isMd?5:2} >
                {data.img.map((item: any) => (
                  <ImageListItem key={item.value}>
                    {(item.cover||item.value)&&
                      <CardMedia
                        component="img"
                        height="250"
                        image={`${item.cover||item.value}`}
                        onClick={()=>{setOpen(item)}}
                      />
                    }
                  </ImageListItem>
                ))}
              </ImageList>
            </Box>  
          }
          <ThemeProvider theme={theme}>
            <Typography variant="body1" dangerouslySetInnerHTML={{ __html: data.bodyHtml }}/>
          </ThemeProvider>
          <MagaTable cols={cols} rows={state}/>
          {/* {JSON.stringify(data.attachedFiles)} */}
          {data.attachedFiles&&
          <><br/>
          <h5 style={{marginBottom:10}}>Arquivos anexados:</h5>
          {data.attachedFiles.map((item: any, index: number)=>{
            return (
              <div key={item.value} style={{marginBottom:10}}>
                <a   href={item.value} target="_blank" rel="noreferrer" download>{item.value.split('/').pop()}</a><br/>
              </div>
            )
          })}
          </>}
        </Box>
        {user.isLogged&&
          <Paper sx={{ paddingTop: '10px', bgcolor: '#000000', position: 'fixed', bottom: 0, left: 0, right: 0  }} elevation={3}>
          <BottomNavigation sx={{ 
            zIndex: 5000,
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
            >
            <BottomNavigationAction label="Editar" disabled={false} onClick={() => callLink("/" + folder + "/" + router.query.id + "/edit")} icon={<EditIcon />} />
            <BottomNavigationAction label="Excluir" onClick={() => delete_card(user.uid, router.query.id as string)}  icon={<DeleteIcon />}  />
            <BottomNavigationAction label="Voltar" onClick={() => router.back()} icon={<ArrowBackIcon />} />
          
          </BottomNavigation>
          <br/>
          </Paper>
        }
      </Box>
    </>
  );
} 

export default ShowCard;

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