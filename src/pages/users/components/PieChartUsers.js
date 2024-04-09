import { Box, Center, Loader, Paper, Text, Title } from '@mantine/core';
import React, { useEffect, useState } from 'react'
import { VictoryPie } from 'victory';
import classes from './PieChartUsers.module.css';

const PieChartUsers = ({ data, loading = false, selectedRole, setSelectedRole }) => {

  const handleChartHighlight = (chart) => {
    setSelectedRole(selectedRole === chart ? null : chart);
  };

  const handleTotalCount = () => {
    let result = data?.field_officer + data?.dealer + data?.transporter + data?.others;
    return result || 0
  };

  return (
    <Paper className={classes.mainComp}>
      <Box style={{ display: "flex", justifyContent: "space-evenly" }}>
        <Center style={{ width: "60%", position: "relative" }}>
          <Box
            style={{
              position: "absolute",
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Title order={3} style={{ fontSize: "1.6rem", fontWeight: 600 }}>
              {loading ? <Loader type='dots' size={'xs'} color='blue.1' /> : handleTotalCount()}
            </Title>
            <Text>
              Total Users
            </Text>
          </Box>
          {loading ? (
            <Loader size={240} mt={"35px"} mb={"34px"} color={"blue.1"} />
          ) : (
            <VictoryPie
              data={[
                {
                  x: "filed_officer",
                  y: data?.field_officer,
                  title: 'Field Officer'
                },
                {
                  x: "dealer",
                  y: data?.dealer,
                  title: 'Dealer'
                },
                {
                  x: "transporter",
                  y: data?.transporter,
                  title: 'Transporter'
                },
                {
                  x: "others",
                  y: data?.others,
                  title: 'Others'
                },
              ]}
              width="250"
              height="250"
              innerRadius={100}
              radius={({ datum }) => {
                if (datum?.title == selectedRole) {
                  return 70;
                } else {
                  return 75;
                }
              }}
              padAngle={1}
              cornerRadius={4}
              colorScale={["#15AABF", "#39d47a", "teal", "orange"]}
              style={{ labels: { display: "none" } }}
            />
          )}
        </Center>
        <Box className={classes.statsContainer}>
          <Box
            onClick={() => handleChartHighlight("Field Officer")}
            className={classes.stats1}
          >
            <Box
              className={classes.legend}
              style={{ backgroundColor: "#15AABF" }}
            ></Box>
            <Box ml="md">
              <Title order={3} style={{ fontSize: "1.7rem", fontWeight: 600 }}>
                {loading ? <Loader type='dots' size={'xs'} color='#1ce2ff' /> : (data?.field_officer || "0")}
              </Title>
              <Text style={{ color: "#15AABF", marginTop: 2 }}>
                Field Officer
              </Text>
            </Box>
          </Box>
          <Box
            onClick={() => handleChartHighlight("Dealer")}
            className={classes.stats2}
          >
            <Box
              className={classes.legend}
              style={{ backgroundColor: "#39d47a" }}
            ></Box>
            <Box ml="md">
              <Title order={3} style={{ fontSize: "1.7rem", fontWeight: 600 }}>
                {loading ? <Loader type='dots' size={'xs'} color='#44ff92' /> : (data?.dealer || "0")}
              </Title>
              <Text style={{ color: "#39d47a", marginTop: 2 }}>
                Dealer
              </Text>
            </Box>
          </Box>
          <Box
            onClick={() => handleChartHighlight("Transporter")}
            className={classes.stats3}
          >
            <Box
              className={classes.legend}
              style={{ backgroundColor: "teal" }}
            ></Box>
            <Box ml="md">
              <Title order={3} style={{ fontSize: "1.7rem", fontWeight: 600 }}>
                {loading ? <Loader type='dots' size={'xs'} color='#00cccc' /> : (data?.transporter || "0")}
              </Title>
              <Text style={{ color: "teal", marginTop: 2 }}>
                Transporters
              </Text>
            </Box>
          </Box>
          <Box
            onClick={() => handleChartHighlight("Others")}
            className={classes.stats4}
          >
            <Box
              className={classes.legend}
              style={{ backgroundColor: "orange" }}
            ></Box>
            <Box ml="md">
              <Title order={3} style={{ fontSize: "1.7rem", fontWeight: 600 }}>
                {loading ? <Loader type='dots' size={'xs'} color='#ffc700' /> : (data?.others || "0")}
              </Title>
              <Text style={{ color: "orange", marginTop: 2 }}>
                Other Users
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>
    </Paper>
  )
}

export default PieChartUsers