import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Button, Icon, IconButton, Typography } from '@mui/material';
import linkifyHtml from "linkify-html";
import Modal from "../Modal";
import FormTable from "./FormTable"
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ViewHeadlineIcon from '@mui/icons-material/ViewHeadline';
import Image from 'react-bootstrap/Image'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { ReactSortable } from "react-sortablejs";
import {arrayMoveImmutable} from 'array-move'
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import  Droppable  from "../StrictModeDroppable";
import DragHandleIcon from '@mui/icons-material/DragHandle';

const rows: any = [];
let reset = (obj: any) => {
    Object.keys(obj).map(key => {
      if (obj[key] instanceof Array) obj[key] = []
      else obj[key] = ''
    })
  }
export default function SimpleTable(props: any) {
   
    let formFields: any = {}
    const [open, setOpen] = React.useState(false);
    const [data, setData] = React.useState<any>({})
    const [selectedIndex, setSelectedIndex] = React.useState<number>(0)
    const [handleSideMenu, setHandleSideMenu] = React.useState<boolean>(false)

    const handleDragEnd = (e: any) => {
        if (!e.destination) return;
        let tempData = props.rows;
        let [source_data] = tempData.splice(e.source.index, 1);
        tempData.splice(e.destination.index, 0, source_data);
        props.setRows(props.table,tempData)
        // props.setRows(props.table, [...arrayMoveImmutable(props.rows, index, index-1)])

      };
  
    const selectedRow = async (value: any) => {
        console.log('value: ', value);
        console.log('props.rows: ', props.rows);
        
        props.cols.map((i: any)=>formFields[i.name] = '')
        setData({...formFields, ...value})
        setTimeout(() => {
            setOpen(true)
           }, 0)
    }
    
    const deleteRow = (value: any) => {
        if (confirm('Confirma exclusão de registro?')){
            let r = props.rows.filter((item: any) => item !== value)
            console.log('props.rows: ', props.rows);
            console.log('r: ', r);
            // props.setRows(r) 
            props.setRows(props.table, [...r])
            setData({})
        }
        
    }

    const ShowFile = (str: string) => {
        return String(str).substring(0,200)
    } 

    const bodyHtmlGen = (str: any) => {
        if (str){
            return linkifyHtml(str.replace(/\n/g, "<br />"), {
                target: {
                url: "_blank"}})
        }
    }

    const ShowDataFromSelectBox = ({value, options}: any) => {
        let ret = options.find((x: any)=>x[0] == value)
        return <ShowText variant='subtitle1' str={ret?.length>0?ret[1]:''} />
    }

    const ShowAttachedFile = ({url}: any) => {
        if (url) {
          if (isImage(url)){
            return <Image width={75} src={url} thumbnail />
          }else{
            return <a href={url} download target="_blank"><InsertDriveFileIcon/></a>
          }
        }else{
            return <></>
        }
       
    }

    const add = () => {
        props.cols.map((i: any)=>formFields[i.name] = '')
        formFields.id = Date.now().toString(36) + Math.random().toString(36).substring(2);
        setData({...formFields})
        setOpen(true)
    }

    React.useEffect(()=>{
        props.handleRefresh()
    },[])

    React.useEffect(()=>{

        let data_ = {...data}
        delete data_.id
        let isFormEmpty = Object.values(data_).join().replaceAll(',','').length==0
        
        console.log('isFormEmpty: ', isFormEmpty);
        
        if (!isFormEmpty) {
            let index = props.rows?.findIndex((x: any)=>x.id==data.id)
            if (index>-1){
                //Edition
                let cc = props.rows
                cc[index] = data
                setTimeout(() => {
                  console.log('props.table, [...cc]: ', props.table, [...cc]);
                  props.setRows(props.table, [...cc])
                }, 10)
            }else{
                //New record created
                //Edition
                let cc = props.rows||[]
                cc.push(data)
                props.setRows(props.table, [...cc])
            }
            console.log('Data changed in component', data);
        }
    },[data])

    function isImage(url: string) {
        if (url) { url = url.split('?')[0]
          return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
        }
    }

    const ShowText = ({variant, str}: any) => {
        return <Typography component='article' variant={variant} dangerouslySetInnerHTML={{ __html: bodyHtmlGen(str) }}/>
    }

    const TableCellContent = ({type, col, row}: any) => {
        if (type === "string") {
            return <ShowText variant='subtitle1' str={row[col.name]}/>
        }
        if (type === "select") {
            return <ShowDataFromSelectBox  value={row[col.name]} options={col.options}/>
        }
        if (type === "file") {
            return <ShowAttachedFile url={row[col.name]} />
        }else{
            return null
        }
    }

    const ColsShow = ({cols, row, index}: any) => {
        return (
            <> 
                {cols.filter((col: any) => !col.hidden).map((col: any, index2: any)=>(
                  <TableCell align='left' key={Date.now().toString(36) + Math.random().toString(36).substring(2)} component="th" scope="row">
                    <TableCellContent type={col.type} col={col} row={row} />
                  </TableCell>
                ))}
            </>
        )
    }

    if (props.cols){
    return (
        <>
            <Modal 
                open={open} 
                setOpen={setOpen} 
                title={props.title}
                >
                <FormTable user={props.user} cols={props.cols} setOpen={setOpen} data={data} setData={setData}/>
            </Modal>
            <TableContainer sx={{width: "max-content"}} component={Paper}>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Table size={props.tableDesity ? 'small' : 'medium'} style={{  width: "auto", tableLayout: "auto" }} aria-label="simple table">
                    <TableHead>
                    <TableRow sx={{backgroundColor: "#1C2833"}}>
                        {/* <TableCell  align='center' component="th" scope="row" ><IconButton onClick={()=>props.setTableDesity(!props.tableDesity)}><ViewHeadlineIcon/></IconButton></TableCell> */}
                        {/* <TableCell width={0} align='center' component="th" scope="row" ><IconButton onClick={()=>setHandleSideMenu(!handleSideMenu)}><ViewHeadlineIcon/></IconButton></TableCell> */}
                        <TableCell width={0} align='center' component="th" scope="row" >Comandos</TableCell>
                        {props.cols&&props.cols.filter((col: any) => !col.hidden).map((col: any)=>(
                            <TableCell component="th" key={Date.now().toString(36) + Math.random().toString(36).substring(2)}>
                                <ShowText variant='subtitle1' str={col.label}/>
                            </TableCell>
                        ))}
                        <TableCell component="th" scope="row"></TableCell>
                    </TableRow>
                    </TableHead>
                    <Droppable droppableId="droppable-1">
                    {(provider) => (
                    <TableBody  className="text-capitalize"
                    ref={provider.innerRef}
                    {...provider.droppableProps}>
                        {props.rows&&props.rows.map((row: any, index: number) => (
                           <Draggable
                            key={row.id}
                            draggableId={row.id}
                            index={index}
                          >
                            {(provider) => (
                                <TableRow  key={row.id} {...provider.draggableProps} ref={provider.innerRef}  > 
                                   <TableCell width={140} component="th" scope="row">
                                        <IconButton {...provider.dragHandleProps} ><DragHandleIcon fontSize='small'/></IconButton>
                                        <IconButton onClick={()=>selectedRow(row)} ><EditIcon fontSize='small' /></IconButton>
                                        <IconButton onClick={()=>deleteRow(row)} ><DeleteIcon fontSize='small' /></IconButton>
                                    </TableCell>
                                    <ColsShow cols={props.cols} row={row} index={index} />
                                    <TableCell component="th" scope="row"></TableCell>
                                </TableRow>
                                )}
                            </Draggable>
                        ))}
                       
                       {provider.placeholder}

                        <TableRow sx={{backgroundColor: "#1C2833"}}>
                            <TableCell colSpan={props.cols.length}> 
                                <Button size='small' variant="contained" onClick={()=>add()} startIcon={<AddCircleIcon />}>
                                    Novo registro
                                </Button>
                            </TableCell>
                            <TableCell  component="th" scope="row"></TableCell>
                            {/* <TableCell  component="th" scope="row"></TableCell> */}
                        </TableRow>
                    </TableBody>
                     )}
                     </Droppable>
                </Table>
            </DragDropContext>
            </TableContainer>
        </>
    );
}
}
