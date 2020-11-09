import React, { useState } from "react"
import { withStyles } from "@material-ui/core/styles"
import MuiAccordion from "@material-ui/core/Accordion"
import MuiAccordionSummary from "@material-ui/core/AccordionSummary"
import MuiAccordionDetails from "@material-ui/core/AccordionDetails"
import Typography from "@material-ui/core/Typography"
import Currency from "../../../components/Number/Currency"

const Accordion = withStyles({
  root: {
    border: "1px solid rgba(0, 0, 0, .125)",
    boxShadow: "none",
    "&:not(:last-child)": {
      borderBottom: 0,
    },
    "&:before": {
      display: "none",
    },
    "&$expanded": {
      margin: "auto",
    },
  },
  expanded: {},
})(MuiAccordion)

const AccordionSummary = withStyles({
  root: {
    backgroundColor: "rgba(0, 0, 0, .03)",
    borderBottom: "1px solid rgba(0, 0, 0, .125)",
    marginBottom: -1,
    minHeight: 56,
    "&$expanded": {
      minHeight: 56,
    },
  },
  content: {
    "&$expanded": {
      margin: "12px 0",
    },
    justifyContent: "space-between",
  },
  expanded: {},
})(MuiAccordionSummary)

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiAccordionDetails)

export default function VehicleInfo({ data, currentUser }) {
  const [expanded, setExpanded] = useState("")
  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false)
  }

  return (
    <div>
      {data.map((vehicleInfo) => {
        return (
          <div key={vehicleInfo.vehicle_id}>
            <Accordion
              square
              expanded={expanded === vehicleInfo.vehicle_id}
              onChange={handleChange(vehicleInfo.vehicle_id)}
            >
              <AccordionSummary
                aria-controls="panel1d-content"
                id="panel1d-header"
              >
                <Typography>Vehicle Number: {vehicleInfo.tt_no}</Typography>
                <Typography>
                  Credit Limit: <Currency value={vehicleInfo.credit_limit} />
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>No Info</Typography>
              </AccordionDetails>
            </Accordion>
          </div>
        )
      })}
    </div>
  )
}
