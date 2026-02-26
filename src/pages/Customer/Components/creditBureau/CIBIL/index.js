// ─── Main Component ───────────────────────────────────────────────────────────
export { CibilDashboard } from './CibilDashboard';
export { default }        from './CibilDashboard';

// ─── Tab Components (for custom layouts) ─────────────────────────────────────
export { CibilHeader }                      from './CibilHeader';
export { OverviewTab }                      from './OverviewTab';
export { AccountsTab }                      from './AccountsTab';
export { EnquiriesTab, IdentityTab, LOSTab } from './OtherTabs';

// ─── Sub-components ───────────────────────────────────────────────────────────
export { ScoreGradientBar, PaymentDots, DotLegend } from './ScoreGauge';

// ─── Utils (re-exported for custom use) ──────────────────────────────────────
export {
  fmtAmount, fmtDate, fmtDateLong,
  isActive, getBalance, getEMI, getHighCredit, getOverdue,
  parsePaymentHistory, parseDotStatus,
  getScoreInfo, computeLOS,
  REASON_CODE_MAP, ADDRESS_CAT, ENQUIRY_PURPOSE, OCCUPATION, PHONE_TYPE,
} from './utils';
