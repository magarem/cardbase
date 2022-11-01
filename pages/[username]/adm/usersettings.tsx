import { AddBox } from "@material-ui/icons";
import { DeleteForever } from "@material-ui/icons";
import { Create } from "@material-ui/icons";
import { Folder } from "@material-ui/icons";
import { Avatar, Grid, IconButton, InputAdornment, Link, List, ListItem, ListItemAvatar, ListItemText, TextField } from "@mui/material";
import type { NextPage } from "next";
import { type } from "os";
import { ChangeEvent, cloneElement, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useAuth } from "../../../context/AuthContext";
import CardDataService from "../../../services/services";
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';

interface a {
  key: string;
  value: string;
}
let aa = 0

// export async function getServerSideProps() {
//   const entries = await firestore.collection("blogs").get();
//   const entriesData = entries.docs.map((entry) => ({
//   id: entry.id,
//   ...entry.data()
//   }))
//   return {
//   props : {entries: entriesData}
//   }
//   }

const Useraccount: NextPage = () => {
  const [cardFolder, setCardFolder] = useState<a>({key:"", value:""})
  const [state, setState] = useState<any[]>([])
  const { user } = useAuth()
  const save = (data: object) => {
    CardDataService.add(user.displayName, data)
    .then((x) => {
      console.log("Created new item successfully!");
      console.log(x)
    })
    .catch((e) => {
      console.log(e);
    });
  }

  useEffect(() => {
    if (user) {
      const data = CardDataService.readById(user.displayName, "settings").then((data: []) => {
        console.log(data)
        console.log(Object.values(data))
        // const map1 = new Map(Object.values(data))
        // console.log(map1);
        
        setState(Object.values(data))
      })
    }
  }, [user.displayName])
  
  const folderAdd = () => {
    if (cardFolder.value){
      var array = state
      if (cardFolder.key){
        var foundIndex = array.findIndex(x => x.key == cardFolder.key);
        array[foundIndex] = cardFolder;
      }else{
        var array = [{key:generateId(), value:cardFolder.value}, ...state]
      }
      console.log(array);
      setState(array);
      save(array)
      setCardFolder({key:"", value:""});
    }
  }
  
  
  const generateId = () => {
    return Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36)
  }

  const itemRemove = (index: number) => {
    var array = [...state]; 
    array.splice(index, 1);
    setState(array);
  }
  const itemEdit = (index: number) => {
    setCardFolder({key: state[index].key, value:state[index].value})
  }
  return (
    <>
        <h3>Configurações de usuário</h3><br/>
        <h5>Pastas</h5>
        <TextField  name="cardFolder_key" value={cardFolder.key} hidden></TextField>
        <TextField
          name="cardFolder_value"
          value={cardFolder.value}
          style={{width:370, marginTop: 5}}
          placeholder="Nova pasta"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <div color="primary" onClick={()=>folderAdd()}>
                <IconButton edge="end" color="primary" >
                  <ArrowDropDownCircleIcon />
                </IconButton>
                </div>
              </InputAdornment>
            ),
          }} onChange={(e)=>{setCardFolder({key: cardFolder.key, value: e.target.value})}}
        />
       
        {/* <Grid container> */}
        <div style={{width:350}}>
            <List dense={true}>
              {/* {JSON.stringify(state, null, 2)} */}
            {state&&state.map((item, index) => 
              <>
                <ListItem key={item.key}
                  secondaryAction={
                    <>
                      <IconButton sx={{ margin: 1 }} edge="end" onClick={() => itemEdit(index)} aria-label="edit">
                        <Create />
                      </IconButton>
                      <IconButton edge="end" onClick={() => itemRemove(index)} aria-label="delete">
                        <DeleteForever />
                      </IconButton>
                    </>
                  }
                >
                  <ListItemAvatar>
                    <Avatar>
                      <Folder />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    onClick={(event) => itemEdit(index, event)}
                    primaryTypographyProps={{
                      fontSize: 16
                    }}
                    primary={item.value}
                  />
                </ListItem>
                </>
              )
            }
          </List>
          </div>
        {/* </Grid> */}
       
    </>
  )
}

export default Useraccount