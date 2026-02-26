// ─── Amount Formatting ────────────────────────────────────────────────────────

export const fmtAmount = (n) => {
  const v = parseFloat(String(n));
  if (isNaN(v) || v < 0) return '—';
  if (v >= 1e7) return `₹${(v / 1e7).toFixed(2)}Cr`;
  if (v >= 1e5) return `₹${(v / 1e5).toFixed(2)}L`;
  if (v >= 1000) return `₹${v.toLocaleString('en-IN')}`;
  return `₹${v}`;
};

export const fmtDate = (s) => {
  if (!s || s === 'NA' || s === '-1') return '—';
  try { return new Date(s).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }); }
  catch { return s; }
};

export const fmtDateLong = (s) => {
  if (!s || s === 'NA' || s === '-1') return '—';
  try { return new Date(s).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }); }
  catch { return s; }
};

// ─── Account Helpers ──────────────────────────────────────────────────────────

export const isActive = (acc) => {
  const d = acc.dateClosed;
  return !d || d === 'NA' || d === '-1';
};

export const getBalance   = (acc) => { const v = parseFloat(String(acc.currentBalance));   return isNaN(v) || v < 0 ? 0 : v; };
export const getEMI       = (acc) => { const v = parseFloat(String(acc.emiAmount));         return isNaN(v) || v < 0 ? 0 : v; };
export const getHighCredit= (acc) => { const v = parseFloat(String(acc.highCreditAmount));  return isNaN(v) || v < 0 ? 0 : v; };
export const getOverdue   = (acc) => { const v = parseFloat(String(acc.amountOverdue));     return isNaN(v) || v < 0 ? 0 : v; };

// ─── Payment History ──────────────────────────────────────────────────────────

export const parseDotStatus = (status) => {
  const s = String(status).trim().toUpperCase();
  if (s === '0') return 'ok';
  if (s === 'STD') return 'std';
  if (s === 'SMA') return 'sma';
  if (s === 'XXX') return 'xxx';
  if (/^[1-9]/.test(s) || ['SUB','DBT','LSS'].includes(s)) return 'bad';
  return 'unknown';
};

export const parsePaymentHistory = (acc) => {
  const hist = acc.paymentHistory;
  if (!hist || hist === '-1') {
    return (acc.monthlyPayStatus || []).map(p => parseDotStatus(p.status));
  }
  const result = [];
  const patterns = ['STD','SMA','DBT','LSS','SUB','XXX'];
  let i = 0;
  while (i < hist.length) {
    let matched = false;
    for (const p of patterns) {
      if (hist.substr(i, p.length) === p) { result.push(parseDotStatus(p)); i += p.length; matched = true; break; }
    }
    if (!matched) { result.push(parseDotStatus(hist[i])); i++; }
  }
  return result;
};

// ─── Score Info ───────────────────────────────────────────────────────────────

export const getScoreInfo = (score) => {
  if (score >= 800) return { color: 'teal',   verdict: 'Excellent',  grade: 'A+' };
  if (score >= 750) return { color: 'green',  verdict: 'Very Good',  grade: 'A'  };
  if (score >= 700) return { color: 'blue',   verdict: 'Good',       grade: 'B+' };
  if (score >= 650) return { color: 'yellow', verdict: 'Fair',       grade: 'B'  };
  if (score >= 550) return { color: 'orange', verdict: 'Poor',       grade: 'C'  };
  return              { color: 'red',    verdict: 'Very Poor',  grade: 'D'  };
};

// ─── LOS Computation ──────────────────────────────────────────────────────────

