import React, { useMemo, useState } from "react"
import { NavLink as RouterLink } from "react-router-dom"
import { makeStyles } from "@material-ui/styles"
import MUIDataTable from "mui-datatables"
import Typography from "@material-ui/core/Typography"
import CircularProgress from "@material-ui/core/CircularProgress"
import { useMount } from "react-use"
import { getAllTransport } from "../../../services/transports.service"
import { selectAllTransports } from "../../../store/transports/transports.selector"
import { createStructuredSelector } from "reselect"
import { connect } from "react-redux"
import { setAllTransports } from "../../../store/transports/transports.actions"
import Button from '../../../components/CommonComponents/Button/Button';
import FormDialog from "../../../components/CommonComponents/FormDialog/FormDialog"
import AddNewTransportsForm from "./AddNewTransportsForm"
import AddNewTransportsOwnerForm from "./AddNewTransportsOwnerForm"
import { Grid } from "@material-ui/core"
import { Paper } from "@material-ui/core";
import Skeleton from '@material-ui/lab/Skeleton';
import Drawer from '@material-ui/core/Drawer';
import CloseIcon from '@material-ui/icons/Close';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';



const useStyles = makeStyles((theme) => ({
  title: {
    fontWeight: 500,
    marginRight: 12,
  },
  button: {
    display: "flex",
  },
  sidePanelWrapper: {
    width: '40vw',
    padding: '10px',
  },
  sidePanelTitle: {
    padding: '12px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    zIndex: 0,
    marginBottom: 4,
    boxShadow: '0 1px 4px -3px #333',
  },
  transWrapper: {
    boxShadow: '0 1px 4px -3px #333',
    // borderBottom: '1px solid green',
    marginBottom: '8px',
    padding: '10px'
  },
  ownerWrapper: {
    borderBottom: '1px solid green',
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  resetContainer: {
    padding: theme.spacing(3),
  },
}))
function getSteps() {
  return ['Add Transport Owner Information', 'Add Transport Information'];
}



const TransportsTable = ({ transports, setAllTransports }) => {
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const classes = useStyles()

  const columns = useMemo(() => {
    return [
      {
        label: "Code",
        name: "id",
        options: {
          filter: false,
          sort: true,
          customBodyRender: (value) => {
            return <RouterLink to={`/transports/${value}`}>{value}</RouterLink>
          },
        },
      },
      {
        label: "Name",
        name: "name",
        options: {
          filter: false,
          sort: true,
        },
      },
      {
        label: "Mobile Number",
        name: "mobile",
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        label: "OMC",
        name: "omc",
        options: {
          filter: true,
          sort: true,
        },
      },
    ]
  }, [])

  useMount(() => {
    if (!transports.length) {
      setLoading(true)
      getAllTransport()
        .then((data) => {
          setAllTransports(data)
          setLoading(false)
          // setData(data)
        })
        .catch((e) => {
          console.log(e);
          setLoading(false);
        })
    }
  })

  const options = {
    // filterType: 'checkbox',
    selectableRowsHeader: false,
    selectableRows: "none",
    print: false,
    viewColumns: false,
    rowsPerPage: 10,
    isRowSelectable: () => false,
    customToolbar: () => {
      return (
        <Button
          color="primary"
          variant="contained"
          onClick={() => setOpenModal(true)}
        >
          Add Transport
        </Button>
      );
    }
  }
  function getStepContent(step) {
    switch (step) {
      case 0:
        return <AddNewTransportsOwnerForm handleNext={handleNext} />
      case 1:
        return <AddNewTransportsForm handleBack={handleBack} />

      default:
        return 'Unknown step';
    }
  }

  return (
    <div>
      {
        loading ? (
          <Grid item xs={12}>
            <Skeleton variant="rect" width="100%" height={400} />
          </Grid>
        ) :
          Array.isArray(transports) && transports.length ? (
            <MUIDataTable
              title={
                <div className={classes.button}>
                  <Typography className={classes.title} variant="h5" component="h5">
                    Transports List
                  </Typography>
                </div>
              }
              data={transports}
              columns={columns}
              options={options}
            />
          ) : (
            <Paper style={{ marginTop: 10, padding: 10 }}>No Transporters found</Paper>
          )}
      <Drawer anchor="right" open={openModal} onClose={() => setOpenModal(false)}>
        <div className={classes.sidePanelWrapper}>
          <Typography className={classes.sidePanelTitle} variant="h4">
            <div> Add New Transport Form</div>
            <CloseIcon onClick={() => setOpenModal(false)} />
          </Typography>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
                <StepContent>
                  <Typography>{getStepContent(index)}</Typography>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </div>
      </Drawer>
    </div>
  )
}

const mapStateToProps = createStructuredSelector({
  transports: selectAllTransports,
})

const mapDispatchToProps = (dispatch) => ({
  setAllTransports: (data) => dispatch(setAllTransports(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(TransportsTable)
