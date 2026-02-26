import React from 'react';
import {
  Paper,
  Group,
  Box,
  Text,
  Badge,
  Stack,
  SimpleGrid,
  ThemeIcon,
  Progress,
  Flex,
} from '@mantine/core';
import {
  IconUser,
  IconId,
  IconPhone,
  IconMail,
  IconGenderMale,
  IconGenderFemale,
  IconBuildingBank,
  IconCurrencyRupee,
  IconSearch,
  IconAlertTriangle,
  IconCheck,
  IconX,
  IconTrendingUp,
  IconClock,
} from '@tabler/icons-react';
import { ScoreGradientBar } from './ScoreGauge';
import {
  fmtAmount,
  fmtDate,
  fmtDateLong,
  isActive,
  getBalance,
  getEMI,
  getHighCredit,
  getScoreInfo,
  computeLOS,
} from './utils';

function InfoPill({ icon, label, value, mono }) {
  if (!value) return null;
  return (
    <Group gap={6} wrap="nowrap">
      <ThemeIcon size={16} variant="transparent" color="gray">
        {icon}
      </ThemeIcon>
      <Text size="xs" c="dimmed">
        {label}:
      </Text>
      <Text size="xs" fw={600} style={mono ? { fontFamily: 'monospace' } : {}}>
        {value}
      </Text>
    </Group>
  );
}

function StatTile({ icon, label, value, sub, color = 'blue' }) {
  return (
    <Paper withBorder p="sm" radius="md">
      <Group gap="xs" mb={4}>
        <ThemeIcon size="sm" color={color} variant="light" radius="sm">
          {icon}
        </ThemeIcon>
        <Text
          size="xs"
          c="dimmed"
          fw={600}
          tt="uppercase"
          style={{ letterSpacing: '0.05em', fontSize: 10 }}
        >
          {label}
        </Text>
      </Group>
      <Text size="lg" fw={800} lh={1}>
        {value}
      </Text>
      {sub && (
        <Text size="xs" c="dimmed" mt={3}>
          {sub}
        </Text>
      )}
    </Paper>
  );
}

function SignalRow({ label, ok, value, warn }) {
  const Icon = ok === null ? IconAlertTriangle : ok ? IconCheck : IconX;
  const color = ok === null ? 'yellow' : ok ? 'green' : 'red';
  return (
    <Group
      justify="space-between"
      py={6}
      style={{ borderBottom: '1px solid var(--mantine-color-gray-1)' }}
    >
      <Text size="xs" c="dimmed">
        {label}
      </Text>
      <Group gap={6}>
        <ThemeIcon size={14} color={color} variant="transparent">
          <Icon size={11} />
        </ThemeIcon>
        <Text size="xs" fw={700} c={warn ? color : undefined}>
          {value}
        </Text>
      </Group>
    </Group>
  );
}

