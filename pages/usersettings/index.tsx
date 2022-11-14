import { DeleteForever } from "@material-ui/icons";
import { Create } from "@material-ui/icons";
import { Folder } from "@material-ui/icons";
import { Avatar, IconButton, InputAdornment,  List, ListItem, ListItemAvatar, ListItemText, TextField } from "@mui/material";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import CardDataService from "../../services/services";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useRouter } from "next/router";
interface a {
  key: string;
  value: string;
  order: number;
}
let aa = 0

const Usersettings: NextPage = (props) => {
 
  console.log(props);
  const [cardFolder, setCardFolder] = useState<a>({key:"", value:"", order: 0})
  const [state, setState] = useState<any[]>([])
  const { user, getFolders, setFolders } = useAuth()
  const router = useRouter()

  const save = (data: object) => {
    CardDataService.addUserSettings(user.uid, data)
    .then((x) => {
      console.log("Created new item successfully!");
      console.log(x)
    })
    .catch((e) => {
      console.log(e);
    });
  }

  useEffect(() => {
    console.log(getFolders());
    setState(getFolders())
  }, [])
  
  const folderAdd = () => {
    if (cardFolder.value){
      var array = state
      if (cardFolder.key){
        var foundIndex = array.findIndex(x => x.key == cardFolder.key);
        array[foundIndex] = cardFolder;
      }else{
        var array = [{key:generateId(), value:cardFolder.value, order: new Date().getTime()}, ...state]
      }
      console.log(array);
      setState(array);
      setFolders(array)
      save(array)
      setCardFolder({key:"", value:"", order: 0});
      router.push({
        pathname: '/usersettings',
        query: { name: 'Someone' }
    }, '/usersettings');
    }
  }
  
  const generateId = () => {
    return Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36)
  }

  const itemRemove = (index: number) => {
    var array = [...state]; 
    array.splice(index, 1);
    setState(array);
    save(array)
  }
  const itemEdit = (index: number) => {
    setCardFolder({key: state[index].key, value: state[index].value, order: state[index].order})
  }
  const goHome = () => {
    window.location.href = "/home/list"
  }
  return (
    <>
        <h3>Configurações de usuário</h3><br/>
        <h5>Pastas</h5>
        <TextField name="cardFolder_key" value={cardFolder.key} hidden></TextField>
        <TextField
          name="cardFolder_value"
          value={cardFolder.value}
          style={{width:350, marginTop: 5}}
          placeholder="Nova pasta"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <div color="primary" onClick={()=>folderAdd()}>
                <IconButton edge="end" color="primary" >
                  <CheckCircleIcon />
                </IconButton>
                </div>
              </InputAdornment>
            ),
          }} onChange={(e)=>{setCardFolder({key: cardFolder.key, value: e.target.value, order: 0})}}
        />
        <div style={{width:350}}>
          <List dense={true}>
            {state&&state.map((item, index) => {
              return (
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
                    }>
                    <ListItemAvatar >
                      <Avatar>
                        <Folder />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      onClick={() => itemEdit(index)}
                      primaryTypographyProps={{
                        fontSize: 16
                      }}
                      primary={item.value}
                    />
                  </ListItem>
              )})
            }
          </List>
          </div>
    </>
  )
}

export default Usersettings