import React, { useState } from "react"
import { useMount } from "react-use"
import { makeStyles } from "@material-ui/styles"
import Box from "@material-ui/core/Box"
import Grid from "@material-ui/core/Grid"
import Alert from "@material-ui/lab/Alert"
import Radio from "@material-ui/core/Radio"
import RadioGroup from "@material-ui/core/RadioGroup"
import FormControl from "@material-ui/core/FormControl"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import ChevronLeftRoundedIcon from "@material-ui/icons/ChevronLeftRounded"
import {
  TabPanel,
} from "../../../components/CommonComponents/Tabs/TabPanel"
import TextInput, {
  InputFieldWrapper,
  InputLabel,
} from "../../../components/TextInput/TextInput"
import Button from "../../../components/CommonComponents/Button/Button"

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

const SolarEnquiryForm = ({ solarTab, onChangeTab, dealershipId, mainApplicant, currentUser }) => {
  const classes = useStyles()
  const [loading, setLoading] = useState(false)
  const [apiStatus, setApiStatus] = useState({})

  return (
    <Box>
      <div className={classes.tabsWrapper}>
        <TabPanel activeTab={solarTab} index={0} style={{ maxWidth: 620 }}>
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
                  number
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
                  number
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

              <Grid xs={12} container item justify="flex-end">
                {/* <Button
                  variant="contained"
                  startIcon={<ChevronLeftRoundedIcon />}
                  disabled={loading}
                  onClick={onClose}
                >
                  Go back
                </Button> */}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={(e) => {
                    if (solarTab < 4) {
                      onChangeTab(solarTab + 1)
                    }
                  }}
                >
                  Save &amp; Continue
                </Button>
              </Grid>
            </Grid>
          </form>
        </TabPanel>
        <TabPanel activeTab={solarTab} index={1} style={{ maxWidth: 620 }}>
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
                  number
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
                    if (solarTab !== 0) {
                      onChangeTab(solarTab - 1)
                    }
                  }}
                >
                  Previous
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={(e) => {
                    if (solarTab < 4) {
                      onChangeTab(solarTab + 1)
                    }
                  }}
                >
                  Save &amp; Continue
                </Button>
              </Grid>
            </Grid>
          </form>
        </TabPanel>
        <TabPanel activeTab={solarTab} index={2} style={{ maxWidth: 620 }}>
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
                    if (solarTab !== 0) {
                      onChangeTab(solarTab - 1)
                    }
                  }}
                >
                  Previous
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={(e) => {
                    if (solarTab < 4) {
                      onChangeTab(solarTab + 1)
                    }
                  }}
                >
                  Save &amp; Continue
                </Button>
              </Grid>
            </Grid>
          </form>
        </TabPanel>
        <TabPanel activeTab={solarTab} index={3} style={{ maxWidth: 620 }}>
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
                    if (solarTab !== 0) {
                      onChangeTab(solarTab - 1)
                    }
                  }}
                >
                  Previous
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={(e) => {
                    if (solarTab < 4) {
                      onChangeTab(solarTab + 1)
                    }
                  }}
                >
                  Save &amp; Continue
                </Button>
              </Grid>
            </Grid>
          </form>
        </TabPanel>
        <TabPanel activeTab={solarTab} index={4} style={{ maxWidth: 620 }}>
          <Grid xs={12} container item justify="space-between">
            <Button
              variant="contained"
              startIcon={<ChevronLeftRoundedIcon />}
              disabled={loading}
              onClick={(e) => {
                if (solarTab !== 0) {
                  onChangeTab(solarTab - 1)
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
