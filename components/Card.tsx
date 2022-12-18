import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { maxHeight } from '@mui/system';
import Link from 'next/link';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import OpenWithIcon from '@mui/icons-material/OpenWith';
import IconButton from '@mui/material/IconButton';

export default function MediaCard(props: any) {
  return (
    <>
        
    <Card className={props.cls||''} sx={{ width: '100%', minHeight: {xs:170, sm:190, md:150}, backgroundColor: "rgba(0, 0, 0, .7)"}}>
    <div className="container">
      <CardMedia
        sx={props.sx_||{}}
          onClick={props.cmdImage}
          component="img"
          // width={props.width}
          image={props.img}
      />
      <IconButton className={props.flagAction?'btnHandleDrag handle':'btnHandleDrag hide'}><OpenWithIcon/></IconButton></div>

      <CardContent>
        <Typography onClick={props.cmdTitle} align="center"  variant="subtitle1" component="div" sx={{marginTop:-1}}>
        {/* <MoreVertIcon fontSize='small'/> */}
      
            {props.title}
          {/* <DragIndicatorIcon className='handle'/>
          <Button onClick={props.cmdTitle}>
            {props.title} 
          </Button> */}
        </Typography>
        {props.body&&
        <Typography variant="body2" color="text.secondary">
            {props.body}
        </Typography>
        }
      </CardContent>
      {/* <CardActions>
        {props.children}
        <Button size="small">Share</Button>
        <Button size="small">Learn More</Button>
      </CardActions>  */}
    </Card>
   
    </>
  );
}