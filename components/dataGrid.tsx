import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, TextField } from '@mui/material';


interface Obj1 {
    key: any;
    value: any;
}

export default function BasicTable(props: { stateExtra: React.SetStateAction<Obj1[]>; setStateExtra: (arg0: Obj1[]) => void; }) {

    const tblObj = [{key: "", value: ""}];
    const [stateExtra, setStateExtra] = React.useState<Obj1[]>(tblObj)

    React.useEffect(() => {
        //Typical usage, don't forget to compare the props
        console.log(JSON.stringify(props.stateExtra));
        
        if (JSON.stringify(props.stateExtra) !== JSON.stringify(stateExtra)) {
            console.log(props.stateExtra);
            setStateExtra(props.stateExtra)
        }
    },[props.stateExtra])

  
    
    React.useEffect(() => {
        props.setStateExtra(stateExtra)
    },[stateExtra])
    
    
    const updateFieldChanged = (index: number) => (e: { target: { name: string; value: string; }; }) => {
        console.log('index: ' + index);
        console.log('property name: '+ e.target.name);
        let newArr = [...stateExtra];
        if (e.target.name == 'key'){
            newArr[index][e.target.name] = e.target.value.substring(0,20).replace(' ','_').normalize('NFD').replace(/[\u0300-\u036f]/g, "")
        }
        if (e.target.name == 'value'){
            newArr[index][e.target.name] = e.target.value.trim(); 
        }
        
        setStateExtra(newArr)
      }
    
    const rowAdd = () => {
        setStateExtra([...stateExtra, {key: "", value: ""}])
    }
    
    const itemDel = (index: number) => {
        setStateExtra(stateExtra.filter((x, i:any) => i !== index))
    }

  return (
    <>
        {/* {JSON.stringify(stateExtra)} */}
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 400 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Chave</TableCell>
            <TableCell align="center">Valor</TableCell>
            <TableCell align="center">Excluir</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
            
          {stateExtra.map((row, index) => (
            <TableRow 
              key={index}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell width={200} key={'keyss_'+index} align="center" component="th" scope="row">
              <TextField 
                    key={'key_'+index}
                    id="outlined-basic"
                    fullWidth
                    name="key"
                    variant="outlined"
                    onChange={updateFieldChanged(index)}
                    value={stateExtra[index].key}
                    />
              </TableCell>
              <TableCell align="center">
                <TextField 
                 key={'value_'+index}
                    id="outlined-basic"
                    fullWidth
                    name="value"
                    variant="outlined"
                    onChange={updateFieldChanged(index)}
                    value={stateExtra[index].value}
                    />
              </TableCell>
              <TableCell align="center">
                <Button onClick={()=>itemDel(index)}>x</Button>
              </TableCell>
            </TableRow>
           
          ))}
           <TableRow>
                <TableCell colSpan={3}><Button onClick={rowAdd}>Nova linha</Button></TableCell>
            </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
    </>
  );
}

