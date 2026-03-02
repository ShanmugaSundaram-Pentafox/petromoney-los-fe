import {
  Alert,
  Button,
  Card,
  Group,
  LoadingOverlay,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  ThemeIcon,
  TextInput,
  Select,
  NumberInput,
  SegmentedControl,
   Switch 
} from '@mantine/core';
import { useForm, yupResolver } from '@mantine/form';
import * as yup from 'yup';
import { IconCheck, IconSend } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';
import {
  useCreateLoan,
  useEligibility,
  useForwardLoan,
  useLoan,
  useUpdateLoan,
} from './useEligibility';
import CustomerOnboardStorage from '../../../../store/CustomerOnboardStorage';

const schema = yup.object({
  loan_types: yup.string().required('Loan type is required'),
  requested_amount: yup
    .number()
    .typeError('Enter valid amount')
    .positive('Amount must be positive')
    .required('Amount required'),
  tenure: yup
    .number()
    .typeError('Enter valid tenure')
    .min(1, 'Min 1')
    .required('Tenure required'),
  loan_purpose: yup.string().required('Purpose required'),
});

const getStatusColor = (status) => {
  if (!status) return 'gray';
  if (status === 'APPROVED') return 'green';
  if (status === 'REVIEW') return 'yellow';
  return 'red';
};

const Info = ({ label, value }) => (
  <Stack gap={2}>
    <Text size="xs" c="dimmed">
      {label}
    </Text>
    <Text fw={600}>{value || '—'}</Text>
  </Stack>
);

