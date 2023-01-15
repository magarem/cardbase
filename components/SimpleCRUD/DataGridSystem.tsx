import SimpleTable from './SimpleTable'
import React, { useEffect } from 'react'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}
  
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const DataGridSystem = ({id, user, tables, tblsRelacions, dataSource, setDataSource}: any) => {
  let cloneDataSource:any = {}
    const [value, setValue] = React.useState(0)
    const [tablesState, setTablesState] = React.useState(tables)
    const [tableDesity, setTableDesity] = React.useState<boolean>(true)
    let cloneTable: any = []

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
      setValue(newValue);
    };

    const updateDataSource = (table: any, data: any) => {
      cloneDataSource = {...dataSource}
      cloneDataSource[id] = {...cloneDataSource[id], [table]:data}
      setDataSource({...cloneDataSource})
    }
    
    const handleRefresh = () => {
      if (JSON.stringify(dataSource)!=='{}'){
        tblsRelacions?.map((i: any)=>{
          let ret: any = tablesState[i.tabela_destino].cols.map((x: any)=>{
              if (x.name == i.tabela_destino_field){
                return {...x, options: dataSource[id][i.tabela_origem]?.map((a: any) => [a[i.tabela_origem_id], a[i.tabela_origem_valor]])}
              }else{
                return x
              }
          })
          cloneTable = {...tablesState}
          cloneTable[i.tabela_destino].cols = ret
          setTablesState({...cloneTable })
        })
      }
    }

    const auxFunc_setSystemStateRows = (table: any, value: any) => {
      updateDataSource(table, value)
      handleRefresh()
    }
    
    useEffect(()=>{
      console.log(dataSource);
      handleRefresh()
    },[])
   
    if (Object.entries(tables).length==1){
      return (
        <Box sx={{ width: '100%', marginBottom:-2 }}>
          {Object.entries(tables).map((i: any, index: number)=>(
            <SimpleTable 
              key={i[1].label}
              user={user}
              tableDesity={tableDesity}
              setTableDesity={setTableDesity}
              title={i[1].label}
              cols={i[1].cols} 
              rows={dataSource[id]?dataSource[id][i[0]]:[]} 
              table={i[0]} 
              handleRefresh={handleRefresh}
              setRows={auxFunc_setSystemStateRows} 
              />
          ))}
        </Box>
      )
    }else{
      return (
        <Box sx={{ width: '100%', marginBottom:-2 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              {Object.entries(tables).map((i: any)=>
                (<Tab key={i[1].label} label={i[1].label} {...a11yProps(0)} />))
              }
            </Tabs>
          </Box>
          {Object.entries(tables).map((i: any, index: number)=>(
            <TabPanel key={i[1].label} value={value} index={index}>
              <SimpleTable 
                key={i[1].label}
                user={user}
                tableDesity={tableDesity}
                setTableDesity={setTableDesity}
                title={i[1].label}
                cols={i[1].cols} 
                rows={dataSource[id]?dataSource[id][i[0]]:[]} 
                table={i[0]} 
                handleRefresh={handleRefresh}
                setRows={auxFunc_setSystemStateRows} 
              />
            </TabPanel>)
          )}
        </Box>
      )
    }
}

export default DataGridSystem
