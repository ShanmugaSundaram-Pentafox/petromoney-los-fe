/* eslint-disable quotes */
import React from 'react'
import { Tabs, Box } from "@mantine/core";
import {
  IconUser,
  IconUsers,
  IconCreditCard,
  IconBuildingBank,
  IconHome,
  IconChecklist,
  IconBusinessplan
} from "@tabler/icons-react";
import "./Onboard.css";
import AssetsAndLiability from './AssetsAndLiability';
import Documents from './Documents';
import BankStatementAnalysis from './BankStatement';
import CustomerDetails from './CustomerDetails';
import { useLocation } from 'react-router-dom';
import CreditBureau from './creditBureau/creditBureau';
import { Eligibility } from './eligibility/eligibility';
import CoApplicants from './CoApplicants';
import LoanType from './LoanType';

function CustomerOnBoardMain() {
  const location = useLocation();
  const [activeTab, setActiveTab] = React.useState('loanType');
  const [loadedTabs, setLoadedTabs] = React.useState(['loanType']);

  const { applicant_id, isExisting } = location.state || {};

  const handleTabChange = (value) => {
    setActiveTab(value);

    if (!loadedTabs.includes(value)) {
      setLoadedTabs((prev) => [...prev, value]);
    }
  };

  return (
    <Box>
      <Tabs value={activeTab} onChange={handleTabChange}>
        <Tabs.List grow>
          <Tabs.Tab value="loanType" leftSection={<IconBusinessplan size={16} />}>
            Loan Type
          </Tabs.Tab>

          <Tabs.Tab value="basic" leftSection={<IconUser size={16} />}>
            Basic Details
          </Tabs.Tab>

          <Tabs.Tab value="coapplicant" leftSection={<IconUsers size={16} />}>
            Co-Applicants
          </Tabs.Tab>

          <Tabs.Tab value="cibil" leftSection={<IconCreditCard size={16} />}>
            Credit Bureau
          </Tabs.Tab>

          <Tabs.Tab value="bank" leftSection={<IconBuildingBank size={16} />}>
            Bank Statements
          </Tabs.Tab>

          <Tabs.Tab
            value="documents"
            leftSection={<IconBuildingBank size={16} />}
          >
            Documents
          </Tabs.Tab>

          <Tabs.Tab value="assets" leftSection={<IconHome size={16} />}>
            Assets
          </Tabs.Tab>

          <Tabs.Tab
            value="eligibility"
            leftSection={<IconChecklist size={16} />}
          >
            Eligibility
          </Tabs.Tab>
        </Tabs.List>

        <Box mt="lg">
           <Tabs.Panel value="loanType">
            {loadedTabs.includes('loanType') && <LoanType />}
          </Tabs.Panel>

          <Tabs.Panel value="basic">
            {loadedTabs.includes('basic') && <CustomerDetails viewMode={isExisting} applicantId={applicant_id} />}
          </Tabs.Panel>

          <Tabs.Panel value="coapplicant">
            {loadedTabs.includes('coapplicant') && (
              <CoApplicants viewMode={isExisting} applicantId={applicant_id} />
            )}
          </Tabs.Panel>

          <Tabs.Panel value="cibil">
            {loadedTabs.includes('cibil') && (
              <CreditBureau viewMode={isExisting} />
            )}
          </Tabs.Panel>

          <Tabs.Panel value="bank">
            {loadedTabs.includes('bank') && (
              <BankStatementAnalysis viewMode={isExisting} />
            )}
          </Tabs.Panel>

          <Tabs.Panel value="documents">
            {loadedTabs.includes('documents') && <Documents />}
          </Tabs.Panel>

          <Tabs.Panel value="assets">
            {loadedTabs.includes('assets') && <AssetsAndLiability />}
          </Tabs.Panel>

          <Tabs.Panel value="eligibility">
            {loadedTabs.includes('eligibility') && (
              <Eligibility viewMode={isExisting} />
            )}
          </Tabs.Panel>
        </Box>
      </Tabs>
    </Box>
  );
}

export default CustomerOnBoardMain;