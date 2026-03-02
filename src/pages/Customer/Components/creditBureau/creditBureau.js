import React from 'react';
import { Tabs, Loader, Button, Stack, Alert, Group } from '@mantine/core';
import CibilDashboard from './CIBIL';
import {
  useFetchCreditReport,
  useGenerateCreditReport,
  useGetCibiFile,
} from './useCreditBureau';
import CustomerOnboardStorage from '../../../../store/CustomerOnboardStorage';
import { IconAlertCircle } from '@tabler/icons-react';

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
      name: data.primaryApplicant.full_name,
    });
  }

  data.coApplicant?.forEach((co, index) => {
    if (!co?.applicant_id) return;

    tabs.push({
      key: `app-${co.applicant_id}`,
      label: `${co.full_name || ''} (Co-Applicant ${index + 1})`,
      applicantId: co.applicant_id,
      name: co.full_name,
    });
  });

  return tabs;
};

const CreditBureau = () => {
  const DEFAULT_CIBIL_FILE_ID = 2;
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
  const [cibilFiles, setCibilFiles] = React.useState({});

  const activeTab = tabs.find((t) => t.key === activeTabKey);

  /* Hooks */
  const fetchReportMutation = useFetchCreditReport();
  const generateReportMutation = useGenerateCreditReport();
  const getCibiFileMutation = useGetCibiFile();

  const getFileIdFromPayload = React.useCallback((payload) => {
    if (!payload || typeof payload !== 'object') return null;

    return (
      payload?.[0]?.file_id ||
      payload?.[0]?.cibil_file_id ||
      payload?.cibil_file_id ||
      payload?.cibilFileId ||
      payload?.file_id ||
      payload?.fileId ||
      payload?.cibil_details?.file_id ||
      payload?.cibil_details?.cibil_file_id ||
      payload?.cibil_details?.[0]?.file_id ||
      payload?.cibil_details?.[0]?.cibil_file_id ||
      payload?.data?.cibil_file_id ||
      payload?.data?.cibilFileId ||
      payload?.data?.file_id ||
      payload?.data?.fileId ||
      payload?.data?.cibil_details?.file_id ||
      payload?.data?.cibil_details?.cibil_file_id ||
      payload?.data?.cibil_details?.[0]?.file_id ||
      payload?.data?.cibil_details?.[0]?.cibil_file_id ||
      payload?.credit_report?.[0]?.file_id ||
      payload?.credit_report?.[0]?.cibil_file_id ||
      payload?.data?.credit_report?.[0]?.file_id ||
      payload?.data?.credit_report?.[0]?.cibil_file_id ||
      null
    );
  }, []);

  const getPresignedUrlFromPayload = React.useCallback((payload) => {
    if (!payload || typeof payload !== 'object') return null;

    return (
      payload?.presigned_url ||
      payload?.file_url ||
      payload?.url ||
      payload?.data?.presigned_url ||
      payload?.data?.file_url ||
      payload?.data?.url ||
      null
    );
  }, []);

  /* Fetch report */
  const fetchReport = (applicantId) => {
    fetchReportMutation.mutate(
      { dealershipId: formattedData.dealershipId, applicantId },
      {
        onSuccess: (data) => {
          const reportData = data?.cibil_details ?? null;
          const fileId =
            getFileIdFromPayload(data) ||
            getFileIdFromPayload(reportData) ||
            cibilFiles?.[applicantId]?.fileId ||
            Number(process.env.REACT_APP_DEFAULT_CIBIL_FILE_ID) ||
            DEFAULT_CIBIL_FILE_ID;

          setReports((prev) => ({
            ...prev,
            [applicantId]: reportData,
          }));

          setCibilFiles((prev) => ({
            ...prev,
            [applicantId]: {
              ...(prev[applicantId] || {}),
              fileId,
            },
          }));

          fetchCibilFileAndStore(applicantId, fileId);
        },
      }
    );
  };

  const fetchCibilFileAndStore = (applicantId, fileId) => {
    const fallbackFileId = Number(process.env.REACT_APP_DEFAULT_CIBIL_FILE_ID) || DEFAULT_CIBIL_FILE_ID;
    const effectiveFileId = fileId || fallbackFileId;

    getCibiFileMutation.mutate(effectiveFileId, {
      onSuccess: (fileResponse) => {
        const presignedUrl = getPresignedUrlFromPayload(fileResponse);

        setCibilFiles((prev) => ({
          ...prev,
          [applicantId]: {
            ...(prev[applicantId] || {}),
            fileId: effectiveFileId,
            presignedUrl,
          },
        }));
      },
    });
  };

  /* Generate / Re-generate report */
  const generateReport = (applicantId) => {
    generateReportMutation.mutate(
      { dealershipId: formattedData.dealershipId, applicantId },
      {
        onSuccess: (data) => {
          const reportData = data?.cibil_details ?? null;
          const fileId =
            getFileIdFromPayload(data) ||
            getFileIdFromPayload(reportData) ||
            cibilFiles?.[applicantId]?.fileId ||
            Number(process.env.REACT_APP_DEFAULT_CIBIL_FILE_ID) ||
            DEFAULT_CIBIL_FILE_ID;

          setReports((prev) => ({
            ...prev,
            [applicantId]: reportData,
          }));

          fetchCibilFileAndStore(applicantId, fileId);
        },
      }
    );
  };

  const handleDownloadCibil = (applicantId) => {
    const presignedUrl = cibilFiles?.[applicantId]?.presignedUrl;
    if (presignedUrl) {
      window.open(presignedUrl, '_blank', 'noopener,noreferrer');
    }
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
          const tabFileInfo = cibilFiles[tab.applicantId] || {};
          const hasDownloadUrl = Boolean(tabFileInfo.presignedUrl);
          const isActionLoading =
            generateReportMutation.isLoading || getCibiFileMutation.isLoading;

          return (
            <Tabs.Panel key={tab.key} value={tab.key} pt="md">
              {fetchReportMutation.isLoading && activeTabKey === tab.key ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                  <Loader type="dots" />
                </div>
              ) : report ? (
                <Stack>
                  <Group>
                    <Button
                      loading={isActionLoading}
                      onClick={() => generateReport(tab.applicantId)}
                    >
                      Regenerate Credit Report
                    </Button>
                    {hasDownloadUrl && (
                      <Button
                        variant="outline"
                        onClick={() => handleDownloadCibil(tab.applicantId)}
                      >
                        Download Credit Report
                      </Button>
                    )}
                  </Group>
                  <CibilDashboard
                    cibildData={report}
                    applicantId={tab.applicantId}
                    onRefetchCIBIL={generateReport}
                  />
                </Stack>
              ) : (
                <Stack>
                  <Button
                    loading={isActionLoading}
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
