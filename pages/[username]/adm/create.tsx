import styles from '../../../styles/data.module.scss'
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router'
import { Button } from "@mui/material";
import CardDataService from "../../../services/services";
import Upload from '../../../components/Upload'
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useAuth } from '../../../context/AuthContext'
import Box from '@mui/material/Box';

interface Props {
  setuser: Function,
  user: {
    uid: string,
    email: string
  }
}

const Create: NextPage<Props> = (props) => {
  const { user } = useAuth()
  const router = useRouter()

  const [uploadRefresh, setUploadRefresh] = useState(0);
  const [saved, setSaved] = useState({opened: false, txt: ""});

  const cardObj = {id: "", img: "", title: "", body: "", order: -1 };
  const [state, setState] = useState(cardObj)
  
  const handleChange = e => {
    const { name, value } = e.target;
    console.log(name, value)
    setState(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const saveCard = () => {
    let data = { img: state.img, title: state.title, body: state.body, order: -1 };
    CardDataService.create(user.displayName, data)
      .then((x) => {
        console.log("Created new item successfully!");
        console.log(x)
        // setState({ ...state, submitted: true });
        setSaved({opened: true, txt: "Registro salvo com sucesso"})
        setUploadRefresh(uploadRefresh + 1)
        const timeId = setTimeout(() => {
          // After 3 seconds set the show value to false
          setSaved({opened: false})
        }, 3000)
        setState(cardObj)
      })
      .catch((e) => {
        console.log(e);
      });
  }
  
  const updateCard = () => {
    let data = {
      img: state.img,
      title: state.title,
      body: state.body,
      order: state.order
    };

    console.log(user.displayName, data)

    CardDataService.update(user.displayName, state.id, data)
      .then((x) => {
        console.log("Update item successfully!");
        console.log(x)
        // setState({...state, submitted: true });
        setSaved({opened: true, txt: "Registro alterado com sucesso"})
        setUploadRefresh(uploadRefresh + 1)
        const timeId = setTimeout(() => {
          // After 3 seconds set the show value to false
          setSaved({opened: false, txt: ""})
        }, 3000)
      })
      .catch((e) => {
        console.log(e);
      });
  }

  useEffect(() => {
    if (router.query.card_id) {
      console.log(user.displayName);
      CardDataService.readById(router.query.username, router.query.card_id).then((data) => {
        console.log(data)
        if (data) {
          setState({ id: router.query.card_id, title: data.title, body: data.body, img: data.img, order: data.order })
          console.log(state);
        }
      })
    }
  }, [])
  if (true) {
    return (
      <div>
        <main className="py-10">
          <div className="w-full max-w-3xl px-3 mx-auto">
          {state.id?<h1>Editar</h1>:<h1>Criar</h1>}
            {saved.opened && (<h4>{saved.txt}</h4>)}
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
              <Grid item={true} xs={12} sm={12} md={4} sx={{ padding: 2 }} style={{textAlign: "center"}} >
                <Upload key={uploadRefresh} user={user} state={state} setState={setState} /> <br />
              </Grid>
              <Grid item={true} xs={12} sm={12} md={8} sx={{ padding: 2 }}>
                {/* <Typography gutterBottom variant="h5" component="div"> */}
                <Box >
                  <TextField
                    id="outlined-basic"
                    name="id"
                    label="id"
                    variant="outlined"
                    onChange={handleChange}
                    value={state.id}
                    hidden
                  />
                  {/* </Typography> */}
                  {/* <Typography gutterBottom variant="h5" component="div"> */}
                  <TextField 
                    id="outlined-basic"
                    fullWidth
                    name="title"
                    label="Titulo"
                    variant="outlined"
                    onChange={handleChange}
                    value={state.title}
                  /><br/><br/>
                  {/* </Typography>
                  <Typography variant="body2" color="text.secondary"> */}
                    <TextField
                    fullWidth
                    name="body"
                    label="Descrição"
                    multiline
                    rows={13}
                    onChange={handleChange}
                    value={state.body}
                  />
                  {/* </Typography><br/>
                  <Typography variant="body2" color="text.secondary"> */}
                    <TextField
                    name="order"
                    label="Order"
                    onChange={handleChange}
                    value={state.order}
                    hidden
                  /><br/><br/>
                  {/* </Typography> */}
                  <Button variant="contained" fullWidth component="label"  onClick={state.id?updateCard:saveCard}>
                    Salvar
                  </Button>
                </Box>
              </Grid>
            </Grid><br/>
          </div>
        </main>
      </div>
    );
  } else {
    return <div>go to login page</div>
  }
};

export default Create;

// export async function getServerSideProps(context) {
//   if (!context.req.cookies['user']) {
//     const { res } = context;
//     res.setHeader("location", "/Login");
//     res.statusCode = 302;
//     res.end();
//     return;
//   }
//   return {
//     props: { user: JSON.parse(context.req.cookies['user']) }, // will be passed to the page component as props
//   }
// }