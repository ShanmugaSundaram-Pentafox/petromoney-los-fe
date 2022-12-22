export const resources_id = {
  navigation: 'navigation',
  dashboard: 'dashboard',
  creditReload: 'credit_reload',
  withheld: 'withheld',
  renewal: 'renewal',
  transports: 'transports',
  transportPassbook: 'transports_passbook',
  collectionRemark: 'collection_remark',
  nocLetter: 'noc',
  settings: 'settings',
  callRequest: 'call_request',
  users: 'users',
  preSubmit: 'pre_submit',
  exception: 'exception',
  report: 'report',
  dealershipNavigation: 'dealership_navigation',
  dealership: 'dealership',
  dealer: 'dealer',
  scoreCard: 'score_card',
  loansList: 'loans_list',
  personalDiscussion: 'personal_discussion',
  docChecklist: 'doc_checklist',
  transporters: 'transporters',
  fleetOperator: 'fleet_operator'
}

export const action_id = {
  navigation: {

  },
  creditReload: {
    create: 'request:create',
    decline: 'request:decline',
    disburse: 'request:disburse',
  },
  withheld: {
    create: 'request:create',
    resolve: 'request:resolve',
    delete: 'request:delete',
  },
  renewal: {
    sanctionLetter: 'sanction_letter',
    loanAgreement: 'loan_agreement',
    esignApplication: 'esign_application'
  },
  transportPassbook: {
    upload: 'upload_statement',
    download: 'download_statement',
    share: 'share_statement'
  },
  nocLetter: {
    raiseRequest: 'noc:request'
  },
  dealershipNavigation: {
    dealership: 'dealership',
    dealers: 'dealers',
    scoreCard: 'score_card',
    loansList: 'loans_list',
    personalDiscussion: 'personal_discussion',
    docChecklist: 'document_checklist',
    transporters: 'transporters',
    fleetOperator: 'fleet_operator'
  }
}