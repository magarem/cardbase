import type { NextPage } from "next";
import { styled } from '@mui/material/styles';
import { useState, useEffect, SetStateAction } from "react";
import CardDataService from "../../services/services";
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {BrowserView, MobileView} from 'react-device-detect';
import { useRouter } from 'next/router'
import Modal from '@mui/material/Modal';
import Container from "@mui/material/Container";
import CssBaseline from '@mui/material/CssBaseline';
import { Dialog, DialogContent, Link } from "@mui/material";

// const style = {
//   position: 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: 400,
//   bgcolor: 'background.paper',
//   border: '1px solid #000',
//   boxShadow: 24,
//   p: 4,
// };

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

interface Props {
  setuser: Function,
  currentState2:{
    img: string
  },
  user: {
    uid: string,
    email: string
  }
}
interface ss {
  id?: any,
  img?: string,
  title?: string,
  body?: string
  type?: string,
  order?: number
}

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
 })(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const Show: NextPage<Props> = (props) => {
 
  const router = useRouter()
  const { asPath } = useRouter()
  
  const [open, setOpen] = useState(false);

  const [currentState, setCurrentState] = useState<ss[]>([]);
  const [currentState2, setCurrentState2] = useState<ss>({id:'', img:'', title:'', body:'', type:'', order: -1});
  
  const [user, setUser] = useState({});
  const handleClose = () => setOpen(false);
  const username = router.query.username
  const folder = router.query.folder
  
  useEffect(() => {
      console.log(router.pathname)
      const data = CardDataService.readByFolderName(username as string, folder as string).then((data)=>{
        setCurrentState(data)
        console.log(data)
      })
  }, [username])

  const PhotoZoonCard = () => {
    return (
      <Box>
          <Grid container>
            <Grid item md={6}>
              <img src={currentState2.img} style={{ maxWidth: 410, borderRadius:4, border: '1px solid #302D2C'  }}/>
            </Grid>
            <Grid item md={6}>
              <Typography component="div" variant="h5" pb={1}>
                {currentState2.title}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" component="div">
                {currentState2.body}
              </Typography>
            </Grid>
          </Grid>
        </Box>
    )
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

  const CardItem = (props: { item: any; }) => {
    const item = props.item
    const [expanded, setExpanded] =  useState(false);
    const handleOpen = (obj: SetStateAction<ss>) => {
      if (window.innerWidth > 700){
        console.log(obj);
        setCurrentState2(obj)
        setOpen(true)
      }
    }
    const handleExpandClick = () => {
      setExpanded(!expanded);
    };
   
    return (
      <Box style={{"padding": "0px"}}>
      <Card raised>
        <BrowserView>
          <CardMedia
            height={300} 
            onClick = {() => {handleOpen({...item})}}
            component="img"
            image={item.img}
          />
        </BrowserView>
        <MobileView>
          <CardMedia
            component="img"
            image={item.img}
          />
        </MobileView>
        
        <CardContent sx={{ pt:1.5, '&:last-child': { pb: 0.4 }}}>
          <Grid container rowSpacing={1} columnSpacing={1}>
            <Grid item md={10} xs={10}>
              <Typography variant="h6" color="text.secondary">
                {item.title}
              </Typography>
            </Grid>
            <Grid item md={2} xs={2} >
              <ExpandMore
                expand={expanded}
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label="show more">
                <ExpandMoreIcon fontSize="small"/>
              </ExpandMore>
            </Grid>
          </Grid>
        </CardContent>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent  sx={{ pt:0, '&:last-child': { pb: 0 }}}>
            <Typography paragraph>
              {item.body}
            </Typography>
          </CardContent>
        </Collapse>
      </Card>
    </Box>
    )
  }
  return (
    <>
    <CssBaseline />
       <Dialog 
        fullWidth
        maxWidth="md"
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        >
      <DialogContent>
        <PhotoZoonCard/>
      </DialogContent>
    </Dialog>
      <Container maxWidth="lg"><br/>
        <Grid container rowSpacing={2} columnSpacing={2}>
          {
            currentState.map((item, key) => (
              <Grid item xs={12} sm={4} md={3} key={key} >
                <CardItem item={item}/>
              </Grid>
            ))
          }
        </Grid>
      </Container>
      <Copyright/>
    </>
  );
};
export default Show;