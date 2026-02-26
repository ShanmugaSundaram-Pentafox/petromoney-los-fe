import React from 'react';
import {
  Grid, Card, Stack, Group, Text, Badge, Paper,
  Progress, Divider, ThemeIcon, Box, Table,
} from '@mantine/core';
import {
  IconAlertTriangle, IconCheck,
} from '@tabler/icons-react';
import {
  fmtAmount, fmtDate, isActive, getBalance, getEMI, getHighCredit,
  getScoreInfo, REASON_CODE_MAP, computeLOS, parsePaymentHistory,
} from './utils';

const BAR_COLORS = ['blue','green','yellow','red','teal','violet','orange','cyan','pink'];

function ReasonCode({ code, name }) {
  const str = String(code).padStart(2, '0');
  const desc = REASON_CODE_MAP[str];
  const isOk = str === '00';
  return (
    <Paper withBorder p="sm" radius="sm" style={{ borderLeft: `3px solid var(--mantine-color-${isOk ? 'green' : 'orange'}-5)` }}>
      <Group gap="xs" mb={3}>
        <ThemeIcon size={14} color={isOk ? 'green' : 'orange'} variant="transparent">
          {isOk ? <IconCheck size={11} /> : <IconAlertTriangle size={11} />}
        </ThemeIcon>
        <Text size="xs" fw={800} c={isOk ? 'green' : 'orange'} tt="uppercase" style={{ letterSpacing: '0.08em' }}>
          Code {str}
        </Text>
      </Group>
      <Text size="xs" c="dimmed" lh={1.55}>{desc || name || 'Unknown factor'}</Text>
    </Paper>
  );
}

