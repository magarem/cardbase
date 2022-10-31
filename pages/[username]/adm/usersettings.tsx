import { AddBox } from "@material-ui/icons";
import { DeleteForever } from "@material-ui/icons";
import { Create } from "@material-ui/icons";
import { Folder } from "@material-ui/icons";
import { Avatar, Grid, IconButton, InputAdornment, Link, List, ListItem, ListItemAvatar, ListItemText, TextField } from "@mui/material";
import type { NextPage } from "next";
import { ChangeEvent, cloneElement, useState } from "react";
import { Button } from "react-bootstrap";

const Useraccount: NextPage = () => {
  const [cardSession, setCardSession] = useState({key:"", value:""})
  const [state2, setState2] = useState([])
  const sessionAdd = () => {
    var array = state2
    if (cardSession.key){
      var foundIndex = array.findIndex(x => x.key == cardSession.key);
      array[foundIndex] = cardSession;
    }else{
      var array = [{key:generateId(), value:cardSession.value}, ...state2]
    }
    console.log(array);
    setState2(array);
    setCardSession({key:"", value:""});
  }
  
  
  const generateId = () => {
    return Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36)
  }

  const itemRemove = (index: number) => {
    var array = [...state2]; // make a separate copy of the array
    // var index = array.indexOf(e.target.value)
    // if (index !== -1) {
      array.splice(index, 1);
      setState2(array);
    // }
  }

  const itemEdit = (index: number) => {
    setCardSession({key: state2[index].key, value:state2[index].value})
  }
  
  return (
    <>
        <h3>Configurações de usuário</h3><br/>
        <h5>Seções</h5>
        <TextField name="cardSession_key" value={cardSession.key} hidden></TextField>
        <TextField
          name="cardSession_value"
          value={cardSession.value}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <div color="primary" onClick={()=>sessionAdd()}>
                <IconButton edge="end" color="primary" >
                  <AddBox />
                </IconButton>
                </div>
              </InputAdornment>
            ),
          }} onChange={(e)=>{setCardSession({key: cardSession.key, value: e.target.value})}}
        />
       
        <Grid container>
            <List dense={true}>
            {state2&&state2.map((item, index) => 
              <>
                <ListItem key={index}
                  secondaryAction={
                    <><IconButton edge="end" onClick={() => itemRemove(index)} aria-label="delete">
                      <DeleteForever />
                    </IconButton>
                    <IconButton edge="end" onClick={() => itemEdit(index)} aria-label="edit">
                      <Create />
                    </IconButton>
                    </>
                  }
                >
                  <ListItemAvatar>
                    <Avatar>
                      <Folder />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText sx={{width: 200}}
                    primary={item.value}
                  />
                </ListItem>
                </>
              )
            }
          </List>
        </Grid>
       
    </>
  )
}

export default Useraccount