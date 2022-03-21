import { Button } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { makeStyles } from '@material-ui/styles';
import React, { useState } from 'react';
import styled from 'styled-components'
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


const PreviewCard = ({ children, onEdit, onDelete, onCustom, customButton = false, customIcon, token=false, tokenLabel, tokenIcon, variant }) => {
  const classes = useStyles()
  const [deleteModal, setDeleteModal] = useState(false)
  return (
    <Card style={{marginBottom:0}}>
      <div className="card-body">
        {children}
      </div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 10}} >
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
    </Card>
  )
}
export default PreviewCard;

export const PreviewCardBank = ({ children, onEdit, onDelete, onCustom, verified = false, customIcon, tokenLabel }) => {
  const classes = useStyles()
  const [deleteModal, setDeleteModal] = useState(false)
  return (
    <Card style={{marginBottom:0}}>
      <div className="card-body">
        {children}
      </div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 10}} >
        <div>
          {
            !verified &&
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
        {
          !verified && (
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
          )
        }
      </div>
    </Card>
  )
}