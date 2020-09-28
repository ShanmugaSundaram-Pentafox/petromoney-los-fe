import React, { useState, Fragment } from 'react';
import { makeStyles } from '@material-ui/styles';
import { useMount } from 'react-use';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import DeleteForeverRoundedIcon from '@material-ui/icons/DeleteForeverRounded';
import DoneRoundedIcon from '@material-ui/icons/DoneRounded';
import TextInput from '../../../components/TextInput/TextInput';
import Currency from '../../../components/Number/Currency';
import { getDealershipExpensesById, postDealershipExpensesById } from '../../../services/dealerships.service';

const useStyles = makeStyles({
  table: {
    padding: 8
  }
});

const ExpensesTable = ({ id, editable, values=[], currentUser }) => {
  const classes = useStyles();
  const [expenses, setExpenses] = useState(values);
  const [addNewRow, setAddNewRow] = useState();
  const [apiData, setApiData] = useState({});

  useMount(() => {
    getDealershipExpensesById(id)
      .then(data => {
        setExpenses(data);
      })
      .catch(err => {
        console.log('Expenses data fetch error - ', err);
      })
  });

  const onTextChange = e => {
    const { name, value } = e.target;
    setApiData({
      ...apiData,
      [name]: value
    })
  }

  const saveNewExpense = () => {
    console.log('Expense api body - ', apiData)
    if(Object.keys(apiData).length < 2) return null;
    const objBody = {
      user_id: currentUser.id, ...apiData
    }
    postDealershipExpensesById(id, objBody)
      .then(res => {
        setExpenses(res);
        setAddNewRow(false);
      })
      .catch(err => {
        console.log('Expenses data save error - ', err);
      })
  }

  return (
    <Table className={classes.table} size="small" aria-label="Expenses">
      <TableHead>
        <TableRow>
          <TableCell>Type</TableCell>
          <TableCell align="right">Amount</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {
          Array.isArray(expenses) && expenses.map((item, i) => (
            <TableRow key={i}>
              <TableCell>{item.expense_type}</TableCell>
              <TableCell align={"right"}>
                <Currency value={item.expense_amount} />
              </TableCell>
            </TableRow>
          ))
        }
        {
          addNewRow && (
            <TableRow key={"new-row"}>
              <TableCell>
                <TextInput
                  label="Expense Type"
                  name="expense_type"
                  value={apiData.expense_type}
                  onChange={onTextChange}
                />
              </TableCell>
              <TableCell align={"right"}>
                <TextInput
                  money
                  label="Expense Amount"
                  name="expense_amount"
                  type="number"
                  value={apiData.expense_amount}
                  onChange={onTextChange}
                />
              </TableCell>
            </TableRow>
          )
        }
        <TableRow key={"add-row"}>
          <TableCell align="right" colSpan={2}>
            {
              addNewRow ? (
                <Fragment>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={() => {
                      setAddNewRow(false);
                    }}>
                      <DeleteForeverRoundedIcon fontSize="small" />
                    </Button>
                    &nbsp;&nbsp;
                  <Button
                    size="small"
                    variant="outlined"
                    color="success"
                    className={classes.btnSuccess}
                    onClick={saveNewExpense}>
                      <DoneRoundedIcon fontSize="small" />
                    </Button>
                </Fragment>
              ) : (editable && (
                <Button
                  size="small"
                  variant="outlined"
                  className={classes.btnSuccess}
                  onClick={() => setAddNewRow(true)}>Add Expense</Button>
              ))
            }
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}

export default ExpensesTable;