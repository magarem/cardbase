import styles from '../../../styles/data.module.scss'
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router'
import { Button, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
import CardDataService from "../../../services/services";
import Upload from '../../../components/Upload'
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useAuth } from '../../../context/AuthContext'
import Box from '@mui/material/Box';
import AlertDialog from '../../../components/AlertDialog'
import Image from 'next/image'

function ShowOk() {
  return <Image src="/ok.png" alt="me" width="64" height="64" />
}

interface Props {
  setuser: Function,
  user: {
    uid: string,
    email: string
  }
}
interface Obj1 {
  id: any;
  img: string; 
  title: string;
  body: string;
  type: any;
  order: number;
}

const Create: NextPage<Props> = (props) => {
  const { user } = useAuth()
  const router = useRouter()

  const [uploadRefresh, setUploadRefresh] = useState(0);
  const [saved, setSaved] = useState({opened: false, txt: ""});

  const cardObj = {id: "", img: "", title: "", body: "", type: "card", order: -1 };
  const [state, setState] = useState<Obj1>(cardObj)
  const [mostra, setMostra] = useState(false)
  
  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    console.log(name, value)
    setState(prevState => ({
      ...prevState,
      [name]: value
    }));
    console.log(state)
  };

  const saveCard = () => {
    let data = { img: state.img, title: state.title, body: state.body, type: state.type, order: -1 };
    CardDataService.create(user.displayName, data)
      .then((x) => {
        console.log("Created new item successfully!");
        console.log(x)
        // setState({ ...state, submitted: true });
        setUploadRefresh(uploadRefresh + 1)
        setMostra(true)
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
      type: state.type||"card",
      order: state.order
    };

    console.log(user.displayName, data)

    CardDataService.update(user.displayName, state.id, data)
      .then((x) => {
        console.log("Update item successfully!");
        console.log(x)
        // setState({...state, submitted: true });
        setUploadRefresh(uploadRefresh + 1)
        setMostra(true)
      })
      .catch((e) => {
        console.log(e);
      });
  }

  useEffect(() => {
    if (router.query.card_id) {
      console.log(user.displayName);
      // CardDataService.readById(router.query.username, router.query.card_id).then((data) => {
      CardDataService.readById(user.displayName, router.query.card_id as string).then((data) => {
        console.log(data)
        if (data) {
          if (data.type == undefined) data.type="card"
          setState({ id: router.query.card_id, title: data.title, body: data.body, img: data.img, type: data.type, order: data.order })
          console.log(state);
        }
      })
    }
  }, [])

  const ActionLink = () => {
    console.log(11);
    setMostra(true)
  }
  if (true) {
    return (
      <div>
        <main className="py-10">
        <AlertDialog time title="" body="" img="/ok.png" mostra={mostra} setMostra={setMostra}/>
          <div className="w-full max-w-3xl px-3 mx-auto">
          {state.id?<h2>Editar</h2>:<h2>Criar</h2>}
            {saved.opened && (<h4>{saved.txt}</h4>)}
            {/* <Button onClick={ActionLink}>mostra</Button> */}
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
                  /><br/><br/>
                    <RadioGroup
                      row
                      aria-labelledby="demo-radio-buttons-group-label"
                      defaultValue="card"
                      name="type"
                      value={state.type}
                      onChange={handleChange}
                    >
                      <FormControlLabel value="card" control={<Radio />} label="Cartão" />
                      <FormControlLabel value="section" control={<Radio />} label="Seção" />
                    </RadioGroup>
                  {/* </Typography><br/>
                  <Typography variant="body2" color="text.secondary"> */}
                    <TextField
                    name="order"
                    label="Order"
                    onChange={handleChange}
                    value={state.order}
                    hidden
                  /><br/>
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