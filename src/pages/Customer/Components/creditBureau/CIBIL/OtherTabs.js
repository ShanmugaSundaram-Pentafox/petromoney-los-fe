import React from 'react';
import {
  Stack,
  Card,
  Group,
  Text,
  Badge,
  Box,
  Table,
  SimpleGrid,
  Paper,
  ThemeIcon,
  Progress,
  Alert,
  List,
} from '@mantine/core';
import {
  IconSearch,
  IconCheck,
  IconX,
  IconAlertTriangle,
  IconShield,
  IconTrendingUp,
  IconCurrencyRupee,
  IconId,
  IconPhone,
  IconMail,
  IconMapPin,
  IconBriefcase,
  IconCircleCheck,
  IconUser,
  IconBuilding,
  IconHome,
} from '@tabler/icons-react';
import {
  fmtAmount,
  fmtDate,
  fmtDateLong,
  isActive,
  getBalance,
  getEMI,
  getHighCredit,
  computeLOS,
  getScoreInfo,
  ENQUIRY_PURPOSE,
  OCCUPATION,
  PHONE_TYPE,
  ADDRESS_CAT,
  upper,
} from './utils';

// ─── ENQUIRIES TAB ────────────────────────────────────────────────────────────

const isHard = (e) => String(e.enquiryPurpose) === '02';
const daysSince = (d) =>
  Math.round((Date.now() - new Date(d).getTime()) / 86400000);

