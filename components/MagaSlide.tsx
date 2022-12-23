import { Box, Button, CardMedia } from '@mui/material';
import { useEffect, useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import ReactPlayer from 'react-player'

function UncontrolledExample(props: any) {

  const [state, setState] = useState("");
  
  return (
    <Carousel interval={null}>
        {props.imgs.map((i: any)=>(
            <Carousel.Item key={i.value}>
                <div className="container2">
                    <CardMedia
                        component="img"
                        height="200"
                        image={i.cover||i.value}
                    />
                    <Button onClick={props.onClickMidia} className='btnHandleDrag2' color="secondary" sx={{ height: '40%', width: '40%' }}>
                    </Button>
                </div>
            </Carousel.Item>
            ))
        }
    </Carousel>
  )
}

export default UncontrolledExample;