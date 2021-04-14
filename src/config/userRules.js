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
  "dealer_view":"dealer:view",
  "region_map": "region:map",
}

export const rulesForUserRoles = {
  CEO: {
    static: [
      rulesList.dashboard,
      rulesList.loan_approval,
      rulesList.dealer_credit_view,
      rulesList.dealership_credit_view,
    ]
  },
  CREDIT_HEAD: {
    static: [
      rulesList.dashboard,
      rulesList.loan_approval,
      rulesList.dealer_credit_view,
      rulesList.dealership_credit_view,
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
    ]
  },
  CFO: {
    static: [
      rulesList.loan_approval,
      rulesList.dashboard,
      rulesList.dealership_edit,
      rulesList.dealer_edit,
      rulesList.dealer_credit_edit,
      rulesList.dealership_credit_edit,
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
    ]
  },
  CREDIT: {
    static: [
      rulesList.dashboard,
      rulesList.dealership_edit,
      rulesList.dealer_edit,
      rulesList.dealer_credit_edit,
      rulesList.dealership_credit_edit,
    ]
  },
  DEALER: {
    static:[
      rulesList.dealer_view,
    ]
  }
}