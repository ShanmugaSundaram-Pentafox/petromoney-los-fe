/* eslint-disable react/react-in-jsx-scope */
import { NavLink as RouterLink } from 'react-router-dom';
import Currency from '../Number/Currency';
import clsx from 'clsx';
import moment from 'moment';
import classes from './Dashboard.module.css';

const column = {
  submitted: [
    {
      header: 'Dealership Id',
      key: 'dealership_id',
      enableColumnFilter: false,
      cell: (value) => <RouterLink to={`/dealership/${value?.getValue()}`}>{value?.getValue()}</RouterLink>
    }, {
      header: 'Name',
      enableColumnFilter: false,
      key: 'name',
      cell: (value) => <span>{value?.getValue()?.toUpperCase()}</span>
    }, {
      header: 'Type',
      key: 'type',
      cell: (value) => <span className={clsx(classes.pill, classes[`pills_${value?.getValue()}`])}>{value?.getValue()}</span>
    }, {
      header: 'Region',
      key: 'region',
      cell: (value) => <span>{value?.getValue() ? value?.getValue()?.toLowerCase().replace(/^(.)|\s+(.)/g, value => value.toUpperCase()) : '-'}</span>
    }, {
      header: 'Field Officer',
      key: 'field_officer',
    }, {
      header: 'Req. Amount',
      key: 'amount_requested',
      enableColumnFilter: false,
      cell: (value) => <Currency value={value?.getValue()} />
    }, {
      header: 'Req. Date',
      key: 'created_date',
      enableColumnFilter: false,
      cell: (value) => <span>{value?.getValue() ? moment(new Date(value?.getValue())).format('DD-MM-YYYY') : '-'}</span>
    }, {
      header: 'Application State',
      key: 'application_state',
      cell: (value) => <span>{value?.getValue() || '-'}</span>
    }
  ],
  loan_review: [
  ],
  loan_approval: [
  ],
  approved: [
  ],
  disbursement_approval: [
  ]
}

export default column;