export const computeLOS = (score, accounts = [], enquiries = []) => {
  const active = accounts.filter(isActive);
  const totalBal = active.reduce((s, a) => s + getBalance(a), 0);
  const totalEMI = active.reduce((s, a) => s + getEMI(a), 0);

  let hasDefault = false, hasSMA = false, hasWriteoff = false, hasSuit = false;
  let cleanM = 0, totalM = 0;

  accounts.forEach(a => {
    if (parseFloat(String(a.woAmountTotal)) > 0) hasWriteoff = true;
    if (parseFloat(String(a.settlementAmount)) > 0) hasWriteoff = true;
    if (a.suitFiledWillfulDefaultWrittenOff?.trim()) hasSuit = true;
    parsePaymentHistory(a).forEach(d => {
      totalM++;
      if (d === 'ok' || d === 'std') cleanM++;
      if (d === 'bad') hasDefault = true;
      if (d === 'sma') hasSMA = true;
    });
  });

  const payOnTimeRate = totalM > 0 ? (cleanM / totalM) * 100 : 100;
  const now = Date.now();
  const daysSince = (e) => Math.round((now - new Date(e.enquiryDate).getTime()) / 86400000);
  const recentEnquiries   = enquiries.filter(e => daysSince(e) <= 365);
  const hardEnquiries12m  = recentEnquiries.filter(e => String(e.enquiryPurpose) === '02');

  const levWarn = totalBal > 5_000_000;
  const levHigh = totalBal > 15_000_000;
  const enqWarn = hardEnquiries12m.length >= 3;
  const enqHigh = hardEnquiries12m.length >= 5;

  const pillarScore = score >= 700 ? 'PASS' : score >= 600 ? 'REVIEW' : 'FAIL';
  const pillarPay   = hasDefault ? 'FAIL' : hasSMA ? 'REVIEW' : 'PASS';
  const pillarLev   = levHigh ? 'FAIL' : levWarn ? 'REVIEW' : 'PASS';
  const pillarEnq   = enqHigh ? 'FAIL' : enqWarn ? 'REVIEW' : 'PASS';

  let decision, riskLevel;
  if (hasDefault || hasSuit || hasWriteoff || score < 600)      { decision = 'Decline / Refer';        riskLevel = 'high';   }
  else if (score < 700 || hasSMA || levHigh || enqHigh)         { decision = 'Manual Review';           riskLevel = 'medium'; }
  else if (levWarn || enqWarn)                                   { decision = 'Conditional Approval';    riskLevel = 'medium'; }
  else                                                           { decision = 'Recommended Approval';    riskLevel = 'low';    }

  const positives = [], warnings = [];
  if (score >= 750) positives.push(`CIBIL Score ${score} — ${getScoreInfo(score).verdict}`);
  else warnings.push(`CIBIL Score ${score} — Below preferred threshold (750+)`);
  if (!hasDefault) positives.push('Zero DPD across all accounts');
  else warnings.push('Delinquency / DPD found in payment history');
  if (!hasWriteoff) positives.push('No write-offs or settlements');
  else warnings.push('Write-off or settlement present');
  if (!hasSuit) positives.push('No suits filed or willful defaults');
  else warnings.push('Suit / willful default on record');
  if (!hasSMA) positives.push('No SMA history');
  else warnings.push('SMA (Special Mention) history detected');
  const closedCount = accounts.filter(a => !isActive(a)).length;
  if (closedCount > 3) positives.push(`${closedCount} accounts successfully closed`);
  if (totalBal > 15_000_000) warnings.push(`Very high active balance: ${fmtAmount(totalBal)}`);
  else if (totalBal > 5_000_000) warnings.push(`High active balance: ${fmtAmount(totalBal)} — verify income`);
  else if (totalBal > 0) positives.push(`Manageable active balance: ${fmtAmount(totalBal)}`);
  if (totalEMI > 150_000) warnings.push(`High monthly EMI: ${fmtAmount(totalEMI)} — check FOIR`);
  if (hardEnquiries12m.length >= 3) warnings.push(`${hardEnquiries12m.length} hard enquiries in last 12 months`);
  else if (hardEnquiries12m.length > 0) positives.push(`${hardEnquiries12m.length} hard enquiry(ies) — acceptable`);
  const oldest = [...accounts].filter(a => a.dateOpened).sort((a, b) => new Date(a.dateOpened).getTime() - new Date(b.dateOpened).getTime())[0];
  if (oldest) {
    const yrs = ((now - new Date(oldest.dateOpened).getTime()) / (1000*60*60*24*365));
    if (yrs >= 5) positives.push(`${yrs.toFixed(1)} years of credit history`);
    else warnings.push(`Only ${yrs.toFixed(1)} years of credit history`);
  }

  return {
    score, totalBal, totalEMI, hasDefault, hasSMA, hasWriteoff, hasSuit,
    recentEnquiries, hardEnquiries12m, levWarn, levHigh, enqWarn, enqHigh,
    pillarScore, pillarPay, pillarLev, pillarEnq,
    decision, riskLevel, payOnTimeRate, totalMonths: totalM,
    positives, warnings, activeAccounts: active,
  };
};

export const safeStr = (v, fallback = '') => {
  if (v == null) return fallback;
  if (typeof v === 'string') return v;
  if (typeof v === 'number') return String(v);
  if (typeof v === 'object') return v.description || v.code || fallback;
  return fallback;
};

export const lower = (v) => safeStr(v).toLowerCase();
export const upper = (v) => safeStr(v, '—').toUpperCase();

// ─── Lookup Maps ──────────────────────────────────────────────────────────────

export const REASON_CODE_MAP = {
  '39': 'Proportion of balance to high credit on revolving accounts is too high',
  '38': 'Serious delinquency, derogatory public record or collection filed',
  '37': 'Amount owed on delinquent accounts',
  '36': 'Length of time accounts have been established',
  '35': 'Amount past due on accounts',
  '34': 'Amount owed on revolving accounts is too high',
  '33': 'Proportion of loan balances to amounts is too high',
  '32': 'Lack of recent installment loan information',
  '31': 'Too many accounts with balances',
  '30': 'Proportion of delinquent accounts',
  '29': 'Number of recent inquiries',
  '28': 'Number of established accounts',
  '27': 'Too many open accounts',
  '26': 'Too many inquiries last 12 months',
  '25': 'Length of time revolving accounts established',
  '24': 'No recent revolving balances',
  '23': 'Too many bank or national revolving accounts',
  '22': 'Too many consumer finance company accounts',
  '21': 'Amount owed on accounts is too high',
  '20': 'Length of time since derogatory public record is too short',
  '19': 'Frequency of delinquency',
  '18': 'Number of accounts with delinquency',
  '00': 'No adverse factor — positive',
};

export const ADDRESS_CAT = {
  '01': 'Residential', '02': 'Residential (Owned)',
  '03': 'Office / Work', '04': 'Office / Work',
  '05': 'Temporary', '06': 'Others',
};

export const ENQUIRY_PURPOSE = {
  '01': 'Auto Loan', '02': 'Home / Property Loan',
  '03': 'Personal Loan', '04': 'Credit Card',
  '05': 'Business Loan', '06': 'Education Loan',
  '07': 'OD / CC Facility', '10': 'Credit Card Issuance',
  '11': 'Account Review',
};

export const OCCUPATION = {
  '01': 'Salaried', '02': 'Self-Employed Professional',
  '03': 'Self-Employed Business', '04': 'Agricultural',
  '05': 'Retired', '06': 'Student', '07': 'Homemaker',
  '08': 'Unemployed', '09': 'Others',
};

export const PHONE_TYPE = { '00': 'Telephone', '01': 'Mobile', '02': 'Office' };