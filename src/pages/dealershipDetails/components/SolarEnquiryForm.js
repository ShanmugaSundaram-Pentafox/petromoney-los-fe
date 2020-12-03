import React, { useState } from "react"
import { useMount } from "react-use"
import { makeStyles } from "@material-ui/styles"
import Box from "@material-ui/core/Box"
import Tabs from "@material-ui/core/Tabs"
import Tab from "@material-ui/core/Tab"
import Grid from "@material-ui/core/Grid"
import Divider from "@material-ui/core/Divider"
import Alert from "@material-ui/lab/Alert"
import Radio from "@material-ui/core/Radio"
import Typography from "@material-ui/core/Typography"
import RadioGroup from "@material-ui/core/RadioGroup"
import FormControl from "@material-ui/core/FormControl"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import ChevronLeftRoundedIcon from "@material-ui/icons/ChevronLeftRounded"
import InfoBox from "../../../components/CommonComponents/InfoBox"
import { getDealersByDealershipId } from "../../../services/dealers.service"
import {
  tabA11yProps,
  TabPanel,
} from "../../../components/CommonComponents/Tabs/TabPanel"
import TextInput, {
  InputFieldWrapper,
  InputLabel,
} from "../../../components/TextInput/TextInput"
import Button from "../../../components/CommonComponents/Button/Button"
import InfoCard from "../../../components/CommonComponents/Cards/InfoCard"

const useStyles = makeStyles((theme) => ({
  pageTitle: {
    marginBottom: 16
  },
  tabsWrapper: {
    display: "flex",
    flexGrow: 1,
  },
  tabs: {
    borderRight: "none",
    minWidth: 180,
  },
  topSpacing: {
    marginTop: theme.spacing(2),
  },
  bottomSpacing: {
    marginBottom: theme.spacing(2),
  },
}))

const inputProps = {
  direction: "column",
  alignTop: true,
}

