import { makeStyles } from '@material-ui/styles';
import React, {useState} from 'react';
import Contain from './MasterDataTable';
import { getOmcList, getStates, getAllRegion, getBusinessTypes, getLoanTypes, getAssetType } from '../../../services/common.service';
import { useMount } from 'react-use';
import Skeleton from '@material-ui/lab/Skeleton';

const useStyles = makeStyles({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
})

function MasterData() {
  const classes = useStyles();
  const [omc, setOmc] = useState([]);
  const [region, setRegion] = useState([]);
  const [state, setState] = useState([]);
  const [businessType, setBusinessType] = useState([]);
  const [loanType, setLoanType] = useState([]);
  const [assetType, setAssetType] = useState([]);
  const [loading, setLoading] = useState(false);

  useMount(() => {
    setLoading(true);
    getOmcList()
      .then(setOmc)
      .catch((e) => {
        console.log(e)
        setLoading(false)
      });
    
    getAllRegion()
      .then(setRegion)
      .catch((e) => {
        console.log(e)
        setLoading(false)
      });
      
    getStates()
      .then((data) => {
        setState(data)
          setLoading(false)
      }) 
      .catch((e) => {
        console.log(e)
        setLoading(false)
      });

    getBusinessTypes()
      .then((data) => {
        setBusinessType(data)
          setLoading(false)
      }) 
      .catch((e) => {
        console.log(e)
        setLoading(false)
      });
    
    getLoanTypes()
      .then((data) => {
        setLoanType(data)
          setLoading(false)
      }) 
      .catch((e) => {
        console.log(e)
        setLoading(false)
      });
    
    getAssetType()
      .then((data) => {
        setAssetType(data)
          setLoading(false)
      }) 
      .catch((e) => {
        console.log(e)
        setLoading(false)
      });
  });

  return (
    <div className={classes.root}>
      {
        loading ? (
          <Skeleton variant="rect" width="100%" height={500}/>
        ) : (
          <>
          <Contain title={'OMCs'} data={omc} label={'name'} setStateBtn={false} regionForm={false}/>
          <Contain title={'Region'} data={region} label={'region'} setStateBtn={false} regionForm={true}/>
          <Contain title={'State'} data={state} label={'name'} setStateBtn={true} regionForm={false}/>
          <Contain title={'Business Type'} data={businessType} label={'id_name'} setStateBtn={false} regionForm={false}/>
          <Contain title={'Asset Type'} data={assetType} label={'id_name'} setStateBtn={false} regionForm={false}/>
          <Contain title={'Loan Type'} data={loanType} label={'id_name'} setStateBtn={false} regionForm={false}/>
          </>
        )
      }
    </div>
  );
}

export default MasterData;
