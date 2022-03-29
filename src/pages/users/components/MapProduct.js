import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import {
  getProducts,
} from '../../../services/common.service';
import { getProductsMapById, updateProductMapById } from '../../../services/users.service';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: 10,
    minWidth: '10vw',
    maxHeight: 300,
    overflowY: 'auto',
    border: '1px solid rgb(0,0,0,0.2)',
    boxShadow: 'rgba(27, 31, 35, 0.04) 0px 1px 0px, rgba(255, 255, 255, 0.25) 0px 1px 0px inset',
    borderRadius: 3
  },
  paper: {
    width: 'auto',
    height: 20,
    overflow: 'auto',
  },
  button: {
    margin: theme.spacing(0.5, 0),
  },
}));

const MapProduct = ({role_id}) => {
  const classes = useStyles();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedState, setSelectedState] = useState(false)
  const { data: mappedProducts = [] } = useQuery('mapped-products', () => getProductsMapById(role_id), {refetchOnWindowFocus: false})
  const { data: allProducts = [] } = useQuery('all-products', () => getProducts(), {refetchOnWindowFocus: false})
  const productsList = (allProducts || []).filter((r) => {
    if (!mappedProducts.find(rg => rg.value === r.value))
      return true
    else return false;
  })

  const handleChange = (e, list) => {
    const {checked, value} = e.target;
    if(checked){
      setProducts([...products, parseInt(value)])
    } else {
      let buffer = [...products]
      buffer.splice(buffer.indexOf(parseInt(value)), 1)
      setProducts(buffer)
    }
  }

  const updateValue = (action) => {
    const body = { products: products}
    setLoading(true);
    updateProductMapById(role_id, body, action)
      .then((res) => {
        setLoading(false);
        queryClient.invalidateQueries('mapped-products')
        enqueueSnackbar(res, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'success',
        });
        setProducts([])
      })
      .catch((err) => {
        setLoading(false);
      });
  }

  const handleSelectAll = (list, mode) => {
    if(mode){
      setProducts([])
      setSelectedState(false)
    } else {
      setProducts(list.map(r => r.value))
      setSelectedState(true)
    }
  }

  return (
    <Box mt={2} position={'relative'}>
      {
        loading && (
          <Box p={2} pt={10} mx={'auto'} bgcolor={'rgba(207, 216, 220, .25)'} textAlign={'center'} position={'absolute'} zIndex={10} top={0} bottom={0} width={'100%'}>
            <CircularProgress color="secondary" />
          </Box>
        )
      }
      <Typography variant="h4" component="h3">Assign Products</Typography>
      <Grid container spacing={2} style={{padding: 10}}>
        <Grid container style={{display: 'flex', justifyContent: 'space-between', marginTop: 10}}>
          <Grid item md={5}>
            {
              productsList.length != 0 &&
                <Button variant='outlined' size='small' 
                  onClick={() => handleSelectAll(productsList, selectedState)}
                >{selectedState ? 'Deselect All' : 'Select All'}</Button>
            }
          </Grid>
          <Grid item md={5}>
            {
              mappedProducts.length != 0 &&
                <Button variant='outlined' size='small' 
                  onClick={() => handleSelectAll(mappedProducts, selectedState)}
                >{selectedState ? 'Deselect All' : 'Select All'}</Button>
            }
          </Grid>
        </Grid>
        <Grid item xs={5} className={classes.root}>
          {
            productsList.length != 0 ?
              productsList.map((item) => {
                return (
                  <Paper key={item.value}>
                    <FormGroup>
                      <FormControlLabel
                        key={item.value}
                        control={<Checkbox key={item.value} checked={products.includes(item.value)} color="primary" value={item.value} onChange={(e) => handleChange(e, productsList)} />}
                        label={item.label}
                        value={item.value}
                      />
                    </FormGroup>
                  </Paper>
                );
              }) : <Typography variant='body1' style={{color: 'rgb(0,0,0,0.4)'}}>All Products are Mapped!</Typography>
          }
        </Grid>
        <Grid item xs={2} style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 15}}>
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            aria-label="move selected right"
            onClick={() => updateValue('add')}
            style={{ marginBottom: 15 }}
          >
            &gt;
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            aria-label="move selected left"
            onClick={() => updateValue('delete')}
          >
            &lt;
          </Button>
        </Grid>
        <Grid item xs={5} className={classes.root}>
          <Paper direction="column">
            {
              mappedProducts.length != 0 ?
                mappedProducts.map((item) => {
                  return (
                    <FormGroup key={item.value}>
                      <FormControlLabel
                        key={item.value}
                        control={<Checkbox color="primary" key={item.value} checked={products.includes(item.value)} value={item.value} onChange={(e) => handleChange(e, mappedProducts)} />}
                        label={item.label}
                        value={item.value}
                      />
                    </FormGroup>
                  );
                }) : <Typography variant='body1' style={{color: 'rgb(0,0,0,0.4)'}}>No Products are Mapped!</Typography>
            }
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
export default MapProduct;
