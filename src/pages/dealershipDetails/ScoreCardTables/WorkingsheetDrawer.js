import { Accordion, Box, Flex, Text } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import React from 'react';
import { useQuery } from 'react-query';
import { BankDetailsTable, BunkDetailsTable, BusinessAnalysisTable, CibilAnalysisTable, DemographicsTable, DeviationTable, FacultyBankDetailsTable, FacultySalesTable, MonthlySalesTable, ReferrenceTable, RemarksTable, SanctionConditionTable, ShareHoldingTable, SummaryDataTable } from './WorkingSheetTable';
import { getScoreCard } from '../../../services/common.service';


const WorkingSheetDrawer = ({ id }) => {
  const { data } = useQuery('scorecard', () => getScoreCard(id), { refetchOnWindowFocus: false })

  const scoreCardData = data?.working_sheet

  const tableData = [
    { id: 1, name: 'Summary data', component: <SummaryDataTable data={scoreCardData} /> },
    { id: 2, name: 'Remarks', component: <RemarksTable data={scoreCardData} /> },
    { id: 3, name: 'Demographics data', component: <DemographicsTable data={scoreCardData} /> },
    { id: 4, name: 'Shareholding details', component: <ShareHoldingTable data={scoreCardData} /> },
    { id: 5, name: 'Business Analysis', component: <BusinessAnalysisTable data={scoreCardData} /> },
    { id: 6, name: 'Monthly Sales details', component: <MonthlySalesTable data={scoreCardData} /> },
    { id: 7, name: 'Infrastructure details', component: <FacultySalesTable data={scoreCardData} /> },
    { id: 8, name: 'Faculty details', component: <BunkDetailsTable data={scoreCardData} /> },
    { id: 9, name: 'Bank Account details', component: <FacultyBankDetailsTable data={scoreCardData} /> },
    { id: 10, name: 'Bank Statement details', component: <BankDetailsTable data={scoreCardData} /> },
    { id: 11, name: 'CIBIL Analysis', component: <CibilAnalysisTable data={scoreCardData} /> },
    { id: 12, name: 'Reference details', component: <ReferrenceTable data={scoreCardData} /> },
    { id: 13, name: 'Deviation details', component: <DeviationTable data={scoreCardData} /> },
    { id: 14, name: 'Sanction details', component: <SanctionConditionTable data={scoreCardData} /> },
  ]

  return (
    <Box my="lg">
      {scoreCardData?.ws_summary_data[0] ? (
        <Accordion
          classNames={{
            chevron: '!transform !rotate-0 data-[rotate]:!rotate-45',
            label: 'text-sm !text-gray-900',
          }}
          chevron={<IconPlus className="w-4 h-4" />}
        >
          {tableData?.map(item => {
            return (
              <Accordion.Item key={item?.id} value={item?.name}>
                <Accordion.Control px="xs">
                  {item?.name}
                </Accordion.Control>

                <Accordion.Panel>
                  {item.component}
                </Accordion.Panel>
              </Accordion.Item>
            )
          })}
        </Accordion>
      ) : (
        <Flex h="60" align="center" justify="center">
          <Text c="gray.6" fz="sm">No data found!</Text>
        </Flex>
      )}
    </Box>
  )
}
export default WorkingSheetDrawer;