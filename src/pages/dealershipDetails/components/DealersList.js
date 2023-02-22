import Drawer from '@material-ui/core/Drawer';
import { makeStyles } from '@material-ui/core/styles';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import AddIconButon from './AddIcon';
import CoApplicantsTable from './CoApplicantsTable';
import DealerEditSideWrapper from './DealerEditSideWrapper';
import DealersTable from './DealersTable';
import GuarantorsTable from './GuarantorsTable';
import { permissionCheck } from '../../../components/UserCan/UserCan';
import { action_id, resources_id } from '../../../config/accessControl';
import { rulesList } from '../../../config/userRules';
import { getDealersByDealershipId, getCoApplicantByDealershipId, getGuarantorByDealershipId } from '../../../services/dealers.service';
import CheckAllowed from '../../rbac/CheckAllowed';

const useStyles = makeStyles(theme => ({
  wrapper: {
    padding: 8,
  },
  addButton: {
    textAlign: 'right',
    float: 'right',
    marginTop: '8px',
    marginRight: '8px'
  },
  title: {
    paddingLeft: 8,
    marginBottom: 8
  },
  table: {
    padding: 8
  },
  header: {
    display: 'flex',
    marginBottom: 8
  },
  footer: {
    padding: 8,
    textAlign: 'right',
  },
  sidePanelWrapper: {
    width: '40vw',
    minWidth: 300
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
  const [formType, setFormType] = useState('');
  const [modelType, setModelType] = useState('');
  const [rowData, setRowData] = useState({});
  const { data: coApplicantsData } = useQuery(['co-applicants', id], () => getCoApplicantByDealershipId(id), {
    initialData: [],
    select: res => {
      return res.map(d => ({
        ...d,
        userType: 'Co-Applicant'
      }))
    },
    refetchOnWindowFocus: false
  })
  const { data: dealerData } = useQuery(['dealers-coapplicant', id], () => getDealersByDealershipId(id), {
    initialData: [],
    select: res => {
      return res.map(d => ({
        ...d,
        userType: 'Dealer'
      }))
    },
    refetchOnWindowFocus: false
  })
  const { data: guarantorsData } = useQuery(['guarantors', id], () => getGuarantorByDealershipId(id), {
    initialData: [],
    select: res => {
      return res.map(d => ({
        ...d,
        userType: 'Guarantor'
      }))
    },
    refetchOnWindowFocus: false
  })

  const openCloseCreditForm = () => {
    setShowCreditForm(!showCreditForm);
  }

  const onClickAddMenu = (modelType) => {
    if (modelType === 'DEALER') {
      setModelType('DEALER')
    } else if (modelType === 'COAPPLICANT') {
      setModelType('COAPPLICANT')
    } else if (modelType === 'GUARANTOR') {
      setModelType('GUARANTOR')
    }
    setFormType('Add');
    setRowData({})
    setShowDealerEditForm(true);
    return null;
  }

  const dealersClickRow = (e, row, type) => {
    if (e.target.tagName === 'A') {
      return null;
    }
    const d = { ...row, pan_details: typeof (row.pan_details) === 'string' ? JSON.parse(row.pan_details) : (row.pan_details || {}) }
    setModelType(type);
    setFormType('Edit');
    setShowDealerEditForm(true);
    setRowData(d);
  }

  const editFormClose = (type) => {
    setShowDealerEditForm(false)
  }

  const deletable = permissionCheck(currentUser.role_name, rulesList.applicant_delete);
  return (
    <>
      {
        <CheckAllowed currentUser={currentUser} resource={resources_id?.dealer} action={action_id?.dealer?.dealerAdd}>
          <div className={classes.addButton}>
            <AddIconButon onClickAddMenu={onClickAddMenu} />
          </div>
        </CheckAllowed>
      }
      <DealersTable
        id={id}
        deletable={deletable}
        data={dealerData}
        formType={formType}
        rowData={rowData}
        titleAlign={titleAlign}
        showCreditForm={showCreditForm}
        openCloseCreditForm={openCloseCreditForm}
        editFormClose={editFormClose}
        dealersClickRow={dealersClickRow}
        onClickAddMenu={onClickAddMenu}
        currentUser={currentUser}
        showDealerEditForm={showDealerEditForm} />

      <CoApplicantsTable
        id={id}
        deletable={deletable}
        titleAlign={titleAlign}
        coApplicantsData={coApplicantsData}
        formType={formType}
        rowData={rowData}
        showCreditForm={showCreditForm}
        openCloseCreditForm={openCloseCreditForm}
        editFormClose={editFormClose}
        dealersClickRow={dealersClickRow}
        onClickAddMenu={onClickAddMenu}
        currentUser={currentUser}
        showDealerEditForm={showDealerEditForm} />

      <GuarantorsTable
        id={id}
        deletable={deletable}
        titleAlign={titleAlign}
        guarantorsData={guarantorsData}
        formType={formType}
        rowData={rowData}
        showCreditForm={showCreditForm}
        openCloseCreditForm={openCloseCreditForm}
        editFormClose={editFormClose}
        dealersClickRow={dealersClickRow}
        onClickAddMenu={onClickAddMenu}
        currentUser={currentUser}
        showDealerEditForm={showDealerEditForm} />

      <Drawer
        anchor="right"
        open={showDealerEditForm}
        onClose={() => setShowDealerEditForm(false)}
        variant="temporary"
      >
        <div className={classes.sidePanelWrapper}>
          <DealerEditSideWrapper
            id={id}
            dealersList={dealerData}
            isAdd={formType}
            modelType={modelType}
            dealershipId={id}
            data={rowData}
            currentUser={currentUser}
            onClose={() => editFormClose(modelType)} />
        </div>
      </Drawer>

    </>
  )
}

export default DealersList;