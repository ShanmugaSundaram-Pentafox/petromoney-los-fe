export const rulesList = {
  "dashboard": "dashboard",
  "users_view": "users:view",
  "loan_approval": "loan:approval",
  "dealership_edit": "dealership:edit",
  "dealer_edit": "dealer:edit",
  "dealer_credit_edit": "dealer:credit:edit",
  "dealership_credit_edit": "dealership:credit:edit",
  "dealer_credit_view": "dealer:credit:view",
  "dealership_credit_view": "dealership:credit:view",
  "dealer_view": "dealer:view",
  "transporter_view": "transporter:view",
  "region_map": "region:map",
  "settings_view": "settings:view",
  "credit_view": "credit:view",
  "pdr_view": "sales:view",
}

export const rulesForUserRoles = {
  CEO: {
    static: [
      rulesList.dashboard,
      rulesList.loan_approval,
      rulesList.dealer_credit_view,
      rulesList.dealership_credit_view,
      rulesList.credit_view,
      rulesList.pdr_view,
    ]
  },
  CDO: {
    static: [
      rulesList.dashboard,
      rulesList.loan_approval,
      rulesList.dealer_credit_view,
      rulesList.dealership_credit_view,
      rulesList.credit_view,
      rulesList.pdr_view,
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
      rulesList.pdr_view,
    ]
  },
  CREDIT_HEAD: {
    static: [
      rulesList.dashboard,
      rulesList.loan_approval,
      rulesList.dealer_credit_view,
      rulesList.dealership_credit_view,
      rulesList.credit_view,
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
      rulesList.pdr_view,
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
    ]
  },
  OPS_EXEC: {
    static: [
      rulesList.dashboard,
      rulesList.dealer_credit_view,
      rulesList.dealership_credit_view,
      rulesList.credit_view,
      rulesList.pdr_view,
    ]
  },
  OPS_MANAGER: {
    static: [
      rulesList.dashboard,
      rulesList.dealer_credit_view,
      rulesList.dealership_credit_view,
      rulesList.credit_view,
      rulesList.pdr_view,
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
    ]
  },
  SALES_HEAD_STATE: {
    static: [
      rulesList.dashboard,
      rulesList.dealer_credit_view,
      rulesList.dealership_credit_view,
      rulesList.pdr_view,
    ]
  },
  SALES_HEAD_REGIONAL: {
    static: [
      rulesList.dashboard,
      rulesList.dealer_credit_view,
      rulesList.dealership_credit_view,
      rulesList.pdr_view,
    ]
  },
  FIELD_OFFICER: {
    static: [
      rulesList.dashboard,
      rulesList.dealer_credit_view,
      rulesList.dealership_credit_view,
      rulesList.credit_view,
      rulesList.pdr_view,
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
  }
}