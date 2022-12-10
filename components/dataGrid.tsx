import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Button, Card, CardMedia, Grid, IconButton, InputAdornment, TextField } from '@mui/material';
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


  // const onDragDropEnds = (oldIndex, newIndex) => {
  //   props.currentState.map((item, index) => {
  //     if (item.cardSession == undefined) item.cardSession = ""
  //     const objToUpdate = {id: item.id, ...item, order: index}
  //     CardDataService.update(user.uid, item.id, objToUpdate)
  //   })
  // }

    // const tblObj = [{key: "", value: ""}];
    // const [stateUpload, setStateUpload] = React.useState({id:0, key: null, value: null})

    // React.useEffect(() => {
       
    // },[stateUpload])

    // React.useEffect(() => {
    //     props.setStateExtra(stateExtra)
    //     // let y = stateExtra
    // },[stateExtra])
    
    // const DynamicComponent1 = dynamic(() => import('../components/hello1'))
    
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
      // const x_ = parseInt(props.stateExtra[x-1].id) + 1
      // console.log({id: timestamp,  key: "", value: ""});
      props.setStateExtra([...props.stateExtra, { id: timestamp, key: "", value: ""}])
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

    // const setStateExtra_index = (index: number, value: string) => {
    //   const newItems = [...props.setStateExtra];
    //   newItems[index] = value;
    //   props.setStateExtra(newItems);
    // }
    const deleteImage = (index: number) => {
      rowUpdate({...props.stateExtra, id: index, value: ''})
    }

    // React.useEffect(() => {
    //   preloadImage

    // },[])

    function preloadImage (src: string) {
      const DynamicHeader = dynamic(() => import(src), {
        ssr: false,
      })
    }

    function Image({ url }: any) {
      const onLoad = () => {
        console.log("loaded");
      };
      return <img src={url} style={{ width: '200', maxHeight: 200 }} onLoad={onLoad} />;
    }
  return (
    <>
      {/* {JSON.stringify(props.stateExtra)Box} */}
      <TableContainer component="table" sx={{ width: props.width }}>
        <Table sx={{width: '100%' }} aria-label="simple table">
          <TableBody>
            <ReactSortable 
              handle=".handle"
              list={props.stateExtra} 
              setList={(newlist) => props.setStateExtra(newlist)}
              // onEnd={({ oldIndex, newIndex }) => onDragDropEnds(oldIndex, newIndex)}
              >
              {props.stateExtra.map((row: any, index: number, arr: any) => { 
                 
                return (
               
                <TableRow component="tr"
                  key={'key_'+index}
                  sx={{'&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell key={'keyss_'+index} className="handle" align="center" component="th" scope="row">
                    <DragIndicatorIcon/>
                  </TableCell>
                  {props.optColumKey&&
                    <TableCell key={'keysss_'+index} align="center" component="td" scope="row">
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
                        key={'key_'+index}
                        id="outlined-basic"
                        fullWidth
                        name="key"
                        variant="outlined"
                        onChange={updateFieldChanged(index)}
                        value={props.stateExtra[index].key}
                        />
                    </TableCell>
                  }
                  <TableCell align="center">
                    <TextField 
                      key={'value_'+index}
                      id="outlined-basic"
                      fullWidth
                      name="value"
                      variant="outlined"
                      // onBlur={checkIfIsAImage}
                      onChange={updateFieldChanged(index)}
                      value={props.stateExtra[index].value}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <>
                              <IconButton color="primary" aria-label="upload picture" component="label" onClick={() => deleteImage(index)}>
                                <HighlightOff />
                              </IconButton>
                            </>
                          </InputAdornment>
                      )}}
                    />
                  </TableCell>
                  <TableCell width={10} align="center">
                    <Upload key={'key_'+index} user={props.user} imgFieldName='value' state={props.stateExtra[index]} setState={rowUpdate} /> 
                  </TableCell> 
                  <TableCell width={260} align="center">
                    {(props.stateExtra[index].value)&&
                      <>
                      {isImage(props.stateExtra[index].value)&& 
                        <Image url={props.stateExtra[index].value}/>
                      }
                        {/* {isImage(props.stateExtra[index].value)&& */}
                    
                         {/* <img
                            style={{ width: '100', maxHeight: 100 }}
                            src={props.stateExtra[index].value}
                            loading="lazy"
                          /> */}
                        {/* } */}
                       
                      </>
                      }
                  </TableCell>
                  <TableCell width={20} align="center">
                    <Button onClick={()=>itemDel(index)}><RemoveCircleOutlineIcon/></Button>
                    {/* {index + 1 === arr.length&&<Button onClick={rowAdd}><AddIcon/></Button>} */}
                  </TableCell> 
                  {/* <TableCell width={1} align="center">
                  </TableCell> */}
                </TableRow>
              )})}
              <TableRow>
                <TableCell colSpan={props.optColumKey?6:5} align="center">
                    <Button onClick={rowAdd}><AddIcon/></Button>
                </TableCell> 
              </TableRow>
            </ReactSortable>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

