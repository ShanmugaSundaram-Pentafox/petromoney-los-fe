import React, { useState } from 'react';
import {
  Stack, Card, Group, Text, Badge, Box, Table, Collapse,
  ActionIcon, SimpleGrid, Divider, Paper, ScrollArea,
} from '@mantine/core';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { PaymentDots, DotLegend } from './ScoreGauge';
import {
  fmtAmount, fmtDate, fmtDateLong, isActive,
  getBalance, getEMI, getHighCredit, getOverdue, parsePaymentHistory,
} from './utils';


function statusTag(acc) {
  const active = isActive(acc);
  return <Badge color={active ? 'teal' : 'gray'} variant="light" size="sm">{active ? 'Active' : 'Closed'}</Badge>;
}

function healthTag(acc) {
  const dots = parsePaymentHistory(acc);
  const hasBad = dots.some(d => d === 'bad');
  const hasSMA = dots.some(d => d === 'sma');
  const hasWO  = parseFloat(String(acc.woAmountTotal)) > 0;
  if (hasBad || hasWO) return <Badge color="red"    size="xs" variant="dot">Delinquent</Badge>;
  if (hasSMA)          return <Badge color="yellow" size="xs" variant="dot">SMA</Badge>;
  return                      <Badge color="green"  size="xs" variant="dot">Clean</Badge>;
}

function AccountCard({ acc }) {
  const [open, setOpen] = useState(false);
  const bal = getBalance(acc);
  const emi = getEMI(acc);
  const hc  = getHighCredit(acc);
  const od  = getOverdue(acc);
  const active = isActive(acc);

  return (
    <Paper withBorder radius="md" style={{ overflow: 'hidden' }}>
      {/* Header */}
      <Group p="sm" justify="space-between" style={{ background: 'var(--mantine-color-gray-0)', borderBottom: '1px solid var(--mantine-color-gray-2)' }} wrap="nowrap">
        <Box style={{ minWidth: 0 }}>
          <Text fw={700} size="sm" lineClamp={1}>{acc.accountTypeNormalized || acc.accountType || '—'}</Text>
          <Text size="xs" c="dimmed" style={{ fontFamily: 'monospace' }}>{acc.memberShortName} · #{String(acc.accountNumber).substring(0, 22)}</Text>
        </Box>
        <Group gap={6} wrap="nowrap" style={{ flexShrink: 0 }}>
          {statusTag(acc)}
          {healthTag(acc)}
          <Badge size="xs" variant="outline" color="gray">{acc.ownershipIndicator || 'Individual'}</Badge>
          <ActionIcon size="sm" variant="subtle" onClick={() => setOpen(o => !o)}>
            {open ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />}
          </ActionIcon>
        </Group>
      </Group>

      {/* Quick metrics */}
      <SimpleGrid cols={4} spacing={0}>
        {[
          { label: 'Sanctioned', value: fmtAmount(hc),               color: undefined },
          { label: 'Balance',    value: bal > 0 ? fmtAmount(bal) : '₹0', color: bal > 0 ? 'orange' : 'green' },
          { label: 'EMI',        value: emi > 0 ? fmtAmount(emi) : '—', color: undefined },
          { label: 'Overdue',    value: od > 0 ? fmtAmount(od) : '₹0',  color: od > 0 ? 'red' : 'green' },
        ].map(({ label, value, color }, i) => (
          <Box key={label} p="xs" style={{ borderRight: i < 3 ? '1px solid var(--mantine-color-gray-2)' : undefined }}>
            <Text size="xs" c="dimmed" mb={1}>{label}</Text>
            <Text size="xs" fw={800} c={color} style={{ fontFamily: 'monospace' }}>{value}</Text>
          </Box>
        ))}
      </SimpleGrid>

      {/* Pay history */}
      <Box px="sm" py={8} style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}>
        <Text size="xs" c="dimmed" mb={5} fw={600} tt="uppercase" style={{ letterSpacing: '0.06em', fontSize: 10 }}>
          Payment History ({parsePaymentHistory(acc).length} months)
        </Text>
        <PaymentDots account={acc} />
      </Box>

      {/* Expanded details */}
      <Collapse in={open}>
        <Divider />
        <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="xs" p="sm">
          {[
            { label: 'Account Number',      value: String(acc.accountNumber) },
            { label: 'Opened',              value: fmtDateLong(acc.dateOpened) },
            { label: active ? 'Last Payment' : 'Closed', value: active ? fmtDateLong(acc.lastPaymentDate) : fmtDateLong(acc.dateClosed) },
            { label: 'Date Reported',       value: fmtDateLong(acc.dateReported) },
            { label: 'Repayment Tenure',    value: acc.repaymentTenure && acc.repaymentTenure !== '-1' ? `${acc.repaymentTenure} months` : '—' },
            { label: 'Term Months',         value: acc.termMonths && acc.termMonths !== '-1' ? `${acc.termMonths} months` : '—' },
            { label: 'Payment Frequency',   value: acc.paymentFrequency || '—' },
            { label: 'Facility Status',     value: acc.creditFacilityStatus || '—' },
            { label: 'WO Amount (Principal)',value: fmtAmount(acc.woAmountPrincipal) },
            { label: 'WO Amount (Total)',    value: fmtAmount(acc.woAmountTotal) },
            { label: 'Settlement Amount',   value: fmtAmount(acc.settlementAmount) },
            { label: 'Suit / Default',      value: acc.suitFiledWillfulDefaultWrittenOff || 'None' },
          ].map(({ label, value }) => (
            <Box key={label}>
              <Text size="xs" c="dimmed">{label}</Text>
              <Text size="xs" fw={600} style={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>{value || '—'}</Text>
            </Box>
          ))}
        </SimpleGrid>
        {/* Monthly pay status table if available */}
        {(acc.monthlyPayStatus || []).length > 0 && (
          <Box px="sm" pb="sm">
            <Text size="xs" c="dimmed" fw={700} tt="uppercase" mb="xs" style={{ letterSpacing: '0.06em', fontSize: 10 }}>Monthly Payment Status</Text>
            <ScrollArea>
              <Group gap={4} wrap="nowrap">
                {acc.monthlyPayStatus.map((p, i) => (
                  <Box key={i} ta="center" style={{ minWidth: 36 }}>
                    <Text size="xs" c="dimmed" style={{ fontSize: 9 }}>
                      {new Date(p.date).toLocaleDateString('en-GB', { month: 'short', year: '2-digit' })}
                    </Text>
                    <Badge
                      size="xs"
                      color={p.status === '0' ? 'green' : p.status === 'STD' ? 'teal' : p.status === 'SMA' ? 'yellow' : p.status === 'XXX' ? 'gray' : 'red'}
                      variant="filled"
                      style={{ fontSize: 8, padding: '1px 4px' }}
                    >
                      {p.status}
                    </Badge>
                  </Box>
                ))}
              </Group>
            </ScrollArea>
          </Box>
        )}
      </Collapse>
    </Paper>
  );
}

