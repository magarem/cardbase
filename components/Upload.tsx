import { storage } from "../config/firebase";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { useState } from "react";
import Resizer from "react-image-file-resizer";
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { useAuth } from '../context/AuthContext'
import { Box } from "@mui/material";

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
  const {user} = useAuth()
  const [spin, setSpin] = useState(false);
  const handleUpload = async (file: File) => {
    try {
      setSpin(true)
      const timestamp = new Date().getTime().toString(36)
      const uri = await resizeFile(file) as string;
      const fileName = `${timestamp}_${file.name}`; //filename of thumbnail
      const thumbRef = ref(storage, `${user.uid}/${fileName}`);
      uploadString(thumbRef, uri, 'data_url').then((thumbSnapshot) => {
        getDownloadURL(thumbSnapshot.ref).then((thumbUrl) => {
          props.setState({...props.state, [props.imgFieldName]:thumbUrl})
          setSpin(false)
          console.log(`${fileName} enviado com sucesso`);
        })
      });
    } catch (e: any) {
      console.log(`Error uploading image: ${e.code}`);
    }
  };
  return (
    <>
      {spin?
       
         <CircularProgress size='20px' />
      
        :
        <IconButton color="primary" aria-label="upload picture" component="label">
          <PhotoCamera />
          <input hidden accept="image/*" type="file" onChange={(e: any) => handleUpload(e.target.files[0])} />
        </IconButton> 
      }
    </>
  );
}

export default Upload;