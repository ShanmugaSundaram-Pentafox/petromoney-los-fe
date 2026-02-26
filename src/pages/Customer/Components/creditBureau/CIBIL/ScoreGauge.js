import React from 'react';
import {
  Badge,
  Box,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import { getScoreInfo, parsePaymentHistory } from './utils';

// ─── Score Gauge ──────────────────────────────────────────────────────────────

const DOT_COLORS = {
  ok: '#40c057',
  std: '#12b886',
  sma: '#fab005',
  bad: '#fa5252',
  xxx: '#868e96',
  unknown: '#dee2e6',
};

// ─── Payment Dots ─────────────────────────────────────────────────────────────

const DOT_LABEL = {
  ok: 'On Time',
  std: 'Standard (STD)',
  sma: 'SMA',
  bad: 'Delinquent/DPD',
  xxx: 'No Data',
  unknown: 'Unknown',
};

export function PaymentDots({ account, max = 48 }) {
  const dots = parsePaymentHistory(account).slice(0, max);
  const statuses = account.monthlyPayStatus || [];

  if (!dots.length)
    return (
      <Text size="xs" c="dimmed">
        No data
      </Text>
    );

  return (
    <Group gap={2} wrap="wrap" style={{ maxWidth: 220 }}>
      {dots.map((d, i) => {
        const entry = statuses[i];
        const label = entry
          ? `${new Date(entry.date).toLocaleDateString('en-GB', {
            month: 'short',
            year: '2-digit',
          })} · ${DOT_LABEL[d]}`
          : DOT_LABEL[d];
        return (
          <Tooltip key={i} label={label} withArrow fz="xs">
            <Box
              w={10}
              h={10}
              style={{
                borderRadius: 2,
                backgroundColor: DOT_COLORS[d] || '#dee2e6',
                cursor: 'default',
                flexShrink: 0,
              }}
            />
          </Tooltip>
        );
      })}
    </Group>
  );
}

export function DotLegend() {
  return (
    <Group gap="md" wrap="wrap">
      {[
        ['ok', '#40c057', 'On Time'],
        ['sma', '#fab005', 'SMA'],
        ['bad', '#fa5252', 'DPD/Delinquent'],
        ['xxx', '#868e96', 'No Data'],
      ].map(([k, c, l]) => (
        <Group key={k} gap={5}>
          <Box
            w={10}
            h={10}
            style={{ borderRadius: 2, background: c, flexShrink: 0 }}
          />
          <Text size="xs" c="dimmed">
            {l}
          </Text>
        </Group>
      ))}
    </Group>
  );
}

export function ScoreGradientBar({
  score,
  scoreObj = {},
  min = 300,
  max = 900,
}) {
  const sco = getScoreInfo(score);
  const percent = Math.max(0, Math.min(1, (score - min) / (max - min))) * 100;

  const gradient =
    'linear-gradient(90deg, #ef4444 0%, #f97316 18%, #facc15 35%, #60a5fa 55%, #22c55e 75%, #14b8a6 100%)';

  const ticks = [300, 450, 600, 750, 900];

  return (
    <Box w="100%" miw={280}>
      <Stack gap="sm">
        {/* Header */}
        <Group justify="space-between" align="center">
          <Box>
            <Text size="xs" c="dimmed" fw={600} tt="uppercase">
              Credit Score
            </Text>
            <Group gap={6} align="end">
              <Text size="xl" fw={800} c={sco.color}>
                {score}
              </Text>
              <Text size="xs" c="dimmed" mb={3}>
                / {max}
              </Text>
            </Group>
          </Box>

          <Badge color={sco.color} size="lg">
            {sco.verdict}
          </Badge>
        </Group>

        {/* Gradient */}
        <Box
          style={{
            position: 'relative',
            height: 8,
            borderRadius: 999,
            background: gradient,
          }}
        >
          <Box
            style={{
              position: 'absolute',
              left: `${percent}%`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: 14,
              height: 14,
              borderRadius: '50%',
              background: '#fff',
              border: '2px solid #111',
            }}
          />
        </Box>

        {/* Ticks */}
        <Group justify="space-between" c="dimmed">
          {ticks.map((t) => (
            <Text key={t} size="xs">
              {t}
            </Text>
          ))}
        </Group>

        {/* Details */}
        <SimpleGrid cols={2} gap={4} mt={4}>
          <Group>
            <Text size="xs" c="dimmed">
              Grade
            </Text>
            <Badge color={sco.color} size="sm">
              {sco.grade}
            </Badge>
          </Group>

          <Group>
            <Text size="xs" c="dimmed">
              Score Card
            </Text>
            <Text size="xs" fw={600} style={{ fontFamily: 'monospace' }}>
              {scoreObj.scoreCardName || '—'}
            </Text>
          </Group>

          <Group>
            <Text size="xs" c="dimmed">
              Score Name
            </Text>
            <Text size="xs" fw={600}>
              {scoreObj.scoreName || '—'}
            </Text>
          </Group>

          <Group>
            <Text size="xs" c="dimmed">
              Report Date
            </Text>
            <Text size="xs" fw={600}>
              {scoreObj.scoreDate
                ? new Date(scoreObj.scoreDate).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })
                : '—'}
            </Text>
          </Group>
        </SimpleGrid>
      </Stack>
    </Box>
  );
}
