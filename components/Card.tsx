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
export default function MediaCard(props: any) {
  return (
    <Card className={props.cls||''} sx={{ width: '100%', height: 185, backgroundColor: "rgba(0, 0, 0, .7)"}}>
      <CardMedia
        
        onClick={props.cmdImage}
        component="img"
        width={props.width}
        image={props.img}
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div" sx={{marginLeft:-2, marginTop:-1}}>
        {/* <MoreVertIcon fontSize='small'/> */}
        <Button onClick={props.cmdTitle}
            // startIcon={<MoreVertIcon className='handle' fontSize='small'/>}
            // fullWidth={true}
            style={{justifyContent: "flex-start"}}>
            {props.title}
        </Button>
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
  );
}