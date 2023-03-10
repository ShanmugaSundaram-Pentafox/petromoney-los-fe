import { Button, Typography } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { makeStyles } from '@material-ui/styles';
import React, { useState } from 'react';
import styled from 'styled-components'
import { action_id, resources_id } from '../../../config/accessControl';
import CheckAllowed from '../../../pages/rbac/CheckAllowed';
import DeleteButton from '../Button/DeleteButton';

const Card = styled.div`
  background-color: #fff;
  margin-bottom: 20px;
  border-radius: 4px;
  position: relative;
  box-shadow: rgb(0 0 0 / 12%) 0px 0px 3px, rgb(0 0 0 / 24%) 0px 1px 2px;

  .card-body {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px 15px  0px 15px;
  }

  .card-footer {
    // background-color: #f9f9f9;
    padding: 10px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    border-radius: 0 0 4px 4px;
  }
`;
const useStyles = makeStyles((theme) => ({
  btnSuccess: {
    '&.MuiButton-contained': {
      backgroundColor: theme.palette.success.main,
      color: theme.palette.white
    },
    '&.MuiButton-contained:hover': {
      backgroundColor: theme.palette.success.dark
    }
  },

}))


const PreviewCard = ({ children, action = true, onEdit, onDelete, onCustom, customButton = false, customIcon, token = false, tokenLabel, tokenIcon, variant }) => {
  const classes = useStyles()
  const [deleteModal, setDeleteModal] = useState(false)
  return (
    <Card style={{ marginBottom: 0 }}>
      <div className="card-body">
        {children}
      </div>
      {
        action &&
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 10 }} >
            <div>
              {
                customButton &&
                  <Button
                    size="small"
                    variant="outlined"
                    color="success"
                    style={{ margin: 4 }}
                    className={classes.btnSuccess}
                    startIcon={customIcon ? customIcon : <InfoOutlinedIcon color="primary" />}
                    onClick={onCustom}
                  >
                    {tokenLabel}
                  </Button>
              }
            </div>
            <div className='card-footer'>
              <Button
                size="small"
                variant="outlined"
                color="success"
                style={{ margin: 4 }}
                className={classes.btnSuccess}
                startIcon={<EditIcon color="primary" />}
                onClick={onEdit}
              >
                Edit
              </Button>
              <DeleteButton deleteModal={deleteModal} deleteAction={onDelete} setDeleteModal={setDeleteModal} />
            </div>
          </div>
      }
    </Card>
  )
}
export default PreviewCard;

export const PreviewCardBank = ({ children, onEdit, action = true, onDelete, onCustom, verified = false, customIcon, tokenLabel, verifiedDate, currentUser }) => {
  const classes = useStyles()
  const [deleteModal, setDeleteModal] = useState(false)
  return (
    <Card style={{ marginBottom: 0 }}>
      <div className="card-body">
        {children}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 10 }} >
        {
          verified ?
            <Typography variant='body2' style={{ color: 'rgb(0,0,0,0.4)', margin: '16px 0px' }}>
              {`Last Verified: ${verifiedDate || '-'}`}
            </Typography> :
            <CheckAllowed currentUser={currentUser} resource={resources_id?.personalDiscussion} action={action_id?.personalDiscussion?.bankVerify}>
              <Button
                size="small"
                variant="outlined"
                color="success"
                style={{ margin: 4 }}
                className={classes.btnSuccess}
                startIcon={customIcon ? customIcon : <InfoOutlinedIcon color="primary" />}
                onClick={onCustom}
              >
                {tokenLabel}
              </Button>
            </CheckAllowed>
        }
        {
          !verified && (
            <div className='card-footer'>
              <CheckAllowed
                currentUser={currentUser} resource={resources_id?.personalDiscussion} action={action_id?.personalDiscussion?.bankEdit}
              >
                <Button
                  size="small"
                  variant="outlined"
                  color="success"
                  style={{ margin: 4 }}
                  className={classes.btnSuccess}
                  startIcon={<EditIcon color="primary" />}
                  onClick={onEdit}
                >
                  Edit
                </Button>
              </CheckAllowed>
              <CheckAllowed currentUser={currentUser} resource={resources_id?.personalDiscussion} action={action_id?.personalDiscussion?.bankDelete}>
                <DeleteButton deleteModal={deleteModal} deleteAction={onDelete} setDeleteModal={setDeleteModal} />
              </CheckAllowed>
            </div>
          )

        }

      </div>
    </Card>
  )
}