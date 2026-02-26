import React from 'react';
import { Tabs, Loader, Button, Stack, Alert } from '@mantine/core';
import CibilDashboard from './CIBIL';
import {
  useFetchCreditReport,
  useGenerateCreditReport,
} from './useCreditBureau';
import CustomerOnboardStorage from '../../../../store/CustomerOnboardStorage';
import { IconAlertCircle } from '@tabler/icons-react';

/* Helpers */
const buildApplicantTabs = (data) => {
  if (!data) return [];

  const tabs = [];

  if (data.primaryApplicant) {
    tabs.push({
      key: `app-${data.primaryApplicant.applicant_id}`,
      label: 'Primary Applicant',
      applicantId: data.primaryApplicant.applicant_id,
      name: data.primaryApplicant.full_name,
    });
  }

  data.coApplicant?.forEach((co, index) => {
    if (!co?.applicant_id) return;

    tabs.push({
      key: `app-${co.applicant_id}`,
      label: `Co-Applicant ${index + 1}`,
      applicantId: co.applicant_id,
      name: co.full_name,
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
  const dummyData = {
    dealershipId: 30,
    primaryApplicant: { applicant_id: 35 },
    coApplicant: [{ applicant_id: 30 }, { applicant_id: 41 }],
  };

  const tabs = React.useMemo(() => buildApplicantTabs(formattedData), []);
  console.log(tabs, '---TAB--->', formattedData);
  const [activeTabKey, setActiveTabKey] = React.useState(tabs[0]?.key);
  const [reports, setReports] = React.useState({});

  const activeTab = tabs.find((t) => t.key === activeTabKey);

  /* Hooks */
  const fetchReportMutation = useFetchCreditReport();
  const generateReportMutation = useGenerateCreditReport();
  // const getCibiFileMutation = useGetCibiFile(2);

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
  
  if (tabs[0]?.applicantId === null) {
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
  } else {
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
                <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                  <Loader type="dots" />
                </div>
              ) : report ? (
                <CibilDashboard
                  cibildData={report}
                  applicantId={activeTab.applicantId}
                  onRefetchCIBIL={generateReport}
                />
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
  }
};

export default CreditBureau;