export const Eligibility = ({ viewMode = false }) => {
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
  //   primaryApplicant: {
  //     name: 'Kannan',
  //     applicant_id: 35,
  //   },
  //   coApplicant: [
  //     { applicant_id: 30, name: 'John' },
  //     { applicant_id: 41, name: 'Doe' },
  //   ],
  // };

  const [remarks, setRemarks] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [tenureUnit, setTenureUnit] = useState('months');
  const [localLoan, setLocalLoan] = useState(null);

  const loanQuery = useLoan(formattedData?.dealershipId, viewMode);
  const eligibilityMutation = useEligibility(
    formattedData?.dealershipId,
    formattedData?.primaryApplicant.applicant_id
  );
  const forwardMutation = useForwardLoan();
  const createLoanMutation = useCreateLoan(formattedData?.dealershipId);
  const updateLoanMutation = useUpdateLoan(formattedData?.dealershipId);

  const form = useForm({
    initialValues: {
      loan_types: '',
      requested_amount: '',
      tenure: '',
      loan_purpose: '',
    },
    validate: yupResolver(schema),
  });

  const convertTenureToMonths = (tenure, unit) => {
    const numericTenure = Number(tenure);
    if (!numericTenure) return 0;
    return unit === 'years' ? numericTenure * 12 : numericTenure;
  };

  const normalizeLoanResponse = (response) => {
    if (!response) return null;
    return response?.data || response;
  };

  const handleTenureUnitChange = (nextUnit) => {
    if (nextUnit === tenureUnit) return;

    const currentTenure = Number(form.values.tenure);
    if (currentTenure) {
      const convertedTenure =
        nextUnit === 'years'
          ? Number((currentTenure / 12).toFixed(2))
          : currentTenure * 12;
      form.setFieldValue('tenure', convertedTenure);
    }

    setTenureUnit(nextUnit);
  };

  const createLoan = async (values) => {
    const payload = {
      ...values,
      requested_amount: Number(values.requested_amount),
      tenure: convertTenureToMonths(values.tenure, tenureUnit),
    };

    const createdLoan = await createLoanMutation.mutateAsync(payload);

    if (!viewMode) {
      setLocalLoan(normalizeLoanResponse(createdLoan) || payload);
    }

    form.reset();
    setTenureUnit('months');
  };

  const updateLoan = async (values) => {
    const payload = {
      ...values,
      requested_amount: Number(values.requested_amount),
      tenure: convertTenureToMonths(values.tenure, tenureUnit),
    };

    const updatedLoan = await updateLoanMutation.mutateAsync(payload);

    if (!viewMode) {
      setLocalLoan(normalizeLoanResponse(updatedLoan) || {
        ...(localLoan || {}),
        ...payload,
      });
    }

    setIsEditing(false);
  };

  const loan = viewMode ? loanQuery.data : localLoan;
  const data = eligibilityMutation.data;
  const metrics = data?.credit_metrics;

  useEffect(() => {
    if (loan && isEditing) {
      form.setValues({
        loan_types: loan.loan_types,
        requested_amount: loan.requested_amount,
        tenure:
          tenureUnit === 'years'
            ? Number((Number(loan.tenure || 0) / 12).toFixed(2))
            : loan.tenure,
        loan_purpose: loan.loan_purpose,
      });
    }
  }, [loan, isEditing, tenureUnit]);

  const flags = data
    ? [
      metrics?.overdue_accounts === 0 && 'No overdue accounts',
      metrics?.highest_dpd === 0 && 'Perfect repayment history',
      data.cibil_score > 750 && 'Strong credit score',
    ].filter(Boolean)
    : [];

  return (
    <Stack pos="relative" mt="md">
      <LoadingOverlay visible={viewMode && loanQuery.isLoading} />

      {/* ================= Loan Form Card ================= */}
      {!loan && (
        <Card withBorder radius="md">
          <Stack>
            <Text fw={700}>Loan Information</Text>

            <SimpleGrid cols={3}>
              <Select
                label="Loan Type"
                placeholder="Select loan type"
                data={[
                  'Home Loan',
                  'Land Loan',
                  'Working Capital',
                  'Business Loan',
                ]}
                {...form.getInputProps('loan_types')}
              />

              <NumberInput
                label="Requested Amount (₹)"
                placeholder="500000"
                {...form.getInputProps('requested_amount')}
              />

<NumberInput
  label={
    <Group justify="space-between" align="center" w="100%">
      <Text fw={500}>Tenure</Text>

      <Switch
        size="sm"
        checked={tenureUnit === 'years'}
        onChange={(event) => {
          const checked = event.currentTarget.checked;
          const nextUnit = checked ? 'years' : 'months';

          const currentTenure = Number(form.values.tenure);

          if (currentTenure) {
            const converted =
              nextUnit === 'years'
                ? Number((currentTenure / 12).toFixed(2))
                : currentTenure * 12;

            form.setFieldValue('tenure', converted);
          }

          setTenureUnit(nextUnit);
        }}
        onLabel="Year"
        offLabel="Month"
      />
    </Group>
  }
  placeholder="24"
  {...form.getInputProps('tenure')}
/>            </SimpleGrid>

          
            <TextInput
              label="Purpose"
              placeholder="Fuel inventory purchase"
              {...form.getInputProps('loan_purpose')}
            />

            <Group justify="flex-end">
              <Button
                loading={createLoanMutation.isLoading}
                onClick={form.onSubmit(createLoan)}
              >
                Save Loan Info
              </Button>
            </Group>
          </Stack>
        </Card>
      )}

      {/* ================= Loan Snapshot ================= */}
      {loan && !isEditing && (
        <Card withBorder radius="md">
          <Stack>
            <Group justify="space-between">
              <Text fw={700}>Loan Details</Text>

              <Button
                size="xs"
                variant="light"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
            </Group>

            <SimpleGrid cols={4}>
              <Info label="Loan Type" value={loan.loan_types} />
              <Info
                label="Requested Amount"
                value={`₹${loan.requested_amount?.toLocaleString()}`}
              />
              <Info label="Tenure" value={`${loan.tenure} months`} />
              <Info label="Purpose" value={loan.loan_purpose} />
            </SimpleGrid>
          </Stack>
        </Card>
      )}

      {loan && isEditing && (
        <Card withBorder radius="md">
          <Stack>
            <Group justify="space-between">
              <Text fw={700}>Edit Loan</Text>

              <Button
                size="xs"
                variant="subtle"
                color="gray"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </Group>

            <SimpleGrid cols={3}>
              <Select
                label="Loan Type"
                data={[
                  'Home Loan',
                  'Land Loan',
                  'Working Capital',
                  'Business Loan',
                ]}
                {...form.getInputProps('loan_types')}
              />

              <NumberInput
                label="Requested Amount (₹)"
                {...form.getInputProps('requested_amount')}
              />

              <NumberInput
                label={`Tenure (${tenureUnit === 'years' ? 'Years' : 'Months'})`}
                {...form.getInputProps('tenure')}
              />
            </SimpleGrid>

            <Group gap="sm" align="end">
              <Text size="sm" fw={500}>Tenure Unit</Text>
              <SegmentedControl
                value={tenureUnit}
                onChange={handleTenureUnitChange}
                color="blue"
                data={[
                  { label: 'Month', value: 'months' },
                  { label: 'Year', value: 'years' },
                ]}
                w={180}
              />
            </Group>

            <TextInput
              label="Purpose"
              {...form.getInputProps('loan_purpose')}
            />

            <Group justify="flex-end">
              <Button variant="light" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>

              <Button
                loading={updateLoanMutation.isLoading}
                onClick={form.onSubmit(updateLoan)}
              >
                Update Loan
              </Button>
            </Group>
          </Stack>
        </Card>
      )}

      {/* Calculate Eligibility */}
      {!data && loan && (
        <Card withBorder py={40}>
          <Stack align="center">
            <Text c="dimmed">Calculate eligibility based on credit data</Text>
            <Button
              onClick={() => eligibilityMutation.mutate()}
              loading={eligibilityMutation.isLoading}
            >
              Calculate Eligibility
            </Button>
          </Stack>
        </Card>
      )}

      {/* Result Banner */}
      {data && (
        <Alert
          color={getStatusColor(data.eligibility.status)}
          radius="md"
          title={`${data.eligibility.emoji} ${data.eligibility.category}`}
        >
          Approval Likelihood: {data.eligibility.approval_likelihood_percent}%
        </Alert>
      )}

      {/* Metrics */}
      {metrics && (
        <SimpleGrid cols={4}>
          <Card withBorder>
            <Text size="xs" c="dimmed">
              Total Accounts
            </Text>
            <Text fw={700}>{metrics.total_accounts}</Text>
          </Card>
          <Card withBorder>
            <Text size="xs" c="dimmed">
              Closed Accounts
            </Text>
            <Text fw={700}>{metrics.closed_accounts}</Text>
          </Card>
          <Card withBorder>
            <Text size="xs" c="dimmed">
              Overdue
            </Text>
            <Text fw={700} c="red">
              {metrics.overdue_accounts}
            </Text>
          </Card>
          <Card withBorder>
            <Text size="xs" c="dimmed">
              Highest DPD
            </Text>
            <Text fw={700}>{metrics.highest_dpd}</Text>
          </Card>
        </SimpleGrid>
      )}

      {/* Decision Factors */}
      {flags.length > 0 && (
        <Card withBorder>
          <Text fw={600}>Decision Factors</Text>
          <Stack mt="sm">
            {flags.map((f, i) => (
              <Group key={i}>
                <ThemeIcon color="green" size="sm" radius="xl">
                  <IconCheck size={14} />
                </ThemeIcon>
                <Text size="sm">{f}</Text>
              </Group>
            ))}
          </Stack>
        </Card>
      )}

      {/* Remarks */}
      {data && !viewMode && (
        <Textarea
          label="Remarks"
          placeholder="Add underwriting notes"
          minRows={4}
          value={remarks}
          onChange={(e) => setRemarks(e.currentTarget.value)}
        />
      )}

      {/* Footer */}
      {data && !viewMode && (
        <Group justify="flex-end">
          <Button
            rightSection={<IconSend size={16} />}
            color={getStatusColor(data.eligibility.status)}
            onClick={() => forwardMutation.mutate({ loanId: loan.id, remarks })}
            loading={forwardMutation.isLoading}
            disabled={viewMode}
          >
            Submit for Approval
          </Button>
        </Group>
      )}
    </Stack>
  );
};
