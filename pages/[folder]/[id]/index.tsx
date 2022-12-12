import type { NextPage } from "next";
import { useEffect, useState, useRef } from "react";
import { useRouter } from 'next/router'
import { BottomNavigation, BottomNavigationAction, Button, Card, CardMedia, Container, createTheme, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormControlLabel, FormLabel, ImageList, ImageListItem, InputLabel, Link, MenuItem, Paper, Radio, RadioGroup, Select, ThemeProvider, Typography, useMediaQuery } from "@mui/material";
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
import Image from 'next/image'
import MagaTable from "../../../components/table"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import '@fontsource/roboto/300.css';
import SwipeableTextMobileStepper from "../../../components/Carousel"
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

  const imageZoom = (url: string) => {
    console.log(url);
    
    return (
      <><Typography>{url}</Typography><img src={url} /></>
    )
  }

  useEffect(() => {
    if (router.query.id) {
      const folder_key = getFolderKeyByValue(folder)
      const username = location.href.split('//')[1].split('.')[0]
      CardDataService.readUserData(null, username).then(async (ret: any)=>{
        const uid = ret.uid
        console.log(uid, router.query.id)
        CardDataService.readById(uid, router.query.id as string).then((data: any) => {
          console.log(data)
          if (data) {
            setData(data)
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
  }, [router.query.id])
  const matches = useMediaQuery('(min-width:600px)');
  return (
    <Container>
      <Box justifyContent="center">
      <Typography variant="h5" gutterBottom mt={11} ml={0} mb={2}>
        <Link onClick={()=>router.push('/'+folder)} underline="hover">{folder}</Link>{' › '} {data.title}
      </Typography>
      
      <Box
      sx={{
        xs: {width: '100%'},
        md: {width: '50%'}
      }}
    >
        {/* <h4><Link onClick={()=>router.push('/'+folder)} underline="hover">{folder}</Link> {'›'} {data.title}</h4><br/> */}
        {data.img[0]?.value&&
        <Container disableGutters
          sx={{
            padding: 0,
            width: '100%',
            maxWidth: '100%',
            alignContent: 'center'
          }}
        >
            {/* <Carousel >
              {
                items.map( (item, i) => <img src={data.img[i]?.value} style={{ maxWidth: '100%', zIndex: '0 !important'}}/> )
              }
            </Carousel> */}
            <Box sx={{ width: {md:'50%', sm: '100%'} }}>
              <SwipeableTextMobileStepper height={400} position="static" imgs={data.img} />
            </Box>
            {/* <ImageList sx={{ width: '100%', height: 350 }} cols={matches ? 3 : 1} rowHeight={350}>
              {data.img.map((item: any) => (
                <ImageListItem key={item.value}>
                  <img
                    src={`${item.value}?w=164&h=164&fit=crop&auto=format`}
                    srcSet={`${item.value}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                    loading="lazy"
                    style={{ maxHeight: 350 }}
                  />
                </ImageListItem>
              ))}
            </ImageList> */}
          <Box
          sx={{
            padding: 0,
            width: {
              md: '50%',
              lg: '50%',
              xs: '100%'
            }
            ,
            maxWidth: '100%',
            alignContent: 'center'
          }}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
          

            {/* <img src={data.img[0]?.value} style={{ maxWidth: '100%'}}/> */}
          </Box>
        </Container>
       }
       <br/>
        <ThemeProvider theme={theme}>
          <Typography variant="body1" dangerouslySetInnerHTML={{ __html: data.body }}/>
        </ThemeProvider>
        <MagaTable cols={cols} rows={state}/>
        <br/><br/><br/><br/><br/><br/>
        {user.isLogged&&
        <>
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
      </>
        }
        </Box>
        </Box>
        
    </Container>
   
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