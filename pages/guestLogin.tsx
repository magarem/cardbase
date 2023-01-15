import * as React from 'react';
import DataGridSystem from '../components/SimpleCRUD/DataGridSystem'
import CardDataService from "../services/services";
import { useAuth } from '../context/AuthContext';
import secureLocalStorage  from  "react-secure-storage";

export default function guestLogin() {
    const { setStateRoot, user } = useAuth()
    let guest_groups_that_belong: any
    let guest: any
    // const [dataSource, setDataSource] = React.useState<any>({})
    // const [refresh, setRefresh] = React.useState<any>("init")
    
    // setStateRoot('Magueti!!!')
    // secureLocalStorage.setItem("guest", {
    //     message:  "Magueti!!!",
    // });
    // localStorage.setItem('guest', 'Magueti!!!')
    
    
    const loadDataSource = async (id: string) => {
        return await CardDataService.getUserData(user.uid, 'meta_UserPermissions').then((r: any)=>{
            //Check if system ID exist in databank
           
            if (r[id]){
              // console.log({[id]: r[id]});
              // return {[id]: r[id]}
              return r[id]
                // setDataSource({[id]: r[id]})
                // setDataSource({[id]: r[id]})
            }else{
                // setDataSource({})
            }
        })
      }
    
    
    React.useEffect(()=>{

        guest = "lcs2i40my9daa6s5yen"
       
        const t = async () => {
            let a: any = await loadDataSource('system1')
            console.log(a.tblUsersGroups);
            console.log('guest: ', guest);
            guest_groups_that_belong = a.tblUsersGroups.filter((x: any) => x.user.toLowerCase() == guest.toLowerCase()).map((obj: any)=>obj.group);
            console.log('guest_groups_that_belong: ', guest_groups_that_belong);
            const guestObj = {
                id: guest,
                guest_groups_that_belong: guest_groups_that_belong
            }
            secureLocalStorage.setItem("guest", guestObj);
            setStateRoot(guestObj)
        }
        t()
    },[])
    return <h1>Login</h1>
}