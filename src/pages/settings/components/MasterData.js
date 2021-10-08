import { makeStyles } from '@material-ui/styles';
import React, {useState} from 'react';
import Contain from './MasterDataTable';
import { getOmcList, getStates, getAllRegion, getBusinessTypes, getLoanTypes, getAssetType } from '../../../services/common.service';
import { useMount } from 'react-use';
import Skeleton from '@material-ui/lab/Skeleton';
import { ReactComponent as BunkIcon } from '../../../icons/bunk.svg';
import { ReactComponent as AssetIcon } from '../../../icons/assets.svg';
import { ReactComponent as LoanIcon } from '../../../icons/loan.svg';
import { ReactComponent as BusinessIcon } from '../../../icons/business.svg';
// import { ReactComponent as StateIcon } from '../../../icons/map.svg';
// import { ReactComponent as RegionIcon } from '../../../icons/globe.svg';
import { ReactComponent as OtherIcon } from '../../../icons/other_icons.svg';
import { ReactComponent as InfrastructureIcon } from '../../../icons/infrastructure.svg';
import PublicIcon from '@material-ui/icons/Public';
import MapIcon from '@material-ui/icons/Map';
import { Drawer, Grid, Paper, Tooltip, Typography } from '@material-ui/core';

const useStyles = makeStyles({
    root: {
      display: 'flex',
      marginTop: 4,
      flexGrow: 1,
      justifyContent: 'center'
    },
    title: {
      fontSize: 12,
      // paddingLeft: 8,
      marginBottom: 8
    },
    content: {
      textAlign: 'center',
      borderRadius: 6,
      paddingTop: 16,
      paddingBottom: 12,
      cursor: 'pointer',
      transition: 'all 0.35s',
      '&:hover': {
        backgroundColor: '#e6e6e6',
      },
    },
    icons: {
      // textAlign: 'center',
    },
    header: {
      display: 'flex',
      marginBottom: 10,
      marginLeft: 20,
      marginTop: 15
    },
    WrapperTitle: {
      fontSize: 18,
      marginBottom: 12
    },
})

function MasterData() {
  const classes = useStyles();
  const [openOmcForm, setOpenOmcForm] = useState(false)
  const [openRegionForm, setOpenRegionForm] = useState(false)
  const [openStateForm, setOpenStateForm] = useState(false)
  const [openBusinessForm, setOpenBusinessForm] = useState(false)
  const [openLoanForm, setOpenLoanForm] = useState(false)
  const [openAssetForm, setOpenAssetForm] = useState(false)
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
    <div>
      {/* {
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
      } */}
      <Paper style={{padding: 10}}>
        <div className={classes.header}>
          <Typography variant="h4" className={classes.WrapperTitle} >Table Settings</Typography>
        </div>
        <div style={{marginLeft: 20, width: '95%'}}>
          <Grid container spacing={1} className={classes.root}>
            <Grid item md={2}>
              <Tooltip title="OMC details">
                <div className={classes.content} onClick={() => setOpenOmcForm(true)}>
                  <BunkIcon width={35} className={classes.icons} />
                  <Typography variant="h5" align='center' className={classes.title} >OMCs</Typography>
                </div>
              </Tooltip>
            </Grid>
            <Grid item md={2}>
              <Tooltip title="OMC details">
                <div className={classes.content} onClick={() => setOpenRegionForm(true)}>
                  <OtherIcon width={35} className={classes.icons} />
                  <Typography variant="h5" align='center' className={classes.title}>Regions</Typography>
                </div>
              </Tooltip>
            </Grid>
            <Grid item md={2}>
              <Tooltip title="OMC details">
                <div className={classes.content} onClick={() => setOpenStateForm(true)}>
                  <InfrastructureIcon width={35} className={classes.icons} />
                  <Typography variant="h5" align='center' className={classes.title}>States</Typography>
                </div>
              </Tooltip>
            </Grid>
            <Grid item md={2}>
              <Tooltip title="OMC details">
                <div className={classes.content} onClick={() => setOpenBusinessForm(true)}>
                  <BusinessIcon width={35} className={classes.icons} />
                  <Typography variant="h5" align='center' className={classes.title} >Business</Typography>
                </div>
              </Tooltip>
            </Grid>
            <Grid item md={2}>
              <Tooltip title="OMC details">
                <div className={classes.content} onClick={() => setOpenLoanForm(true)}>
                  <LoanIcon width={35} className={classes.icons} />
                  <Typography variant="h5" align='center' className={classes.title} >Loan</Typography>
                </div>
              </Tooltip>
            </Grid>
            <Grid item md={2}>
              <Tooltip title="OMC details">
                <div className={classes.content} onClick={() => setOpenAssetForm(true)}>
                  <AssetIcon width={35} className={classes.icons} />
                  <Typography variant="h5" align='center' className={classes.title} >Asset</Typography>
                </div>
              </Tooltip>
            </Grid>
          </Grid>
        </div>
        <Drawer
          anchor="right"
          open={openOmcForm}
          onClose={() => setOpenOmcForm(false)}
          variant="temporary"
        >
          <Contain title={'OMCs'} data={omc} label={'name'} setStateBtn={false} regionForm={false} callback={() => setOpenOmcForm(false)}/>
        </Drawer>
        <Drawer
          anchor="right"
          open={openRegionForm}
          onClose={() => setOpenRegionForm(false)}
          variant="temporary"
        >
          <Contain title={'Region'} data={region} label={'region'} setStateBtn={false} regionForm={true} callback={() => setOpenRegionForm(false)}/>
        </Drawer>
        <Drawer
          anchor="right"
          open={openStateForm}
          onClose={() => setOpenStateForm(false)}
          variant="temporary"
        >
          <Contain title={'State'} data={state} label={'name'} setStateBtn={true} regionForm={false} callback={() => setOpenStateForm(false)}/>
        </Drawer>
        <Drawer
          anchor="right"
          open={openBusinessForm}
          onClose={() => setOpenBusinessForm(false)}
          variant="temporary"
        >
          <Contain title={'Business Type'} data={businessType} label={'id_name'} setStateBtn={false} regionForm={false} callback={() => setOpenBusinessForm(false)}/>
        </Drawer>
        <Drawer
          anchor="right"
          open={openAssetForm}
          onClose={() => setOpenAssetForm(false)}
          variant="temporary"
        >
          <Contain title={'Asset Type'} data={assetType} label={'id_name'} setStateBtn={false} regionForm={false} assetForm={true} callback={() => setOpenAssetForm(false)}/>
        </Drawer>
        <Drawer
          anchor="right"
          open={openLoanForm}
          onClose={() => setOpenLoanForm(false)}
          variant="temporary"
        >
          <Contain title={'Loan Type'} data={loanType} label={'id_name'} setStateBtn={false} regionForm={false} callback={() => setOpenLoanForm(false)}/>
        </Drawer>
      </Paper>

    </div>
  );
}

export default MasterData;
