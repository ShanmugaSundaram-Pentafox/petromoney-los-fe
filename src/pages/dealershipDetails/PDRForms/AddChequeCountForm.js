import {
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
} from '@material-ui/core';
import toInteger from 'lodash-es/toInteger'
import { useSnackbar } from 'notistack';
import React, { useState, useEffect } from 'react';
import TextInput from '../../../components/TextInput/TextInput';
import { addPdcCollection, updatePdcCollection } from '../../../services/pdc.service';

const AddChequeCountForm = ({ dealershipId, initData,handleFetch }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [allowEdit, setAllowEdit] = useState(true);
  const [data, setData] = useState();
  useEffect(() => {
    if (initData?.id) {
      setData(initData)
      setAllowEdit(false)
    }
  }, [initData])

  const addPdcData = () => {
    let d = {
      dpn: data?.dpn,
      total_no_of_cheques: toInteger(data?.total_no_of_cheques)
    }
    if (data?.id) {
      updatePdcCollection(d, dealershipId)
        .then((res) => {
          setAllowEdit(false)
          handleFetch()
          enqueueSnackbar(res, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'success',
          });
        })
        .catch((err) => {
          enqueueSnackbar(err, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'error',
          });
        })
    }
    else {
      addPdcCollection(d, dealershipId)
        .then((res) => {
          handleFetch()
          enqueueSnackbar(res, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'success',
          });
        })
        .catch((err) => {
          enqueueSnackbar(err, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'error',
          });
        })
    }
  }

  return (
    <>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: 12 }}>
          <div>
            <p style={{ fontSize: 11, color: '#888', marginRight: 20, alignItems: 'center' }}>DPN</p>
            <FormControl component="fieldset">
              <RadioGroup
                row
                disabled={!allowEdit}
                defaultValue={data?.dpn}
                value={data?.dpn}
                onChange={(event) => setData({ ...data, dpn: event?.target?.value == 'yes' ? 1 : 0 })}
              >
                <FormControlLabel
                  value="yes"
                  disabled={!allowEdit}
                  control={<Radio size="small" />}
                  label="Yes"
                />
                <FormControlLabel
                  value="no"
                  disabled={!allowEdit}
                  control={<Radio size="small" />}
                  label="No"
                />
              </RadioGroup>
            </FormControl>
          </div>
          <div style={{ width: '30%', marginLeft: 20 }}>
            <p style={{ fontSize: 11, color: '#888', marginRight: 20, alignItems: 'center' }}>Total Number of Cheque</p>
            <TextInput
              number
              disabled={!allowEdit}
              direction='column'
              onChange={(e) => setData({ ...data, total_no_of_cheques: e.target.value })}
              value={data?.total_no_of_cheques}
            />
          </div>
          <div style={{ marginLeft: 32, marginTop: 16 }}>
            {
              allowEdit ?
                <Button variant='contained' color='primary' onClick={addPdcData}>{'Save & Continue'}</Button> :
                <Button variant='contained' color='primary' onClick={() => setAllowEdit(true)}>{'Edit'}</Button>
            }
          </div>
        </div>
      </div>
    </>
  )
}

export default AddChequeCountForm;