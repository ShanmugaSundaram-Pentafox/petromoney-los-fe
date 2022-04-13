import { Table, TableBody, TableHead, TableRow, TableCell, Typography, makeStyles, TextField, Button, CircularProgress, FormControlLabel, Checkbox } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useSnackbar } from 'notistack';
import React, {useState} from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query';
import DeleteButton from '../../../components/CommonComponents/Button/DeleteButton';
import TextInput from '../../../components/TextInput/TextInput';
import { permissionCheck } from '../../../components/UserCan/UserCan';
import { rulesList } from '../../../config/userRules';
import { deleteDeviationsById, getCalculateDeviation, getDeviations, updateDeviationsById } from '../../../services/dealerships.service';

const useStyles = makeStyles(theme => ({
  title: {
    marginTop:15,
    display: 'flex',
    justifyContent: 'space-between'
  },
  tableContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  topicBtn: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 20,
    alignItems: 'center'
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: 20
  },
  field: {
    margin: 0
  },
  delBtn: {
    color: '#FF5C58',
    borderColor: '#FF5C58'
  }
}))

const Deviations = ({id, currentUser}) => {
  const classes = useStyles()
  const queryClient = useQueryClient()
  const [errorStatus, setErrorStatus] = useState()
  const [deviationData, setDeviationData] = useState([])
  const [manualDeviationData, setManualDeviationData] = useState([])
  const [deleteModal, setDeleteModal] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const editable = permissionCheck(currentUser.role_name, rulesList.external_view);

  const deviationsTable = useQuery(['deviations', id], () => {return getDeviations(id)}, {
    onError: (error) => {
      setErrorStatus(error)
    },
    onSuccess: (data) => {
      setDeviationData(data.data)
      setManualDeviationData(data.others)
      setErrorStatus()
    },
    refetchOnWindowFocus: false
  })

  const { mutate: deleteDeviation, mutate: updateDeviation } = useMutation(data => data.type === 'delete' ? deleteDeviationsById(id, data.id) : updateDeviationsById(id, data) , {
    onSuccess: (message) => {
      queryClient.invalidateQueries(['deviations', id])
      setDeleteModal(false)
      enqueueSnackbar(message.message, {
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
        variant: 'success',
      });
    },
    onError: (message) => {
      console.log(message);
      enqueueSnackbar(message, {
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
        variant: 'error',
      });
    }
  })

  const onChange = (e, i) => {
    const {name, value, checked} = e.target
    const newData = [...deviationData]
    newData[i] = {...newData[i], [name]: name === 'review_status' ? checked : value}
    setDeviationData(newData)
  }

  const onManualChange = (e, i) => {
    const {name, value, checked} = e.target
    const newData = [...manualDeviationData]
    newData[i] = {...newData[i], [name]: name === 'review_status' ? checked : value}
    setManualDeviationData(newData)
  }

  const handleSubmit = () => {
    updateDeviation({data: deviationData, others: manualDeviationData})
  }

  const calculateDeviation = () => {
    let body = {data: deviationData, others: manualDeviationData}
    getCalculateDeviation(id, body)
      .then((data) => {
        setDeviationData(data.data)
        setManualDeviationData(data.others)
      })
      .catch(e => console.log(e))
  }

  return (
    <>
      <div className={classes.title}>
        <Typography variant="h5">Deviations</Typography>
        {
          !editable && <Button variant='contained' size='small' color='secondary' onClick={() => calculateDeviation()}>Calculate Deviations</Button>
        }
      </div>
      {
        deviationsTable.isLoading ? (
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <CircularProgress size={30} />
          </div>
        ) : (
          <>
            <div className={classes.tableContainer}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Particulars</TableCell>
                    <TableCell>Policy</TableCell>
                    <TableCell>Actual</TableCell>
                    <TableCell>Deviation</TableCell>
                    <TableCell>Remarks</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                                deviationData?.map((item, i) => {
                                  return(
                                    <TableRow key={i}>
                                      <TableCell>{item.particulars}</TableCell>
                                      <TableCell>{item.policy}</TableCell>
                                      <TableCell>
                                        <TextInput
                                          className={classes.field}
                                          name="actual"
                                          value={item.actual}
                                          onChange={(e) => onChange(e, i)}
                                          disabled={
                                            item.particulars === 'Max FOIR%' ||
                                                        item.particulars === 'Min Credit Bureau Score' ||
                                                        item.particulars === 'Min Business Vintage with OMC (Yrs)' || editable ? true : false
                                          }
                                        />
                                      </TableCell>
                                      <TableCell>
                                        <TextInput
                                          className={classes.field}
                                          disabled={editable}
                                          select
                                          name="deviation"
                                          value={item.deviation}
                                          onChange={(e) => onChange(e, i)}
                                        >
                                          <option value="Yes">Yes</option>
                                          <option value="No">No</option>
                                        </TextInput>
                                      </TableCell>
                                      <TableCell>
                                        <TextField
                                          className={classes.field}
                                          disabled={editable}
                                          name="deviation_review"
                                          onChange={(e) => onChange(e, i)}
                                          value={item.deviation_review}
                                          placeholder="Remarks"
                                          variant="outlined"
                                          fullWidth
                                        />
                                      </TableCell>
                                      <TableCell>
                                        <FormControlLabel
                                          control={
                                            <Checkbox
                                              checked={item?.review_status}
                                              disabled={item.deviation_review.length <= 3 || editable}
                                              name="review_status"
                                              onChange={(e) => {
                                                if(item.deviation_review.length !== 1){
                                                  onChange(e, i)
                                                }
                                              }}
                                            />
                                          }
                                        />
                                      </TableCell>
                                    </TableRow>
                                  )
                                })
                  }
                </TableBody>
              </Table>
            </div>
            <div className={classes.topicBtn}>
              <Typography variant="h5">Manual Deviation</Typography>
              {
                !editable &&
                <Button variant="outlined" color="secondary" size="medium" disabled={editable} onClick={() => 
                  setManualDeviationData([...manualDeviationData, {deviation_description: '', deviation_review: ''}])
                }>Add Deviation</Button>
              }
            </div>
            <div style={{marginTop: 10}}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Deviation Description</TableCell>
                    <TableCell>Remarks</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    manualDeviationData.length ? (
                                    manualDeviationData?.map((item, i) => {
                                      return(
                                        <TableRow key={i}>
                                          <TableCell>
                                            <TextInput
                                              name="deviation_description"
                                              disabled={editable}
                                              placeholder="Description..."
                                              value={item.deviation_description}
                                              onChange={e => onManualChange(e, i)}
                                            />
                                          </TableCell>
                                          <TableCell>
                                            <TextInput
                                              name="deviation_review"
                                              disabled={editable}
                                              variant="outlined"
                                              placeholder="Review..."
                                              value={item.deviation_review}
                                              onChange={e => onManualChange(e, i)}
                                            />
                                          </TableCell>
                                          <TableCell>
                                            <FormControlLabel
                                              control={
                                                <Checkbox
                                                  checked={item?.review_status}
                                                  disabled={item.deviation_review.length <= 3 || editable}
                                                  name="review_status"
                                                  onChange={(e) => {
                                                    if(item.deviation_review.length !== 1){
                                                      onManualChange(e, i)
                                                    }
                                                  }}
                                                />
                                              }
                                            />
                                          </TableCell>
                                          <TableCell align="right">
                                            <DeleteButton disabled={editable} alertText='Do you really want to delete this deviation? This process cannot be undone.' deleteAction={() => item.id && (deleteDeviation({id: item.id, type: 'delete'}))} deleteModal={deleteModal} setDeleteModal={setDeleteModal} id={i} />
                                          </TableCell>
                                        </TableRow>
                                      )
                                    })
                    ) : (
                      <Typography variant='h6' style={{color: 'rgb(0,0,0,0.4)', marginTop: 10, marginLeft: 15}}>No Manual Deviations Found!</Typography>
                    )
                  }
                </TableBody>
              </Table>
            </div>
            {
              errorStatus && 
                <Alert severity='error' style={{marginTop: 20}}>{errorStatus}</Alert>
            }
            {
              !editable &&
              <div className={classes.footer}>
                <Button variant="contained" color="primary" onClick={handleSubmit}>Save</Button>
              </div>
            }
          </>
        )
      }
    </>
  )
}

