import * as React from 'react';
import DataGridSystem from '../components/SimpleCRUD/DataGridSystem'
import CardDataService from "../services/services";
import { useAuth } from '../context/AuthContext';

let tblUsers = {
    name: 'tblUsers',
    label: 'Usuários',
    cols: [
        { name: 'id', label: 'id', type: 'string', hidden: false },
        { name: 'nome', label: 'Nome', type: 'string' },
        { name: 'email', label: 'Email', type: 'string' },
        { name: 'tel', label: 'Telefone', type: 'string' },
        { name: 'avatar', label: 'Avatar', type: 'file' },
        { name: 'attached', label: 'Anexo', type: 'file' },
    ]
}

let tblGroups = {
    label: 'Grupos',
    cols: [
        { name: 'id', label: 'id', type: 'string', hidden: false },
        { name: 'nome', label: 'Nome', type: 'string' },
    ]
}

let tblUsersGroups = {
    label: 'Grupos de Usuários',
    cols: [
        { name: 'id', label: 'id', type: 'string', hidden: true },
        { name: 'user', label: 'Usuário', type: 'select', options: [] },
        { name: 'group', label: 'Grupo', type: 'select', options: [] },
        { name: 'ativo', label: 'Ativo', type: 'select', options: [[0,'sim'], [1,'não']] }
    ]
}

let tblsRelations = [
    {
        tabela_origem: 'tblUsers',
        tabela_origem_id: 'id',
        tabela_origem_valor: 'nome',
        tabela_destino: 'tblUsersGroups',
        tabela_destino_field: 'user'
    },
    {
        tabela_origem: 'tblGroups',
        tabela_origem_id: 'id',
        tabela_origem_valor: 'nome',
        tabela_destino: 'tblUsersGroups',
        tabela_destino_field: 'group'
    }
]

export default function userAcessAdmin() {

    const [dataSource, setDataSource] = React.useState<any>({})
    const [refresh, setRefresh] = React.useState<any>("init")
    const { user } = useAuth()

    const saveData = () => {
        console.log(dataSource);
        if (JSON.stringify(dataSource) !== '{}') {
            CardDataService.getUserData(user.uid, 'meta_UserPermissions').then((r: any) => {
                CardDataService.setUserData(user.uid, 'meta_UserPermissions', { ...r, ...dataSource })
            })
        }
    }

    const loadData = (id: string) => {
        CardDataService.getUserData(user.uid, 'meta_UserPermissions').then((r: any) => {
            //Check if system ID exist in databank
            if (r[id]) {
                setDataSource({ [id]: r[id] })
            } else {
                setDataSource({})
            }
        })
    }

    React.useEffect(() => {
        loadData("system1")
    }, [])

    React.useEffect(() => {
        saveData()
    }, [dataSource])

    return (
        <>
            <h4>Pemissões de usuários</h4>
            {/* <pre>
            {JSON.stringify(dataSource, null, 2)}
        </pre> */}
            <DataGridSystem
                id="system1"
                user={user}
                // key={refresh} 
                tables={{ tblUsers, tblGroups, tblUsersGroups }}
                tblsRelacions={tblsRelations}
                dataSource={dataSource}
                setDataSource={setDataSource} />
            <br />
        </>
    )
}