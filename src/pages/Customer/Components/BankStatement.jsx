/* eslint-disable no-duplicate-imports */
import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Card,
  Group,
  Title,
  Button,
  Badge,
  Text,
  Stepper,
  CopyButton,
  Tooltip,
  ActionIcon,
  Flex,
  Grid,
  Loader,
  Stack,
  Divider,
  Progress,
  Paper,
  ScrollArea,
  Center,
  Container,
  Alert,
  ThemeIcon
} from '@mantine/core';
import {
  IconAlertCircle,
  IconBuildingBank,
  IconChartPie,
  IconCheck,
  IconClock,
  IconCopy,
  IconCurrencyDollar,
  IconLink,
  IconTrendingDown,
  IconTrendingUp,
  IconEye,
  IconUpload,
  IconFileText
} from '@tabler/icons-react';
import { IconCircleCheck } from '@tabler/icons-react';
import {
  createConsent,
  getBankDetails,
  getBsaData,
  getBsaStatus,
  getConsentStatus,
  getFoirData,
  initiateBsa,
} from '../../../services/customerOnboarding.service';
import { notifications } from '@mantine/notifications';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { IconWallet } from '@tabler/icons-react';
import { IconAlertTriangle } from '@tabler/icons-react';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip } from 'recharts';
import CustomerOnboardStorage from '../../../store/CustomerOnboardStorage';
import FormDialog from "../../../components/CommonComponents/FormDialog/FormDialog";
import { Typography } from '@material-ui/core';

/* -------------------- Allowed Types -------------------- */
const allowedTypes = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "application/pdf",
];

const getStatusColor = (status) => {
  const value = status?.toLowerCase();

  if (['active'].includes(value)) return 'green';
  if (['ready'].includes(value)) return 'teal';
  if (['draft'].includes(value)) return 'gray';
  if (['rejected', 'expired'].includes(value)) return 'red';
  if (value === 'pending') return 'yellow';
  return 'gray';
};

// Helper functions
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const getFOIRColor = (percentage) => {
  if (percentage <= 30) return 'green';
  if (percentage <= 50) return 'yellow';
  return 'red';
};

const getEMIIcon = (foirPercentage) => {
  if (foirPercentage > 50) return <IconAlertTriangle size={28} color="red" />;
  if (foirPercentage > 40) return <IconTrendingDown size={28} color="orange" />;
  return <IconTrendingDown size={28} color="blue" />;
};

const DonutChart = ({
  data,
  size,
  thickness,
  strokeWidth,
  endAngle,
  chartLabel,
  withTooltip,
  tooltipDataSource,
}) => {
  // Calculate total for the center label
  const total = data.reduce((sum, item) => sum + item.value, 0);

  // Custom tooltip content
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: 'white',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          <p style={{ margin: 0, fontWeight: 'bold' }}>{payload[0].name}</p>
          <p style={{ margin: 0, color: '#666' }}>
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };
  // Custom label for center
  const renderCenterLabel = () => {
    if (chartLabel) {
      return (
        <text
          x={size / 2}
          y={size / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{
            fontSize: '16px',
            fontWeight: 'bold',
            fill: '#333',
          }}
        >
          {chartLabel}
        </text>
      );
    }
    return null;
  };

  return (
    <PieChart width={size} height={size}>
      <Pie
        data={data}
        innerRadius={size / 2 - thickness}
        outerRadius={size / 2}
        startAngle={90}
        endAngle={endAngle}
        paddingAngle={0}
        dataKey="value"
        strokeWidth={strokeWidth}
        isAnimationActive={false}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color || entry.fill} />
        ))}
      </Pie>
      {renderCenterLabel()}
      {withTooltip && (
        <RechartsTooltip
          content={<CustomTooltip />}
          wrapperStyle={{ zIndex: 1000 }}
        />
      )}
    </PieChart>
  );
};

