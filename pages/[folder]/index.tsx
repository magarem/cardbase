import type { NextPage } from "next";
import { useState, useEffect } from "react";
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CardDataService from "../../services/services";
import { useRouter } from "next/router";
import CardsGrid from '../../components/CardsGrid'
import { useAuth } from '../../context/AuthContext'
import { Dialog, DialogContent, Grid, Link, Fab, Button, IconButton } from "@mui/material";
import React from "react";
import AddIcon from '@mui/icons-material/Add';
import { SxProps } from '@mui/system';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
interface Props {
  setuser: Function,
  currentState2?: {
    img: string
  },
  user: {
    uid: string,
    email: string,
    displayName: string
  }
}

type ss = {
  id?: any;
  img?: string;
  folder?: string;
  title?: string;
  body?: string;
  type?: string;
  order?: number
}

function Copyright(props: any) {
  return (
    <>
      <Typography mt={15} mb={10} variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © '}
        <Link color="inherit" href="">
          ZenBase
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    </>
  );
}

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const fabStyle = {
  bottom: 40,
  right: 40,
  position: 'fixed',
};

const fabs = [{
    color: 'primary' as 'primary', sx: fabStyle as SxProps,
    icon: <AddIcon />, label: 'Add',
}]

const List: NextPage<Props> = (props) => {
  const router = useRouter()
  const { user, stateFolder, folderReload, getFolderKeyByValue, folderReloadByGuest } = useAuth()
  let folder = router.query.folder
  console.log({user, folder});
  const [open, setOpen] = useState(false);
 
  const handleOpen = (obj: ss) => {
    router.push("/" + folder + "/" + obj.id)
    // if (window.innerWidth > 700) {
    //   console.log(obj);

    //   setCurrentState2(obj)
    //   // setOpen(true)
    // }
  }

  const handleClose = () => setOpen(false);
  const [currentState, setCurrentState] = useState<ss[]>([]);
  const [currentState2, setCurrentState2] = useState<ss>();
  const [userDataByGuest, setUserDataByGuest] = useState({});

  const loadData = async (user: { folders: any[]; uid: string; }) => {
    if (true) {
      // await folderReload()
      // const folderKey = await getFolderKeyByValue(folder)
      // console.log(stateFolder);
      const folderKey = await user.folders.find(item => item.value == folder)?.key
      // alert(folder + '-' + folderKey)
      console.log('>>', user, folder, folderKey);
      if (folderKey){
        CardDataService.read(user.uid, folderKey).then((data3) => {
          setCurrentState(data3)
          console.log(data3)
        })
      }
    }else{
      userByGuest()
    }
  }

  const userByGuest = async () => {
    CardDataService.readUserData(null, location.href.split('//')[1].split('.')[0]).then( async (ret: any)=>{
      // setUserDataByGuest(ret)
      // console.log(folder, folderKey)
      const folderKey = await folderReloadByGuest(ret.uid, folder)
      console.log(folder, folderKey)
      CardDataService.read(ret.uid, folderKey).then((data3) => {
        setCurrentState(data3)
        console.log(data3)
      })
    })
  }
  
  // useEffect(() => {
  //   console.log(user);
  //   if (user.uid) {
  //     loadData(user, folder)
  //   }
  // }, [folder])
  

  useEffect(() => {
    if (true) {
      console.log(location.href.split('//')[1].split('.')[0]);
      CardDataService.readUserData(null, location.href.split('//')[1].split('.')[0]).then((ret: any)=>{
        console.log(ret);
        setUserDataByGuest(ret)
        loadData(ret)
      })
    }
  },[folder])


  const PhotoZoonCard = () => {
    return (
      <Box>
        <Grid container>
          {(currentState2?.img) ?
            <>
              <Grid item md={6}>
                <img src={currentState2?.img} style={{ maxWidth: 410, borderRadius: 4, border: '1px solid #302D2C' }} />
              </Grid>
              <Grid item md={6}>
                <Typography component="div" variant="h5" pb={1}>
                  {currentState2?.title}
                </Typography>
                {currentState2 &&
                  <Typography variant="subtitle1" color="text.secondary" dangerouslySetInnerHTML={{ __html: currentState2?.body as string }}>
                  </Typography>
                }

              </Grid>
            </>
            :
            <>
              <Grid item md={12}>
                <Typography component="div" variant="h5" pb={1}>
                  {currentState2?.title}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" component="div" dangerouslySetInnerHTML={{ __html: currentState2?.body as string }}>
                </Typography>
              </Grid>
            </>
          }
        </Grid>
      </Box>
      //     <Card sx={style} >
      //   <CardMedia
      //     component="img"
      //     sx={{ width: 350}}
      //     image={currentState2.img}/>
      //   <Box sx={{ display: 'flex', flexDirection: 'column' }} >
      //     <CardContent sx={{ flex: '1 0 auto', verticalAlign: 'top', paddingTop: 0 }}  >
      //       <Typography component="div" variant="h5">
      //       {currentState2.title}
      //       </Typography>
      //       <Typography variant="subtitle1" color="text.secondary" component="div">
      //       {currentState2.body}
      //       </Typography>
      //     </CardContent>
      //   </Box>
      // </Card>
    )
  }

  const mw = currentState2?.img ? "md" : "sm"
  // if (folder=='Home') folder='Início'
  return (
    <>
      <Dialog
        fullWidth
        maxWidth={mw}
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <PhotoZoonCard />
        </DialogContent>
      </Dialog>
      {/* {JSON.stringify(user)}<br/>
      {JSON.stringify(stateFolder)} */}
       <Typography variant="h5" gutterBottom mt={11} ml={0} mb={2}>
        <Link onClick={()=>{router.push('/Home')}} style={{textDecoration: 'none'}}>
          <IconButton size="small" ><ChevronLeftIcon fontSize="small"/></IconButton></Link>{folder}
      </Typography>
     
      {/* {JSON.stringify(currentState)} */}
      <CardsGrid user={user} handleOpen={handleOpen} currentState={currentState} setCurrentState={setCurrentState} />
      {user.isLogged&&
      <>
      {/* <Switch 
      // checked={checked}
      sx={styleDiv}
      onChange={()=>alert(1)}
      inputProps={{ 'aria-label': 'controlled' }}
    /> */}
      <Fab sx={fabs[0].sx} aria-label={fabs[0].label} color={fabs[0].color} onClick={() => {
          router.push("/" + folder + "/new/edit")
          }}>
        {fabs[0].icon}
      </Fab>
      </>}
      <br/><br/><br/><br/><br/><br/>
      {/* <Copyright /> */}
    </>
  );
};
export default List;