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
import CardDataService from "../../../services/services";
import Container from '@mui/material/Container';
import { useRouter } from "next/router";
import CardsGrid from '../../../components/CardsGrid'
import { useAuth } from '../../../context/AuthContext'
import { collection, query, where, getDocs } from "firebase/firestore";
import {
  getAuth
} from "firebase/auth";

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
    console.log(obj);
    setCurrentState2(obj)
    setOpen(true)
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

  return (
    <div>
      <Head>
        <title>list</title>
        <meta name="description" content="File uploader" />
      </Head>
      <main>
       
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>

        <Card>
                <CardMedia 
                  component="img"
                  image={currentState2.img}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                  {currentState2.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                  {currentState2.body}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => setOpen(false)}>Fechar</Button>
                </CardActions>
              </Card>


          {/* <Typography id="modal-modal-title" variant="h6" component="h2">
            <img src={currentState2.img}/>
           
            {currentState2.title}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {currentState2.body} 
          </Typography> */}
          {/* <Button size="small" onClick={() => setOpen(false)}>Fechar</Button> */}
        </Box>
     
      </Modal>
      <CardsGrid user={user} currentState={currentState} setCurrentState={setCurrentState}/>
       
      </main>

      <footer>
        <div className="w-full max-w-3xl px-3 mx-auto">
          <p>All right reserved</p>
        </div>
      </footer>
    </div>
  );
};
export default List;