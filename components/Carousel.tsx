import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MobileStepper from '@mui/material/MobileStepper';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import { CardMedia, TextField } from '@mui/material';
import { useEffect } from 'react';
import { route } from 'next/dist/server/router';
import FullScreenDialog from "./DialogFullScreen";
import { Container } from '@mui/system';
const AutoPlaySwipeableViews = autoPlay(SwipeableViews);
import Image from "material-ui-image";
import { useAuth } from '../context/AuthContext';
let images: { label: any; imgPath: any; }[] = [];

function SwipeableTextMobileStepper(props: any) {
  const [open, setOpen] = React.useState(false);
  const { flagMoveItens } = useAuth()
  
  // useEffect(() => {
    images=[]
    props.imgs.map((item: { value: any; }, index: any) => {
      images.push({label: index, imgPath: item.value}) 
    })
  // },[props])
  
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const [imgZoom, setImgZoom] = React.useState("");
  const maxSteps = images.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };
  
  const ImageZoom = () => {
    console.log(imgZoom);
    return (
      <>
      <Box
        sx={{marginTop:{md:3}}}
        display="flex"
        justifyContent="center"
        alignItems="center"
        // minHeight="100vh"
      >
      <Box
        component="img"
        sx={{
          // height: 233,
          width: '100%',
           maxHeight: { xs: '100%', md: 600},
           maxWidth: { xs: '100%', md: 500 },
        }}
        src={imgZoom}
        />
      </Box>
        {/* <Image src={imgZoom}   style={{maxWidth: '100%',
      height: 'auto',
      padding: 0,
      margin: 0}}/> */}
      <br/>
        <Container><br/>
          <TextField
            id="outlined-textarea"
            label="Endereço da imagem"
            placeholder="Placeholder"
            fullWidth
            value={imgZoom}
            multiline
          />
          {/* <Button onClick={()=>handleClose}>Fechar</Button> */}
        </Container>
      </>
    )
  }
  const handleClickOpen = (img: string) => {
    setImgZoom(img)
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ maxWidth: '100%', flexGrow: 1, margin: 'auto' }} >
    <FullScreenDialog state={open} handleClose={handleClose} >
      <ImageZoom/>
    </FullScreenDialog>
    {/* <Button variant="outlined" onClick={handleClickOpen}>
        Open full-screen dialog
    </Button> */}
      {/* <Paper
        square
        elevation={0}
        sx={{
          display: 'flex',
          alignItems: 'center',
          height: 50,
          pl: 2,
          bgcolor: 'background.default',
        }}
      >
        <Typography>{images[activeStep].label}</Typography>
      </Paper> */}
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={activeStep}
        onChangeIndex={handleStepChange}
        enableMouseEvents
      >
        {images.map((step, index) => (
          <div key={step.label} >
         
            {Math.abs(activeStep - index) <= 2 ? (
              <> 
              <CardMedia height={props.height} component="img" image={step.imgPath} onClick={() => flagMoveItens||handleClickOpen(step.imgPath)}/>
              {/* <Box
                component="img"
                sx={{
                  height: 300,
                  display: 'block',
                  overflow: 'hidden',
                  width: '100%',
                }}
                src={step.imgPath}
                alt={step.label}
              />
             */}
                </>
            ) : null}
            
          </div>
        ))}
      </SwipeableViews>
      <MobileStepper
        steps={maxSteps}
        position={props.position}
        activeStep={activeStep}
        nextButton={
          <Button
            size="small"
            onClick={handleNext}
            disabled={activeStep === maxSteps - 1}
          >
            
            {theme.direction === 'rtl' ? (
              <KeyboardArrowLeft />
            ) : (
              <KeyboardArrowRight />
            )}
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            {theme.direction === 'rtl' ? (
              <KeyboardArrowRight />
            ) : (
              <KeyboardArrowLeft />
            )}
            
          </Button>
        }
      />
    </Box>
  );
}

export default SwipeableTextMobileStepper;