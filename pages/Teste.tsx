import type { NextPage } from "next";
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from "react";
import { Router } from "next/router";
import { useRouter } from 'next/router';
import Link from "next/link";
import { Box, Button, Slide } from "@mui/material";
import { useAuth } from '../context/AuthContext'
import MagaSlide from '../components/MagaSlide'

const List: NextPage = () => {
  const { user, setUser, flagMoveItens, setFlagMoveItens, logout } = useAuth();

  const router = useRouter()
  const [state, setState] = useState("")
  const [state2, setState2] = useState(false)
  let a: boolean = false
  let b: number = 0
  let c: string = ''
  // console.log(1)
  const handleInput = (t: any) => {
    // console.log(t.value)
    c = t
    // console.log(c)
    setState(t)
  }

  const userEmailChange = () => {
    // console.log(user);
    
    setUser({...user, email: 'fifi@fifi.com'})
  }

  // console.log(c)
  // console.log('k')
  // console.log('k1')
  // console.log('k2')
  
  // if (state=='oi') {
  //   b++
  //   if (!a) {
  //     console.log(b)
  //     // a = true
  //   }
  // }
  console.log(user)
  useEffect(()=>{
    console.log('entrada')
    return () => console.log('saida')
  },[]) 



  return (
   
    <Typography variant="h5" gutterBottom mt={11} ml={0} mb={2}>
      <MagaSlide/>
     
    </Typography>
 
  );
};
export default List;