import { Typography, Grid, Box, Avatar } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import AccountCircleRoundedIcon from '@material-ui/icons/AccountCircleRounded';
import EditIcon from '@material-ui/icons/Edit';
import { makeStyles } from '@material-ui/styles';
import MUIDataTable from 'mui-datatables';
import React, { useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { NavLink as RouterLink } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../../../components/CommonComponents/Button/Button';
import { permissionCheck } from '../../../components/UserCan/UserCan';
import { rulesList } from '../../../config/userRules';
import usePageTitle from '../../../hooks/usePageTitle';
import AddNewTransportForm from '../../../pages/transports/components/AddNewTransportsForm';
import AddNewTransportsOwnerForm from '../../../pages/transports/components/AddNewTransportsOwnerForm';
import { getTransportsByOwnersId, getOwnerDetailsById } from '../../../services/transports.service';


const Card = styled.div`
  background-color: #fff;
  margin-bottom: 20px;
  border-radius: 4px;
  position: relative;
  box-shadow: 0 1px 5px 0 rgba(0,0,0,.4);
  max-width:22vw;
  min-height:25vh;

  .card-body {
    display: flex;
    justify-content:flex-start;
    align-items: center;
    padding: 10px 15px;
  }

  .card-footer {
    background-color: #f9f9f9;
    padding-left: 10px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    border-radius: 0 0 4px 4px;
  }
`;


const useStyles = makeStyles((theme) => ({
  title: {
    textAlign: 'center',
    paddingTop: theme.spacing(1),
    color: '#9e9e9e'
  },
}))

export const OwnerInfoCard = ({ id, ownerData, currentUser }) => {
  const classes = useStyles()
  const [openEditModal, setOpenEditModal] = useState(false)
  // const [apiStatus, setApiStatus] = useState({});

  usePageTitle(`${id} - ${ownerData && (ownerData.first_name || '')}`, true)

  const handleEdit = () => {
    setOpenEditModal(!openEditModal)
  }
  return (
    <>
      <Card>
        <Typography variant="h4" color="action" className={classes.title}>Owner Info</Typography>
        <div className="card-body">
          <Box pr={2}>
            <Avatar>
              <AccountCircleRoundedIcon />
            </Avatar>
          </Box>
          <Box>
            <p><strong>{ownerData.first_name.toUpperCase()} {ownerData.last_name.toUpperCase()}</strong></p>
            <p><small>{ownerData.dob} | {ownerData.gender}</small></p>
            <p><small>{ownerData.address} </small></p>
            <p><small>{ownerData.mobile}</small></p>
            <p><small>{ownerData.mail}</small></p>
          </Box>
        </div>
        <div className="card-footer">
          <IconButton
            color="primary"
            aria-label="edit owner"
            component="span"
            onClick={() => setOpenEditModal(true)}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </div>
      </Card>
      <Drawer
        anchor="right"
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        variant="temporary"
      >
        <AddNewTransportsOwnerForm currentUser={currentUser} callback={handleEdit} form_data={ownerData} id={id} />
      </Drawer>
    </>
  )
}

const OwnerDetails = ({ currentUser, match }) => {
  const classes = useStyles()
  const [openModal, setOpenModal] = useState(false)
  const [rowData, setRowData] = useState({})
  const [formType, setFormType] = useState('');
  const editable = permissionCheck(currentUser.role_name, rulesList.external_view);

  const {
    url,
    params: { id },
  } = match
  const { data: transportsData, isLoading } = useQuery(['transport-data', id], () => getTransportsByOwnersId(id))
  const { data: ownerData } = useQuery(['owner-data', id], () => getOwnerDetailsById(id))


  const onRowClick = (id, rowData) => {
    setOpenModal(true)
    setRowData(rowData)
    setFormType('Edit')

  }


  // useMount(() => {
  //   getTransportsByOwnersId(id)
  //     .then(data => {
  //       setTransportsData(data);
  //     })
  //     .catch(e => {
  //       console.log(e)
  //     })
  //   getOwnerDetailsById(id)
  //     .then(data => {
  //       setOwnerData(data[0])
  //     })
  //     .catch(error => {
  //       console.log(error)
  //     })
  // })
  let cardData = [
    { label: 'Owner ID', value: ownerData?.t_owner_id },
    { label: 'Owner name', value: ownerData?.first_name + ' ' + ownerData?.last_name },
    { label: 'Mobile', value: ownerData?.mobile },
    // { label: 'Email', value: ownerData?.email }
  ]
  usePageTitle(`${id} - ${ownerData && (ownerData.name || '')} `, true, cardData)

  const columns = useMemo(() => {
    return [
      {
        label: 'Transport Id',
        name: 'transporter_id',
        options: {
          filter: false,
          sort: true,
          customBodyRender: value => {
            return <RouterLink to={`/transports/${value}`}>{value}</RouterLink>
          }
        }
      },
      {
        label: 'Name',
        name: 'name',
        options: {
          filter: false,
          sort: true,
          customBodyRender: (value) => {
            return <>{value?.toUpperCase()}</>
          },
        }
      },
      {
        label: 'Mobile',
        name: 'mobile',
        options: {
          filter: true,
          filterWidth: '100%',
          sort: true,
          customBodyRender: value => {
            return <div>
              {value ? value : '-'}
            </div>
          }
        }
      },
      {
        label: 'OMC',
        name: 'omc',
        options: {
          filter: false,
          sort: true
        }
      },
    ]
  }, [transportsData]);

  const options = {
    selectableRows: 'none',
    print: false,
    filter: false,
    search: false,
    download: false,
    viewColumns: false,
    rowsPerPage: 10,
    isRowSelectable: () => false,
    selectableRowsHeader: false,
    customToolbar: () => {
      return (
        !editable &&
        <Button
          color="primary"
          variant="contained"
          onClick={() => {
            setOpenModal(true)
            setRowData('Add')
            setFormType('Add')

          }}
        >
          Add Transport
        </Button>
      );
    },
    onRowClick: (rowData, { dataIndex }) => {
      onRowClick(transportsData[dataIndex].dealership_id, transportsData[dataIndex])
    },

  };
  return (
    <>
      <Grid container>
        {/* <Grid item md={4}>
                    <OwnerInfoCard id={id} ownerData={ownerData} currentUser={currentUser} />
                </Grid> */}
        <Grid item md={9}>
          <div >
            {
              Array.isArray(transportsData) ? (

                <MUIDataTable
                  title={<Typography className={classes.tableTitle} variant="h4" component="h4">Transports List</Typography>}
                  data={transportsData}
                  columns={columns}
                  options={options}
                />
              ) : (
                !isLoading && <Paper style={{ padding: 10 }}>No transports found</Paper>
              )
            }
            {
              isLoading && <div style={{ textAlign: 'center' }}> <CircularProgress /></div>
            }
          </div>
        </Grid>
      </Grid>
      <Drawer
        anchor="right"
        open={openModal}
        onClose={() => {
          setOpenModal(false)
          setRowData({})
        }}
        variant="temporary"
      >
        <AddNewTransportForm callback={() => setOpenModal(false)} isAdd={formType} id={id} data={rowData} currentUser={currentUser} editable={editable} />
      </Drawer>
    </>
  )

}

export default OwnerDetails;