import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Button, Card, CardMedia, Grid, IconButton, InputAdornment, MenuItem, Select, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import FirebaseUpload from '../FirebaseUpload'
import ClearIcon from '@mui/icons-material/Clear';
function isImage(url: string) {
  if (url) { url = url.split('?')[0]
    return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
  }
}
let a = 0
export default function FormTable({ user, data, setData, cols, setOpen }: any) {
  const [state, setState] = useState(data);
  const [flag, setFlag] = useState(false);
  const [uploadField, setUploadField] = useState([]);
  
  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    console.log('name, value: ', name, value);
    // data[name] = value
    setState({...state, [name]:value})
    console.log('data: ', data);
  }

  const handleUpload = (field: string, url: string) => {
    console.log(field, url);
    setState({...state, [field]:url})
  }
  
  
  const ShowItem = (value: any) => {
    value = value.value
    if (isImage(value)){ 
      return (
        <Card sx={{ width: 150, maxHeight: 200 }}>
          <CardMedia
            component="img"
            height="100%"
            width="100%"
            image={value}
          />
        </Card>
      )
    }else{
      return (
        <ShowText variant='subtitle1' str={value} />
      )
    }
  }

  const save = () => {
    console.log('state: ', state);
   
    setData(state)
    // setOpen(false)
    setTimeout(() => {
      setOpen(false)
     }, 0)
    
    // setOpen(false)
  }
  const ShowText = ({variant, str}: any) => {
    // return <Typography variant={variant} >{str}</Typography>
    return <Typography variant={variant} dangerouslySetInnerHTML={{ __html: str }}/>
  }
  if (state) {
    return (
      <TableContainer className="ablock" component={Box}  sx={{
        width: {
          xs: '100%', // theme.breakpoints.up('xs')
          sm: '100%', // theme.breakpoints.up('sm')
          md: 300, // theme.breakpoints.up('md')
          lg: 400, // theme.breakpoints.up('lg')
          xl: 500, // theme.breakpoints.up('xl')
        },
      }}>
        <Table size="small" padding='normal' aria-label="a dense table" style={{
            // minWidth: 650,
            // borderCollapse: 'separate',
            borderSpacing: '0px',
            padding: 100
        }}>
          <TableBody>
            {state&&Object.entries(state).filter(([key, value]) => key!=='id').map((row: any, index: number) => (
             <TableRow
                key={row[0]}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell align='right' component="th" scope="row" style={{borderBottom:"none"}}>
                    <ShowItem value={cols[index+1].label} />
                </TableCell>
                <TableCell component="th" scope="row" style={{borderBottom:"none"}}>
                  {cols[index+1].type=='select'&&
                    <Select
                      displayEmpty
                      name={cols[index+1].name} 
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={state[cols[index+1].name]}
                      onChange={handleChange}
                    >
                      <MenuItem value=''>Selecione</MenuItem>
                      {cols[index+1].options?.map((i: any)=>{
                        return (
                          <MenuItem key={i[0]} value={i[0]}>{i[1]}</MenuItem>
                        )
                      })}
                    </Select>
                  }
                  {cols[index+1].type=='string'&&
                    <>
                      <TextField size="small" name={cols[index+1].name} value={state[cols[index+1].name]} onChange={handleChange}/>
                    </>
                  } 
                  {cols[index+1].type=='file'&&
                   <TextField size="small" sx={{width:235}} name={cols[index+1].name} value={state[cols[index+1].name]} onChange={handleChange}  
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start" style={{width:60, marginLeft:-10}}>
                               <FirebaseUpload dirTarget={user.id + '/files'} name={cols[index+1].name} handleUpload={handleUpload} />
                            </InputAdornment>
                          ),
                            endAdornment: (
                              <>
                                <IconButton
                                  sx={{ visibility: state[cols[index+1].name] ? "visible" : "hidden" }}
                                  onClick={()=>{setState({...state, [cols[index+1].name]:''})}}
                                >
                                  <ClearIcon/>
                                </IconButton>
                              </>
                                  ),
                           }}/>
                  }
                </TableCell>
                
                {/* <TableCell align='left' component="th" scope="row" style={{borderBottom:"none"}} >
                {cols[index+1].type=='file'&&
                    <FirebaseUpload  dirTarget={user.id + '/files'} name={cols[index+1].name} handleUpload={handleUpload} />
                }
                    </TableCell> */}
              </TableRow>
            ))}
             {/* <TableRow>
                <TableCell align="right" colSpan={2} component="td" scope="row" >
                 
                </TableCell>
             </TableRow> */}
          </TableBody>
        </Table>
        <Box sx={{ marginTop:3, display: 'flex', justifyContent: 'center' }}>
          <Button variant="contained" color='success' onClick={()=>{save()}} sx={{marginRight:1}}>Save</Button>
          <Button variant="contained" onClick={()=>setOpen(false)}>Cancelar</Button>
        </Box>
      </TableContainer>
    )
  }else{
    return null
  }
}


