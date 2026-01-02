import React from 'react';
import { Box, Text, Title, Group } from '@mantine/core';
import {
  IconCheck,
  IconFileText,
  IconThumbUp,
  IconRefresh,
} from '@tabler/icons-react';
import LoginForm from './loginForm';

const FEATURES = [
  { icon: IconCheck, label: 'Loan Application Processing' },
  { icon: IconThumbUp, label: 'Approval & Disbursement Management' },
  { icon: IconFileText, label: 'Customer & Document Verification' },
  { icon: IconRefresh, label: 'Repayment & Status Tracking' },
];

export default function Login() {
  return (
    <Box
      style={{
        display: 'flex',
        minHeight: '100vh',
      }}
    >
      {/* LEFT PANEL */}
      <Box
        style={{
          width: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#ffffff',
        }}
      >
        <LoginForm />
      </Box>

      {/* RIGHT PANEL */}
      <Box
        style={{
          width: '50%',
          display: 'flex',
          alignItems: 'center',
          color: '#ffffff',
          background:
            'linear-gradient(135deg, #7A0F0F 0%, #C41E1E 45%, #E03131 70%, #8B0C0C 100%)',
        }}
      >
        {/* CONTENT COLUMN */}
        <Box
          style={{
            marginLeft: 72,
            marginRight: 72,
          }}
        >
          {/* HEADER */}
          <Title
            order={1}
            fw={500}
            fz={32}
            mb={18}
            style={{
              lineHeight: 1.2,
            }}
          >
            Smart & Secure Loan Management
          </Title>

          <Text
            size="md"
            mb={48}
            style={{
              opacity: 0.75,
              maxWidth: 460,
            }}
          >
            Manage loan applications, approvals, and disbursements from a
            single platform.
          </Text>

          {/* FEATURES */}
          <Box style={{ marginBottom: 96 }}>
            {FEATURES.map(({ icon: Icon, label }) => (
              <Group key={label} spacing={18} mb={26}>
                <Box
                  style={{
                    width: 49,
                    height: 44,
                    borderRadius: 10,
                    backgroundColor: 'rgba(255,255,255,0.18)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(6px)',
                  }}
                >
                  <Icon size={22} stroke={1.8} />
                </Box>

                <Text fz={16} fw={400}>
                  {label}
                </Text>
              </Group>
            ))}
          </Box>

          {/* FOOTER COPY */}
          <Title order={3} fz={24} fw={500} mb={10}>
            One Platform. Complete Control.
          </Title>

          <Text
            fz={18}
            fw={400}
            style={{ opacity: 0.75 }}
          >
            Accurate. Secure. Operationally efficient.
          </Text>
        </Box>
      </Box>
    </Box>
  );
}
