export const rulesList = {
  'dashboard': 'dashboard',
  'users_view': 'users:view',
  'loan_approval': 'loan:approval',
  'dealership_edit': 'dealership:edit',
  'dealer_edit': 'dealer:edit',
  'dealer_credit_edit': 'dealer:credit:edit',
  'dealership_credit_edit': 'dealership:credit:edit',
  'dealer_credit_view': 'dealer:credit:view',
  'dealership_credit_view': 'dealership:credit:view',
  'dealer_view': 'dealer:view',
  'transporter_view': 'transporter:view',
  'region_map': 'region:map',
  'settings_view': 'settings:view',
  'credit_view': 'credit:view',
  'credit_refresh': 'credit:refresh',
  'pdr_view': 'sales:view',
  'financial_view': 'financial:view',
  'upload_statement': 'upload:statement',
  'projection_report': 'projection:report',
  'opportunity_report': 'opportunity:report',
  'applicant_delete': 'applicant:delete',
  'external_view': 'external:view',
  'dealership_view': 'dealership:view',
  'external_lms': 'external:lms',
  'phone_call' : 'phonecall:pdr',
}

export const rulesForUserRoles = {
  CEO: {
    static: [
      rulesList.dashboard,
      rulesList.loan_approval,
      rulesList.dealer_credit_view,
      rulesList.dealership_credit_view,
      rulesList.credit_view,
      rulesList.credit_refresh,
      rulesList.pdr_view,
      rulesList.financial_view,
      rulesList.upload_statement,
      rulesList.projection_report,
      rulesList.external_lms,
      rulesList.opportunity_report
    ]
  },
  CDO: {
    static: [
      rulesList.dashboard,
      rulesList.loan_approval,
      rulesList.dealer_credit_view,
      rulesList.dealership_credit_view,
      rulesList.credit_view,
      rulesList.credit_refresh,
      rulesList.pdr_view,
      rulesList.financial_view,
      rulesList.upload_statement,
      rulesList.projection_report,
      rulesList.external_lms,
      rulesList.opportunity_report
    ]
  },
  CFO: {
    static: [
      rulesList.dashboard,
      rulesList.loan_approval,
      rulesList.dealership_edit,
      rulesList.dealer_edit,
      rulesList.dealer_credit_edit,
      rulesList.dealership_credit_edit,
      rulesList.credit_view,
      rulesList.credit_refresh,
      rulesList.pdr_view,
      rulesList.financial_view,
      rulesList.upload_statement,
      rulesList.projection_report,
      rulesList.external_lms,
      rulesList.opportunity_report
    ]
  },
  CREDIT_HEAD: {
    static: [
      rulesList.dashboard,
      rulesList.dealership_edit,
      rulesList.dealer_edit,
      rulesList.loan_approval,
      rulesList.dealer_credit_view,
      rulesList.dealership_credit_view,
      rulesList.credit_view,
      rulesList.credit_refresh,
      rulesList.pdr_view,
      rulesList.financial_view,
      rulesList.upload_statement,
      rulesList.phone_call,
    ]
  },
  ADMIN: {
    static: [
      rulesList.loan_approval,
      rulesList.dashboard,
      rulesList.dealership_edit,
      rulesList.dealer_edit,
      rulesList.dealer_credit_edit,
      rulesList.dealership_credit_edit,
      rulesList.users_view,
      rulesList.region_map,
      rulesList.settings_view,
      rulesList.credit_view,
      rulesList.credit_refresh,
      rulesList.pdr_view,
      rulesList.financial_view,
      rulesList.upload_statement,
      rulesList.projection_report,
      rulesList.applicant_delete,
      rulesList.external_lms,
      rulesList.phone_call,
      rulesList.opportunity_report,
    ]
  },
  CREDIT_EXEC: {
    static: [
      rulesList.loan_approval,
      rulesList.dashboard,
      rulesList.dealership_edit,
      rulesList.dealer_edit,
      rulesList.dealer_credit_edit,
      rulesList.dealership_credit_edit,
      rulesList.credit_view,
      rulesList.credit_refresh,
      rulesList.pdr_view,
      rulesList.financial_view,
      rulesList.upload_statement,
      rulesList.region_map,
      rulesList.phone_call,
    ]
  },
  OPS_EXEC: {
    static: [
      rulesList.dashboard,
      rulesList.dealer_credit_view,
      rulesList.dealership_credit_view,
      rulesList.credit_view,
      rulesList.credit_refresh,
      rulesList.pdr_view,
      rulesList.financial_view,
      rulesList.upload_statement,
      rulesList.external_lms
    ]
  },
  OPS_MANAGER: {
    static: [
      rulesList.dashboard,
      rulesList.dealer_credit_view,
      rulesList.dealership_credit_view,
      rulesList.credit_view,
      rulesList.credit_refresh,
      rulesList.pdr_view,
      rulesList.financial_view,
      rulesList.upload_statement,
      rulesList.external_lms
    ]
  },
  CREDIT: {
    static: [
      rulesList.dashboard,
      rulesList.dealership_edit,
      rulesList.dealer_edit,
      rulesList.dealer_credit_edit,
      rulesList.dealership_credit_edit,
      rulesList.credit_view,
      rulesList.credit_refresh,
      rulesList.pdr_view,
      rulesList.financial_view,
      rulesList.upload_statement,
      rulesList.region_map,
      rulesList.phone_call,
    ]
  },
  SALES_HEAD_STATE: {
    static: [
      rulesList.dashboard,
      rulesList.dealer_credit_view,
      rulesList.dealership_credit_view,
      rulesList.pdr_view,
      rulesList.dealership_edit,
      rulesList.credit_view,
      rulesList.credit_refresh,
      rulesList.financial_view,
      rulesList.upload_statement,
    ]
  },
  SALES_HEAD_REGIONAL: {
    static: [
      rulesList.dashboard,
      rulesList.dealer_credit_view,
      rulesList.dealership_credit_view,
      rulesList.dealership_edit,
      rulesList.pdr_view,
      rulesList.credit_view,
      rulesList.credit_refresh,
      rulesList.financial_view,
      rulesList.upload_statement,
    ]
  },
  FIELD_OFFICER: {
    static: [
      rulesList.dashboard,
      rulesList.dealership_edit,
      rulesList.dealer_edit,
      rulesList.dealer_credit_view,
      rulesList.dealership_credit_view,
      rulesList.credit_view,
      rulesList.credit_refresh,
      rulesList.pdr_view,
      rulesList.financial_view,
      rulesList.upload_statement,
    ]
  },
  DEALER: {
    static: [
      rulesList.dealer_view,
    ]
  },
  TRANSPORTER: {
    static: [
      rulesList.transporter_view,
    ]
  },
  EXTERNAL: {
    static: [
      rulesList.external_view,
      rulesList.pdr_view,
      rulesList.credit_view,
      rulesList.dealership_view,
      rulesList.financial_view,
      rulesList.dashboard,
    ]
  }
}