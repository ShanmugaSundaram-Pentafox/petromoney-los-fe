import { Button } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import AddIconButon from './AddIcon';
import CoApplicantsTable from './CoApplicantsTable';
import DealerEditSideWrapper from './DealerEditSideWrapper';
import DealersTable from './DealersTable';
import GuarantorsTable from './GuarantorsTable';
import TextInput from '../../../components/TextInput/TextInput';
import { permissionCheck } from '../../../components/UserCan/UserCan';
import { action_id, resources_id } from '../../../config/accessControl';
import { rulesList } from '../../../config/userRules';
import { getDealersByDealershipId, getCoApplicantByDealershipId, getGuarantorByDealershipId, updateApplicantDataById } from '../../../services/dealers.service';
import CheckAllowed from '../../rbac/CheckAllowed';


const useStyles = makeStyles(theme => ({
  wrapper: {
    padding: 8,
  },
  addButton: {
    textAlign: 'right',
    float: 'right',
    width: '40%',
    marginTop: '8px',
    marginBottom: '8px',
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
  const [updateApplicant, setUpdateApplicant] = useState({})
  const [activeApplicant, setActiveApplicant] = useState([])
  const { enqueueSnackbar } = useSnackbar();
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
  useEffect(() => {
    if (dealerData) {
      const res = dealerData?.filter(d => d?.is_active == 1)
      setActiveApplicant(res)
    }
  }, [dealerData])

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
  const updateApplicantData = () => {
    updateApplicantDataById(id, updateApplicant?.value)
      .then((res) => {
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

  const deletable = permissionCheck(currentUser.role_name, rulesList.applicant_delete);

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        {
          activeApplicant?.length > 1 &&
            <CheckAllowed currentUser={currentUser} resource={resources_id?.dealer} action={action_id?.dealer?.dealerAdd}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginRight: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <label style={{ marginRight: 8 }}>Change main Applicant</label>
                  <TextInput
                    select
                    error={updateApplicant?.error}
                    helperText={updateApplicant?.error}
                    value={updateApplicant?.value}
                    onChange={(e) => setUpdateApplicant({ updateApplicant, value: e?.target?.value })}
                    SelectProps={{
                      native: true,
                    }}
                    InputLabelProps={{ shrink: true }}
                  >
                    {
                    activeApplicant?.map((item, i) => {
                      return <option key={i} value={item?.id}>{item.first_name}</option>
                    })
                    }
                  </TextInput>
                </div>
                <Button style={{ marginLeft: 20 }} variant='outlined' color='primary' onClick={updateApplicantData}>Update</Button>
              </div>
            </CheckAllowed>
        }
        {
          <CheckAllowed currentUser={currentUser} resource={resources_id?.dealer} action={action_id?.dealer?.dealerAdd}>
            <div>
              <AddIconButon onClickAddMenu={onClickAddMenu} />
            </div>
          </CheckAllowed>
        }
      </div>
      <div className={classes.addButton}>
      </div>
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
            dealersList={activeApplicant}
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