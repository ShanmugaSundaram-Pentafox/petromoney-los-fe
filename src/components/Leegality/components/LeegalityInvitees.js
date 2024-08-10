import React from 'react';
import CardsCheckList from './CardsCheckList';
import { Box, Grid, rem, Text, Title } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconCalendar } from '@tabler/icons-react';

const LeegalityInvitees = ({ dealers, applicants, guarantor, updateSelectedDealers, updateSelectedCoAppicants, updateSelectedGuarantors, dateValue, setDateValue }) => {

  return (
    <Box style={{ width: '40%' }}>
      <Grid ml={'md'}>
        <Grid.Col>
          <Title order={4}>Date</Title>
          <DatePickerInput
            style={{
              width: 280, margin: 10, 
            }}
            valueFormat="DD-MM-YYYY"
            value={dateValue}
            onChange={setDateValue}
            placeholder="Pick Date"
            rightSection={<IconCalendar style={{ width: rem(18), height: rem(18) }} stroke={1.5} />}
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
