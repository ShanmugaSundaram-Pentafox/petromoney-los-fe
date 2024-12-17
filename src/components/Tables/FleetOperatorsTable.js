import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles } from '@material-ui/styles';
import React from 'react';
import { useQuery } from 'react-query';
import { getFleetOperatorsById } from '../../services/transports.service';
import { Box, Image, Text } from '@mantine/core';



const useStyles = makeStyles(theme => ({
  title: {
    fontWeight: 500
  },
  dTitle: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));


const FleetOperatorsTable = ({ id, editable, titleAlign, dealersClickRow }) => {
  const classes = useStyles();
  const { data: operatorsData = [], isLoading } = useQuery(['fleet-operator', id], () => getFleetOperatorsById(id))

  return (
    <>
      {operatorsData.length > 0 ? (<>
        <div className={classes.wrapper}>
          {/* <div className={classes.header}>
                <Typography style={{ width: '90%' }} variant="h5" align={titleAlign} className={classes.title}>Dealers</Typography>
            </div> */}
          <Table className={classes.table} size="small" aria-label="Dealers">
            <TableHead>
              <TableRow>
                <TableCell>Operator ID</TableCell>
                <TableCell align="center">Transport Name</TableCell>
                <TableCell align="center">Mobile</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {operatorsData?.map(row => (
                <TableRow className={classes.tableRow} key={row.id} onClick={e => dealersClickRow(e, row)}>
                  <TableCell>{row.id}&nbsp;&nbsp;</TableCell>
                  <TableCell align="center">{row.transport_name ? row.transport_name.toUpperCase() : '-'}</TableCell>
                  <TableCell align="center">{row.mobile ? row.mobile : '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div></>) : (<Box
          mt="md"
          p="xl"
          style={{
          textAlign: 'center',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          gap: 10,
          height: '60vh',
        }}
      >
          <Image
          src="https://i.imgur.com/A6KRQAV.png"
          w={150}
          h={100}
          radius="md"
        />
          <Box>
          <Text>No data yet!</Text>
          <Text size="sm" sx={{ color: 'rgb(0,0,0,0.4)' }}>
              No data found in this section
          </Text>
        </Box>
        </Box>)}
    </>
  )
}


export default FleetOperatorsTable;