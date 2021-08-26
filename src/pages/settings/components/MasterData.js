import { makeStyles } from '@material-ui/styles';
import React, {useState} from 'react';
import Contain from './MasterDataTable';
import { getOmcList, getStates, getAllRegion } from '../../../services/common.service';
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
          </>
        )
      }
    </div>
  );
}

export default MasterData;
