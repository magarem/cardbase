import type { NextPage } from "next";
import { useState, useEffect } from "react";
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CardDataService from "../../../services/services";
import { useRouter } from "next/router";
import CardsGrid from '../../../components/CardsGrid'
import { useAuth } from '../../../context/AuthContext'
import {
  getAuth
} from "firebase/auth";
import { useTheme } from '@mui/material/styles';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, useMediaQuery, Grid, Link } from "@mui/material";
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
  currentState2?:{
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
          ZenSite
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    </>
  );
}

const List: NextPage<Props> = (props) => {
  const router = useRouter()
  const type = router.query.type||"card"

  const { user } = useAuth()
  console.log(type);
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const [open, setOpen] = useState(false);
  const handleOpen = (obj: ss) => {
    if (window.innerWidth > 700){
      console.log(obj);
      setCurrentState2(obj)
      setOpen(true)
    }
  }
  const handleClose = () => setOpen(false);
  const [employees, setEmployees] = useState<{salary: number; name: string}[]>(
    [],
  );
  const [currentState, setCurrentState] = useState<ss[]>([]);
  const [currentState2, setCurrentState2] = useState<ss>();

//   const [user, setUser] = useState({});
  const mostra = () => {
    const auth = getAuth();
    const user_ = auth.currentUser;
    console.log(user_)
  }
  
  useEffect(() => {
    if (user.displayName) {
      console.log({type});
      const data = CardDataService.read(user.displayName, type as string).then((data)=>{
        setCurrentState(data)
        console.log(data)
       })
    }
  }, [user, type])

  const styles = {
    width: 300,
    card: {
      margin: 16,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between"
    }
  };
  
  function removeObjectWithId(arr: any[], id: any) {
    const objWithIdIndex = arr.findIndex((obj) => obj.id === id);
    arr.splice(objWithIdIndex, 1);
    return arr;
  }

  const call_link = (link: string) =>{
    router.push(link)
  }

  const PhotoZoonCard = () => {
    return (
      <Box>
          <Grid container>
            {(currentState2?.img)?
            <>
              <Grid item md={6}>
                <img src={currentState2?.img} style={{ maxWidth: 410, borderRadius:4, border: '1px solid #302D2C'  }}/>
              </Grid>
              <Grid item md={6}>
                <Typography component="div" variant="h5" pb={1}>
                  {currentState2?.title}
                </Typography>
                {currentState2&&
                  <Typography variant="subtitle1" color="text.secondary"  dangerouslySetInnerHTML={{ __html: currentState2?.body as string }}>
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
                <Typography variant="subtitle1" color="text.secondary" component="div" dangerouslySetInnerHTML={{ __html: currentState2?.body as string}}>
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


  const theme = useTheme();
  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display: 'flex'
  };
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const mw = currentState2?.img?"md":"sm"
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
        <PhotoZoonCard/>
      </DialogContent>
      {/* <DialogActions>
        <Button onClick={handleClose} autoFocus>fechar</Button>
      </DialogActions> */}
    </Dialog>

      <CardsGrid user={user} handleOpen={handleOpen} currentState={currentState} setCurrentState={setCurrentState}/>
      <Copyright/>
    </>
  );
};
export default List;