import { CardMedia } from '@mui/material';
import Carousel from 'react-bootstrap/Carousel';

function UncontrolledExample(props: any) {
  return (
    <Carousel interval={null}>


            {props.imgs.map((i: any)=>(
              

<Carousel.Item key={i.value}>
{/* <img
  className="d-block w-100"
  src={i.value}
 
/> */}
        <CardMedia
          
          component="img"
          height="200"
          image={i.value}
        />
{/* <Carousel.Caption>
  <h3>First slide label</h3>
  <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
</Carousel.Caption> */}
</Carousel.Item>

            ))
            }




     


      
    </Carousel>
  );
}

export default UncontrolledExample;