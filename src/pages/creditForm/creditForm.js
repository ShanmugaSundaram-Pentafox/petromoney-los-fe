import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CreditInfoCard from './components/CreditInfoCard';
import { getDealersCreditInfo, getDealershipCreditReportData, saveDealershipCreditReportData } from '../../services/creditreport.service';
import { getAllApplicantsByDealershipId } from '../../services/dealers.service';
import FinanceInfo from './components/FinanceInfo';
import ScoreCardInfo from './components/ScoreCardInfo';

const withStylesHOC = withStyles(theme => ({
  root: {
    width: '100%',
    padding: theme.spacing(3)
  },
  pageTitle: {
    ...theme.typography.h3,
    marginLeft: theme.spacing(2)
  },
  stepperRoot: {
    background: 'transparent'
  },
  stepperLabel: theme.typography.h5,
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
}));

const steps = [
  "Credit Info",
  "Financials",
  "Score Card & Bank Statement",
  "Remarks"
];

const validateCreditInfo = (applicants, creditInfoData) => {
  return true;
}

const validateCreditReport = (reportData, type) => {
  switch(type) {
    case steps[1]:
      break;
    case steps[2]:
      break;
    case steps[3]:
      break;
    default:
      return false;
  }
  return true;
}

class CreditForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: 0,
      applicants: [],
      creditInfoData: {},
      reportData: {}
    }
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    getDealersCreditInfo(id)
      .then(dealersCreditData => {
        const result = dealersCreditData.reduce((temp, item) => {
          temp[`${item.dealer_id}_${item.coapplicant_id || 0}`] = item;
          return temp;
        }, {});

        this.setState({
          creditInfoData: result
        }, () => {
          getAllApplicantsByDealershipId(id)
            .then(applicantsData => {
              let applicantsList = [];
              applicantsData.forEach(item => {
                const { co_applicants, main_applicant_id, main_applicant_name } = item;
                applicantsList = applicantsList.concat({ name: `${main_applicant_name}`, id: `${main_applicant_id}_0` })
                co_applicants.forEach(coap => {
                  const { co_applicant_id, co_applicant_name, relationship } = coap;
                  applicantsList = applicantsList.concat({ name: `${co_applicant_name} (${relationship.toLowerCase()})`, id: `${main_applicant_id}_${co_applicant_id}` })
                })
              });
      
              this.setState({
                applicants: applicantsList
              });

            }).catch(e => null);
        })

      }).catch(e => null);

    getDealershipCreditReportData(id)
      .then(creditReportData => {
        this.setState({
          reportData: creditReportData
        })
      })
      .catch(e => null)
  }

  updateCreditData = id => (key, value) => {
    this.setState(state => {
      return {
        creditInfoData: {
          ...state.creditInfoData,
          [id]: {
            ...(state.creditInfoData[id] || {}),
            [key]: value
          }
        }
      }
    })
  }

  updateReportData = (key, value) => {
    this.setState(state => {
      return {
        reportData: {
          ...state.reportData,
          [key]: value
        }
      }
    })
  }

  handleBack = () => {
    this.setState(state => ({ activeStep: state.activeStep-1 }));
  }

  handleNext = async () => {
    const { activeStep } = this.state;
    let isValid = false;
    switch(activeStep) {
      case 0:
        isValid = validateCreditInfo(this.state.applicants, this.state.creditInfoData);
        break;
      case 1:
      case 2:
      case 3:
        const { id } = this.props.match.params;
        isValid = await saveDealershipCreditReportData(id, this.state.reportData);
        // isValid = validateCreditReport(this.state.reportData, steps[activeStep]);
        break;
      default:
        isValid = false;
        break;
    }
    
    if(isValid) {
      this.setState({ activeStep: activeStep+1 });
    }
  }

  handleReset = () => {
    this.setState({ activeStep: 0 });
  }

  render() {
    const { match, classes } = this.props;
    const { id } = match.params;
    const { applicants, creditInfoData, activeStep, reportData } = this.state;

    return (
      <div className={classes.root}>
        <Typography variant="h3">Submit Credit Report</Typography>
        <Stepper activeStep={activeStep} orientation="vertical" className={classes.stepperRoot}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>
                <div className={classes.stepperLabel}>{label}</div>
              </StepLabel>
              <StepContent>
                {
                  index === 0 && (
                    <CreditInfoCard
                      dealership_id={id}
                      creditInfoData={creditInfoData}
                      applicants={applicants}
                      updateCreditData={this.updateCreditData}
                      />)
                }
                {
                  index === 1 && (
                    <FinanceInfo
                      data={reportData}
                      onChange={this.updateReportData}
                      />)
                }
                {
                  index === 2 && (
                    <ScoreCardInfo
                      data={reportData}
                      onChange={this.updateReportData}
                      />)
                }
                <div className={classes.actionsContainer}>
                  <div>
                    <Button
                      disabled={activeStep === 0}
                      onClick={this.handleBack}
                      className={classes.button}
                    >
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={this.handleNext}
                      className={classes.button}
                    >
                      {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                    </Button>
                  </div>
                </div>
              </StepContent>
            </Step>
          ))}
        </Stepper>
        {activeStep === steps.length && (
          <Paper square elevation={0} className={classes.resetContainer}>
            <Typography>All steps completed - you&apos;re finished</Typography>
            <Button onClick={this.handleReset} className={classes.button}>
              Reset
            </Button>
          </Paper>
        )}
      </div>
    )
  }
}

export default withStylesHOC(CreditForm);