const SolarEnquiryForm = ({ dealershipId, dealershipData, currentUser, onClose }) => {
  const classes = useStyles()
  const [loading, setLoading] = useState(false)
  const [dealerData, setDealersData] = useState([])
  const [mainApplicant, setMainApplicant] = useState({})
  const [activeTab, setActiveTab] = useState(0)
  const [apiStatus, setAapiStatus] = useState({})
  const [previous, setPrevious] = useState()
  const [next, setNext] = useState()

  useMount(() => {
    getDealersByDealershipId(dealershipId)
      .then((data) => {
        console.log(dealerData)
        setDealersData(data)
        const ap = data.find(item => item.is_main_applicant);
        setMainApplicant(ap);
      })
      .catch((e) => {
        console.log(e)
      })
  })

  const onChangeTab = (e, newTab) => {
    setActiveTab(newTab)
  }

  return (
    <Box p={2}>
      <Typography variant="h3" className={classes.pageTitle}>Solar Enquiry Form</Typography>
      <Grid container spacing={2}>
        <Grid item xs={6} sm={4}>
          <InfoCard
            title={"Dealership Info"}
            userInitial={dealershipData?.name?.charAt(0)}
            name={dealershipData.name}
            caption={dealershipId}
          />
        </Grid>
        <Grid item xs={6} sm={4}>
          {
            mainApplicant.first_name ? (
              <InfoCard 
                title={"Main Dealer Info"}
                userInitial={`${mainApplicant?.first_name?.charAt(0)}`}
                name={`${mainApplicant.first_name} ${mainApplicant?.last_name || ''}`}
                description={`+91 ${mainApplicant.mobile}`}
              />
            ) : null
          }
        </Grid>
      </Grid>
      <div className={classes.tabsWrapper}>
        <Tabs
          orientation="vertical"
          // variant="scrollable"
          value={activeTab}
          onChange={onChangeTab}
          aria-label="Solar Enquiry Form"
          className={classes.tabs}
        >
          <Tab
            label={
              <InfoBox
                active={activeTab === 0}
                number={1}
                title="Dealer Info"
              />
            }
            {...tabA11yProps(0)}
          />
          <Tab
            label={
              <InfoBox
                active={activeTab === 1}
                number={2}
                title="Project Details"
              />
            }
            {...tabA11yProps(1)}
          />
          <Tab
            label={
              <InfoBox
                active={activeTab === 2}
                number={3}
                title="Roof Details"
              />
            }
            {...tabA11yProps(2)}
          />
          <Tab
            label={
              <InfoBox
                active={activeTab === 3}
                number={4}
                title="Electrical Assessments"
              />
            }
            {...tabA11yProps(3)}
          />
          <Tab
            label={
              <InfoBox
                active={activeTab === 4}
                number={5}
                title="Load Profile"
              />
            }
            {...tabA11yProps(4)}
          />
        </Tabs>
        <TabPanel activeTab={activeTab} index={0} style={{ maxWidth: 620 }}>
          <form>
            <Grid container spacing={2}>
              <Grid item md={6}>
                <TextInput
                  {...inputProps}
                  value={mainApplicant?.first_name}
                  labelText="Dealer Name"
                  onChange={() => null}
                />
              </Grid>
              <Grid item md={6}>
                <TextInput
                  {...inputProps}
                  value={mainApplicant?.mobile}
                  labelText="Dealer Phone Number"
                  onChange={() => null}
                />
              </Grid>
              <Grid item xs={12}>
                <InputFieldWrapper>
                  <InputLabel>Dealer Interest</InputLabel>
                  <div>
                    <FormControl component="fieldset">
                      <RadioGroup
                        row
                        aria-label="dealer_interest"
                        name="dealer_interest"
                        defaultValue="outrate"
                      >
                        <FormControlLabel
                          value="outrate"
                          control={<Radio color="primary" />}
                          label="Outrate"
                          labelPlacement="end"
                        />
                        <FormControlLabel
                          value="loan"
                          control={<Radio color="primary" />}
                          label="Loan"
                          labelPlacement="end"
                        />
                      </RadioGroup>
                    </FormControl>
                  </div>
                </InputFieldWrapper>
              </Grid>
              <Grid item md={6}>
                <TextInput
                  {...inputProps}
                  labelText="Street"
                  onChange={() => null}
                />
              </Grid>
              <Grid item md={6}>
                <TextInput
                  {...inputProps}
                  labelText="City"
                  onChange={() => null}
                />
              </Grid>
              <Grid item md={6}>
                <TextInput
                  {...inputProps}
                  labelText="District"
                  onChange={() => null}
                />
              </Grid>
              <Grid item md={6}>
                <TextInput
                  {...inputProps}
                  labelText="State"
                  onChange={() => null}
                />
              </Grid>
              <Grid item md={6}>
                <TextInput
                  {...inputProps}
                  labelText="Pincode"
                  onChange={() => null}
                />
              </Grid>
              <Grid item md={6}>
                <TextInput
                  {...inputProps}
                  labelText="GSTIN"
                  onChange={() => null}
                />
              </Grid>
              <Grid item md={6}>
                <TextInput
                  {...inputProps}
                  labelText="GPS Location"
                  onChange={() => null}
                />
              </Grid>

              <Grid xs={12} container item justify="space-between">
                <Button
                  variant="contained"
                  startIcon={<ChevronLeftRoundedIcon />}
                  disabled={loading}
                  onClick={onClose}
                >
                  Go back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={(e) => {
                    if (activeTab < 4) {
                      setActiveTab(activeTab + 1)
                      console.log(activeTab)
                    }
                  }}
                >
                  Save & Continue
                </Button>
              </Grid>
            </Grid>
          </form>
        </TabPanel>
        <TabPanel activeTab={activeTab} index={1} style={{ maxWidth: 620 }}>
          <form>
            <Grid container spacing={2}>
              <Grid item md={6}>
                <TextInput
                  {...inputProps}
                  labelText="Office Room Terrace Area"
                  onChange={() => null}
                />
              </Grid>
              <Grid item md={6}>
                <TextInput
                  {...inputProps}
                  labelText="Available Area in Terrace.Sqmtr"
                  onChange={() => null}
                />
              </Grid>

              <Grid item md={6}>
                <TextInput
                  {...inputProps}
                  labelText="Type of Roof"
                  onChange={() => null}
                />
              </Grid>
              <Grid item md={6}>
                <TextInput
                  {...inputProps}
                  labelText="Additional Space for Rooftop.Sqmtr"
                  onChange={() => null}
                />
              </Grid>

              <Grid xs={12} container item justify="space-between">
                <Button
                  variant="contained"
                  startIcon={<ChevronLeftRoundedIcon />}
                  disabled={loading}
                  onClick={(e) => {
                    if (activeTab !== 0) {
                      setActiveTab(activeTab - 1)
                      console.log(activeTab)
                    }
                  }}
                >
                  Previous
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={(e) => {
                    if (activeTab < 4) {
                      setActiveTab(activeTab + 1)
                      console.log(activeTab)
                    }
                  }}
                >
                  Save & Continue
                </Button>
              </Grid>
            </Grid>
          </form>
        </TabPanel>
        <TabPanel activeTab={activeTab} index={2} style={{ maxWidth: 620 }}>
          <form>
            <Grid container spacing={2}>
              <Grid item md={6}>
                <TextInput
                  {...inputProps}
                  labelText="Capacity Required Kwp"
                  onChange={() => null}
                />
              </Grid>
              <Grid item md={6}>
                <TextInput
                  {...inputProps}
                  labelText="Feasible Capacity Kwp"
                  onChange={() => null}
                />
              </Grid>

              <Grid item md={6}>
                <TextInput
                  {...inputProps}
                  labelText="Incoming Supply - Phase"
                  onChange={() => null}
                />
              </Grid>
              <Grid item md={6}>
                <TextInput
                  {...inputProps}
                  labelText="Voltage Quality Remarks"
                  onChange={() => null}
                />
              </Grid>

              <Grid xs={12} container item justify="space-between">
                <Button
                  variant="contained"
                  startIcon={<ChevronLeftRoundedIcon />}
                  disabled={loading}
                  onClick={(e) => {
                    if (activeTab !== 0) {
                      setActiveTab(activeTab - 1)
                      console.log(activeTab)
                    }
                  }}
                >
                  Previous
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={(e) => {
                    if (activeTab < 4) {
                      setActiveTab(activeTab + 1)
                      console.log(activeTab)
                    }
                  }}
                >
                  Save & Continue
                </Button>
              </Grid>
            </Grid>
          </form>
        </TabPanel>
        <TabPanel activeTab={activeTab} index={3} style={{ maxWidth: 620 }}>
          <form>
            <Grid container spacing={2}>
              <Grid item md={6}>
                <TextInput
                  {...inputProps}
                  labelText="Electricity Service Number"
                  onChange={() => null}
                />
              </Grid>
              <Grid item md={6}>
                <TextInput
                  {...inputProps}
                  labelText="Electricity Operator / Provider"
                  onChange={() => null}
                />
              </Grid>

              <Grid item md={6}>
                <TextInput
                  {...inputProps}
                  labelText="Electricity Charge / Month Rs"
                  onChange={() => null}
                />
              </Grid>
              <Grid item md={6}>
                <TextInput
                  {...inputProps}
                  labelText="Netmeter instruction to dealer"
                  onChange={() => null}
                />
              </Grid>

              <Grid xs={12} container item justify="space-between">
                <Button
                  variant="contained"
                  startIcon={<ChevronLeftRoundedIcon />}
                  disabled={loading}
                  onClick={(e) => {
                    if (activeTab !== 0) {
                      setActiveTab(activeTab - 1)
                      console.log(activeTab)
                    }
                  }}
                >
                  Previous
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={(e) => {
                    if (activeTab < 4) {
                      setActiveTab(activeTab + 1)
                      console.log(activeTab)
                    }
                  }}
                >
                  Save & Continue
                </Button>
              </Grid>
            </Grid>
          </form>
        </TabPanel>
        <TabPanel activeTab={activeTab} index={4} style={{ maxWidth: 620 }}>
          <Grid xs={12} container item justify="space-between">
            <Button
              variant="contained"
              startIcon={<ChevronLeftRoundedIcon />}
              disabled={loading}
              onClick={(e) => {
                if (activeTab !== 0) {
                  setActiveTab(activeTab - 1)
                  console.log(activeTab)
                }
              }}
            >
              Previous
            </Button>
            <Button variant="contained" color="primary">Preview Report</Button>
          </Grid>
        </TabPanel>
      </div>

      <div className={classes.actionFooter}>
        {apiStatus.type && (
          <Alert severity={apiStatus.type}>{apiStatus.message}</Alert>
        )}
      </div>
    </Box>
  )
}

export default SolarEnquiryForm
