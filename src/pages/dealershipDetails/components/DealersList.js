import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useMount } from 'react-use';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import EditRoundedIcon from '@material-ui/icons/EditRounded';
import MoreHorizRoundedIcon from '@material-ui/icons/MoreHorizRounded';
import { getDealersByDealershipId } from '../../../services/dealers.service';
import CreditInfoSideWrapper from "./CreditInfoSideWrapper";

const useStyles = makeStyles(theme => ({
  wrapper: {
    padding: 8,
  },
  title: {
    paddingLeft: 8,
    marginBottom: 8
  },
  table: {
    // minWidth: 650,
    padding: 8
  },
  footer: {
    paddingTop: 8,
    textAlign: 'right'
  },
  sidePanelWrapper: {
    width: '40vw',
    minWidth: 300
  },
  actionButtons: {
    // paddingTop: 8
  },
}));

const DealersList = ({ id, titleAlign }) => {
  const classes = useStyles();
  const [data, setDealersData] = useState();
  const [activeStep, setActiveStep] = useState(0);
  const [showCreditForm, setShowCreditForm] = useState(false);
  
  useMount(() => {
    getDealersByDealershipId(id)
      .then(data => setDealersData(data))
      .catch(e => null)
  });

  if(!data || !data.length)
    return (
      <div className={classes.wrapper}>
        <Typography variant="h5" align={titleAlign} className={classes.title}>No Dealers Found</Typography>
        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <Button color="primary" variant="contained" size="small" onClick={() => null}>Add dealer</Button>
        </div>
      </div>
    );

  return (
    <div className={classes.wrapper}>
      <Typography variant="h5" align={titleAlign} className={classes.title}>Dealers</Typography>
      <Table className={classes.table} size="small" aria-label="Dealers">
        <TableHead>
          <TableRow>
            <TableCell>Dealer Name</TableCell>
            <TableCell align="center">Mobile</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(row => (
            <TableRow key={row.id}>
              <TableCell>{row.first_name}</TableCell>
              <TableCell align="center">{row.mobile}</TableCell>
              <TableCell align="center">
                <ButtonGroup size="small" aria-label="dealer action buttons">
                  <Button>View</Button>
                  <Button>Edit</Button>
                </ButtonGroup>
                {/* <Tooltip title="Edit">
                  <Chip variant="outlined" color="primary" size="small" label="Edit" avatar={<Avatar>E</Avatar>} />
                  <IconButton
                    size="small"
                    color="inherit"
                    onClick={() => null}
                  >
                    <EditRoundedIcon />
                  </IconButton>
                </Tooltip> */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className={classes.footer}>
        <div className={classes.actionButtons}>
          <Button color="primary" variant="contained" size="small" onClick={() => setShowCreditForm(true)}>Add Credit Information</Button>
        </div>

        <Drawer
          anchor="right"
          open={showCreditForm}
          variant="temporary"
        >
          <div className={classes.sidePanelWrapper}>
            <CreditInfoSideWrapper dealershipId={id} data={data} onClose={() => setShowCreditForm(false)} />
          </div>
        </Drawer>
      </div>
    </div>
  )
}

export default DealersList;