export function AccountsTab({ report }) {
  const accs = report.accounts || [];
  if (!accs.length) return <Text c="dimmed" ta="center" py={40}>No account data found.</Text>;

  return (
    <Stack gap="xl">

      {/* Summary Table */}
      <Card withBorder radius="md" p={0}>
        <Box p="sm" style={{ borderBottom: '1px solid var(--mantine-color-gray-2)' }}>
          <Group justify="space-between">
            <Text size="xs" fw={700} c="dimmed" tt="uppercase" style={{ letterSpacing: '0.1em' }}>All Accounts — Summary</Text>
            <Badge variant="light">{accs.length} accounts</Badge>
          </Group>
        </Box>
        <ScrollArea>
          <Table striped highlightOnHover withColumnBorders style={{ minWidth: 1000 }}>
            <Table.Thead>
              <Table.Tr>
                {['#','Status','Type','Lender','Opened','Closed','Sanctioned','Balance','EMI','Overdue','Tenure','Ownership','Health','Payment History'].map(h => (
                  <Table.Th key={h} style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</Table.Th>
                ))}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {accs.map((acc, i) => {
                const bal = getBalance(acc); const emi = getEMI(acc); const od = getOverdue(acc);
                return (
                  <Table.Tr key={i}>
                    <Table.Td><Text size="xs" c="dimmed" style={{ fontFamily: 'monospace' }}>{acc.index ?? i}</Text></Table.Td>
                    <Table.Td>{statusTag(acc)}</Table.Td>
                    <Table.Td><Text size="xs" fw={600} lineClamp={2} maw={150}>{acc.accountTypeNormalized || acc.accountType}</Text></Table.Td>
                    <Table.Td><Text size="xs" fw={600}>{acc.memberShortName}</Text></Table.Td>
                    <Table.Td><Text size="xs" style={{ fontFamily: 'monospace' }}>{fmtDate(acc.dateOpened)}</Text></Table.Td>
                    <Table.Td><Text size="xs" style={{ fontFamily: 'monospace' }}>{isActive(acc) ? '—' : fmtDate(acc.dateClosed)}</Text></Table.Td>
                    <Table.Td><Text size="xs" style={{ fontFamily: 'monospace' }}>{fmtAmount(getHighCredit(acc))}</Text></Table.Td>
                    <Table.Td><Text size="xs" fw={700} c={bal > 0 ? 'orange' : undefined} style={{ fontFamily: 'monospace' }}>{bal > 0 ? fmtAmount(bal) : '₹0'}</Text></Table.Td>
                    <Table.Td><Text size="xs" style={{ fontFamily: 'monospace' }}>{emi > 0 ? fmtAmount(emi) : '—'}</Text></Table.Td>
                    <Table.Td><Text size="xs" fw={od > 0 ? 700 : undefined} c={od > 0 ? 'red' : undefined} style={{ fontFamily: 'monospace' }}>{od > 0 ? fmtAmount(od) : '₹0'}</Text></Table.Td>
                    <Table.Td><Text size="xs" style={{ fontFamily: 'monospace' }}>{acc.termMonths && acc.termMonths !== '-1' ? `${acc.termMonths}m` : '—'}</Text></Table.Td>
                    <Table.Td><Badge size="xs" variant="outline" color="gray">{acc.ownershipIndicator || '—'}</Badge></Table.Td>
                    <Table.Td>{healthTag(acc)}</Table.Td>
                    <Table.Td><PaymentDots account={acc} max={24} /></Table.Td>
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        </ScrollArea>
        <Box p="sm" style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}>
          <DotLegend />
        </Box>
      </Card>

      {/* Detail Cards */}
      <Box>
        <Text fw={700} size="sm" mb="sm">Account Detail Cards <Text component="span" size="xs" c="dimmed">(click ▾ to expand)</Text></Text>
        <Stack gap="sm">
          {accs.map((acc, i) => <AccountCard key={i} acc={acc} />)}
        </Stack>
      </Box>
    </Stack>
  );
}
