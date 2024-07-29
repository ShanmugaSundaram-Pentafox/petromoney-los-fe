import React, { useState } from 'react';
import CardsCheckList from './CardsCheckList';
import { Box, Grid, Text, Title } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';

const LeegalityInvitees = ({ dealers, applicants, guarantor, updateSelectedDealers, updateSelectedCoAppicants, updateSelectedGuarantors, dateValue, setDateValue }) => {
  const [localDateValue, setLocalDateValue] = useState(dateValue);
  // Handle date change in local state
  const handleDateChange = (value) => {
    setLocalDateValue(value);
  };

  // Handle blur event to update the actual date value
  const handleDateBlur = () => {
    setDateValue(localDateValue);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      setDateValue(localDateValue);
    }
  };


  return (
    <Box style={{ width: '40%' }}>
      <Grid ml={'md'}>
        <Grid.Col>
          <Text>Change Date</Text>
        </Grid.Col>
        <Grid.Col>
          <DatePickerInput
            valueFormat="DD-MM-YYYY"
            value={dateValue}
            onChange={setDateValue}
            placeholder="Date input"
            popoverProps={{ zIndex: 10000 }}

          />
        </Grid.Col>
        <Grid.Col>
          <Title order={4}>Select Invitees</Title>
        </Grid.Col>
        <Grid.Col pt={2}>
          <Text>Dealers</Text>
          {dealers?.length !== 0 ? (
            <Box pt={1}>
              <CardsCheckList data={dealers} onChange={updateSelectedDealers} />
            </Box>
          ) : (
            <Text c={'#ccc'} ta={'center'}>
              No Dealers Found!
            </Text>
          )}
        </Grid.Col>

        <Grid.Col>
          <Text variant="body1">Co-applicants</Text>
          {applicants?.length !== 0 ? (
            <Box pt={1}>
              <CardsCheckList
                data={applicants}
                onChange={updateSelectedCoAppicants}
                tooltip={true}
              />
            </Box>
          ) : (
            <Text c={'#ccc'} ta={'center'}>
              No Applicants Found!
            </Text>
          )}
        </Grid.Col>
        <Grid.Col>
          <Text variant="body1">Guarantors</Text>
          {guarantor?.length !== 0 ? (
            <Box pt={1}>
              <CardsCheckList
                data={guarantor}
                onChange={updateSelectedGuarantors}
              />
            </Box>
          ) : (
            <Text c={'#ccc'} ta={'center'}>
              No Guarantors Found!
            </Text>
          )}
        </Grid.Col>
      </Grid>
    </Box>
  );
};

export default LeegalityInvitees;
