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
    {
      key: 'dealership_id',
      header: 'Dealership Id',
      enableColumnFilter: false,
      cell: (value) => <RouterLink to={`/dealership/${value?.getValue()}`}>{value?.getValue()}</RouterLink>
    }, {
      key: 'name',
      header: 'Name',
      enableColumnFilter: false,
      cell: (value) => <span>{value?.getValue()?.toUpperCase()}</span>
    }, {
      key: 'type',
      header: 'Type',
      cell: (value) => <span className={clsx(classes.pill, classes[`pills_${value?.getValue()}`])}>{value?.getValue()}</span>
    }, {
      key: 'region',
      header: 'Region',
      cell: (value) => <span>{value?.getValue() ? value?.getValue()?.toLowerCase().replace(/^(.)|\s+(.)/g, value => value.toUpperCase()) : '-'}</span>
    }, {
      key: 'field_officer',
      header: 'Field Officer',
    }, {
      key: 'amount_requested',
      header: 'Req. Amount',
      enableColumnFilter: false,
      cell: (value) => <Currency value={value?.getValue()} />
    }, {
      key: 'modified_date',
      header: 'Req. Date',
      enableColumnFilter: false,
      cell: (value) => <span>{value?.getValue() ? moment(new Date(value?.getValue())).format('DD-MM-YYYY') : '-'}</span>
    }, {
      key: 'reviewer',
      header: 'Reviewer',
      enableColumnFilter: false,
      cell: (value) => <span>{value?.getValue()?.toUpperCase()}</span>
    },
  ],
  loan_approval: [
    {
      key: 'dealership_id',
      header: 'Dealership Id',
      enableColumnFilter: false,
      cell: (value) => <RouterLink to={`/dealership/${value?.getValue()}`}>{value?.getValue()}</RouterLink>
    }, {
      key: 'name',
      header: 'Name',
      enableColumnFilter: false,
      cell: (value) => <span>{value?.getValue()?.toUpperCase()}</span>
    }, {
      key: 'type',
      header: 'Type',
      cell: (value) => <span className={clsx(classes.pill, classes[`pills_${value?.getValue()}`])}>{value?.getValue()}</span>
    }, {
      key: 'region',
      header: 'Region',
      cell: (value) => <span>{value?.getValue() ? value?.getValue()?.toLowerCase().replace(/^(.)|\s+(.)/g, value => value.toUpperCase()) : '-'}</span>
    }, {
      key: 'field_officer',
      header: 'Field Officer',
    }, {
      key: 'amount_requested',
      header: 'Req. Amount',
      enableColumnFilter: false,
      cell: (value) => <Currency value={value?.getValue()} />
    }, {
      key: 'modified_date',
      header: 'Req. Amount',
      enableColumnFilter: false,
      cell: (value) => <span>{value?.getValue() ? moment(new Date(value?.getValue())).format('DD-MM-YYYY') : '-'}</span>
    }, {
      key: 'reviewer',
      header: 'Reviewed By',
      enableColumnFilter: false,
      cell: (value) => <span>{value?.getValue()?.toUpperCase()}</span>
    }, {
      key: 'approver',
      header: 'Approver',
      enableColumnFilter: false,
      cell: (value) => <span>{value?.getValue()?.toUpperCase()}</span>
    },
  ],
  approved: [
    {
      key: 'dealership_id',
      header: 'Dealership Id',
      enableColumnFilter: false,
      cell: (value) => <RouterLink to={`/dealership/${value?.getValue()}`}>{value?.getValue()}</RouterLink>
    }, {
      key: 'name',
      header: 'Name',
      enableColumnFilter: false,
      cell: (value) => <span>{value?.getValue()?.toUpperCase()}</span>
    }, {
      key: 'type',
      header: 'Type',
      cell: (value) => <span className={clsx(classes.pill, classes[`pills_${value?.getValue()}`])}>{value?.getValue()}</span>
    }, {
      key: 'region',
      header: 'Region',
      cell: (value) => <span>{value?.getValue() ? value?.getValue().toLowerCase().replace(/^(.)|\s+(.)/g, value => value.toUpperCase()) : '-'}</span>
    }, {
      key: 'field_officer',
      header: 'Field Officer',
    }, {
      key: 'amount_approved',
      header: 'Approved Amount',
      enableColumnFilter: false,
      cell: (value) => <Currency value={value.getValue()} />
    }, {
      key: 'loan_approved_rejected_date',
      header: 'Approved Date',
      enableColumnFilter: false,
      cell: (value) => <span>{value?.getValue() ? moment(new Date(value?.getValue())).format('DD-MM-YYYY') : '-'}</span>
    }, {
      key: 'approver',
      header: 'Approved By',
      enableColumnFilter: false,
      cell: (value) => <span>{value?.getValue()?.toUpperCase()}</span>
    },
  ],
  disbursement_approval: [
    {
      key: 'dealership_id',
      header: 'Dealership Id',
      enableColumnFilter: false,
      cell: (value) => <RouterLink to={`/dealership/${value?.getValue()}`}>{value?.getValue()}</RouterLink>
    }, {
      key: 'name',
      header: 'Name',
      enableColumnFilter: false,
      cell: (value) => <span>{value?.getValue()?.toUpperCase()}</span>
    }, {
      key: 'type',
      header: 'Type',
      cell: (value) => <span className={clsx(classes.pill, classes[`pills_${value?.getValue()}`])}>{value?.getValue()}</span>
    }, {
      key: 'region',
      header: 'Region',
      cell: (value) => <span>{value?.getValue() ? value?.getValue()?.toLowerCase().replace(/^(.)|\s+(.)/g, value => value.toUpperCase()) : '-'}</span>
    }, {
      key: 'field_officer',
      header: 'Field Officer',
    }, {
      key: 'amount_approved',
      header: 'Approved Amount',
      enableColumnFilter: false,
      cell: (value) => <Currency value={value?.getValue()} />
    }, {
      key: 'modified_date',
      header: 'Approved Date',
      enableColumnFilter: false,
      cell: (value) => <span>{value?.getValue() ? moment(new Date(value?.getValue())).format('DD-MM-YYYY') : '-'}</span>
    },
  ],
  disbursement_approved: [
    {
      key: 'dealership_id',
      header: 'Dealership Id',
      enableColumnFilter: false,
      cell: (value) => <RouterLink to={`/dealership/${value?.getValue()}`}>{value?.getValue()}</RouterLink>
    }, {
      key: 'name',
      header: 'Name',
      enableColumnFilter: false,
      cell: (value) => <span>{value?.getValue()?.toUpperCase()}</span>
    }, {
      key: 'type',
      header: 'Type',
      cell: (value) => <span className={clsx(classes.pill, classes[`pills_${value?.getValue()}`])}>{value?.getValue()}</span>
    }, {
      key: 'region',
      header: 'Region',
      cell: (value) => <span>{value?.getValue() ? value?.getValue()?.toLowerCase().replace(/^(.)|\s+(.)/g, value => value.toUpperCase()) : '-'}</span>
    }, {
      key: 'field_officer',
      header: 'Field Officer',
    }, {
      key: 'amount_approved',
      header: 'Approved Amount',
      enableColumnFilter: false,
      cell: (value) => <Currency value={value?.getValue()} />
    }, {
      key: 'loan_disbursement_approved_rejected_date',
      header: 'Approved Date',
      enableColumnFilter: false,
      cell: (value) => <span>{value?.getValue() ? moment(new Date(value?.getValue())).format('DD-MM-YYYY') : '-'}</span>
    },
  ],
  disbursed: [
    {
      key: 'dealership_id',
      header: 'Dealership Id',
      cell: (value) => <RouterLink to={`/dealership/${value.getValue()}`}>{value.getValue()}</RouterLink>,
      enableColumnFilter: false,
    }, {
      key: 'applicant_code',
      header: 'Customer Code',
      enableColumnFilter: false,
    }, {
      key: 'name',
      header: 'Name',
      cell: (value) => <span>{value.getValue()?.toUpperCase()}</span>,
      enableColumnFilter: false,
    }, {
      key: 'type',
      header: 'Type',
      cell: (value) => <span className={clsx(classes.pill, classes[`pills_${value?.row?.original?.type}`])}>{value.getValue()}</span>,
    }, {
      key: 'region',
      header: 'Region',
      cell: (value) => <>{value.getValue() ? value.getValue().toLowerCase().replace(/^(.)|\s+(.)/g, value => value.toUpperCase()) : '-'}</>,
    }, {
      key: 'field_officer',
      header: 'Field Officer',
    }, {
      key: 'amount_approved',
      header: 'Sanction Amount',
      cell: (value) => <Currency value={value.getValue()} />,
      enableColumnFilter: false,
    }, {
      key: 'loan_approved_rejected_date',
      header: 'Sanction Date',
      cell: (value) => <div>{value.getValue() ? moment(new Date(value.getValue())).format('DD-MM-YYYY') : '-'}</div>,
      enableColumnFilter: false,
    }, {
      key: 'amount_disbursed',
      header: 'Disbursed Amount',
      cell: (value) => <Currency value={value.getValue()} />,
      enableColumnFilter: false,
    }, {
      key: 'loan_disbursed_date',
      header: 'Disbursed Date',
      cell: (value) => <div>{value.getValue() ? moment(new Date(value.getValue())).format('DD-MM-YYYY') : '-'}</div>,
      enableColumnFilter: false,
    },
  ],
  rejected: [
    {
      key: 'dealership_id',
      header: 'Dealership Id',
      enableColumnFilter: false,
      cell: (value) => <RouterLink to={`/dealership/${value?.getValue()}`}>{value?.getValue()}</RouterLink>
    }, {
      key: 'name',
      header: 'Name',
      enableColumnFilter: false,
      cell: (value) => <span>{value?.getValue()?.toUpperCase()}</span>
    }, {
      key: 'type',
      header: 'Type',
      cell: (value) => <span className={clsx(classes.pill, classes[`pills_${value?.getValue()}`])}>{value?.getValue()}</span>
    }, {
      key: 'region',
      header: 'Region',
      cell: (value) => <>{value.getValue() ? value.getValue().toLowerCase().replace(/^(.)|\s+(.)/g, value => value.toUpperCase()) : '-'}</>,
    }, {
      key: 'field_officer',
      header: 'Field Officer',
    }, {
      key: 'amount_approved',
      header: 'Approved Amount',
      enableColumnFilter: false,
      cell: (value) => <Currency value={value?.getValue()} />
    }, {
      key: 'loan_approved_rejected_date',
      header: 'Approved Date',
      enableColumnFilter: false,
      cell: (value) => <span>{value?.getValue() ? moment(new Date(value?.getValue())).format('DD-MM-YYYY') : '-'}</span>
    }, {
      key: 'loan_approved_rejected_date',
      header: 'Rejected Date',
      enableColumnFilter: false,
      cell: (value) => <span>{value?.getValue() ? moment(new Date(value?.getValue())).format('DD-MM-YYYY') : '-'}</span>
    },
  ]
}

export default column;