import React, { useState, useMemo } from 'react';
import { Tabs, Box, Badge } from '@mantine/core';
import {
  IconLayoutDashboard,
  IconBuildingBank,
  IconSearch,
  IconId,
  IconShield,
} from '@tabler/icons-react';
import '@mantine/core/styles.css';

import { CibilHeader } from './CibilHeader';
import { OverviewTab } from './OverviewTab';
import { AccountsTab } from './AccountsTab';
import { EnquiriesTab, IdentityTab, LOSTab } from './OtherTabs';

/**
 * CibilDashboard
 *
 * Props:
 *   cibildData  — raw CIBIL API response JSON (CibilApiResponse shape)
 *
 * Usage:
 *   <CibilDashboard cibildData={apiResponse} />
 */
export function CibilDashboard({ cibildData }) {
  const [tab, setTab] = useState('overview');

  const { data, report } = useMemo(() => {
    const d = cibildData?.data ?? cibildData ?? {};
    const r = (d?.credit_report ?? [])[0] ?? {};
    return { data: d, report: r };
  }, [cibildData]);

  const hasEnquiries = (report.enquiries || []).length > 0;
  const hasIdentity =
    (report.ids || []).length > 0 ||
    (report.addresses || []).length > 0 ||
    (report.emails || []).length > 0 ||
    (report.telephones || []).length > 0;

  return (
    <Box
      style={{ minHeight: '100vh', background: 'var(--mantine-color-gray-0)' }}
    >
      {/* ── HEADER + SUMMARY (always visible) ── */}
      <CibilHeader data={data} report={report} />

      {/* ── TABS ── */}
      <Tabs value={tab} onChange={setTab}>
        <Tabs.List mb="lg">
          <Tabs.Tab
            value="overview"
            leftSection={<IconLayoutDashboard size={14} />}
          >
            Overview
          </Tabs.Tab>
          <Tabs.Tab
            value="accounts"
            leftSection={<IconBuildingBank size={14} />}
          >
            Accounts
            <Badge size="xs" variant="light" color="blue" ml={6}>
              {(report.accounts || []).length}
            </Badge>
          </Tabs.Tab>
          {hasEnquiries && (
            <Tabs.Tab value="enquiries" leftSection={<IconSearch size={14} />}>
              Enquiries
              <Badge size="xs" variant="light" color="violet" ml={6}>
                {(report.enquiries || []).length}
              </Badge>
            </Tabs.Tab>
          )}
          {hasIdentity && (
            <Tabs.Tab value="identity" leftSection={<IconId size={14} />}>
              Identity
            </Tabs.Tab>
          )}
          <Tabs.Tab value="los" leftSection={<IconShield size={14} />}>
            LOS Decision
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="overview">
          <OverviewTab data={data} report={report} />
        </Tabs.Panel>

        <Tabs.Panel value="accounts">
          <AccountsTab report={report} />
        </Tabs.Panel>

        {hasEnquiries && (
          <Tabs.Panel value="enquiries">
            <EnquiriesTab report={report} />
          </Tabs.Panel>
        )}

        {hasIdentity && (
          <Tabs.Panel value="identity">
            <IdentityTab report={report} />
          </Tabs.Panel>
        )}

        <Tabs.Panel value="los">
          <LOSTab data={data} report={report} />
        </Tabs.Panel>
      </Tabs>
    </Box>
  );
}

export default CibilDashboard;
