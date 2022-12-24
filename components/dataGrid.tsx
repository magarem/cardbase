import * as React from 'react';
import { Box, Button, IconButton, Stack, TextField } from '@mui/material';
import Upload from './Upload'
import HighlightOff from '@mui/icons-material/HighlightOff';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { ReactSortable } from "react-sortablejs";
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import AddIcon from '@mui/icons-material/Add';
import dynamic from 'next/dynamic'
// import Image from 'next/image'
interface Obj1 {
    id: any
    key: any;
    value: any;
    midia: string;
}
export default function BasicTable(props: { width: string | number; user: any; optColumKey: boolean; stateExtra: any; setStateExtra: any; }) {

    const updateFieldChanged = (index: number) => (e: { target: { name: string; value: string; }; }) => {
        console.log('index: ' + index);
        console.log('property name: '+ e.target.name);
        let newArr = [...props.stateExtra];
        if (e.target.name == 'key'){
            newArr[index][e.target.name] = e.target.value.substring(0,20).replace(' ','_').normalize('NFD').replace(/[\u0300-\u036f]/g, "")
        }
        if (e.target.name == 'value'){
            newArr[index][e.target.name] = e.target.value 
        }
        props.setStateExtra(newArr)
      }
    
    const rowAdd = () => {
      const timestamp = new Date().getTime().toString(36)
      const x = props.stateExtra.length
      props.setStateExtra([...props.stateExtra, { id: timestamp, key: "", value: ""}])
    }

    const rowUpdate2 = (obj: {id: any, key: string, value: string;}) => {
      // const index = obj.id   
      // console.log(index);
      console.table(obj);
      
      const index = props.stateExtra.findIndex((item: { id: any; }) => item.id === obj.id);
      console.log(index);
     
      const clone = props.stateExtra
      clone[index] = obj
      console.log(clone)
      props.setStateExtra(clone)
      // props.setStateExtra([...obj])
      console.log(props.stateExtra);
      props.setStateExtra([...props.stateExtra])
      
    } 
    
    const rowUpdate = (obj: {id: any, key: string, value: string;}) => {
      // const index = obj.id   
      // console.log(index);
      console.table(obj);
      
      const index = props.stateExtra.findIndex((item: { id: any; }) => item.id == obj.id);
      console.log(index);
     
      const clone = props.stateExtra
      clone[index] = obj
      console.log(clone)
      props.setStateExtra(clone)
      // props.setStateExtra([...obj])
      console.log(props.stateExtra);
      props.setStateExtra([...props.stateExtra])
      
    }
    
    const itemDel = (index: number) => {
      props.setStateExtra(props.stateExtra.filter((x: any, i:any) => i !== index))
    }

    function isImage(url: string) {
      url = url.split('?')[0]
      
      if (/\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url)){
        // preloadImage(url)
        return true
      }else{
        return false
      }
      
    }

    const deleteImage = (index: any, id: any) => {
      console.log({...props.stateExtra[index], id: id, value: ''});
      rowUpdate({...props.stateExtra[index], id: id, value: ''})
    }

    function Image({ url }: any) {
      const onLoad = () => {
        console.log("loaded");
      };
      return <img src={url} style={{ maxWidth: '250px', maxHeight: '300px', marginBottom: 5, marginTop: 10 }} onLoad={onLoad} />;
    }
  return (
    <ReactSortable 
      className="grid-container2"
      handle=".handle"
      list={props.stateExtra} 
      setList={(newlist) => props.setStateExtra(newlist)}
      // onEnd={({ oldIndex, newIndex }) => onDragDropEnds(oldIndex, newIndex)}
      >
      {props.stateExtra.map((row: any, index: number, arr: any) => { 
        return (
            <Stack key={'box_'+index} direction="column" justifyContent="top" style={{width: '250px', backgroundColor: '#171717'}}>
              <TextField 
                    style = {{maxWidth: 250}}
                    fullWidth
                    placeholder='Link'
                    key={'link_'+index}
                    id="outlined-basic"
                    name="cover"
                    variant="outlined"
                    onChange={updateFieldChanged(index)}
                    value={props.stateExtra[index].cover}
                    />
              {props.optColumKey&&
                <>
                  <TextField 
                    key={'id_'+index}
                    id="outlined-basic"
                    fullWidth
                    name="id"
                    variant="filled"
                    onChange={updateFieldChanged(index)}
                    value={props.stateExtra[index].id}
                    hidden
                    />
                  
                  <TextField 
                    style = {{maxWidth: 250}}
                    fullWidth
                    placeholder='Chave'
                    key={'key_'+index}
                    id="outlined-basic"
                    name="key"
                    variant="outlined"
                    onChange={updateFieldChanged(index)}
                    value={props.stateExtra[index].key}
                    />
                 
                </>
              }
              {(props.stateExtra[index].value)&&
                <>
                  {isImage(props.stateExtra[index].value)&& 
                    <Image url={props.stateExtra[index].value}/>
                  }
                </>
              }
              {!isImage(props.stateExtra[index].value)&&
                <TextField 
                  style = {{maxWidth: 250}}
                  fullWidth
                  placeholder='Valor'
                  key={'value_'+index}
                  id="outlined-basic"
                  
                  name="value"
                  variant="outlined"
                  // onBlur={checkIfIsAImage}
                  onChange={updateFieldChanged(index)}
                  value={props.stateExtra[index].value}
                />
              }
            
              <Box>
                <Button style={{maxWidth: '30px', maxHeight: '30px', minWidth: '30px', minHeight: '30px'}} className="handle" ><DragIndicatorIcon/></Button>
                {!isImage(props.stateExtra[index].value)&& 
                  <Upload key={'key_'+index} user={props.user} imgFieldName='value' state={props.stateExtra[index]} setState={rowUpdate2} /> 
                }
                {isImage(props.stateExtra[index].value)&& 
                  <IconButton color="primary" aria-label="upload picture off" component="label" onClick={() => deleteImage(index, props.stateExtra[index].id)}>
                    <HighlightOff />
                  </IconButton>
                }
                <Button style={{maxWidth: '30px', maxHeight: '30px', minWidth: '30px', minHeight: '30px'}} onClick={()=>itemDel(index)}><RemoveCircleOutlineIcon/></Button>
              </Box>
            </Stack>
        
      )})}
            <Stack direction="column" justifyContent="center" style={{width: '250px', backgroundColor: '#171717'}}>
              <Button onClick={rowAdd}><AddIcon/></Button>
            </Stack>
    </ReactSortable>
  );
}