export default Deviations;

export const DeviationsTable = ({id}) => {
  const classes = useStyles()

  const { data: deviationsTable=[] } = useQuery(['deviations', id], () => {return getDeviations(id)}, {
    onError: (error) => {
      console.log(error);
    },
  })
  return(
    <>
      <div className={classes.title}>
        <Typography variant="h5">Deviations</Typography>
      </div>
      <div className={classes.tableContainer}>
        {
          deviationsTable?.data?.length ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Particulars</TableCell>
                  <TableCell>Policy</TableCell>
                  <TableCell>Actual</TableCell>
                  <TableCell>Deviation</TableCell>
                  <TableCell>Remarks</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                                deviationsTable?.data?.map((item, i)=> {
                                  return(
                                    <TableRow key={i}>
                                      <TableCell>{item.particulars}</TableCell>
                                      <TableCell>{item.policy}</TableCell>
                                      <TableCell>{item.actual}</TableCell>
                                      <TableCell>{item?.deviation}</TableCell>
                                      <TableCell>{item?.deviation_review}</TableCell>
                                      <TableCell>{item.review_status === true || item.review_status === 1 ? 'Reviewed' : '-'}</TableCell>
                                    </TableRow>
                                  )
                                })
                }
              </TableBody>
            </Table>
          ) : (
            <Typography variant="body2">NA</Typography>
          )
        }
        <div className={classes.title}>
          <Typography variant="h5">Manual Deviations</Typography>
        </div>
        {
          deviationsTable?.others?.length ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Deviation Description</TableCell>
                  <TableCell>Remarks</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                                deviationsTable?.others?.map((item, i) => {
                                  return(
                                    <TableRow key={i}>
                                      <TableCell>{item.deviation_description}</TableCell>
                                      <TableCell>{item.deviation_review}</TableCell>
                                      <TableCell>{item.review_status === true || item.review_status === 1 ? 'Reviewed' : '-'}</TableCell>
                                    </TableRow>
                                  )
                                })
                }
              </TableBody>
            </Table>
          ) : (
            <Typography variant="body2" style={{marginTop: 10}}>NA</Typography>
          )
        }
      </div>
    </>
  )
}