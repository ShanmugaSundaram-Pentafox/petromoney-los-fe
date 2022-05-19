import { Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { useState } from 'react';
import FormDialog from '../../../components/CommonComponents/FormDialog/FormDialog';
import { TextEditor } from '../../../components/TextEditor/TextEditor';
import { ViewMoreBtn } from '../../../theme/styled-components/utils'

const useStyles = makeStyles(theme => ({
  wrapper: {
    padding: '0 24px 10px 24px',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },
  contentWrapper: {
    padding: 12,
    flex: 1,
    overflow: 'auto',
    overflowX: 'hidden'
  },
  wrapperTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    marginRight: 24,
  },
  title: {
    top: 0,
    left: 0,
    padding: '8px 16px',
    background: theme.palette.grey[300],
    borderBottomRightRadius: 12,
    boxShadow: '0px 0px 4px #8d8d8d',
  },
  closeIcon: {
    marginTop: 8,
  },
  actionButtonsWrapper: {
    paddingTop: 16,
  },
  btn: {
    marginLeft: 16
  },
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

const DrawerRemarks = ({ loanData, readOnly, label }) => {
  const classes = useStyles();
  const [showRemarksModal, setShowRemarksModal] = useState(false);

  const gridProps = {
    item: true,
    xs: 12,
    className: classes.gridItemStyle
  }
  const fieldProps = {
    direction: 'column',
    alignTop: true,
    readOnly,
    className: classes.fieldItemStyle
  }
  return (
    <div>
      <>
        <Grid {...gridProps} style={{ position: 'relative', marginBottom: 10 }}>
          <label>{label}</label>
          {
            loanData ?
              <TextEditor toolBar={false} remarkData={loanData} editable={false} style={{height: '20vh'}} /> :
              <Typography variant='body1' style={{color: 'rgb(0,0,0,0.3)', marginTop: 8}}>No Remarks</Typography>
          }
          {
            loanData?.length >= 150 ? (
              <ViewMoreBtn
                onClick={() => setShowRemarksModal(loanData)}
              >
                View more
              </ViewMoreBtn>
            ) : null
          }
        </Grid>
      </>
      <FormDialog open={showRemarksModal} title="Remarks" onClose={() => setShowRemarksModal(false)}>
        <TextEditor toolBar={false} remarkData={loanData} editable={false} />
      </FormDialog>
    </div>
  )
}
export default DrawerRemarks;