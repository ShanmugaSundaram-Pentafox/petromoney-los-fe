import React, { useState } from "react"
import Chart from "react-google-charts"
import Paper from "@material-ui/core/Paper"
import {
  DesElement,
  DesChild,
  Description,
  Assigned,
  Section,
  Header,
} from "./PieChart.css"
// import MenuAppBar from "./NavBar"

function ChartCard({ data, title, dataReceived, renderData, chartType }) {
  //   const [button, setButtonState] = useState(dataReceived.length && true)
  return (
    <div style={{ width: "100" }}>
      <Header>
        <h3>{title}</h3>
        {/* {button === true ? <button>View All</button> : ""} */}
        <button>View All</button>
      </Header>

      <Paper
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Chart
          data={data}
          width={250}
          height={300}
          chartType={chartType}
          loader={<div>Loading Chart</div>}
          options={{
            title: title,
            pieHole: 0.6,
            colors: [
              "rgb(147,187,136)",
              "rgb(248,213,138)",
              "rgb(255,119,119)",
              "rgb(25,219,219)",
            ],
          }}
        />

        <Description>
          {renderData.map((item) => {
            return (
              <div>
                <DesChild>
                  <DesElement>
                    <Section
                      label={
                        (item.label.toLowerCase() === "completed" &&
                          "completed") ||
                        (item.label.toLowerCase() === "processing" &&
                          "processing") ||
                        (item.label.toLowerCase() === "assigned" &&
                          "assigned") ||
                        (item.label.toLowerCase() === "rejected" && "rejected")
                      }
                    >
                      {" "}
                    </Section>
                    <div>
                      <h5>{item.value}</h5>
                      <p>{item.label}</p>
                    </div>
                  </DesElement>
                </DesChild>
              </div>
            )
          })}
        </Description>
      </Paper>
    </div>
  )
}

export default ChartCard
