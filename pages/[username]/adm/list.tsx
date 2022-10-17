import type { NextPage } from "next";
import Head from "next/head";
import { useState, useEffect } from "react";
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import Theme from '@mui/material/Theme';
import CardDataService from "../../../services/services";
import Container from '@mui/material/Container';
import { useRouter } from "next/router";
import CardsGrid from '../../../components/CardsGrid'
import { useAuth } from '../../../context/AuthContext'
import { collection, query, where, getDocs } from "firebase/firestore";
import {
  getAuth
} from "firebase/auth";
import { useTheme } from '@mui/material/styles';
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
  currentState2:{
    img: string
  },
  user: {
    uid: string,
    email: string,
    displayName: string
  }
}
interface ss {
  img: string,
  title: string,
  body: string
}

const List: NextPage<Props> = (props) => {
  const router = useRouter()
  const { user } = useAuth()
  console.log(user);
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const [open, setOpen] = useState(false);
  const handleOpen = (obj) => {
    if (window.innerWidth > 700){
      console.log(obj);
      setCurrentState2(obj)
      setOpen(true)
    }
  }
  const handleClose = () => setOpen(false);

  const [currentState, setCurrentState] = useState([]);
  const [currentState2, setCurrentState2] = useState<ss>({img:'', title:'', body:''});
  const [singleReg, setSingleReg] = useState({})

//   const [user, setUser] = useState({});
  const mostra = () => {
    const auth = getAuth();
    const user_ = auth.currentUser;
    console.log(user_)
  }
  useEffect(() => {
    if (user.displayName) {
      console.log(user);
      const data = CardDataService.read(user.displayName).then((data)=>{
        setCurrentState(data)
        console.log(data)
       })
    }
  }, [user])


  const styles = {
    width: 300,
    card: {
      margin: 16,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between"
    }
  };
  
  function removeObjectWithId(arr, id) {
    const objWithIdIndex = arr.findIndex((obj) => obj.id === id);
    arr.splice(objWithIdIndex, 1);
    return arr;
  }

  const call_link = (link: string) =>{
    router.push(link)
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
  // const size = useWindowSize();
  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {/* <Box sx={style}> */}



        <Card sx={style}>
        <CardMedia
        component="img"
        sx={{ width: 350}}
        image={currentState2.img}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography component="div" variant="h5">
          {currentState2.title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div">
          {currentState2.body}
          </Typography>
        </CardContent>
      </Box>
      
    </Card>
      
    
      </Modal>
      <CardsGrid user={user} handleOpen={handleOpen} currentState={currentState} setCurrentState={setCurrentState}/>
       
     
     </>
  );
};
export default List;