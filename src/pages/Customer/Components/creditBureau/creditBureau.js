import React from 'react';
import { Tabs, Loader, Button, Stack, Alert, Text } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

import CibilDashboard from './CIBIL';
import {
  useFetchCreditReport,
  useGenerateCreditReport,
} from './useCreditBureau';
import CustomerOnboardStorage from '../../../../store/CustomerOnboardStorage';

/* ------------------ Helpers ------------------ */
const buildApplicantTabs = (data) => {
  if (!data) return [];

  const tabs = [];

  if (data.primaryApplicant?.applicant_id) {
    tabs.push({
      key: `app-${data.primaryApplicant.applicant_id}`,
      label: 'Primary Applicant',
      applicantId: data.primaryApplicant.applicant_id,
      name: data.primaryApplicant.full_name || 'Primary Applicant',
    });
  }

  data.coApplicant?.forEach((co, index) => {
    if (!co?.applicant_id) return;

    tabs.push({
      key: `app-${co.applicant_id}`,
      label: `Co-Applicant ${index + 1}`,
      applicantId: co.applicant_id,
      name: co.full_name || `Co-Applicant ${index + 1}`,
    });
  });

  return tabs;
};

/* ------------------ Component ------------------ */
const CreditBureau = () => {
  const storageData = CustomerOnboardStorage.get();

  const formattedData = {
    dealershipId: storageData?.dealership_id,

    primaryApplicant: {
      applicant_id: storageData?.applicant?.applicant_id,
      full_name: storageData?.applicant?.full_name || '',
    },

    coApplicant:
      storageData?.co_applicants?.map((co) => ({
        applicant_id: co?.applicant_id,
        full_name: co?.full_name || '',
      })) || [],
  };
  const dummyData = {
    dealershipId: 30,
    primaryApplicant: { applicant_id: 35 },
    coApplicant: [{ applicant_id: 30 }, { applicant_id: 41 }],
  };

  const tabs = React.useMemo(
    () => buildApplicantTabs(formattedData),
    [storageData]
  );

  const [activeTabKey, setActiveTabKey] = React.useState(null);
  const [reports, setReports] = React.useState({});

  const fetchReportMutation = useFetchCreditReport();
  const generateReportMutation = useGenerateCreditReport();

  /* ------------------ Sync Active Tab ------------------ */
  React.useEffect(() => {
    if (!tabs.length) {
      setActiveTabKey(null);
      return;
    }

    const exists = tabs.some((t) => t.key === activeTabKey);
    if (!exists) {
      setActiveTabKey(tabs[0].key);
    }
  }, [tabs]);

  const activeTab = tabs.find((t) => t.key === activeTabKey);

  /* ------------------ Fetch Report ------------------ */
  const fetchReport = (applicantId) => {
    fetchReportMutation.mutate(
      { dealershipId: formattedData.dealershipId, applicantId },
      {
        onSuccess: (data) => {
          setReports((prev) => ({
            ...prev,
            [applicantId]: data?.cibil_details ?? null,
          }));
        },
      }
    );
  };

  /* ------------------ Generate Report ------------------ */
  const generateReport = (applicantId) => {
    generateReportMutation.mutate(
      { dealershipId: formattedData.dealershipId, applicantId },
      {
        onSuccess: (data) => {
          setReports((prev) => ({
            ...prev,
            [applicantId]: data?.cibil_details ?? null,
          }));
        },
      }
    );
  };

  /* ------------------ Auto Fetch on Tab Change ------------------ */
  React.useEffect(() => {
    if (!activeTab?.applicantId) return;

    // avoid refetch if already cached
    if (!reports[activeTab.applicantId]) {
      fetchReport(activeTab.applicantId);
    }
  }, [activeTab?.applicantId]);

  /* ------------------ No Applicants Guard ------------------ */
  if (!tabs[0]?.applicantId) {
    return (
      <Alert
        icon={<IconAlertCircle size={18} />}
        title="No Applicants Found"
        color="red"
        mt="md"
      >
        Please add a primary applicant or co-applicant before generating a
        credit report.
      </Alert>
    );
  }

  /* ------------------ UI ------------------ */
  return (
    <Tabs value={activeTabKey} onChange={setActiveTabKey} mt="md">
      <Tabs.List>
        {tabs.map((tab) => (
          <Tabs.Tab key={tab.key} value={tab.key}>
            <Text>
              {tab.name}{' '}
              <Text span size="xs" c="dimmed">
                ({tab.label})
              </Text>
            </Text>
          </Tabs.Tab>
        ))}
      </Tabs.List>

      {tabs.map((tab) => {
        const report = reports[tab.applicantId];
        const isActive = activeTabKey === tab.key;

        return (
          <Tabs.Panel key={tab.key} value={tab.key} pt="md">
            {/* Loading */}
            {fetchReportMutation.isLoading && isActive ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  padding: '2rem',
                }}
              >
                <Loader type="dots" />
              </div>
            ) : report ? (
              /* Dashboard */
              <CibilDashboard
                cibildData={report}
                applicantId={tab.applicantId}
                onRefetchCIBIL={generateReport}
              />
            ) : (
              /* Generate Button */
              <Stack>
                <Button
                  loading={generateReportMutation.isLoading && isActive}
                  onClick={() => generateReport(tab.applicantId)}
                >
                  Generate Credit Report
                </Button>
              </Stack>
            )}
          </Tabs.Panel>
        );
      })}
    </Tabs>
  );
};

export default CreditBureau;
