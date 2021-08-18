import { makeStyles } from '@material-ui/styles';
import React, {useState} from 'react';
import Contain from './MasterDataTable';
import { getOmcList, getStates, getAllRegion } from '../../../services/common.service';
import { useMount } from 'react-use';

const useStyles = makeStyles({
    root: {
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap'
    },  
})

function MasterData() {
  const classes = useStyles();
  const [omc, setOmc] = useState([]);
  const [region, setRegion] = useState([]);
  const [state, setState] = useState([]);

  useMount(() => {
    getOmcList()
      .then(setOmc)
      .catch((e) => console.log(e));
  });

  useMount(() => {
    getAllRegion()
      .then(setRegion)
      .catch((e) => console.log(e));
  });

  useMount(() => {
    getStates()
      .then(setState)
      .catch((e) => console.log(e));
  });

  return (
    <div className={classes.root}>
      <Contain title={'OMCs'} data={omc} label={'name'}/>
      <Contain title={'Region'} data={region} label={'region'}/>
      <Contain title={'State'} data={state} label={'name'}/>
    </div>
  );
}

export default MasterData;
