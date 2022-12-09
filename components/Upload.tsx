import { storage } from "../config/firebase";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { useState } from "react";
import Resizer from "react-image-file-resizer";
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import HighlightOff from '@mui/icons-material/HighlightOff';
import { useAuth } from '../context/AuthContext'
import InputAdornment from '@mui/material/InputAdornment';
import { Button, Card, CardMedia } from "@mui/material";

const resizeFile = (file: Blob) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      700,
      700,
      "JPEG",
      100,
      0,
      (uri) => {
        resolve(uri);
      },
      "base64"
    );
  });

  function Upload(props: { user: any; setState: (arg0: any) => void; state: { [midiaField: string]: any; }; imgFieldName: any; }) {
    const { user } = useAuth()
    console.log(props)
    const [imgURL, setImgURL] = useState("");
    const [progressPorcent, setPorgessPorcent] = useState(0);
    const [spin, setSpin] = useState(false);
    const handleUpload = async (file: File) => {
      try {
        setSpin(true)
        console.log(user.uid);
        const uri = await resizeFile(file) as string;
        const fileName = `thumb_${file.name}`; //filename of thumbnail
        console.log(fileName);
        const thumbRef = ref(storage, `${user.uid}/${fileName}`);
        uploadString(thumbRef, uri, 'data_url').then((thumbSnapshot) => {
          getDownloadURL(thumbSnapshot.ref).then((thumbUrl) => {
            console.log(thumbUrl);
            setImgURL(thumbUrl);
            props.setState({...props.state, [props.imgFieldName]:thumbUrl})
            setSpin(false)
            console.log('Uploaded a data_url string!');
          })
        });
      } catch (e) {
        //display an error if something went wrong during the upload
        // console.log(`Error uploading image: ${e.code}`);
        // setError(`Error uploading image: ${e.code}`);
      }
    };
    
    const deleteImage = () => {
      props.setState({...props.state, img: ''})
    }
   
  return (
    <>
    {spin?
              <>
                <CircularProgress/>
              </>
              :
              <>
                <IconButton color="primary" aria-label="upload picture" component="label">
                  <PhotoCamera />
                  <input hidden accept="image/*" type="file" onChange={(e: any) => handleUpload(e.target.files[0])} />
                </IconButton> 
              </>
  }
    {/* <IconButton color="primary" aria-label="upload picture" component="label" onClick={() => deleteImage()}>
      <HighlightOff />
    </IconButton> */}
    {/* <Button onClick={()=>{props.setState({id: props.state.id, key: 'rr', value: 'teste'})}}>Teste</Button> */}
  </>
    // <>
    //   {/* {JSON.stringify(props.state)} */}
    //   <TextField
    //     id="outlined-basic"
    //     name="img"
    //     label="img"
    //     variant="outlined"
    //     value={props.state.img}
    //     InputProps={{
    //       endAdornment: (
    //         <InputAdornment position="end">
    //           {spin?
    //           <>
    //             <CircularProgress/>
    //           </>
    //           :
    //           <>
    //             <IconButton color="primary" aria-label="upload picture" component="label">
    //               <input hidden accept="image/*" type="file" onChange={(e: any) => handleUpload(e.target.files[0])} />
    //               <PhotoCamera />
    //             </IconButton> 
    //             <IconButton color="primary" aria-label="upload picture" component="label" onClick={() => deleteImage()}>
    //               <HighlightOff />
    //             </IconButton>
    //             {/* <Button onClick={()=>{props.setState({id: props.state.id, key: 'rr', value: 'teste'})}}>Teste</Button> */}
    //           </>
    //           }
    //         </InputAdornment>
    //     )}}
    //   />
     
    // </>
  );
}

export default Upload;