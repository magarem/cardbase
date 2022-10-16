import React, {useContext} from 'react'
import { useAuth } from '../../../context/AuthContext'
const Dashboard = () => {
  const { user } = useAuth()
  return <div>Bem vindo {user.displayName}</div>
}
 
export default Dashboard
