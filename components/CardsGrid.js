import CardItem from './CardItem';
import { useState } from "react";
import { useRouter } from "next/router";
import CardDataService from "../services/services";
import { ReactSortable } from "react-sortablejs";

function CardsGrid(props){

  const [state, setState] = useState([]);
  const router = useRouter()
  
  // Drag and Drop Handler
  const onDragDropEnds = (oldIndex, newIndex) => {
    props.currentState.map((item, index) => {
      const objToUpdate = {id: item.id, ...item, order: index}
      CardDataService.update(props.user.displayName, item.id, objToUpdate)
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
          key={item.id} 
          user={props.user} 
          item={item} 
          currentState={props.currentState} 
          setCurrentState={props.setCurrentState}
        />
      ))}
    </ReactSortable>
  )
}

export default CardsGrid