export default function BankStatementAnalysis({ viewMode = false }) {
  const [active, setActive] = useState(0);
  const queryClient = useQueryClient();
  const [url, setUrl] = useState('');
  const [step, setStep] = useState('create');
  const [consentId, setConsentId] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageModal, setImageModal] = useState({
    open: false,
    image: "",
  });
  const onboardData = CustomerOnboardStorage.get();
  const fileInputRef = useRef(null);

  const applicantId = onboardData?.applicant?.applicant_id;
  const applicantNumber = onboardData?.applicant?.mobile;
  const customerId = applicantId;

  const {
    data: consentStatusData,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['consent-status', customerId],
    queryFn: () => getConsentStatus(customerId.toString()),
    enabled: !!viewMode,
    retry: false,
    onSuccess: (data) => {
      const consentStatus = data[0]?.consent_status;
      if (!consentStatus) return;
      setUrl(data?.[0]?.url);
      setStep('link')
      if (consentStatus === 'READY') {
        setActive(2);
        setConsentId(data[0]?.consent_id);
        isrefetch();
      }
      return data;
    },
  });
  const { data: bankData, refetch: isrefetch } = useQuery({
    queryKey: ['bank-data', consentId],
    queryFn: () => getBankDetails(consentId),
    enabled: false,
    retry: false,
    onSuccess: (data) => {
      setStep('bank');
      setActive(3);
      return data;
    },
  });
  const { data: bsaStatus, refetch: refetchStatus, isLoading: bsaStatusLoading } = useQuery({
    queryKey: ['bsa-statusss', consentId],
    queryFn: () => getBsaStatus(consentId),
    enabled: !!consentId && step === 'bank',
    retry: false,
    onSuccess: (data) => {
      if (data?.report_status === 'COMPLETED') {
        setActive(4);
      }
      return data;
    },
  });
  const status = bsaStatus?.report_status;

  useEffect(() => {
    if (!bsaStatus?.report_status) return;

    const status = bsaStatus.report_status;

    if (status === 'PENDING' || status === 'FETCH_PENDING') {
      const interval = setInterval(() => {
        refetchStatus();
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [bsaStatus, refetchStatus]);

  const consentStatus =
    consentStatusData?.[0]?.consent_status || 'Not Initiated';

  const { data: bsaData } = useQuery({
    queryKey: ['bsa-data', consentId],
    queryFn: () => getBsaData(consentId),
    enabled: !!consentId && status === 'COMPLETED',
    retry: false,
    onSuccess: (data) => {
      setStep('data');
      return data;
    },
  });

  const data = useQuery({
    queryKey: ['foir-data', consentId],
    queryFn: () => getFoirData(consentId),
    enabled: !!consentId && status === 'COMPLETED',
    retry: false,
  });
  // Check if data is empty or invalid
  const hasData =
    bsaData &&
    (bsaData.accountDetails ||
      bsaData.salaryDetails ||
      bsaData.incomeChart ||
      bsaData.expenseChart);

  // Extract data from the API response with fallbacks
  const accountDetails = bsaData?.accountDetails || {};
  const salaryDetails = bsaData?.salaryDetails || {};
  const incomeChart = bsaData?.incomeChart || {
    totalIncome: 0,
    data: [],
  };
  const expenseChart = bsaData?.expenseChart || {
    totalExpense: 0,
    data: [],
  };

  // Check if specific sections have data
  const hasAccountDetails = Object.keys(accountDetails).length > 0;
  const hasSalaryDetails = Object.keys(salaryDetails).length > 0;
  const hasIncomeData = incomeChart.data && incomeChart.data.length > 0;
  const hasExpenseData = expenseChart.data && expenseChart.data.length > 0;

  const generateGradientColors = (count) => {
    const baseColors = [
      'rgba(0, 99, 255, 1)', // Primary blue
      'rgba(40, 123, 255, 1)', // Lighter blue
      'rgba(71, 143, 255, 1)', // Even lighter
      'rgba(102, 163, 255, 1)', // Light 
      'rgba(133, 183, 255, 1)', // Very light blue
      'rgba(163, 203, 255, 1)', // Pale blue
      'rgba(194, 223, 255, 1)', // Very pale blue
      'rgba(214, 235, 255, 1)', // Almost white blue
      'rgba(235, 245, 255, 1)', // Near white blue
      'rgba(245, 250, 255, 1)', // White with blue tint
    ];
    const colors = [];

    for (let i = 0; i < count; i++) {
      const ratio = i / Math.max(count - 1, 1);
      const colorIndex = Math.floor(ratio * (baseColors.length - 1));
      colors.push(baseColors[colorIndex]);
    }

    return colors;
  };

  // Prepare income data for chart with gradient colors
  const incomeList = incomeChart?.data ?? [];

  // Sort descending by amount
  const sortedIncome = [...incomeList].sort((a, b) => b.amount - a.amount);

  // Generate gradient colors based on count
  const incomeColors = generateGradientColors(sortedIncome.length);

  // Attach colors after sorting
  const incomeData = sortedIncome.map((item, index) => ({
    name: item.label,
    value: item.amount,
    color: incomeColors[index],
  }));

  // Prepare expense data for chart with gradient colors
  const expenseList = expenseChart?.data ?? [];

  const sortedExpenses = [...expenseList].sort((a, b) => b.amount - a.amount);

  const expenseColors = generateGradientColors(sortedExpenses.length);

  const expensesData = sortedExpenses.map((item, index) => ({
    name: item.label,
    value: item.amount,
    color: expenseColors[index],
  }));

  // Safe data access with fallbacks
  const foirData = data?.data?.foir_table?.values || {
    average_monthly_net_income: 0,
    average_existing_emi: 0,
    average_monthly_expenses: 0,
    average_investments: 0,
    foir_percentage: 0,
    disposable_income: 0,
  };
  const hasFinancialData = foirData.lastest_monthly_income > 0;
  const absoluteEMI = Math.abs(foirData.lastest_existing_emi);
  const expenses = Math.abs(foirData.lastest_monthly_expenses);

  const APPLICATION_STEPS = [
    {
      key: 'SUBMITTED',
      label: 'Generate Consent Link',
      icon: IconCircleCheck
    },
    {
      key: 'READY',
      label: 'Customer Approval',
      icon: IconCircleCheck,
    },
    {
      key: 'PENDING',
      label: 'Fetch Bank Statement',
      icon: IconClock,
    },
    {
      key: 'APPROVED',
      label: 'Run BSA',
      icon: IconCheck,
    },
  ];

  const createConsentMutation = useMutation({
    mutationFn: createConsent,
    onSuccess: (res) => {
      notifications.show({
        title: 'Success',
        message: res?.message,
        color: 'green',
      });
      setUrl(res?.data?.url);
      setActive(1);
      setStep('link');
    },
    onError: (err) => {
      notifications.show({
        title: 'Error',
        message: err?.message || 'Something went wrong',
        color: 'red',
      });
    },
  });
  const initiateBsaMutation = useMutation({
    mutationFn: initiateBsa,
    onSuccess: (res) => {
      notifications.show({
        title: 'Success',
        message: res?.message,
        color: 'green',
      });
      refetchStatus();
    },
    onError: (err) => {
      notifications.show({
        title: 'Error',
        message: err?.message || 'Something went wrong',
        color: 'red',
      });
    },
  });

  const handleCreateConsent = () => {
    createConsentMutation.mutate({
      customer_id: customerId.toString(),
      mobile: applicantNumber.toString(),
    });
  };
  const handleInitiateBsa = () => {
    initiateBsaMutation.mutate({
      consent_id: consentId,
    });
  };


  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      alert("Only images & PDF allowed.");
      return;
    }

    setUploadedFile(file);
console.log("file",file)
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);

    // 🔥 API Call
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/your-upload-api", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      console.log("Uploaded response:", data);

      // If backend gives URL (recommended)
      if (data?.fileUrl) {
        setPreviewUrl(data.fileUrl); // override local preview with server URL
      }

    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    if (!previewUrl) return;
console.log("previewUrl",previewUrl)
    const isPdf = previewUrl.toLowerCase().includes(".pdf");

    if (isPdf) {
      window.open(previewUrl, "_blank");
    } else {
      setImageModal({
        open: true,
        image: previewUrl,
      });
    }
  };
  const getIcon = (type) => {
    switch (type) {
      case 'pie':
        return IconChartPie;
      case 'dollar':
        return IconCurrencyDollar;
      default:
        return IconCurrencyDollar;
    }
  };

  const dateRangeRow = {
    startDate: bsaData?.salaryDetails?.startDate,
    endDate: bsaData?.salaryDetails?.endDate,
  };

  // Salary details rows configuration
  const salaryRowConfigs = [
    {
      key: 'hugeCreditCount',
      label: 'Huge Credit Count',
      icon: 'pie',
      defaultValue: 0,
    },
    {
      key: 'hugeCreditAmountTotal',
      label: 'Huge Credit Amount Total',
      icon: 'dollar',
      isCurrency: true,
    },
    {
      key: 'hugeDebitCount',
      label: 'Huge Debit Count',
      icon: 'pie',
      defaultValue: 0,
    },
    {
      key: 'hugeDebitAmountTotal',
      label: 'Huge Debit Amount Total',
      icon: 'dollar',
      isCurrency: true,
    },
    {
      key: 'totalDebitAmount',
      label: 'Total Debit Amount',
      icon: 'dollar',
      isCurrency: true,
    },
    {
      key: 'totalCreditAmount',
      label: 'Total Credit Amount',
      icon: 'dollar',
      isCurrency: true,
    },
  ];

  const rowConfigs = [
    {
      key: 'salaryAccount',
      label: 'Salary Account',
      icon: 'pie',
      defaultValue: 'N/A',
    },
    {
      key: 'avgMonthlyBalance',
      label: 'Avg. Monthly Balance',
      icon: 'dollar',
      isCurrency: true,
    },
    {
      key: 'avgMonthlySavings',
      label: 'Avg. Monthly Savings',
      icon: 'dollar',
      isCurrency: true,
    },
    {
      key: 'monthPeakBalance',
      label: 'Month Peak Balance',
      icon: 'dollar',
      isCurrency: true,
    },
    {
      key: 'chequeBounces',
      label: 'Cheque Bounces',
      icon: 'pie',
      defaultValue: 'N/A',
    },
    {
      key: 'onlineGameExposure',
      label: 'Online Game Exposure',
      icon: 'pie',
      defaultValue: 'N/A',
    },
    {
      key: 'creditCard',
      label: 'Credit Card Balance',
      icon: 'dollar',
      isCurrency: true,
    },
  ];

  if (isFetching || bankData?.isFetching || bsaData?.isFetching || data?.isFetching) {
    return (
      <Center h={'70vh'}>
        <Loader size={'md'} />
      </Center>
    )
  }

  if (!applicantId) {
    return (
      <Container size="xl" py="lg">
        <Alert
          icon={<IconAlertCircle size={18} />}
          title="No Applicants Found"
          color="red"
          radius="md"
          variant="light"
        >
          Please add a primary applicant or co-applicant before proceeding.
        </Alert>
      </Container>
    );
  }

  return (
    <Box bg={'gray.0'} h={'100%'} p="xl">
      {/* Header */}
      <Group mb="lg">
        <IconBuildingBank size={28} color="#2563eb" />
        <Title order={2} fw={600}>
          Bank Statement Analysis (Account Aggregator)
        </Title>
      </Group>

      <Stepper active={active} size="sm" iconSize={24}>
        {APPLICATION_STEPS.map((step, index) => {
          return <Stepper.Step key={step.key} label={step.label} />;
        })}
      </Stepper>

      <Box
        shadow="sm"
        radius="md"
        p="sm"
        mt={'xl'}
        withBorder
        style={{ backgroundColor: '#ffffff' }}
      >
        <>
          <Group justify="space-between" mb="lg">
            <Text fz={'lg'} fw={600}>
              AA Consent Flow
            </Text>

            <Badge
              variant="light"
              color={getStatusColor(consentStatus)}
              radius="xl"
              size="lg"
            >
              {consentStatus}
            </Badge>
          </Group>
          {step === 'create' && (
            <Button
              leftSection={<IconLink size={18} />}
              size="md"
              loading={createConsentMutation.isLoading}
              radius="md"
              onClick={() => {
                handleCreateConsent();
              }}
            >
              Generate Consent Link
            </Button>
          )}
        </>
        {step === 'link' && (
          <Box>
            <Flex align={'center'}>
              <Text
                size="sm"
                data-testid="consent-url"
                style={{
                  width: '50%',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {`Consent link: ${url}`}
              </Text>
              <CopyButton value={url} timeout={2000}>
                {({ copied, copy }) => (
                  <Tooltip
                    label={copied ? 'Copied' : 'Copy'}
                    withArrow
                    position="right"
                  >
                    <ActionIcon
                      color={copied ? 'teal' : 'gray'}
                      variant="subtle"
                      onClick={copy}
                    >
                      {copied ? (
                        <IconCheck size={16} />
                      ) : (
                        <IconCopy size={16} />
                      )}
                    </ActionIcon>
                  </Tooltip>
                )}
              </CopyButton>
            </Flex>
            <Button
              leftSection={<IconClock size={18} />}
              mt={10}
              variant="outline"
              loading={isFetching || bankData?.isFetching}
              onClick={() => { refetch() }}
            >
              Check Consent Status
            </Button>
          </Box>
        )}
        {step === 'bank' && (
          <Box mt="md">
            <Text weight={600} mb="sm">
              List of Accounts for Analysis
            </Text>

            <Grid>
              {bankData.map((acc) => {
                return (
                  <Grid.Col span={4}>
                    <Card
                      key={acc.link_ref_number}
                      shadow="sm"
                      padding="md"
                      style={{
                        borderColor: '#d3dce6',
                        borderWidth: 1,
                        borderStyle: 'solid',
                        minWidth: 280,
                        flex: '1 1 30%',
                      }}
                      radius="md"
                    >
                      <Text fw={700} size="md" mb={4} fz={16}>
                        {acc.bank_name}
                      </Text>
                      <Text color="dimmed" size="sm">
                        {acc.masked_account_number} &bull;{' '}
                        {acc.type.replace('_', ' ')}
                      </Text>
                    </Card>
                  </Grid.Col>
                );
              })}
            </Grid>
            <Button
              mt="lg"
              size="md"
              radius="md"
              variant="filled"
              rightSection={
                status === 'FETCH_PENDING' || status === 'PENDING' ? (
                  <Loader size={'xs'} type="dots" />
                ) : null
              }
              disabled={status === 'FETCH_PENDING' || status === 'PENDING'}
              onClick={() => {
                handleInitiateBsa();
              }}
              //   onClick={() => {
              //     refetchStatus();
              //   }}
              loading={initiateBsaMutation.isLoading}
              styles={{
                root: {
                  fontWeight: 500,
                  marginLeft: '16px',
                  flexShrink: 0,
                },
              }}
            >
              {status === 'FETCH_PENDING' || status === 'PENDING'
                ? 'In Progress'
                : ' Analyze Bank Statements'}
            </Button>

            {status === 'FETCH_PENDING' || status === 'PENDING' && (
              <Alert
                icon={<IconClock size={16} />}
                title="Analysis in Progress"
                color="yellow"
                radius="md"
                variant="light"
                mt="md"
              >
                This process may take a few minutes. Please proceed to the next step.
              </Alert>
            )}
          </Box>
        )}
        {step === 'data' && (
          <>
            <Stack gap="md">
              <Flex justify={'space-between'}>
                <Group gap="sm">
                  <IconBuildingBank size={26} />
                  <div>
                    <Text size="xl" fw={600}>
                      Fixed Obligation to Income Ratio
                    </Text>
                  </div>
                </Group>
                {/* <Button variant="light" size="sm" leftSection={<IconDownload size={16} />} onClick={() => downloadBase64File(data?.base64, 'FOIR.json')}>Download</Button> */}
              </Flex>

              {/* Financial Overview Card */}
              {hasFinancialData && (
                <Card p="lg" radius="md" withBorder>
                  <Group justify="space-between" mb="md">
                    <Group justify="apart">
                      <Text size="lg" fw={600}>
                        <Group gap="sm">
                          <IconTrendingUp color="blue" />
                          Financial Overview
                        </Group>
                      </Text>
                      <Badge
                        color={getFOIRColor(foirData.foir_percentage)}
                        size="lg"
                        variant="filled"
                      >
                        FOIR: {foirData.foir_percentage.toFixed(1)}%
                      </Badge>
                    </Group>
                    {/* <Badge size="lg" variant="filled">{dayjs(foirData.lastest_income_month).format("MMM-YYYY")}</Badge> */}
                  </Group>

                  <Group align="stretch">
                    {/* MONTHLY INCOME */}
                    <Paper
                      p="md"
                      withBorder
                      radius="md"
                      w={'300px'}
                      style={{ height: '100%' }}
                    >
                      <Flex justify={'space-around'}>
                        <Flex gap={10} ml={-10}>
                          {/* <IconMoneybagMinus size={28} color="green" /> */}
                          <Box>
                            <Text size="sm" c="dimmed">
                              {' '}
                              Income
                            </Text>
                            <Text fw={600} size="lg">
                              {formatCurrency(foirData.lastest_monthly_income)}
                            </Text>
                          </Box>
                        </Flex>
                        <Divider orientation="vertical" />
                        <Flex gap={10}>
                          {/* <IconMoneybagMove size={28} color="red" /> */}
                          <Box>
                            <Text size="sm" c="dimmed">
                              Expenses
                            </Text>
                            <Text fw={600} size="lg">
                              {formatCurrency(expenses)}
                            </Text>
                          </Box>
                        </Flex>
                      </Flex>
                    </Paper>

                    {/* EXISTING EMI */}
                    <Paper
                      p="md"
                      withBorder
                      radius="md"
                      w={'220px'}
                      style={{ height: '100%' }}
                    >
                      <Group align="flex-start">
                        {getEMIIcon(foirData.foir_percentage)}
                        <div>
                          <Text size="sm" c="dimmed">
                            Existing EMI
                          </Text>
                          <Text fw={600} size="lg">
                            {formatCurrency(absoluteEMI)}
                          </Text>
                        </div>
                      </Group>
                    </Paper>
                    <Paper
                      p="md"
                      withBorder
                      radius="md"
                      style={{ height: '100%' }}
                    >
                      <Group align="flex-start">
                        <IconWallet size={28} color="green" />
                        <div>
                          <Text size="sm" c="dimmed">
                            Disposable Income
                          </Text>
                          <Text fw={600} size="lg">
                            {formatCurrency(foirData.disposable_income)}
                          </Text>
                        </div>
                      </Group>
                    </Paper>

                    {/* FOIR PROGRESS */}
                    <Paper
                      p="md"
                      withBorder
                      radius="md"
                      w={'240px'}
                      style={{ height: '100%' }}
                    >
                      <Stack gap={foirData.foir_emi_percentage ? 6 : 0}>
                        <Text size="sm" c="dimmed" mb={10}>
                          FOIR Progress{' '}
                          {foirData.foir_emi_percentage && (
                            <Text size="xs">
                              <Text
                                span
                                c={getFOIRColor(foirData.foir_percentage)}
                              >
                                {foirData.foir_emi_percentage}%
                              </Text>{' '}
                              of income used for EMI
                            </Text>
                          )}
                        </Text>
                        <Progress
                          value={foirData.foir_percentage}
                          size="lg"
                          radius="xl"
                          color={getFOIRColor(foirData.foir_percentage)}
                        />
                      </Stack>
                    </Paper>
                  </Group>
                </Card>
              )}
            </Stack>
            {hasAccountDetails || hasSalaryDetails ? (
              <>
                <Grid>
                  <Grid.Col span={6}>
                    <Text c={'#344054'} fw={600} fz={16} my="md">
                      Account Summary
                    </Text>
                    {hasAccountDetails ? (
                      <Box style={{ width: '100%' }}>
                        {rowConfigs.map((config, index) => {
                          const IconComponent = getIcon(config.icon);
                          const value = config.isCurrency
                            ? formatCurrency(accountDetails[config.key])
                            : accountDetails[config.key] || config.defaultValue;

                          return (
                            <Box
                              key={config.key}
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '6px 8px',
                              }}
                            >
                              <Group gap="sm">
                                <Box
                                  p={6}
                                  bg="#E6F0FF"
                                  style={{
                                    borderRadius: '18px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: 32,
                                    height: 32,
                                  }}
                                >
                                  <IconComponent size={18} stroke={1.5} />
                                </Box>
                                <Text c="#667085" fw={500} fz={14}>
                                  {config.label}
                                </Text>
                              </Group>
                              <Text c="#667085" fw={500} fz={14}>
                                {value}
                              </Text>
                            </Box>
                          );
                        })}
                      </Box>
                    ) : (
                      <Card withBorder p="md" mt="md">
                        <Text ta="center" c="dimmed">
                          No account details available
                        </Text>
                      </Card>
                    )}
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text c={'#344054'} fw={600} fz={16} my="md">
                      Transaction Details
                    </Text>
                    {hasSalaryDetails ? (
                      <Box style={{ width: '100%' }}>
                        {/* Date Range Row */}
                        <Box
                          style={{
                            padding: '12px 16px',
                            //   borderBottom: hasSalaryDetails ? '1px solid #EDF2F7' : 'none'
                          }}
                        >
                          <Flex justify="space-between">
                            <Text c="#667085" fw={500} fz={14}>
                              {dateRangeRow.startDate}
                            </Text>
                            <Text c="#667085" fw={500} fz={14}>
                              {dateRangeRow.endDate}
                            </Text>
                          </Flex>
                        </Box>

                        {/* Salary Details Rows */}
                        {hasSalaryDetails && (
                          <>
                            {salaryRowConfigs.map((config, index) => {
                              const IconComponent = getIcon(config.icon);
                              const value = config.isCurrency
                                ? formatCurrency(salaryDetails?.[config.key])
                                : salaryDetails?.[config.key] ??
                                config.defaultValue;

                              return (
                                <Box
                                  key={config.key}
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '6px 8px',
                                  }}
                                >
                                  <Group gap="sm">
                                    <Box
                                      p={6}
                                      bg="#E6F0FF"
                                      style={{
                                        borderRadius: '18px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: 32,
                                        height: 32,
                                      }}
                                    >
                                      <IconComponent size={18} stroke={1.5} />
                                    </Box>
                                    <Text c="#667085" fw={500} fz={14}>
                                      {config.label}
                                    </Text>
                                  </Group>
                                  <Text c="#667085" fw={500} fz={14}>
                                    {value}
                                  </Text>
                                </Box>
                              );
                            })}
                          </>
                        )}
                      </Box>
                    ) : (
                      <Card withBorder p="md" mt="md">
                        <Text ta="center" c="dimmed">
                          No transaction details available
                        </Text>
                      </Card>
                    )}
                  </Grid.Col>
                </Grid>
              </>
            ) : (
              <Card withBorder p="md" mt="md">
                <Text ta="center" c="dimmed">
                  No account or transaction details available
                </Text>
              </Card>
            )}

            {hasIncomeData || hasExpenseData ? (
              <Grid pt={'md'} mt={10}>
                <Grid.Col span={6}>
                  <Text c={'#344054'} fw={500} fz={16} mb="md">
                    Income Breakdown
                  </Text>
                  {hasIncomeData ? (
                    <Box>
                      <Center w={'60%'}>
                        <DonutChart
                          data={incomeData}
                          size={250}
                          thickness={50}
                          strokeWidth={0}
                          endAngle={450}
                          chartLabel={`${formatCurrency(
                            incomeChart.totalIncome
                          )}`}
                          withTooltip
                          tooltipDataSource="segment"
                        />
                      </Center>
                      <ScrollArea h={300} type="scroll" mt={10}>
                        <Stack justify="space-around" gap="sm">
                          {incomeData.map((item) => (
                            <Group wrap="nowrap" key={item.name}>
                              <Badge color={item.color} size="xs" circle />
                              <Text c={'#344054'} fw={500} fz={12}>
                                {item.name}: {formatCurrency(item.value)}
                              </Text>
                            </Group>
                          ))}
                        </Stack>
                      </ScrollArea>
                    </Box>
                  ) : (
                    <Card withBorder p="md">
                      <Text ta="center" c="dimmed">
                        No income data available
                      </Text>
                    </Card>
                  )}
                </Grid.Col>
                <Grid.Col span={6}>
                  <Text c={'#344054'} fw={500} fz={16} mb="md">
                    Expense Breakdown
                  </Text>
                  {hasExpenseData ? (
                    <Box>
                      <Center w={'70%'}>
                        <DonutChart
                          data={expensesData}
                          size={250}
                          thickness={50}
                          strokeWidth={0}
                          endAngle={450}
                          chartLabel={`${formatCurrency(
                            expenseChart.totalExpense
                          )}`}
                          withTooltip
                          tooltipDataSource="segment"
                        />
                      </Center>
                      <ScrollArea h={300} type="scroll" mt={10}>
                        <Stack justify="space-around" gap="sm">
                          {expensesData.map((item) => (
                            <Group wrap="nowrap" key={item.name}>
                              <Badge color={item.color} size="xs" circle />
                              <Text c={'#344054'} fw={500} fz={12}>
                                {item.name}: {formatCurrency(item.value)}
                              </Text>
                            </Group>
                          ))}
                        </Stack>
                      </ScrollArea>
                    </Box>
                  ) : (
                    <Card withBorder p="md">
                      <Text ta="center" c="dimmed">
                        No expense data available
                      </Text>
                    </Card>
                  )}
                </Grid.Col>
              </Grid>
            ) : (
              <Card withBorder p="md" mt="md">
                <Text ta="center" c="dimmed">
                  No income or expense data available
                </Text>
              </Card>
            )}
          </>
        )}
      </Box>
      <Box>
        <>
          <Card radius="md" padding="lg" withBorder style={{marginTop:30}}>
            <Group justify="space-between" align="center">
              <Group>
                <ThemeIcon variant="light" size="lg" color="blue">
                  <IconFileText size={18} />
                </ThemeIcon>

                <Stack gap={2}>
                  <Text fw={600}>Upload Bank Statement</Text>
                </Stack>
              </Group>

              <Group>
                {/* Status Badge */}
                {(
                  <Badge
                    variant="light"
                    color="gray"
                    leftSection={<IconClock size={14} />}
                  >
                    Pending
                  </Badge>
                )}

                {/* 👁 Preview Button */}
                {previewUrl && (
                  <ActionIcon
                    color="green"
                    variant="light"
                    onClick={handlePreview}
                  >
                    <IconEye size={16} />
                  </ActionIcon>
                )}

                {/* Upload */}
                <Button
                  variant="light"
                  size="sm"
                  leftSection={<IconUpload size={16} />}
                  onClick={handleUploadClick}
                  loading={false}
                >
                  Upload
                </Button>

                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  accept=".png,.jpg,.jpeg,.pdf"
                  onChange={handleFileChange}
                />
              </Group>
            </Group>
          </Card>

          <FormDialog
            title="Preview Document"
            onDownload={() => {
              if (!previewUrl) return;

              const link = document.createElement("a");
              link.href = previewUrl;
              link.download = "document";
              link.click();
            }}
            open={imageModal.open}
            onClose={() =>
              setImageModal({
                open: false,
                image: "",
              })
            }
          >
            <div style={{ display: "flex", justifyContent: "center" }}>
              <img
                src={imageModal.image}
                alt="preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: "70vh",
                  objectFit: "contain",
                  borderRadius: "8px",
                }}
                onError={(e) => {
                  e.target.src = "https://placehold.co/600x400?text=Not+Found";
                }}
              />
            </div>
          </FormDialog>
        </>
      </Box>
    </Box>
  );
}
