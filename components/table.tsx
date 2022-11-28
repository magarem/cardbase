import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Typography } from '@mui/material';
import { Container } from '@mui/system';

interface Props {
    cols: Array<any>,
    rows: Array<any>
    // any props that come into the component
}

export default function DenseTable({cols, rows}: Props) {
    return (
    <TableContainer component={Paper} style={{ width: '100%' }}>
      <Table aria-label="a dense table">
        {/* <TableHead>
          <TableRow >
            {cols.map((item: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined, index: number) =>
                <TableCell key={index.toString()} style={{ width: 50 }} align="left">{item}</TableCell>
            )}
          </TableRow>
        </TableHead> */}
        <TableBody>
          {rows&&rows.map((row: (React.Key | null | undefined)[], index: number) => (
            <TableRow
              key={index.toString()}
              sx={{  '&:last-child td, &:last-child th': { border: 0 } }}
            >
                {cols.map((col: any, index: number ) => 
                    <TableCell key={index.toString()} component="th" scope="row" align={index==0?'right':'left'}>
                      <Typography sx={{size: 20, fontWeight: (index==0)?'bold':'' }}>
                        {row[index]}
                      </Typography>
                    </TableCell>
                )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
