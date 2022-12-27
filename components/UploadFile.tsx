import { useEffect, useState } from "react";
import { storage } from "../config/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Button, IconButton, TextField } from "@mui/material";
import AttachFileIcon from '@mui/icons-material/AttachFile';
function App(props: any) {
    console.log('props: ', props);
    // State to store uploaded file
    
    const [file, setFile] = useState<any>("");
    const [url, setUrl] = useState("");
 
    // progress
    const [percent, setPercent] = useState(0);
 
    // Handle file upload event and update state
    function handleChange(event: any) {
        setFile(event.target.files[0]);
    }

    useEffect(() => {
        if (file!=="") handleUpload()
        
        // return () => {
        //     setProgress(0)
        // };
    }, [file]);

 
    const handleUpload = () => {
        if (!file) {
            alert("Please upload an image first!");
        }
        const storageRef = ref(storage, `/${props.user.uid}/files/${file.name}`);
 
        // progress can be paused and resumed. It also exposes progress updates.
        // Receives the storage reference and the file to upload.
        const uploadTask = uploadBytesResumable(storageRef, file);
 
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const percent = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
 
                // update progress
                setPercent(percent);
            },
            (err) => console.log(err),
            () => {
                // download url
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    console.log(url);
                    setUrl(url)

                    // const index = props.state.findIndex((item: { id: any; }) => item.id == props.index);
                    // console.log(index);
                   
                    const clone = props.state
                    const newId = Date.now().toString(36) + Math.random().toString(36).substr(2);
                    clone.push({id: newId, value: url})
                    console.log(clone)
                    props.setState(clone)
                    // props.setStateExtra([...obj])
                    console.log(props.state);
                    props.setState([...props.state])



                    // props.setState([...props.state, {id: props.index, value: url}])
                });
            }
        );
    };
 
    return (
        <div>
            {/* {JSON.stringify(props.state)} */}
            <TextField
              name="attachedFile"
              label="Url"
              value={url}
              hidden
            />
            <Button variant="contained" component="label" startIcon={<AttachFileIcon />}>
            Anexar arquivo
            <input hidden type="file" onChange={handleChange} accept="file/*" />
            </Button>{(percent>0&&percent<100)&&<>
             {percent} % Enviado</>}
{/*             <button onClick={handleUpload}>Enviar</button>  */}
        </div>
    );
}
 
export default App;