export function EnquiriesTab({ report }) {
  const all = report.enquiries || [];
  if (!all.length)
    return (
      <Text c="dimmed" ta="center" py={40}>
        No enquiry data found.
      </Text>
    );

  const in12m = all.filter((e) => daysSince(e.enquiryDate) <= 365);
  const in6m = all.filter((e) => daysSince(e.enquiryDate) <= 180);
  const hard12m = in12m.filter(isHard);
  const maxAmt = Math.max(
    ...all.map((e) => parseFloat(String(e.enquiryAmount)) || 0)
  );

  const purposeDist = {},
    lenderDist = {};
  all.forEach((e) => {
    const p =
      ENQUIRY_PURPOSE[String(e.enquiryPurpose)] ||
      `Purpose ${e.enquiryPurpose}`;
    purposeDist[p] = (purposeDist[p] || 0) + 1;
    const l = e.memberShortName || 'Unknown';
    lenderDist[l] = (lenderDist[l] || 0) + 1;
  });

  return (
    <Stack gap="lg">
      {/* Stats */}
      <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="sm">
        {[
          {
            label: 'Total Enquiries',
            value: all.length,
            sub: 'All time',
            color: 'violet',
          },
          {
            label: 'Last 12 Months',
            value: in12m.length,
            sub: `${in6m.length} in 6M`,
            color: in12m.length >= 5 ? 'red' : 'blue',
          },
          {
            label: 'Hard (12M)',
            value: hard12m.length,
            sub: 'Loan enquiries',
            color: hard12m.length >= 3 ? 'red' : 'orange',
          },
          {
            label: 'Largest Amount',
            value: fmtAmount(maxAmt),
            sub: 'Single enquiry',
            color: 'teal',
          },
        ].map(({ label, value, sub, color }) => (
          <Paper
            key={label}
            withBorder
            p="sm"
            radius="md"
            style={{ borderTop: `3px solid var(--mantine-color-${color}-5)` }}
          >
            <Text
              size="xs"
              c="dimmed"
              fw={600}
              tt="uppercase"
              mb={4}
              style={{ fontSize: 10, letterSpacing: '0.06em' }}
            >
              {label}
            </Text>
            <Text size="lg" fw={800}>
              {value}
            </Text>
            <Text size="xs" c="dimmed">
              {sub}
            </Text>
          </Paper>
        ))}
      </SimpleGrid>

      {/* Distributions */}
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
        <Card withBorder radius="md">
          <Text
            size="xs"
            fw={700}
            c="dimmed"
            tt="uppercase"
            mb="md"
            style={{ letterSpacing: '0.1em' }}
          >
            By Purpose
          </Text>
          <Stack gap="sm">
            {Object.entries(purposeDist)
              .sort(([, a], [, b]) => b - a)
              .map(([p, c]) => (
                <Box key={p}>
                  <Group justify="space-between" mb={3}>
                    <Text size="xs">{p}</Text>
                    <Text size="xs" fw={700}>
                      {c}
                    </Text>
                  </Group>
                  <Progress
                    value={(c / all.length) * 100}
                    size="xs"
                    radius="xs"
                    color="violet"
                  />
                </Box>
              ))}
          </Stack>
        </Card>
        <Card withBorder radius="md">
          <Text
            size="xs"
            fw={700}
            c="dimmed"
            tt="uppercase"
            mb="md"
            style={{ letterSpacing: '0.1em' }}
          >
            By Lender
          </Text>
          <Stack gap="sm">
            {Object.entries(lenderDist)
              .sort(([, a], [, b]) => b - a)
              .map(([l, c]) => (
                <Box key={l}>
                  <Group justify="space-between" mb={3}>
                    <Text size="xs" fw={600}>
                      {l}
                    </Text>
                    <Text size="xs" fw={700}>
                      {c}
                    </Text>
                  </Group>
                  <Progress
                    value={(c / all.length) * 100}
                    size="xs"
                    radius="xs"
                    color="blue"
                  />
                </Box>
              ))}
          </Stack>
        </Card>
      </SimpleGrid>

      {/* LOS Analysis */}
      <Card withBorder radius="md">
        <Text
          size="xs"
          fw={700}
          c="dimmed"
          tt="uppercase"
          mb="sm"
          style={{ letterSpacing: '0.1em' }}
        >
          LOS Enquiry Analysis
        </Text>
        <Table withRowBorders={false} striped>
          <Table.Tbody>
            {[
              {
                label: 'Hard Enquiries (12M)',
                value: `${hard12m.length}`,
                ok: hard12m.length < 3,
                warn: hard12m.length >= 3,
              },
              {
                label: 'Enquiry Bunching (6M)',
                value:
                  in6m.length >= 3 ? 'Possible shopping behaviour' : 'Low risk',
                ok: in6m.length < 3,
              },
              {
                label: 'Unique Lenders',
                value: String(new Set(all.map((e) => e.memberShortName)).size),
                ok: null,
              },
              {
                label: 'Largest Loan Enquiry',
                value: fmtAmount(maxAmt),
                ok: null,
              },
              {
                label: 'Declined Applications Signal',
                value: hard12m.length >= 3 ? 'Possible — verify' : 'No signal',
                ok: hard12m.length < 3,
              },
            ].map(({ label, value, ok, warn }) => (
              <Table.Tr key={label}>
                <Table.Td>
                  <Text size="xs" c="dimmed">
                    {label}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Group gap={6}>
                    {ok !== null && (
                      <ThemeIcon
                        size={14}
                        color={ok ? 'green' : 'red'}
                        variant="transparent"
                      >
                        {ok ? <IconCheck size={11} /> : <IconX size={11} />}
                      </ThemeIcon>
                    )}
                    <Text size="xs" fw={600} c={warn ? 'orange' : undefined}>
                      {value}
                    </Text>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Card>

      {/* Full Enquiry Log */}
      <Card withBorder radius="md" p={0}>
        <Box
          p="sm"
          style={{ borderBottom: '1px solid var(--mantine-color-gray-2)' }}
        >
          <Text
            size="xs"
            fw={700}
            c="dimmed"
            tt="uppercase"
            style={{ letterSpacing: '0.1em' }}
          >
            Enquiry Log
          </Text>
        </Box>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              {[
                '#',
                'Date',
                'Lender',
                'Amount',
                'Purpose',
                'Type',
                'Days Ago',
              ].map((h) => (
                <Table.Th
                  key={h}
                  style={{
                    fontSize: 10,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  {h}
                </Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {all.map((e, i) => {
              const hard = isHard(e);
              return (
                <Table.Tr key={i}>
                  <Table.Td>
                    <Text size="xs" c="dimmed">
                      {e.index || i + 1}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="xs" style={{ fontFamily: 'monospace' }}>
                      {fmtDateLong(e.enquiryDate)}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="xs" fw={600}>
                      {e.memberShortName || '—'}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text
                      size="xs"
                      fw={700}
                      style={{ fontFamily: 'monospace' }}
                    >
                      {fmtAmount(e.enquiryAmount)}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="xs">
                      {ENQUIRY_PURPOSE[String(e.enquiryPurpose)] ||
                        `Code ${e.enquiryPurpose}`}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      color={hard ? 'orange' : 'blue'}
                      size="xs"
                      variant="light"
                    >
                      {hard ? 'Hard' : 'Soft'}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text
                      size="xs"
                      c="dimmed"
                      style={{ fontFamily: 'monospace' }}
                    >
                      {daysSince(e.enquiryDate)}d
                    </Text>
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </Card>
    </Stack>
  );
}

// ─── IDENTITY TAB ─────────────────────────────────────────────────────────────

export function IdentityTab({ report }) {
  const ids = report.ids || [];
  const tels = report.telephones || [];
  const emails = report.emails || [];
  const addrs = (report.addresses || []).sort(
    (a, b) => new Date(b.dateReported || 0) - new Date(a.dateReported || 0)
  );
  const emp = report.employment || [];
  const names = report.names || [];
  const person = names[0] || {};

  const ADDR_ICON = {
    '01': IconHome, // Residence
    '02': IconHome, // Permanent
    '03': IconBuilding, // Office
    '04': IconBriefcase, // Business
    '05': IconBuilding, // Other building
    '06': IconMapPin, // Generic location
  };

  return (
    <Stack gap="lg">
      {/* Personal Info */}
      {person.name && (
        <Card withBorder radius="md">
          <Group gap="sm" mb="md">
            <ThemeIcon color="blue" variant="light" size="md" radius="md">
              <IconUser size={16} />
            </ThemeIcon>
            <Text
              size="xs"
              fw={700}
              c="dimmed"
              tt="uppercase"
              style={{ letterSpacing: '0.1em' }}
            >
              Personal Information
            </Text>
          </Group>
          <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md">
            {[
              { label: 'Full Name', value: person.name },
              {
                label: 'Date of Birth',
                value: person.birthDate ? fmtDateLong(person.birthDate) : '—',
              },
              { label: 'Gender', value: upper(person.gender) },
              { label: 'Index', value: person.index },
            ].map(({ label, value }) => (
              <Box key={label}>
                <Text size="xs" c="dimmed" mb={2}>
                  {label}
                </Text>
                <Text size="sm" fw={600}>
                  {value}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </Card>
      )}

      {/* IDs */}
      {ids.length > 0 && (
        <Box>
          <Text fw={700} size="sm" mb="sm">
            Identity Documents
          </Text>
          <SimpleGrid cols={{ base: 2, sm: 3 }} spacing="sm">
            {ids.map((id) => (
              <Paper key={id.index} withBorder p="md" radius="md">
                <Group gap="xs" mb={8}>
                  <ThemeIcon color="blue" variant="light" size="sm" radius="sm">
                    <IconId size={13} />
                  </ThemeIcon>
                  <Text
                    size="xs"
                    c="dimmed"
                    fw={700}
                    tt="uppercase"
                    style={{ letterSpacing: '0.06em' }}
                  >
                    {id.idType
                      .replace(/Id$/, '')
                      .replace(/([A-Z])/g, ' $1')
                      .trim()}
                  </Text>
                </Group>
                <Text
                  size="sm"
                  fw={700}
                  style={{ fontFamily: 'monospace', wordBreak: 'break-all' }}
                >
                  {String(id.idNumber)}
                </Text>
              </Paper>
            ))}
          </SimpleGrid>
        </Box>
      )}

      {/* Phones */}
      {tels.length > 0 && (
        <Box>
          <Text fw={700} size="sm" mb="sm">
            Phone Numbers
          </Text>
          <SimpleGrid cols={{ base: 2, sm: 3 }} spacing="sm">
            {tels.map((t) => (
              <Paper key={t.index} withBorder p="md" radius="md">
                <Group justify="space-between" mb={6}>
                  <Group gap="xs">
                    <ThemeIcon
                      color="teal"
                      variant="light"
                      size="sm"
                      radius="sm"
                    >
                      <IconPhone size={13} />
                    </ThemeIcon>
                    <Text
                      size="xs"
                      c="dimmed"
                      fw={700}
                      tt="uppercase"
                      style={{ letterSpacing: '0.06em' }}
                    >
                      {PHONE_TYPE[t.telephoneType] || 'Phone'}
                    </Text>
                  </Group>
                  {t.enquiryEnriched === 'Y' && (
                    <Badge color="green" size="xs" variant="light">
                      Enriched
                    </Badge>
                  )}
                </Group>
                <Text size="sm" fw={700} style={{ fontFamily: 'monospace' }}>
                  +91 {t.telephoneNumber}
                </Text>
              </Paper>
            ))}
          </SimpleGrid>
        </Box>
      )}

      {/* Emails */}
      {emails.length > 0 && (
        <Box>
          <Text fw={700} size="sm" mb="sm">
            Email Addresses
          </Text>
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
            {emails.map((em) => (
              <Paper key={em.index} withBorder p="md" radius="md">
                <Group gap="sm">
                  <ThemeIcon
                    color="violet"
                    variant="light"
                    size="sm"
                    radius="sm"
                  >
                    <IconMail size={13} />
                  </ThemeIcon>
                  <Box style={{ minWidth: 0 }}>
                    <Text size="xs" c="dimmed" mb={2}>
                      Email {em.index}
                    </Text>
                    <Text
                      size="xs"
                      fw={600}
                      style={{
                        wordBreak: 'break-all',
                        fontFamily: 'monospace',
                      }}
                    >
                      {em.emailID}
                    </Text>
                  </Box>
                </Group>
              </Paper>
            ))}
          </SimpleGrid>
        </Box>
      )}

      {/* Addresses */}
      {addrs.length > 0 && (
        <Box>
          <Text fw={700} size="sm" mb="sm">
            Addresses on Record
          </Text>
          <Stack gap="sm">
            {addrs.map((a) => {
              const Icon = ADDR_ICON[a.addressCategory] || IconMapPin;
              return (
                <Paper key={a.index} withBorder p="md" radius="md">
                  <Group gap="sm" align="flex-start" wrap="nowrap">
                    <ThemeIcon
                      size={38}
                      radius="md"
                      variant="light"
                      color="gray"
                      style={{ flexShrink: 0 }}
                    >
                      <Icon size={18} stroke={1.8} />
                    </ThemeIcon>
                    <Box style={{ flex: 1, minWidth: 0 }}>
                      <Group gap="xs" mb={3}>
                        <Badge color="gray" variant="outline" size="xs">
                          {ADDRESS_CAT[a.addressCategory] ||
                            `Cat ${a.addressCategory}`}
                        </Badge>
                        {a.dateReported && (
                          <Text size="xs" c="dimmed">
                            Reported: {fmtDate(a.dateReported)}
                          </Text>
                        )}
                      </Group>
                      <Text size="sm" lh={1.6}>
                        {a.line1}
                        {a.line2 ? `, ${a.line2}` : ''}
                      </Text>
                      <Group gap={5} mt={3}>
                        <ThemeIcon size={12} color="gray" variant="transparent">
                          <IconMapPin size={10} />
                        </ThemeIcon>
                        <Text
                          size="xs"
                          c="dimmed"
                          style={{ fontFamily: 'monospace' }}
                        >
                          PIN: {a.pinCode || '—'} · State: {a.stateCode || '—'}
                        </Text>
                      </Group>
                    </Box>
                  </Group>
                </Paper>
              );
            })}
          </Stack>
        </Box>
      )}

      {/* Employment */}
      {emp.length > 0 && (
        <Box>
          <Text fw={700} size="sm" mb="sm">
            Employment Details
          </Text>
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
            {emp.map((e) => (
              <Paper key={e.index} withBorder p="md" radius="md">
                <Group gap="xs" mb="sm">
                  <ThemeIcon
                    color="indigo"
                    variant="light"
                    size="sm"
                    radius="sm"
                  >
                    <IconBriefcase size={13} />
                  </ThemeIcon>
                  <Text
                    size="xs"
                    c="dimmed"
                    fw={700}
                    tt="uppercase"
                    style={{ letterSpacing: '0.06em' }}
                  >
                    Employment
                  </Text>
                </Group>
                <Table withRowBorders={false}>
                  <Table.Tbody>
                    <Table.Tr>
                      <Table.Td>
                        <Text size="xs" c="dimmed">
                          Occupation
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="xs" fw={600}>
                          {OCCUPATION[String(e.occupationCode)] ||
                            `Code ${e.occupationCode}`}
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td>
                        <Text size="xs" c="dimmed">
                          Account Type
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="xs" fw={600}>
                          {e.accountType || '—'}
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td>
                        <Text size="xs" c="dimmed">
                          Last Reported
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="xs" fw={600}>
                          {fmtDateLong(e.dateReported)}
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                  </Table.Tbody>
                </Table>
              </Paper>
            ))}
          </SimpleGrid>
        </Box>
      )}
    </Stack>
  );
}

// ─── LOS DECISION TAB ────────────────────────────────────────────────────────

function Pillar({ icon, label, status }) {
  const color =
    status === 'PASS' ? 'green' : status === 'REVIEW' ? 'orange' : 'red';
  const Icon =
    status === 'PASS'
      ? IconCheck
      : status === 'REVIEW'
        ? IconAlertTriangle
        : IconX;
  return (
    <Paper
      withBorder
      p="md"
      radius="md"
      ta="center"
      style={{
        borderTop: `3px solid var(--mantine-color-${color}-5)`,
        background: `var(--mantine-color-${color}-0)`,
      }}
    >
      <ThemeIcon
        size="xl"
        color={color}
        variant="light"
        radius="xl"
        mx="auto"
        mb={8}
      >
        {icon}
      </ThemeIcon>
      <Text
        size="xs"
        c="dimmed"
        fw={700}
        tt="uppercase"
        mb={6}
        style={{ letterSpacing: '0.08em' }}
      >
        {label}
      </Text>
      <Group justify="center" gap={6}>
        <ThemeIcon size={14} color={color} variant="transparent">
          <Icon size={12} />
        </ThemeIcon>
        <Text fw={800} c={color} size="sm">
          {status}
        </Text>
      </Group>
    </Paper>
  );
}

export function LOSTab({ data, report }) {
  const accs = report.accounts || [];
  const score = data.cibil_score ?? (report.scores || [])[0]?.score ?? 0;
  const los = computeLOS(score, accs, report.enquiries || []);
  const sco = getScoreInfo(score);
  const activeAccs = accs.filter(isActive);
  const totalBal = activeAccs.reduce((s, a) => s + getBalance(a), 0);
  const totalEMI = activeAccs.reduce((s, a) => s + getEMI(a), 0);
  const accType = (a) => {
    const raw = a?.accountType;
    if (!raw) return '';
    if (typeof raw === 'string') return raw.toLowerCase();
    if (typeof raw === 'object') {
      return (raw.description || raw.code || '').toLowerCase();
    }
    return String(raw).toLowerCase();
  };
  const isCC = (a) => accType(a).includes('credit card');
  const secBal = activeAccs.filter((a) => !isCC(a)).reduce((s, a) => s + getBalance(a), 0);
  const unsBal = activeAccs.filter(isCC).reduce((s, a) => s + getBalance(a), 0);
  const ccLimit = activeAccs.filter(isCC).reduce((s, a) => s + getHighCredit(a), 0);
  const ccUtil = ccLimit > 0 ? (unsBal / ccLimit) * 100 : 0;
  const oldest = [...accs]
    .filter((a) => a.dateOpened)
    .sort((a, b) => new Date(a.dateOpened) - new Date(b.dateOpened))[0];
  const creditAge = oldest
    ? (
      (Date.now() - new Date(oldest.dateOpened).getTime()) /
        (1000 * 60 * 60 * 24 * 365)
    ).toFixed(1)
    : '—';
  const riskColor =
    los.riskLevel === 'low'
      ? 'green'
      : los.riskLevel === 'medium'
        ? 'orange'
        : 'red';

  return (
    <Stack gap="lg">
      {/* Decision Banner */}
      <Paper
        withBorder
        radius="md"
        p="lg"
        style={{
          borderColor: `var(--mantine-color-${riskColor}-4)`,
          background: `var(--mantine-color-${riskColor}-0)`,
        }}
      >
        <Group justify="space-between" align="center" wrap="wrap" gap="xl">
          <Stack gap="xs">
            <Text
              size="xs"
              c="dimmed"
              fw={700}
              tt="uppercase"
              style={{ letterSpacing: '0.1em' }}
            >
              LOS Underwriting Decision
            </Text>
            <Text size="xl" fw={900} style={{ letterSpacing: '-0.02em' }}>
              {los.decision}
            </Text>
            <Text size="sm" c="dimmed">
              Score: {score} · Balance: {fmtAmount(totalBal)} · EMI:{' '}
              {fmtAmount(totalEMI)}/mo
            </Text>
            <Group gap={6} wrap="wrap" mt={4}>
              {[
                { label: 'No Defaults', ok: !los.hasDefault },
                { label: 'No Write-offs', ok: !los.hasWriteoff },
                { label: 'No Suits', ok: !los.hasSuit },
                { label: 'Score ≥ 700', ok: score >= 700 },
              ].map(({ label, ok }) => (
                <Badge
                  key={label}
                  color={ok ? 'green' : 'red'}
                  variant="light"
                  size="sm"
                  leftSection={
                    ok ? <IconCheck size={10} /> : <IconX size={10} />
                  }
                >
                  {label}
                </Badge>
              ))}
              {los.levWarn && (
                <Badge
                  color="orange"
                  variant="light"
                  size="sm"
                  leftSection={<IconAlertTriangle size={10} />}
                >
                  High Leverage
                </Badge>
              )}
              {los.hardEnquiries12m.length >= 2 && (
                <Badge
                  color="orange"
                  variant="light"
                  size="sm"
                  leftSection={<IconAlertTriangle size={10} />}
                >
                  {los.hardEnquiries12m.length} Hard Enquiries
                </Badge>
              )}
            </Group>
          </Stack>
          <Stack align="center" gap={4}>
            <Badge
              color={riskColor}
              size="xl"
              radius="sm"
              variant="filled"
              fw={800}
            >
              {los.riskLevel.toUpperCase()} RISK
            </Badge>
          </Stack>
        </Group>
      </Paper>

      {/* 4 Pillars */}
      <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md">
        <Pillar
          icon={<IconShield size={20} />}
          label="Credit Score"
          status={los.pillarScore}
        />
        <Pillar
          icon={<IconTrendingUp size={20} />}
          label="Payment Track"
          status={los.pillarPay}
        />
        <Pillar
          icon={<IconCurrencyRupee size={20} />}
          label="Leverage"
          status={los.pillarLev}
        />
        <Pillar
          icon={<IconSearch size={20} />}
          label="Enquiries"
          status={los.pillarEnq}
        />
      </SimpleGrid>

      {/* Detailed metrics */}
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
        {/* Payment */}
        <Card withBorder radius="md">
          <Text
            size="xs"
            fw={700}
            c="dimmed"
            tt="uppercase"
            mb="md"
            style={{ letterSpacing: '0.1em' }}
          >
            Payment Behaviour
          </Text>
          <Box mb="sm">
            <Group justify="space-between" mb={4}>
              <Text size="xs" c="dimmed">
                On-Time Rate
              </Text>
              <Text size="xs" fw={700}>
                {los.payOnTimeRate.toFixed(1)}%
              </Text>
            </Group>
            <Progress
              value={los.payOnTimeRate}
              color={
                los.payOnTimeRate >= 95
                  ? 'green'
                  : los.payOnTimeRate >= 80
                    ? 'yellow'
                    : 'red'
              }
              size="md"
              radius="md"
            />
          </Box>
          <Table withRowBorders={false} striped>
            <Table.Tbody>
              {[
                { label: 'Months Analysed', value: los.totalMonths, ok: null },
                {
                  label: 'Current DPD',
                  value: los.hasDefault ? 'DPD Found' : '0 — Clean',
                  ok: !los.hasDefault,
                },
                {
                  label: 'Historical Defaults',
                  value: los.hasDefault ? 'Yes — Review' : 'None',
                  ok: !los.hasDefault,
                },
                {
                  label: 'SMA History',
                  value: los.hasSMA ? 'Detected' : 'None',
                  ok: !los.hasSMA,
                },
                {
                  label: 'Write-offs',
                  value: los.hasWriteoff ? 'Present' : 'None',
                  ok: !los.hasWriteoff,
                },
                {
                  label: 'Suits Filed',
                  value: los.hasSuit ? 'Yes — Flagged' : 'None',
                  ok: !los.hasSuit,
                },
              ].map(({ label, value, ok }) => (
                <Table.Tr key={label}>
                  <Table.Td>
                    <Text size="xs" c="dimmed">
                      {label}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Group gap={6} justify="flex-end">
                      {ok !== null && (
                        <ThemeIcon
                          size={14}
                          color={ok ? 'green' : 'red'}
                          variant="transparent"
                        >
                          {ok ? <IconCheck size={11} /> : <IconX size={11} />}
                        </ThemeIcon>
                      )}
                      <Text
                        size="xs"
                        fw={600}
                        c={ok === false ? 'red' : undefined}
                      >
                        {value}
                      </Text>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>

        {/* Leverage */}
        <Card withBorder radius="md">
          <Text
            size="xs"
            fw={700}
            c="dimmed"
            tt="uppercase"
            mb="md"
            style={{ letterSpacing: '0.1em' }}
          >
            Leverage & Exposure
          </Text>
          {ccUtil > 0 && (
            <Box mb="sm">
              <Group justify="space-between" mb={4}>
                <Text size="xs" c="dimmed">
                  CC Utilisation
                </Text>
                <Text
                  size="xs"
                  fw={700}
                  c={ccUtil > 50 ? 'red' : ccUtil > 30 ? 'orange' : 'green'}
                >
                  {ccUtil.toFixed(1)}%
                </Text>
              </Group>
              <Progress
                value={ccUtil}
                color={ccUtil > 50 ? 'red' : ccUtil > 30 ? 'orange' : 'green'}
                size="md"
                radius="md"
              />
            </Box>
          )}
          <Table withRowBorders={false} striped>
            <Table.Tbody>
              {[
                {
                  label: 'Total Active Balance',
                  value: fmtAmount(totalBal),
                  ok: !los.levHigh,
                },
                {
                  label: 'Monthly EMI',
                  value: fmtAmount(totalEMI),
                  ok: totalEMI < 150000,
                },
                {
                  label: 'Active Accounts',
                  value: String(activeAccs.length),
                  ok: null,
                },
                {
                  label: 'Secured Balance',
                  value: fmtAmount(secBal),
                  ok: null,
                },
                {
                  label: 'Unsecured Balance',
                  value: fmtAmount(unsBal),
                  ok: unsBal < 500000,
                },
                { label: 'CC Limit', value: fmtAmount(ccLimit), ok: null },
                {
                  label: 'Leverage Risk',
                  value: los.levHigh
                    ? 'HIGH — FOIR Critical'
                    : los.levWarn
                      ? 'Moderate'
                      : 'Low',
                  ok: !los.levWarn,
                },
              ].map(({ label, value, ok }) => (
                <Table.Tr key={label}>
                  <Table.Td>
                    <Text size="xs" c="dimmed">
                      {label}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Group gap={6} justify="flex-end">
                      {ok !== null && (
                        <ThemeIcon
                          size={14}
                          color={ok ? 'green' : 'orange'}
                          variant="transparent"
                        >
                          {ok ? (
                            <IconCheck size={11} />
                          ) : (
                            <IconAlertTriangle size={11} />
                          )}
                        </ThemeIcon>
                      )}
                      <Text
                        size="xs"
                        fw={600}
                        style={{ fontFamily: 'monospace' }}
                      >
                        {value}
                      </Text>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>

        {/* Vintage */}
        <Card withBorder radius="md">
          <Text
            size="xs"
            fw={700}
            c="dimmed"
            tt="uppercase"
            mb="md"
            style={{ letterSpacing: '0.1em' }}
          >
            Credit Vintage
          </Text>
          <Table withRowBorders={false} striped>
            <Table.Tbody>
              {[
                {
                  label: 'Oldest Account',
                  value: fmtDate(oldest?.dateOpened),
                  ok: null,
                },
                {
                  label: 'History Length',
                  value: `${creditAge} years`,
                  ok: parseFloat(creditAge) >= 5,
                },
                {
                  label: 'Total Accounts',
                  value: String(accs.length),
                  ok: null,
                },
                {
                  label: 'Closed Accounts',
                  value: String(accs.filter((a) => !isActive(a)).length),
                  ok: null,
                },
                {
                  label: 'Unique Lenders',
                  value: String(
                    new Set(accs.map((a) => a.memberShortName)).size
                  ),
                  ok: null,
                },
                {
                  label: 'Vintage Rating',
                  value:
                    parseFloat(creditAge) >= 5
                      ? 'Excellent'
                      : parseFloat(creditAge) >= 2
                        ? 'Moderate'
                        : 'Thin File',
                  ok: parseFloat(creditAge) >= 5,
                },
              ].map(({ label, value, ok }) => (
                <Table.Tr key={label}>
                  <Table.Td>
                    <Text size="xs" c="dimmed">
                      {label}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Group gap={6} justify="flex-end">
                      {ok !== null && (
                        <ThemeIcon
                          size={14}
                          color={ok ? 'green' : 'orange'}
                          variant="transparent"
                        >
                          {ok ? (
                            <IconCheck size={11} />
                          ) : (
                            <IconAlertTriangle size={11} />
                          )}
                        </ThemeIcon>
                      )}
                      <Text size="xs" fw={600}>
                        {value}
                      </Text>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>

        {/* Enquiry */}
        <Card withBorder radius="md">
          <Text
            size="xs"
            fw={700}
            c="dimmed"
            tt="uppercase"
            mb="md"
            style={{ letterSpacing: '0.1em' }}
          >
            Enquiry Risk
          </Text>
          <Table withRowBorders={false} striped>
            <Table.Tbody>
              {[
                {
                  label: 'Total Enquiries',
                  value: String((report.enquiries || []).length),
                  ok: null,
                },
                {
                  label: 'Enquiries (12M)',
                  value: String(los.recentEnquiries.length),
                  ok: los.recentEnquiries.length < 5,
                },
                {
                  label: 'Hard Enquiries (12M)',
                  value: String(los.hardEnquiries12m.length),
                  ok: los.hardEnquiries12m.length < 3,
                },
                {
                  label: 'Unique Lenders',
                  value: String(
                    new Set(
                      (report.enquiries || []).map((e) => e.memberShortName)
                    ).size
                  ),
                  ok: null,
                },
                {
                  label: 'Enquiry Risk',
                  value: los.enqHigh
                    ? 'High'
                    : los.enqWarn
                      ? 'Watch'
                      : 'Acceptable',
                  ok: !los.enqWarn,
                },
              ].map(({ label, value, ok }) => (
                <Table.Tr key={label}>
                  <Table.Td>
                    <Text size="xs" c="dimmed">
                      {label}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Group gap={6} justify="flex-end">
                      {ok !== null && (
                        <ThemeIcon
                          size={14}
                          color={ok ? 'green' : 'orange'}
                          variant="transparent"
                        >
                          {ok ? (
                            <IconCheck size={11} />
                          ) : (
                            <IconAlertTriangle size={11} />
                          )}
                        </ThemeIcon>
                      )}
                      <Text size="xs" fw={600}>
                        {value}
                      </Text>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>
      </SimpleGrid>

      {/* Positives & Warnings */}
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
        <Alert
          icon={<IconCircleCheck size={16} />}
          title="Positive Indicators"
          color="green"
          variant="light"
          radius="md"
        >
          <List size="xs" spacing={4} mt={4}>
            {los.positives.map((p, i) => (
              <List.Item key={i}>{p}</List.Item>
            ))}
          </List>
        </Alert>
        <Alert
          icon={<IconAlertTriangle size={16} />}
          title="Risk Watch Points"
          color={los.warnings.length ? 'orange' : 'green'}
          variant="light"
          radius="md"
        >
          {los.warnings.length ? (
            <List size="xs" spacing={4} mt={4}>
              {los.warnings.map((w, i) => (
                <List.Item key={i}>{w}</List.Item>
              ))}
            </List>
          ) : (
            <Text size="xs" mt={4}>
              No significant risk flags identified.
            </Text>
          )}
        </Alert>
      </SimpleGrid>

      {/* Narrative */}
      <Paper
        withBorder
        p="md"
        radius="md"
        style={{ borderLeft: `4px solid var(--mantine-color-${riskColor}-5)` }}
      >
        <Text
          size="xs"
          fw={700}
          c="dimmed"
          tt="uppercase"
          mb="sm"
          style={{ letterSpacing: '0.1em' }}
        >
          Underwriter Recommendation
        </Text>
        <Text size="sm" lh={1.75} c="dimmed">
          {los.riskLevel === 'low' &&
            `Applicant demonstrates excellent repayment behaviour with CIBIL score of ${score} and a clean payment history across all accounts. Monthly EMI obligation of ${fmtAmount(
              totalEMI
            )} should be verified against declared income to ensure FOIR compliance. Recommend approval subject to standard income verification.`}
          {los.riskLevel === 'medium' &&
            `Applicant shows ${
              !los.hasDefault ? 'clean payment history' : 'some delinquency'
            } with score ${score}. ${
              los.levWarn
                ? `Active balance of ${fmtAmount(
                  totalBal
                )} with monthly EMI of ${fmtAmount(
                  totalEMI
                )} requires strict income verification and FOIR < 65%.`
                : ''
            } ${
              los.hasSMA
                ? 'Historical SMA status noted — verify current repayment capacity.'
                : ''
            } Recommend conditional approval with full income documentation.`}
          {los.riskLevel === 'high' &&
            `Significant risk factors present: ${[
              los.hasDefault && 'delinquency detected',
              los.hasWriteoff && 'write-off/settlement on record',
              los.hasSuit && 'suit filed',
              score < 600 && `low score (${score})`,
            ]
              .filter(Boolean)
              .join(
                '; '
              )}. Recommend decline or senior credit committee review with complete documentation.`}
        </Text>
      </Paper>
    </Stack>
  );
}
