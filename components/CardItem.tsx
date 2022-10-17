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


export default function CardItem({item, user, currentState, setCurrentState, handleOpen}){
   
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
    <Card sx={{ maxWidth: 345 }} key={item.key}>
    
    
      <CardActions disableSpacing>
        <Grid container m={0}>
          <Grid item xs={6} sm={6} md={6}>
          <IconButton aria-label="Edit" onClick={() => callLink("/"+user.displayName+"/adm/create?card_id="+item.id)}>
            <EditIcon onClick={() => callLink("/"+user.displayName+"/adm/create?card_id="+item.id)}/>
          </IconButton>
          <IconButton aria-label="Delete" onClick={() => delete_card(user.displayName, item.id)}>
            <DeleteForeveIcon  onClick={() => delete_card(user.displayName, item.id)}/>
          </IconButton>
          </Grid>
          <Grid item  xs={6} sm={6} md={6} style={{textAlign: "right"}}>
          <IconButton>
            <DragIndicator className="handle"/>
          </IconButton>
          </Grid>
        </Grid>
      </CardActions>
     
     
     
      <CardMedia height={300} component="img" image={item.img} onClick = {() => {handleOpen({...item})}}/>
      <CardContent>
        <Grid container rowSpacing={2} columnSpacing={2}>
          <Grid item md={10}  >
            <Typography variant="h6" color="text.secondary">
              {item.title}
            </Typography>
          </Grid>
          <Grid item md={2}  >
            <ExpandMore
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more">
              <ExpandMoreIcon />
            </ExpandMore>
          </Grid>
        </Grid>
      </CardContent>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>
            {item.body}
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  )
}