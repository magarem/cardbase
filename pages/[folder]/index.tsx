import type { NextPage } from "next";
import { useState, useEffect } from "react";
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CardDataService from "../../services/services";
import { useRouter } from "next/router";
import CardsGrid from '../../components/CardsGrid'
import { useAuth } from '../../context/AuthContext'
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, useMediaQuery, Grid, Link, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import React from "react";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '1px solid #000',
  boxShadow: 24,
  p: 4,
};

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
  cardSession?: string;
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

const List: NextPage<Props> = (props) => {
  const router = useRouter()
  const { user, getFolderKeyByValue, folderReloadByGuest } = useAuth()
  let folder = router.query.folder
  console.log({user, folder});
  const [open, setOpen] = useState(false);
  const handleOpen = (obj: ss) => {
    if (window.innerWidth > 700) {
      console.log(obj);
      setCurrentState2(obj)
      setOpen(true)
    }
  }

  const handleClose = () => setOpen(false);
  const [currentState, setCurrentState] = useState<ss[]>([]);
  const [currentState2, setCurrentState2] = useState<ss>();
  const [userDataByGuest, setUserDataByGuest] = useState({});

  const loadData = async () => {
    
    if (user) {
      const folderKey = await getFolderKeyByValue(folder)
      console.log(folder, folderKey)
      console.log({folderKey, folder});
      console.log('>>', user.uid);
      CardDataService.read(user.uid, folderKey).then((data3) => {
        setCurrentState(data3)
        console.log(data3)
      })
    }else{
      userByGuest()
    }
  }

  const userByGuest = async () => {
    CardDataService.readUserData(location.href.split('//')[1].split('.')[0]).then( async (ret: any)=>{
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
  //   loadData()
  // }, [user, folder])
  

  useEffect(() => {
    console.log(location.href.split('//')[1].split('.')[0]);
    CardDataService.readUserData(location.href.split('//')[1].split('.')[0]).then((ret: any)=>{
      setUserDataByGuest(ret)
    })
    loadData()
  }, [user, folder])


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
      {<h2 style={{marginBottom: 15}}>{folder}</h2>}
      {/* {JSON.stringify(currentState)} */}
      <CardsGrid user={user} handleOpen={handleOpen} currentState={currentState} setCurrentState={setCurrentState} />
      <Copyright />
    </>
  );
};
export default List;