export function OverviewTab({ data, report }) {
  const accs      = report.accounts || [];
  const scoreObj  = (report.scores || [])[0] || {};
  const score     = data.cibil_score ?? scoreObj.score ?? 0;
  const sco       = getScoreInfo(score);
  const los       = computeLOS(score, accs, report.enquiries || []);

  const activeAccs = accs.filter(isActive);
  const totalBal   = activeAccs.reduce((s, a) => s + getBalance(a), 0);
  const totalEMI   = activeAccs.reduce((s, a) => s + getEMI(a), 0);
  const totalHC    = activeAccs.reduce((s, a) => s + getHighCredit(a), 0);

  const getAccountTypeSafe = (a) => {
    const value =
      a.accountTypeNormalized?.description ??
      a.accountTypeNormalized ??
      a.accountType ??
      'Other';

    if (typeof value === 'string') return value;
    if (typeof value === 'object')
      return value.description || value.name || 'Other';
    return String(value);
  };

  // Credit mix by type
  const mixMap = {};
  activeAccs.forEach(a => {
    const k = getAccountTypeSafe(a).substring(0, 32);
    mixMap[k] = (mixMap[k] || 0) + getBalance(a);
  });

  // Account type distribution (all)
  const typeMap = {};
  accs.forEach(a => {
    const t = getAccountTypeSafe(a).substring(0, 32);
    typeMap[t] = (typeMap[t] || 0) + 1;
  });

  // Lender distribution
  const lenderMap = {};
  accs.forEach(a => { const l = a.memberShortName || 'Unknown'; lenderMap[l] = (lenderMap[l] || 0) + 1; });

  const oldest = [...accs].filter(a => a.dateOpened).sort((a, b) => new Date(a.dateOpened) - new Date(b.dateOpened))[0];
  const newest = [...accs].filter(a => a.dateOpened).sort((a, b) => new Date(b.dateOpened) - new Date(a.dateOpened))[0];
  const creditAgeYrs = oldest ? ((Date.now() - new Date(oldest.dateOpened).getTime()) / (1000*60*60*24*365)).toFixed(1) : '—';

  // Payment quality
  let totalDots = 0, cleanDots = 0, smaDots = 0, badDots = 0, xxxDots = 0;
  accs.forEach(a => {
    parsePaymentHistory(a).forEach(d => {
      totalDots++;
      if (d === 'ok' || d === 'std') cleanDots++;
      else if (d === 'sma') smaDots++;
      else if (d === 'bad') badDots++;
      else if (d === 'xxx') xxxDots++;
    });
  });

  return (
    <Stack gap="lg">

      {/* Score + Reason Codes */}
      <Grid gutter="md">

        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Card withBorder radius="md" h="100%">
            <Text size="xs" fw={700} c="dimmed" tt="uppercase" mb="sm" style={{ letterSpacing: '0.1em' }}>Score Reason Codes</Text>
            <Stack gap="xs">
              {(scoreObj.reasonCodes || []).length
                ? (scoreObj.reasonCodes || []).map((rc, i) => <ReasonCode key={i} code={rc.reasonCodeValue} name={rc.reasonCodeName} />)
                : <Text size="xs" c="dimmed">No reason codes in response</Text>
              }
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Card withBorder radius="md" h="100%">
            <Text size="xs" fw={700} c="dimmed" tt="uppercase" mb="sm" style={{ letterSpacing: '0.1em' }}>Credit Overview</Text>
            <Stack gap={0}>
              {[
                { label: 'Total Accounts',       value: accs.length },
                { label: 'Active Accounts',      value: accs.filter(isActive).length },
                { label: 'Closed Accounts',      value: accs.filter(a => !isActive(a)).length },
                { label: 'Unique Lenders',       value: Object.keys(lenderMap).length },
                { label: 'Oldest Account',       value: fmtDate(oldest?.dateOpened) },
                { label: 'Newest Account',       value: fmtDate(newest?.dateOpened) },
                { label: 'Credit History',       value: `${creditAgeYrs} years` },
                { label: 'Sanctioned (Active)',  value: fmtAmount(totalHC) },
                { label: 'Active Balance',       value: fmtAmount(totalBal) },
                { label: 'Monthly EMI Burden',   value: fmtAmount(totalEMI) },
                { label: 'Credit Utilisation',   value: totalHC > 0 ? `${Math.round(totalBal / totalHC * 100)}%` : '—' },
                { label: 'Enquiries (12M)',       value: los.recentEnquiries.length },
                { label: 'Hard Enquiries (12M)', value: los.hardEnquiries12m.length },
              ].map(({ label, value }) => (
                <Box key={label}>
                  <Group justify="space-between" py={6}>
                    <Text size="xs" c="dimmed">{label}</Text>
                    <Text size="xs" fw={700} style={{ fontFamily: 'monospace' }}>{value}</Text>
                  </Group>
                  <Divider />
                </Box>
              ))}
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Payment Quality + Credit Mix */}
      <Grid gutter="md">
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Card withBorder radius="md" h="100%">
            <Text size="xs" fw={700} c="dimmed" tt="uppercase" mb="md" style={{ letterSpacing: '0.1em' }}>Payment Quality Analysis</Text>
            <Stack gap="sm">
              {[
                { label: 'On Time', val: cleanDots, pct: totalDots ? (cleanDots/totalDots*100).toFixed(1) : 0, color: 'green' },
                { label: 'SMA',     val: smaDots,   pct: totalDots ? (smaDots/totalDots*100).toFixed(1) : 0,  color: 'yellow' },
                { label: 'DPD / Delinquent', val: badDots, pct: totalDots ? (badDots/totalDots*100).toFixed(1) : 0, color: 'red' },
                { label: 'No Data (XXX)', val: xxxDots, pct: totalDots ? (xxxDots/totalDots*100).toFixed(1) : 0, color: 'gray' },
              ].map(({ label, val, pct, color }) => (
                <Box key={label}>
                  <Group justify="space-between" mb={3}>
                    <Group gap={6}><Box w={8} h={8} style={{ borderRadius: 2, background: `var(--mantine-color-${color}-6)` }} /><Text size="xs">{label}</Text></Group>
                    <Text size="xs" fw={700}>{val} ({pct}%)</Text>
                  </Group>
                  <Progress value={parseFloat(pct)} color={color} size="sm" radius="sm" />
                </Box>
              ))}
              <Divider />
              <Group justify="space-between">
                <Text size="xs" c="dimmed" fw={600}>Total Months Analysed</Text>
                <Text size="xs" fw={800}>{totalDots}</Text>
              </Group>
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Card withBorder radius="md" h="100%">
            <Text size="xs" fw={700} c="dimmed" tt="uppercase" mb="md" style={{ letterSpacing: '0.1em' }}>Active Credit Exposure Mix</Text>
            {totalBal > 0 ? (
              <Stack gap="sm">
                {Object.entries(mixMap).filter(([,v]) => v > 0).map(([k, v], i) => {
                  const pct = (v / totalBal * 100).toFixed(1);
                  return (
                    <Box key={k}>
                      <Group justify="space-between" mb={3}>
                        <Text size="xs" lineClamp={1}>{k}</Text>
                        <Text size="xs" fw={700} style={{ fontFamily: 'monospace' }}>{fmtAmount(v)} ({pct}%)</Text>
                      </Group>
                      <Progress value={parseFloat(pct)} color={BAR_COLORS[i % BAR_COLORS.length]} size="sm" radius="sm" />
                    </Box>
                  );
                })}
                <Divider />
                <Group justify="space-between">
                  <Text size="xs" fw={700} c="dimmed">Total Active</Text>
                  <Text size="xs" fw={800} style={{ fontFamily: 'monospace' }}>{fmtAmount(totalBal)}</Text>
                </Group>
              </Stack>
            ) : <Text size="xs" c="dimmed">No active balances</Text>}
          </Card>
        </Grid.Col>
      </Grid>

      {/* Account type + Lender distribution */}
      <Grid gutter="md">
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Card withBorder radius="md">
            <Text size="xs" fw={700} c="dimmed" tt="uppercase" mb="md" style={{ letterSpacing: '0.1em' }}>Account Type Distribution</Text>
            <Table striped withRowBorders={false}>
              <Table.Tbody>
                {Object.entries(typeMap).sort(([,a],[,b]) => b - a).map(([type, count]) => (
                  <Table.Tr key={type}>
                    <Table.Td><Text size="xs">{type}</Text></Table.Td>
                    <Table.Td ta="right"><Badge size="xs" variant="light" color="blue">{count}</Badge></Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Card withBorder radius="md">
            <Text size="xs" fw={700} c="dimmed" tt="uppercase" mb="md" style={{ letterSpacing: '0.1em' }}>Lender Distribution</Text>
            <Table striped withRowBorders={false}>
              <Table.Tbody>
                {Object.entries(lenderMap).sort(([,a],[,b]) => b - a).map(([lender, count]) => (
                  <Table.Tr key={lender}>
                    <Table.Td><Text size="xs" fw={600}>{lender}</Text></Table.Td>
                    <Table.Td ta="right">
                      <Group justify="flex-end" gap="xs">
                        <Badge size="xs" variant="light">{count} A/C{count > 1 ? 's' : ''}</Badge>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Card>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
