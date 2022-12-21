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
  order: number;
}

interface Obj2 {
  key: any;
  value: any;
}
const Create: NextPage<Props> = () => {
  const { user, getFolderKeyByValue } = useAuth()

  const router = useRouter()
  let folder = router.query.folder
  if (folder=='usersettings') folder = 'Home'
  const original_card_id = router.query.id
  const id = router.query.id

  const cardObj = {id: "", card_id: "", img: [], folder: "", title: "", body: "", tags: "", order: -1 };
  const [state, setState] = useState<Obj1[]>([cardObj])
  const [data, setData] = useState<Obj1>(cardObj)
  const [open, setOpen] = useState("")
 
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
    setOpen("");
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
      <FullScreenDialog state={open.length>0} handleClose={handleClose} >
      <Box
        sx={{marginTop:{md:3}}}
        display="flex"
        justifyContent="center"
        alignItems="center"
        // minHeight="100vh"
      >
      <Box
        component="img"
        sx={{
          // height: 233,
          width: '100%',
           maxHeight: { xs: '100%', md: 600},
           maxWidth: { xs: '100%', md: 500 },
        }}
        src={open}
        />
      </Box>
      <br/>
        <Container><br/>
          <TextField
            id="outlined-textarea"
            label="Endereço da imagem"
            placeholder="Placeholder"
            fullWidth
            value={open}
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

  function isLandscape(src: string) {

    var orientation,
    img = new Image();
    img.src = src;

    if (img.naturalWidth > img.naturalHeight) {
        orientation = true;
    } else if (img.naturalWidth < img.naturalHeight) {
        orientation = false;
    } else {
        orientation = false;
    }

    return orientation;

  }
  let ww1 = '300px'
  let ww2 = '600px'
  let hh1 = '300px'
  let hh2 = '600px'
  return (
    <>{  open ? <ImageZoom/> : null }
      <Box justifyContent="center">
        <Box justifyContent="center" sx={{paddingBottom:20}}>
          <Typography variant="h5" gutterBottom mt={11} ml={0} mb={2}>
            <Link onClick={()=>router.push('/'+folder)} underline="hover">{folder}</Link>{' › '} {data.title}
          </Typography>
          {data.img.length==1&&
          <img src={`${data.img[0].value}`} style={{maxWidth:'100%', marginBottom: 17}}/>
        //   <CardMedia
        //   component="img"
        //   height="200"
        //   image={`${data.img[0].value}`}
        //   onClick={()=>{setOpen(data.img[0].value)}}
        // />

          }
          {data.img.length>1&&
            <Box sx={{ width: '100%'}}>


<ImageList sx={{ width: '100%'}} cols={isMd?5:2} rowHeight={250}>
  {data.img.map((item: any) => (
    <ImageListItem key={item.value}>
     <CardMedia
          
          component="img"
          height="250"
          image={`${item.value}?w=164&h=164&fit=crop&auto=format`}
          onClick={()=>{setOpen(item.value)}}
        />
      {/* <div className="M_box"  style={{width: isLandscape(item.value)?'600px':'300px',  height: isLandscape(item.value)?'300px':'600px'}}> */}
        {/* <img
          src={`${item.value}?w=164&h=164&fit=crop&auto=format`}
          srcSet={`${item.value}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
        
          loading="lazy"
        /> */}
      {/* </div> */}
    </ImageListItem>
  ))}
</ImageList>


              {/* <ImageList sx={{ width: '1210px', height: 'auto' }}
                variant="quilted"
                cols={4}
                rowHeight={300} >
                {data.img.map((item: any, index: number, array: any) => (
                  <ImageListItem key={item.value} cols={isLandscape(item.value)?2:1} rows={isLandscape(item.value)?1:2}   > 
                  
                   <div className="M_box"  style={{width: isLandscape(item.value)?'600px':'300px',  height: isLandscape(item.value)?'300px':'600px'}}>
                    <img 

                      className="M_img"
                      // style={{width: isLandscape(item.value)?'398':'200px',  height: isLandscape(item.value)?'200px':'398px'}}
                      src={`${item.value}`}
                      srcSet={`${item.value}`}
                      
                      // style={{width:'100%'}}
                      // sizes="(max-width: 710px) 50px,
                      //        (max-width: 991px) 50px,
                      //        50px"
                      loading="lazy"
                      onClick={()=>{setOpen(item.value)}}
                     
                    />
                    </div>
                  </ImageListItem>
                ))}
              </ImageList> */}
            </Box>  
          }
          <ThemeProvider theme={theme}>
            <Typography variant="body1" dangerouslySetInnerHTML={{ __html: data.body }}/>
          </ThemeProvider>
          <MagaTable cols={cols} rows={state}/>
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