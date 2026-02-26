import React from 'react';
import { Tabs, Loader, Button, Stack } from '@mantine/core';
import CibilDashboard from './CIBIL';
import { useFetchCreditReport, useGenerateCreditReport } from './useCreditBureau';
import CustomerOnboardStorage from '../../../../store/CustomerOnboardStorage';


/* Helpers */
const buildApplicantTabs = (data) => {
  console.log('formattedData:', data);
  if (!data) return [];

  const tabs = [];

  if (data.primaryApplicant) {
    tabs.push({
      key: `app-${data.primaryApplicant.applicant_id}`,
      label: `${data.primaryApplicant.full_name || ''} (Primary Applicant)`,
      applicantId: data.primaryApplicant.applicant_id,
    });
  }

  data.coApplicant?.forEach((co, index) => {
    if (!co?.applicant_id) return;

    tabs.push({
      key: `app-${co.applicant_id}`,
      label: `${co.full_name || ''} (Co-Applicant ${index + 1})`,
      applicantId: co.applicant_id,
    });
  });

  return tabs;
};

const CreditBureau = () => {
  const storageData = CustomerOnboardStorage.get();

  const formattedData = {
    dealershipId: storageData?.dealership_id || null,

    primaryApplicant: {
      applicant_id: storageData?.applicant?.applicant_id || null,
      full_name: storageData?.applicant?.full_name || '',
    },

    coApplicant:
      storageData?.co_applicants?.map((co) => ({
        applicant_id: co?.applicant_id || null,
        full_name: co?.full_name || '',
      })) || [],
  };

  // const dummyData = {
  //   dealershipId: 30,
  //   primaryApplicant: { applicant_id: 35 },
  //   coApplicant: [{ applicant_id: 30 }],
  // };

  const tabs = React.useMemo(() => buildApplicantTabs(formattedData), []);
  const [activeTabKey, setActiveTabKey] = React.useState(tabs[0]?.key);
  const [reports, setReports] = React.useState({});

  const activeTab = tabs.find((t) => t.key === activeTabKey);

  /* Hooks */
  const fetchReportMutation = useFetchCreditReport();
  const generateReportMutation = useGenerateCreditReport();

  /* Fetch report */
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

  /* Generate report */
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

  /* Auto fetch on tab change */
  React.useEffect(() => {
    if (!activeTab) return;
    fetchReport(activeTab.applicantId);
  }, [activeTab?.applicantId]);

  return (
    <Tabs value={activeTabKey} onChange={setActiveTabKey} mt="md">
      <Tabs.List>
        {tabs.map((tab) => (
          <Tabs.Tab key={tab.key} value={tab.key}>
            {tab.label}
          </Tabs.Tab>
        ))}
      </Tabs.List>

      {tabs.map((tab) => {
        const report = reports[tab.applicantId];

        return (
          <Tabs.Panel key={tab.key} value={tab.key} pt="md">
            {fetchReportMutation.isLoading && activeTabKey === tab.key ? (
              <Loader type="dots" />
            ) : report ? (
              <CibilDashboard cibildData={report} />
            ) : (
              <Stack>
                <Button
                  loading={generateReportMutation.isLoading}
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
