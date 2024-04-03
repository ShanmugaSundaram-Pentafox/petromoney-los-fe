import React from 'react';
import CardsCheckList from './CardsCheckList';
import { Box, Grid, Text, Title } from '@mantine/core';

const LeegalityInvitees = ({ dealers, applicants, guarantor, updateSelectedDealers, updateSelectedCoAppicants, updateSelectedGuarantors }) => {

  return (
    <Box style={{ width: '40%' }}>
      <Grid ml={'md'}>
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
