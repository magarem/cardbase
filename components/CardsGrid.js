import CardItem from './CardItem';
import { useState } from "react";
import { useRouter } from "next/router";
import CardDataService from "../services/services";
import { ReactSortable } from "react-sortablejs";
import { useAuth } from '../context/AuthContext';
import { Box } from '@mui/material';

function CardsGrid(props){
  const { user, flagMoveItens } = useAuth()

  // Drag and Drop Handler
  const onDragDropEnds = (oldIndex, newIndex) => {
    console.log('parou de mover');
    props.currentState.slice(0).reverse().map((item, index) => {
      if (item.cardSession == undefined) item.cardSession = ""
      const objToUpdate = {id: item.id, ...item, order: index}
      CardDataService.update(user.uid, item.id, objToUpdate)
    })
  }

  return (
    <>
    {props.currentState.length==0?
    <h3></h3>:
    <ReactSortable 
      handle=".handle"
      animation={200}
      className="grid-container"
      list={props.currentState} 
      setList={(newlist) => props.setCurrentState(newlist)}
      onEnd={({ oldIndex, newIndex }) => onDragDropEnds(oldIndex, newIndex)}   
      onChoose={(x)=>{console.log(x.item.getAttribute('data-id'))}}
      // onMove={()=>{console.log("11111")}}
      >
      {props.currentState.map((item) => (
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
    }
    </>
  )
}

export default CardsGrid