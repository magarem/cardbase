import { route } from 'next/dist/server/router'
import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/router'

const Signup = () => {
  const router = useRouter()
  const { user, signup, registerUser, login, logout } = useAuth()
  console.log(user)
  const [data, setData] = useState({
    email: '',
    displayName: '',
    password: '',
  })


  
  const handleSignup = async (e: any) => {
    e.preventDefault()
    
    try {

      registerUser(data.email, data.displayName, data.password).then((user: any) => {
        console.log("User created")
        //  user.reload();
        //  user = useAuth().currentUser;
        logout()
        login(data.email, data.password).then((ret: { user: { displayName: string } })=>{
          console.log(ret.user.displayName);
          router.push(ret.user.displayName + '/adm/list')
        })
        // if (user) router.push(data.displayName + '/adm/list')
      })

      // const ret = await signup(data.email, data.displayName, data.password)
      // console.log(ret)

      // if (auth.currentUser) {
      //   router.push(auth.currentUser.displayName + '/adm/list')
      // }
    } catch (err) {
      console.log(err)
    }

    console.log(data)
  }

  return (
    <div
      style={{
        width: '40%',
        margin: 'auto',
      }}
    ><br/>
      <h3 className="text-center my-3">Registrar</h3>
      <Form onSubmit={handleSignup}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            required
            onChange={(e: any) =>
              setData({
                ...data,
                email: e.target.value,
              })
            }
            value={data.email}
          />
        </Form.Group> 
        <Form.Group className="mb-3" controlId="formBasicUserName">
          <Form.Label>Usuário</Form.Label>
          <Form.Control
            required
            onChange={(e: any) =>
              setData({
                ...data,
                displayName: e.target.value,
              })
            }
            value={data.displayName}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Senha</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            required
            onChange={(e: any) =>
              setData({
                ...data,
                password: e.target.value,
              })
            }
            value={data.password}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Registrar
        </Button>
      </Form>
    </div>
  )
}

export default Signup
