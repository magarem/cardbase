import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, Typography } from '@mui/material';
import linkifyHtml from "linkify-html";

function createData(
    value: any
) {
    console.log('value: ', value);
//   return { col1, col2, col3, col4 };
}

const rows: any = [
//   createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
//   createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
//   createData('Eclair', 262, 16.0, 24, 6.0),
//   createData('Cupcake', 305, 3.7, 67, 4.3),
//   createData('Gingerbread', 356, 16.0, 49, 3.9),
];

export default function BasicTable(props: any) {
  console.log('props.rows: ', props);
 
//   props.rows.map((item: any)=>{
//     rows.push({props.cols[0])
//     // item.map((i2: any)=>{
//     //     rows.push(createData(i2))
//     // })
//     // rows.push(createData(item.col[0], item.col[1], item.col[2], item.col[3]))
//   })
    const deleteRow = (row: string) => {
        console.log(row);
        props.deleteRow(row)
    }
    const showRow = (str: string) => {
        return String(str).substring(0,200)
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

    const bodyHtmlGen = (str: string) => {
        return linkifyHtml(str.replace(/\n/g, "<br />"), {
          target: {
            url: "_blank"}})
    }
    if (true){
        return (
            <TableContainer style={{width: '100%', overflowX: 'auto'}} component={Paper}>
            <Table  aria-label="simple table">
                <TableHead>
                <TableRow>
                    <TableCell component="th">Excluir</TableCell>
                    {props.cols.map((col: any) => (
                        <TableCell component="th" key={col}>{col}</TableCell>
                    ))}
                    
                </TableRow>
                </TableHead>
                <TableBody>
                {props.rows.map((row: any) => (
                    <TableRow
                    key={row[props.cols[0]]}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell  scope="row">
                            <Button onClick={()=>{deleteRow(row)}}>X</Button>
                    </TableCell>
                    {props.cols.map((col:any)=>(
                        <TableCell key={row[col]} component="th" scope="row">
                            <Typography variant="body1" dangerouslySetInnerHTML={{ __html: bodyHtmlGen(showRow(row[col])) }}/>
                        </TableCell>
                    ))}
                    
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </TableContainer>
        );
    } else {
        return null
    }
}