export function CibilHeader({ data, report }) {
  const accs = report.accounts || [];
  const person = (report.names || [])[0] || {};
  const scoreObj = (report.scores || [])[0] || {};
  const score = data.cibil_score ?? scoreObj.score ?? 0;
  const sco = getScoreInfo(score);
  const los = computeLOS(score, accs, report.enquiries || []);
  const tels = report.telephones || [];
  const emails = report.emails || [];
  const ids = report.ids || [];

  const activeAccs = accs.filter(isActive);
  const closedAccs = accs.filter((a) => !isActive(a));
  const totalBal = activeAccs.reduce((s, a) => s + getBalance(a), 0);
  const totalEMI = activeAccs.reduce((s, a) => s + getEMI(a), 0);
  const totalHC = activeAccs.reduce((s, a) => s + getHighCredit(a), 0);
  const utilPct = totalHC > 0 ? Math.round((totalBal / totalHC) * 100) : 0;

  const panId = ids.find((i) => i.idType === 'TaxId');
  const passId = ids.find((i) => i.idType === 'PassportId');
  const dlId = ids.find((i) => i.idType === 'DriversLicenseId');

  const oldest = [...accs]
    .filter((a) => a.dateOpened)
    .sort((a, b) => new Date(a.dateOpened) - new Date(b.dateOpened))[0];
  const creditAgeYrs = oldest
    ? (
      (Date.now() - new Date(oldest.dateOpened).getTime()) /
        (1000 * 60 * 60 * 24 * 365)
    ).toFixed(1)
    : '—';

  const enquiries12m = los.recentEnquiries;
  const hard12m = los.hardEnquiries12m;

  const riskColor =
    los.riskLevel === 'low'
      ? 'green'
      : los.riskLevel === 'medium'
        ? 'orange'
        : 'red';
  const genderIcon =
    (data.gender || person.gender || '').toLowerCase() === 'female' ? (
      <IconGenderFemale size={14} />
    ) : (
      <IconGenderMale size={14} />
    );

  return (
    <Stack gap="md" mb="xl">
      {/* ── TOP HEADER ───────────────────────────────────────── */}
      <Paper withBorder radius="md" p="md">
        <Stack justify="space-between" align="flex-start" wrap="wrap" gap="lg">
          {/* Left: Identity block */}
          <Group gap="md" align="flex-start" wrap="nowrap">
            <ThemeIcon size={52} radius="xl" color={sco.color} variant="light">
              <IconUser size={26} />
            </ThemeIcon>
            <Stack gap={4}>
              <Flex gap="md">
                <Text size="xl" fw={800} lh={1.2}>
                  {data.full_name || person.name || 'Unknown'}
                </Text>
                <Group gap="xs" wrap="wrap">
                  {person.birthDate && (
                    <Badge variant="outline" size="xs" color="gray">
                      DOB: {fmtDateLong(person.birthDate)}
                    </Badge>
                  )}
                  {(data.gender || person.gender) && (
                    <Badge
                      variant="outline"
                      size="xs"
                      color="gray"
                      leftSection={genderIcon}
                    >
                      {(data.gender || person.gender).toUpperCase()}
                    </Badge>
                  )}
                  {scoreObj.scoreCardName && (
                    <Badge variant="outline" size="xs" color="blue">
                      {scoreObj.scoreCardName}
                    </Badge>
                  )}
                  {scoreObj.scoreDate && (
                    <Badge variant="outline" size="xs" color="gray">
                      Report: {fmtDateLong(scoreObj.scoreDate)}
                    </Badge>
                  )}
                </Group>
              </Flex>
              {/* IDs row */}
              <Group gap="md" wrap="wrap" mt={2}>
                {panId && (
                  <InfoPill
                    icon={<IconId size={13} />}
                    label="PAN"
                    value={String(panId.idNumber)}
                    mono
                  />
                )}
                {passId && (
                  <InfoPill
                    icon={<IconId size={13} />}
                    label="Passport"
                    value={String(passId.idNumber)}
                    mono
                  />
                )}
                {dlId && (
                  <InfoPill
                    icon={<IconId size={13} />}
                    label="DL"
                    value={String(dlId.idNumber)}
                    mono
                  />
                )}
                {data.pan_number && !panId && (
                  <InfoPill
                    icon={<IconId size={13} />}
                    label="PAN"
                    value={data.pan_number}
                    mono
                  />
                )}
              </Group>
              <Group gap="md" wrap="wrap" mt={2}>
                {data.mobile_number && (
                  <InfoPill
                    icon={<IconPhone size={13} />}
                    label="Mobile"
                    value={`+91 ${data.mobile_number}`}
                    mono
                  />
                )}
                {tels
                  .filter((t) => t.telephoneType === '01')
                  .slice(0, 2)
                  .map((t, i) =>
                    !data.mobile_number ||
                    String(t.telephoneNumber) !== String(data.mobile_number) ? (
                      <InfoPill
                          key={i}
                          icon={<IconPhone size={13} />}
                          label="Mobile"
                          value={`+91 ${t.telephoneNumber}`}
                          mono
                        />
                      ) : null
                  )}
                {emails.slice(0, 2).map((e, i) => (
                  <InfoPill
                    key={i}
                    icon={<IconMail size={13} />}
                    label="Email"
                    value={e.emailID.toLowerCase()}
                  />
                ))}
              </Group>
            </Stack>
          </Group>

          {/* Center: Score gauge */}
          <ScoreGradientBar score={score} scoreObj={scoreObj} />
        </Stack>
      </Paper>

      {/* ── SUMMARY STATS ─────────────────────────────────────── */}
      <SimpleGrid cols={{ base: 2, sm: 3, md: 6 }} spacing="sm">
        <StatTile
          icon={<IconBuildingBank size={14} />}
          label="Accounts"
          value={accs.length}
          sub={`${activeAccs.length} active · ${closedAccs.length} closed`}
          color="blue"
        />
        <StatTile
          icon={<IconCurrencyRupee size={14} />}
          label="Active Bal"
          value={fmtAmount(totalBal)}
          sub={`Sanctioned: ${fmtAmount(totalHC)}`}
          color={totalBal > 10_000_000 ? 'orange' : 'teal'}
        />
        <StatTile
          icon={<IconCurrencyRupee size={14} />}
          label="Monthly EMI"
          value={fmtAmount(totalEMI)}
          sub="Active obligations"
          color={totalEMI > 100_000 ? 'orange' : 'green'}
        />
        <StatTile
          icon={<IconSearch size={14} />}
          label="Enquiries"
          value={(report.enquiries || []).length}
          sub={`${hard12m.length} hard in 12M`}
          color={los.enqWarn ? 'red' : 'violet'}
        />
        <StatTile
          icon={<IconClock size={14} />}
          label="Credit Age"
          value={`${creditAgeYrs} yrs`}
          sub={`Since ${fmtDate(oldest?.dateOpened)}`}
          color="indigo"
        />
        <StatTile
          icon={<IconTrendingUp size={14} />}
          label="Pay Rate"
          value={`${los.payOnTimeRate.toFixed(0)}%`}
          sub={`${los.totalMonths} months analysed`}
          color={los.payOnTimeRate >= 95 ? 'green' : 'orange'}
        />
      </SimpleGrid>

      {/* ── KEY SIGNALS STRIP ─────────────────────────────────── */}
      <Paper withBorder radius="md" p="md">
        <Text
          size="xs"
          fw={700}
          c="dimmed"
          tt="uppercase"
          mb="sm"
          style={{ letterSpacing: '0.1em' }}
        >
          Key Credit Signals
        </Text>
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing={0}>
          <Box pr="md">
            <SignalRow
              label="CIBIL Score"
              ok={score >= 700}
              value={`${score} — ${sco.verdict}`}
            />
            <SignalRow
              label="Current DPD"
              ok={!los.hasDefault}
              value={los.hasDefault ? 'DPD Found — Review' : 'Zero DPD — Clean'}
              warn={los.hasDefault}
            />
            <SignalRow
              label="SMA History"
              ok={!los.hasSMA}
              value={los.hasSMA ? 'Detected' : 'None'}
              warn={los.hasSMA}
            />
          </Box>
          <Box
            px={{ base: 0, sm: 'md' }}
            style={{
              borderLeft: '1px solid var(--mantine-color-gray-2)',
              borderRight: '1px solid var(--mantine-color-gray-2)',
            }}
          >
            <SignalRow
              label="Write-offs / Settlements"
              ok={!los.hasWriteoff}
              value={los.hasWriteoff ? 'Present — Flag' : 'None'}
              warn={los.hasWriteoff}
            />
            <SignalRow
              label="Suits / Willful Default"
              ok={!los.hasSuit}
              value={los.hasSuit ? 'Yes — Flag' : 'None'}
              warn={los.hasSuit}
            />
            <SignalRow
              label="Hard Enquiries (12M)"
              ok={hard12m.length < 3}
              value={`${hard12m.length} — ${
                hard12m.length >= 3
                  ? 'High'
                  : hard12m.length >= 2
                    ? 'Watch'
                    : 'OK'
              }`}
              warn={hard12m.length >= 3}
            />
          </Box>
          <Box pl={{ base: 0, sm: 'md' }}>
            <SignalRow
              label="Active Leverage"
              ok={!los.levHigh}
              value={`${fmtAmount(totalBal)} — ${
                los.levHigh ? 'HIGH' : los.levWarn ? 'MODERATE' : 'LOW'
              }`}
              warn={los.levHigh || los.levWarn}
            />
            <SignalRow
              label="Credit Utilisation"
              ok={utilPct < 50}
              value={`${utilPct}% of sanctioned limit`}
              warn={utilPct >= 50}
            />
            <SignalRow
              label="Pay On-Time Rate"
              ok={los.payOnTimeRate >= 90}
              value={`${los.payOnTimeRate.toFixed(1)}%`}
              warn={los.payOnTimeRate < 90}
            />
          </Box>
        </SimpleGrid>
        {/* Pay rate progress */}
        <Box mt="sm">
          <Progress
            value={los.payOnTimeRate}
            color={
              los.payOnTimeRate >= 95
                ? 'green'
                : los.payOnTimeRate >= 80
                  ? 'yellow'
                  : 'red'
            }
            size="xs"
            radius="xl"
          />
        </Box>
      </Paper>
    </Stack>
  );
}
