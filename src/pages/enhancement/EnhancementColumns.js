/* eslint-disable react/react-in-jsx-scope */
import { NavLink as RouterLink } from 'react-router-dom';
import Currency from '../../components/Number/Currency';
import clsx from 'clsx';
import classes from './Enhancement.module.css';

const column = {
  submitted: [
    {
      key: 'dealership_id',
      header: 'Dealership Id',
      cell: (value) => <RouterLink to={`/dealership/${value?.getValue()}`}>{value?.getValue()}</RouterLink>
    }, {
      key: 'dealership_name',
      header: 'Name',
      cell: (value) => <span>{value?.getValue()}</span>
    }, {
      key: 'new_product_name',
      header: 'Product Type',
      cell: (value) => <span className={clsx(classes.pill, classes[`pills_${value?.getValue()}`])}>{value?.getValue()}</span>
    }, {
      key: 'region',
      header: 'Region',
      cell: (value) => <span>{value?.getValue() ? value?.getValue()?.toLowerCase().replace(/^(.)|\s+(.)/g, value => value.toUpperCase()) : '-'}</span>
    }, {
      key: 'new_loan_amount',
      header: 'Loan Amount',
      cell: (value) => <Currency value={value?.getValue()} />
    },
  ]
}

export default column;