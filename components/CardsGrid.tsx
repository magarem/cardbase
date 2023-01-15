import CardItem from './CardItem';
import { useState } from "react";
import { useRouter } from "next/router";
import CardDataService from "../services/services";
import { ReactSortable } from "react-sortablejs";
import { useAuth } from '../context/AuthContext';
import { Box, Button, ButtonGroup, FormControl, FormControlLabel, FormHelperText, FormLabel, Input, InputLabel, Paper, Radio, RadioGroup, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import Slider from '@mui/material/Slider';
import SelectBoxMulti from './SelectBoxMulti'
// import DataTableCrud from './DataTableCrud'
function CardsGrid(props: any){
  const { user, flagMoveItens } = useAuth()
  // const [gridWidth, setGridWidth]= useState(150)
  const [stateFolderSettings, setStateFolderSettings]= useState({
    gridWidth: 150,
    permissions: 'public'
  })
  // console.log('gridWidth: ', gridWidth);
  // setGridWidth(10)
  // setGridWidth('120px')
  // Drag and Drop Handler
  // let gridWidth = 200
  const onDragDropEnds = (oldIndex: any, newIndex: any) => {
    console.log('parou de mover');
    props.currentState.slice(0).reverse().map((item, index) => {
      if (item.cardSession == undefined) item.cardSession = ""
      const objToUpdate = {id: item.id, ...item, order: index}
      CardDataService.update(user.uid, item.id, objToUpdate)
    })
  }

  // const updateFieldChanged = (index: number) => (e: { target: { name: string; value: string; }; }) => {
  //   console.log('index: ' + index);
  //   console.log('property name: '+ e.target.name);
  //   let newArr = [...props.stateExtra];
  //   if (e.target.name == 'key'){
  //       newArr[index][e.target.name] = e.target.value.substring(0,20).replace(' ','_').normalize('NFD').replace(/[\u0300-\u036f]/g, "")
  //   }
  //   if (e.target.name == 'value'){
  //       newArr[index][e.target.name] = e.target.value 
  //   }
  //   props.setStateExtra(newArr)
  // }
    // const handleChange = (e) => {
    //   console.log(e);
    //   setGridWidth(e)
    // }
  
    const handleChange = (key: string, value: any) => {
      setStateFolderSettings({...stateFolderSettings, [key]: value});
    };
    
    const SelectBoxMulti_options = [
      'Administrado',
      'Colaboradores',
      'Fornecedores',
      'Clientes'
    ];

    return (
      <>
      <FormControl>
        <Box border={1} sx={{marginBottom: 4}}>
        <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
        <TableRow>
            <TableCell  width={150} align="right"><b>Nome :</b></TableCell>
            <TableCell  width={250} align="left">
               teste
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell  width={150} align="right"><b>Display :</b></TableCell>
            <TableCell  width={250} align="left">
                <ButtonGroup variant="contained" aria-label="outlined primary button group">
                <Button onClick={() => handleChange('gridWidth', 100)}>Pequeno</Button>
                <Button onClick={() => handleChange('gridWidth', 150)}>Médio</Button>
                <Button onClick={() => handleChange('gridWidth', 220)}>Grande</Button>
              </ButtonGroup>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
            <TableRow>
              <TableCell  width={150} align="right"><b>Permissões :</b></TableCell>
              <TableCell  width={250} align="left">
                <FormControl>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                  >
                    <FormControlLabel value="private" control={<Radio />} onChange={() => handleChange('permissions', 'private')} label="Privado" />
                    <FormControlLabel value="public"  control={<Radio />} onChange={() => handleChange('permissions', 'public')} label="Publico" />
              
                    <FormControlLabel value="restrict" control={<Radio />} onChange={() => handleChange('permissions', 'restrict')} control={<Radio />} label="Restrito" />
                  </RadioGroup>
                  {stateFolderSettings.permissions=='restrict'&&
                    <SelectBoxMulti names={SelectBoxMulti_options}/>
                  }
                </FormControl>
              </TableCell>
            </TableRow>

            
        </TableBody>
      </Table>
    </TableContainer>
        </Box>
  
</FormControl>
      {props.currentState.length==0?
      <h3></h3>:
      <>
      <ReactSortable 
        handle=".handle"
        animation={200}
        className="grid-container"
        style={{gridTemplateColumns: 'repeat(auto-fill, minmax(' + (stateFolderSettings.gridWidth) + 'px, 1fr))'}}
        list={props.currentState} 
        setList={(newlist) => props.setCurrentState(newlist)}
        onEnd={({ oldIndex, newIndex }) => onDragDropEnds(oldIndex, newIndex)}   
        onChoose={(x)=>{console.log(x.item.getAttribute('data-id'))}}
        // onMove={()=>{console.log("11111")}}
        >
        {props.currentState.map((item: any) => (
        <div key={item.id} >{/*className={flagMoveItens&&'divBlur'}*/}
          <CardItem 
            handleOpen={props.handleOpen}
            key={item.id} 
            item={item} 
            currentState={props.currentState} 
            setCurrentState={props.setCurrentState}
          />
        </div>
        ))}
      </ReactSortable>
      </>
      }
      </>
    )
}

export default CardsGrid