import * as React from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeveIcon from '@mui/icons-material/DeleteForever';
import CardDataService from "../services/services";
import { Router, useRouter } from "next/router";
import { DragIndicator } from '@material-ui/icons';

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

interface obj1 {
  id: string;
}
interface obj2 {
  key: string;
}

interface main0 {
    id: string;
    type: string;
    img: string;
    title: string;
    body: string;
    order: number;
  }
interface main {
  key: string;
  item: {
    id: string;
    type: string;
    img: string;
    title: string;
    body: string;
    order: number;
  }
  user: {
    displayName: string;
  }
  currentState: Array<obj1>;
  setCurrentState: (currentState: Array<obj1>) => void;
  handleOpen: (item: object) => void;
}

export default function CardItem({key, item, user, currentState, setCurrentState, handleOpen}: main){
   
  const [expanded, setExpanded] =  React.useState(false);
  const router =  useRouter()

  const callLink = (link: string) =>{
    router.push(link)
  }
  
  const handleRemove = (id: string) => {
    setCurrentState(currentState.filter((item) => item.id !== id))
  };
  
  const delete_card = (user: string, id: string) => {
    if (window.confirm("Confirma exclusão?")) {
      CardDataService.delete(user, id)
      handleRemove(id)
    }
  }

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (  
    <Card sx={{ maxWidth: 345 }} key={item.id}>
      <CardActions  sx={{ p: 0.5, '&:last-child': { pb: 10 }}}>
        <Grid container m={0}>
          <Grid item xs={6} sm={6} md={6}>
          <IconButton aria-label="Edit" onClick={() => callLink("/"+user.displayName+"/adm/create?card_id="+item.id)}>
            <EditIcon fontSize="small"/>
          </IconButton>
          <IconButton aria-label="Delete" onClick={() => delete_card(user.displayName, item.id)}>
            <DeleteForeveIcon fontSize="small"/>
          </IconButton>
          </Grid>
          <Grid item xs={6} sm={6} md={6} style={{textAlign: "right"}}>
          <IconButton>
            <DragIndicator className="handle" fontSize="small"/>
          </IconButton>
          </Grid>
        </Grid>
      </CardActions>
      {item.img&&
      <CardMedia height={300} component="img" image={item.img} onClick = {() => {handleOpen({...item})}}/>
      }
      <CardContent sx={{  pt:1.5, '&:last-child': { pb: 0.4 }}}>
        <Grid container rowSpacing={2} columnSpacing={2}>
          <Grid item md={10}  >
            <Typography variant="h6" color="text.secondary" >
              {item.title}
              {!item.img && <div>{item.body.substring(0, 178)}</div>}
            </Typography>
          </Grid>
          {item.img &&
          <Grid item md={2}  >
            <ExpandMore
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more">
              <ExpandMoreIcon fontSize="small" />
            </ExpandMore>
          </Grid>
          }
        </Grid>
      </CardContent>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent sx={{ pt:1, '&:last-child': { pb: 0 }}}>
          <Typography paragraph>
            {item.body}
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  )
}