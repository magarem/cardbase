import { storage } from "../config/firebase";
import {
  getStorage,
  ref,
  uploadString,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { useState } from "react";
import Button from '@mui/material/Button';
import { padding } from "@mui/system";
import Resizer from "react-image-file-resizer";
// import AlertDialog from "./AlertDialog";
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Stack from '@mui/material/Stack';
import Modal from '@mui/material/Modal';
import { useAuth } from '../context/AuthContext'
import Box from '@mui/material/Box';

const resizeFile = (file) =>
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

  function Upload(props) {
    const { user } = useAuth()
    console.log(user)
    const [imgURL, setImgURL] = useState("");
    const [progressPorcent, setPorgessPorcent] = useState(0);
    const [spin, setSpin] = useState(false);
    const handleSpin = () => {
      console.log(1);
      setSpin(!spin)
    }
    const handleUpload = async (file) => {
      try {
        setSpin(true)
        // const storage = getStorage(); //firebase storage
        console.log(user.uid);
        //create thumbnail using the function we created before
        const uri = await resizeFile(file);
        const fileName = `thumb_${file.name}.png`; //filename of thumbnail
        console.log(fileName);
        //references to the location in firebase storage where the image will be uploaded
        const thumbRef = ref(storage, `${user.uid}/${fileName}`);
        
        //upload thumbnail, because we are using a uri with 'base64'
        //we have to use 'uploadString' with 'data_url' as the third param
        const thumbSnapshot = await uploadString(thumbRef, uri, "data_url");
    
        //you can store this url in your database or do something else with it
        const thumbUrl = await getDownloadURL(thumbSnapshot.ref);
        console.log(thumbUrl);
        setImgURL(thumbUrl);
        //upload main image, works the same
        // const storageRef = ref(storage, `images/${file.name}`);
        // const snapshot = await uploadBytes(storageRef, file);
    
        //url of the full image.
        //similarly you can upload to a database from here
        // const url = await getDownloadURL(snapshot.ref);
        
        props.setState({...props.state, img:thumbUrl})
        setSpin(false)
        // setImgURL("")
          //     });
      } catch (e) {
        //display an error if something went wrong during the upload
        console.log(`Error uploading image: ${e.code}`);
        // setError(`Error uploading image: ${e.code}`);
      }
    };
    
    const onChange = async (e) => {
      var file_ = e.target.files[0]
      console.log(file_);
      const file = await resizeFile(file_);
      console.log(file);
      const storageRef = ref(storage, `images/${file_.name}`);
      const uploadTask = uploadString(storageRef, file);
      
      // uploadTask.on(
      //   "state_changed",
      //   (snapshot) => {
      //     const progress = Math.round(
      //       (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      //     );
      //     setPorgessPorcent(progress);
      //   },
      //   (error) => {
      //     alert(error);
      //   },
      //   () => {
      //     getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      //       setImgURL(downloadURL);
      //       setState({img:downloadURL})
      //     });
      //   }
      // );
    };
    const handleSubmit = (event) => {
      event.preventDefault();
      const file = event.target[0]?.files[0];
      if (!file) return;

      const storageRef = ref(storage, `images/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setPorgessPorcent(progress);
        },
        (error) => {
          alert(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImgURL(downloadURL);
            setState({img:downloadURL})
          });
        }
      );
    };
  return (
    <>
        {/* <form onSubmit={handleSubmit}> */}
          {/* <input type="file" onChange={onChange}/> */}
          {/* <Button
            variant="contained"
            component="label"
          >
            Enviar imagem
            <input
              type="file"
              // onChange={onChange}
              onChange={(e) => handleUpload(e.target.files[0])}
              hidden
            />
          </Button> */}
          {/* <IconButton color="primary" aria-label="upload picture" component="label">
          <input hidden accept="image/*" type="file" onChange={(e) => handleUpload(e.target.files[0])}
              hidden/>
          <PhotoCamera />
        </IconButton> */}
        
              <img
                  style={{width: "100%"}}
                  src={props.state.img||"https://firebasestorage.googleapis.com/v0/b/receitas-5968d.appspot.com/o/YFxIwZAdyaVpmpNKnDwiv0GyUMR2%2Fthumb_noun-picture-1198149.png.png?alt=media&token=93a229d7-3ae3-46db-b403-1948cc76e4c3"}
                /><br/>
               
              
               <br/>      
        <Button variant="contained" component="label" style={{width: "100%"}} onChange={(e) => handleUpload(e.target.files[0])}>
          Anexar imagem
          <input hidden accept="image/*" multiple type="file" />
        </Button>
        <br/><br/>
        <TextField
                    id="outlined-basic"
                    name="img"
                    label="img"
                    variant="outlined"
                    style={{width: "100%"}}
                    value={props.state.img}
                  />
                  {spin && (<span><br /><CircularProgress /></span>)}
       
          {/* <button>Enviar</button> */}
        <br/>
    </>
  );
}

export default Upload;