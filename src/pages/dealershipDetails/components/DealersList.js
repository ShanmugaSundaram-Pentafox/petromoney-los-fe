import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useMount } from 'react-use';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import { getDealersByDealershipId, getCoApplicantByDealershipId } from '../../../services/dealers.service';
import CreditInfoSideWrapper from "./CreditInfoSideWrapper";
import DealerEditSideWrapper from './DealerEditSideWrapper';
import AddIconButon from './AddIcon';
import DealersTable from './DealersTable';
import CoApplicantsTable from './CoApplicantsTable';
import { permissionCheck } from '../../../components/UserCan/UserCan';
import { rulesList } from '../../../config/userRules';
// import ExperianReport from './ExperianReport';
import GuarantorsTable from './GuarantorsTable';
import { getAllGuarantor } from '../../../services/leegality.service';
import { get } from 'lodash-es';
import { useQuery } from 'react-query';
import { de } from 'date-fns/locale';

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
    // minWidth: 650,
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
  // experianWrapper: {
  //   width: '50vw',
  //   minWidth: 300
  // },
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
  const [experianData, setExperianData] = useState({});
  const [formType, setFormType] = useState('');
  const [modelType, setModelType] = useState('');
  const [rowData, setRowData] = useState({});
  const { data: coApplicantsData, refetch: getCoApplicantApiCall } = useQuery(['co-applicants', id], () => getCoApplicantByDealershipId(id))
  const { data: dealerData, refetch: getDealerApiCall } = useQuery(['dealers-coapplicant', id], () => getDealersByDealershipId(id))
  const { data: guarantorsData, refetch: getGuarantorApiCall } = useQuery(['guarantors', id], () => getAllGuarantor(id))


  // const getCoApplicantApiCall = (id) => {
  //   getCoApplicantByDealershipId(id)
  //     .then(data => {
  //       setCoApplicantsData(data);
  //       setDealerCoApplicantData(prevArray => [...prevArray]);
  //     })
  //     .catch(e => null)
  // }
  // const getDealerApiCall = (id) => {
  // getDealersByDealershipId(id)
  // .then(data => {
  //   setDealersData(data);
  //   setDealerCoApplicantData(prevArray => [...prevArray]);
  // })
  // .catch(e => null)
  // }
  // const getGuarantorApiCall = () => {
  //   getAllGuarantor(id)
  //     .then(data => {
  //       setGuarantorsData(data);
  //     })
  // }
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
    setModelType(type);
    setFormType('Edit');
    setShowDealerEditForm(true);
    setRowData(row);
  }

  const editFormClose = (type) => {
    setShowDealerEditForm(false)
  }

  // const getExperianData = type => (event, id) => {
  //   event.preventDefault();
  //   event.stopPropagation()
  //   setExperianData({ show: true, id, type });
  // }

  const editable = permissionCheck(currentUser.role_name, rulesList.dealership_edit);
  return (
    <>
      {
        editable && <div className={classes.addButton}>
          <AddIconButon onClickAddMenu={onClickAddMenu} />
          {/* <Button color="primary" variant="contained" size="small" onClick={() => onClickAddMenu()}>Add Dealer</Button> */}
        </div>
      }
      <DealersTable
        id={id}
        editable={editable}
        data={dealerData}
        formType={formType}
        rowData={rowData}
        titleAlign={titleAlign}
        showCreditForm={showCreditForm}
        openCloseCreditForm={openCloseCreditForm}
        editFormClose={editFormClose}
        dealersClickRow={dealersClickRow}
        onClickAddMenu={onClickAddMenu}
        // getExperianData={getExperianData("dealer")}
        showDealerEditForm={showDealerEditForm} />

      <CoApplicantsTable
        id={id}
        editable={editable}
        titleAlign={titleAlign}
        coApplicantsData={coApplicantsData}
        formType={formType}
        rowData={rowData}
        titleAlign={titleAlign}
        showCreditForm={showCreditForm}
        openCloseCreditForm={openCloseCreditForm}
        editFormClose={editFormClose}
        dealersClickRow={dealersClickRow}
        onClickAddMenu={onClickAddMenu}
        // getExperianData={getExperianData("coapplicant")}
        showDealerEditForm={showDealerEditForm} />

      <GuarantorsTable
        id={id}
        editable={editable}
        titleAlign={titleAlign}
        guarantorsData={guarantorsData}
        formType={formType}
        rowData={rowData}
        titleAlign={titleAlign}
        showCreditForm={showCreditForm}
        openCloseCreditForm={openCloseCreditForm}
        editFormClose={editFormClose}
        dealersClickRow={dealersClickRow}
        onClickAddMenu={onClickAddMenu}
        // getExperianData={getExperianData("guarantor")}
        showDealerEditForm={showDealerEditForm} />
      {/* <Drawer
        anchor="right"
        open={experianData.show}
        onBackdropClick={() => setExperianData({ show: false })}
        variant="temporary"
      >
        <div className={classes.experianWrapper}>
          {
            experianData.id ? (
              <ExperianReport
                id={experianData.id}
                type={experianData.type}
                onClose={() => setExperianData({ show: false })}
              />
            ) : null
          }
        </div>
      </Drawer> */}
      <Drawer
        anchor="right"
        open={showDealerEditForm}
        onClose={() => setShowDealerEditForm(false)}
        variant="temporary"
      >
        <div className={classes.sidePanelWrapper}>
          <DealerEditSideWrapper
            getDealerApiCall={getDealerApiCall}
            dealersList={dealerData?.data}
            getCoApplicantApiCall={getCoApplicantApiCall}
            isAdd={formType}
            modelType={modelType}
            dealershipId={id}
            data={rowData}
            currentUser={currentUser}
            onClose={() => editFormClose(modelType)} />
        </div>
      </Drawer>

      {
        editable && ((dealerData?.data || []).length != 0 || (coApplicantsData?.data || []).length != 0 || (guarantorsData?.data || []).length != 0) && (
          <div className={classes.footer}>
            <div className={classes.actionButtons}>
              <Button color="primary" variant="contained" size="small" onClick={() => openCloseCreditForm()}>View/Edit Credit Information</Button>
            </div>
            <Drawer
              anchor="right"
              open={showCreditForm}
              variant="temporary"
            >
              <div className={classes.sidePanelWrapper}>
                {
                  !dealerData?.isLoading && !coApplicantsData?.isLoading &&
                  <CreditInfoSideWrapper dealershipId={id} data={[...dealerData.data, ...coApplicantsData.data]} currentUser={currentUser} onClose={() => openCloseCreditForm()} />
                }
              </div>
            </Drawer>
          </div>
        )
      }
    </>
  )
}

export default DealersList;