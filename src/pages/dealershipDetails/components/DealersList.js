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
import { getDealersByDealershipId, getCoApplicantByDealershipId } from '../../../services/dealers.service';
import CreditInfoSideWrapper from "./CreditInfoSideWrapper";
import DealerEditSideWrapper from './DealerEditSideWrapper';
import AddIconButon from './AddIcon';
import DealersTable from './DealersTable';
import CoApplicantsTable from './CoApplicantsTable';
import CoApplicantEditSideWrapper from './CoApplicantEditSideWrapper';

const useStyles = makeStyles(theme => ({
  wrapper: {
    padding: 8,
  },
  addButton: {
    width: '10%',
    textAlign: 'right',
    float: 'right',
    marginTop: '4px'
  },
  title: {
    paddingLeft: 8,
    marginBottom: 8
  },
  table: {
    // minWidth: 650,
    padding: 8
  },
  header: {
    display: 'flex',
    marginBottom: 8
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
  tableRow: {
    cursor: 'pointer'
  },
  document: {
    display: 'inline-block',
    borderRadius: 2,
    lineHeight: 1,
    marginRight: 3,
    marginBottom: 4,
    padding: 4,
  }
}));

const DealersList = ({ id, titleAlign, currentUser }) => {
  const classes = useStyles();
  const [showCreditForm, setShowCreditForm] = useState(false);
  const [showDealerEditForm, setShowDealerEditForm] = useState(false);
  const [showApplicantEditForm, setShowApplicantEditForm] = useState(false);
  const [formType, setFormType] = useState('');
  const [rowData, setRowData] = useState({});

  const [dealerData, setDealersData] = useState();
  const [coApplicantsData, setCoApplicantsData] = useState([]);

  const getCoApplicantApiCall = (id) => {
    getCoApplicantByDealershipId(id)
      .then(data => setCoApplicantsData(data))
      .catch(e => null)
  }

  const getDealerApiCall = (id) => {
    getDealersByDealershipId(id)
      .then(data => setDealersData(data))
      .catch(e => null)
  }

  useMount(() => {
    getDealerApiCall(id);
    getCoApplicantApiCall(id);
  });

  const openCloseCreditForm = () => {
    setShowCreditForm(!showCreditForm);
  }

  const onClickAddMenu = (modelType) => {
    setFormType('Add');
    setRowData({})
    if (modelType === 'DEALER') {
      setShowDealerEditForm(true);
    } else if (modelType === 'COAPPLICANT') {
      setShowApplicantEditForm(true);
    }
    return null;
  }

  const dealersClickRow = (e, row) => {
    if (e.target.tagName == 'A') {
      return null;
    }
    setFormType('Edit');
    setShowDealerEditForm(true);
    setRowData(row);
  }

  const editFormClose = (type) => {
    if (type !== 'COAPPLICANT') {
      setShowDealerEditForm(false);
    } else {
      setShowApplicantEditForm(false);
    }
  }

  return (
    <>
      <div className={classes.addButton}><AddIconButon onClickAddMenu={onClickAddMenu} /></div>
      <DealersTable id={id}
        data={dealerData}
        formType={formType}
        rowData={rowData}
        titleAlign={titleAlign}
        showCreditForm={showCreditForm}
        openCloseCreditForm={openCloseCreditForm}
        editFormClose={editFormClose}
        dealersClickRow={dealersClickRow}
        onClickAddMenu={onClickAddMenu}
        showDealerEditForm={showDealerEditForm} />

      <CoApplicantsTable id={id} titleAlign={titleAlign}
        coApplicantsData={coApplicantsData}
        formType={formType}
        rowData={rowData}
        titleAlign={titleAlign}
        showCreditForm={showCreditForm}
        openCloseCreditForm={openCloseCreditForm}
        editFormClose={editFormClose}
        dealersClickRow={dealersClickRow}
        onClickAddMenu={onClickAddMenu}
        showDealerEditForm={showDealerEditForm} />

      <Drawer
        anchor="right"
        open={showDealerEditForm}
        variant="temporary"
      >
        <div className={classes.sidePanelWrapper}>
          <DealerEditSideWrapper getDealerApiCall={getDealerApiCall}
            isAdd={formType}
            dealershipId={id} data={rowData} currentUser={currentUser}
            onClose={() => editFormClose()} />
        </div>
      </Drawer>

      <Drawer
        anchor="right"
        open={showApplicantEditForm}
        variant="temporary"
      >
        <div className={classes.sidePanelWrapper}>
          <CoApplicantEditSideWrapper getCoApplicantApiCall={getCoApplicantApiCall}
            isAdd={formType}
            dealershipId={id} data={coApplicantsData} currentUser={currentUser}
            onClose={() => editFormClose('COAPPLICANT')} />
        </div>
      </Drawer>
    </>
  )
}

export default DealersList;