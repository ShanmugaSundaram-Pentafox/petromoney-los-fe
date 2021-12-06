import { Table, TableBody, TableHead, TableRow, TableCell, Typography, makeStyles, TextField, Button, CircularProgress } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import React, {useState} from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query';
import TextInput from '../../../components/TextInput/TextInput';
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

const Deviations = ({id}) => {
  const classes = useStyles()
  const queryClient = useQueryClient()
  const [deviationData, setDeviationData] = useState([])
  const [manualDeviationData, setManualDeviationData] = useState([])
  const { enqueueSnackbar } = useSnackbar();
  
  const deviationsTable = useQuery(['deviations', id], () => {return getDeviations(id)}, {
    onError: (error) => {
      console.log(error);
      enqueueSnackbar(error, {
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
        variant: 'error',
      });
    },
    onSuccess: (data) => {
      setDeviationData(data.data)
      setManualDeviationData(data.others)
    },
    refetchOnWindowFocus: false
  })

  const { mutate: deleteDeviation, mutate: updateDeviation } = useMutation(data => data.type === 'delete' ? deleteDeviationsById(id, data.id) : updateDeviationsById(id, data) , {
    onSuccess: (message) => {
      queryClient.invalidateQueries(['deviations', id])
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
    const {name, value} = e.target
    const newData = [...deviationData]
    newData[i] = {...newData[i], [name]: value}
    setDeviationData(newData)
  }

  const onManualChange = (e, i) => {
    const {name, value} = e.target
    const newData = [...manualDeviationData]
    newData[i] = {...newData[i], [name]: value}
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
        // window.location.reload(false)
      })
      .catch(e => console.log(e))
  }

  return (
    <>
      <div className={classes.title}>
        <Typography variant="h5">Deviations</Typography>
        <Button variant='contained' size='small' color='secondary' onClick={() => calculateDeviation()}>Calculate Deviations</Button>
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
                    <TableCell>Deviation Review</TableCell>
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
                                                        item.particulars === 'Min Business Vintage with OMC (Yrs)' ? true : false
                                          }
                                        />
                                      </TableCell>
                                      <TableCell>
                                        <TextInput
                                          className={classes.field}
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
                                          name="deviation_review"
                                          onChange={(e) => onChange(e, i)}
                                          value={item.deviation_review}
                                          placeholder="Remarks"
                                          variant="outlined"
                                          fullWidth
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
              <Button variant="outlined" color="secondary" size="medium" onClick={() => 
                setManualDeviationData([...manualDeviationData, {deviation_description: '', deviation_review: ''}])
              }>Add Deviation</Button>
            </div>
            <div style={{marginTop: 10}}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Deviation Description</TableCell>
                    <TableCell>Deviation Review</TableCell>
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
                                              placeholder="Description..."
                                              defaultValue={item.deviation_description}
                                              onChange={e => onManualChange(e, i)}
                                            />
                                          </TableCell>
                                          <TableCell>
                                            <TextField
                                              name="deviation_review"
                                              variant="outlined"
                                              placeholder="Review..."
                                              defaultValue={item.deviation_review}
                                              onChange={e => onManualChange(e, i)}
                                              fullWidth
                                            />
                                          </TableCell>
                                          <TableCell align="right">
                                            <Button variant='outlined' size="small" className={classes.delBtn} onClick={() => item.id && (deleteDeviation({id: item.id, type: 'delete'}))}>Delete</Button>
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
            <div className={classes.footer}>
              <Button variant="contained" color="primary" onClick={handleSubmit}>Save</Button>
            </div>
          </>
        )
      }
    </>
  )
}

export default Deviations;

export const DeviationsTable = ({id}) => {
  const classes = useStyles()

  const deviationsTable = useQuery(['deviations', id], () => {return getDeviations(id)}, {
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
          deviationsTable?.data?.data?.length ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Particulars</TableCell>
                  <TableCell>Policy</TableCell>
                  <TableCell>Actual</TableCell>
                  <TableCell>Deviation</TableCell>
                  <TableCell>Deviation Review</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                                deviationsTable?.data?.data?.map((item, i)=> {
                                  return(
                                    <TableRow key={i}>
                                      <TableCell>{item.particulars}</TableCell>
                                      <TableCell>{item.policy}</TableCell>
                                      <TableCell>{item.actual}</TableCell>
                                      <TableCell>{item?.deviation}</TableCell>
                                      <TableCell>{item?.deviation_review}</TableCell>
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
          deviationsTable?.data?.others?.length ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Deviation Description</TableCell>
                  <TableCell>Deviation Review</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                                deviationsTable?.data?.others.map((item, i) => {
                                  return(
                                    <TableRow key={i}>
                                      <TableCell>{item.deviation_description}</TableCell>
                                      <TableCell>{item.deviation_review}</TableCell>
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