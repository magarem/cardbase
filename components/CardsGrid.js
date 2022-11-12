import CardItem from './CardItem';
import { useState } from "react";
import { useRouter } from "next/router";
import CardDataService from "../services/services";
import { ReactSortable } from "react-sortablejs";
import { useAuth } from '../context/AuthContext';

function CardsGrid(props){
  const { user } = useAuth()
  console.log(user);
  // Drag and Drop Handler
  const onDragDropEnds = (oldIndex, newIndex) => {
    props.currentState.map((item, index) => {
      if (item.cardSession == undefined) item.cardSession = ""
      const objToUpdate = {id: item.id, ...item, order: index}
      CardDataService.update(user.uid, item.id, objToUpdate)
    })
  }
  return (
    <ReactSortable 
      handle=".handle"
      className="grid-container"
      list={props.currentState} 
      setList={(newlist) => props.setCurrentState(newlist)}
      onEnd={({ oldIndex, newIndex }) => onDragDropEnds(oldIndex, newIndex)}>
      {props.currentState.map((item) => (
        <CardItem 
          handleOpen={props.handleOpen}
          key={item.id} 
          item={item} 
          currentState={props.currentState} 
          setCurrentState={props.setCurrentState}
        />
      ))}
    </ReactSortable>
  )
}

export default CardsGrid