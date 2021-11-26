
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import TextInput from '../../../components/TextInput/TextInput';
import { getUserRoleForReview } from '../../../services/common.service';


const LoanStatusDialog = ({ data, status, callback, handleUser, remarks }) => {
  const [userRole, setUserRole] = useState([]);

  useEffect(() => {
    if (data) {
      let val = status === 'submitted' ? 'is_review=1' : 'is_approve=1'
      getUserRoleForReview(val)
        .then(res => {
          let d = [];
          res.forEach((item, i) => {
            d.push({
              label: <div>{item.first_name} {item.last_name}</div>,
              value: item.id
            })
          })
          setUserRole(d);
        })
        .catch(e => {
          console.log(e);
        })
    }
  }, [data])


  return (
    <>
      <DialogTitle id="approval-remarks">Remarks: Send for {status === 'submitted' ? 'review' : status === 'loan_review' ? 'Approval' : 'Disbursement Approval'}</DialogTitle>
      <DialogContent>
        {
          status && ['submitted', 'loan_review'].includes(status) && (
            <div style={{ marginBottom: 20 }}>
              <DialogContentText id="approval-remarks-desc">
                Please choose whom did you want to sent for review.
              </DialogContentText>
              <Select
                isClearable
                name='type'
                onChange={handleUser}
                options={userRole}
                menuPlacement='bottom'
                menuPosition='fixed'
                maxMenuHeight='200px'

              />
            </div>
          )
        }
        {/* {
          status === 'loan_review' && (
            <div style={{ marginBottom: 20 }}>
              <DialogContentText id="approval-remarks-desc">
                Please choose whom did you want to sent for approval.
              </DialogContentText>
              <Select
                isClearable
                name='review'
                onChange={setUser}
                options={userRole}
                menuPlacement='bottom'
                menuPosition='fixed'
                maxMenuHeight='250px'
              />
            </div>
          )
        } */}
        <div>
          <DialogContentText id="approval-remarks-desc">
            Please enter your remarks for sending this for {status === 'submitted' ? 'review' : status === 'loan_review' ? 'Approval' : 'Disbursement Approval'}.
          </DialogContentText>
          <TextInput
            multiline
            direction='column'
            alignTop={true}
            rows={4}
            rowsMax={8}
            labelText="Remarks*"
            placeholder="Enter your remarks here."
            value={remarks}
            onChange={e => { callback(e) }}
          />
        </div>
      </DialogContent>
    </>

  );
}
export default LoanStatusDialog;