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
  },
  dealership: {
    edit: 'dealership:edit',
    crimeCheck: 'dealership:crimeCheck'
  },
  dealer: {
    dealerAdd: 'dealer:add',
    dealerEdit: 'dealer:edit',
    dealerCrimeCheck: 'dealer:crimeCheck',
    dealerCreditCheck: 'dealer:creditCheck',
    dealerStatus: 'dealer:status',
    coapplicantAdd: 'coapplicant:add',
    coapplicantEdit: 'coapplicant:edit',
    coapplicantCrimeCheck: 'coapplicant:crimeCheck',
    coapplicantCreditCheck: 'coapplicant:creditCheck',
    coapplicantStatus: 'coapplicant:status',
    guarantorAdd: 'guarantor:add',
    guarantorEdit: 'guarantor:edit',
    guarantorCrimeCheck: 'guarantor:crimeCheck',
    guarantorCreditCheck: 'guarantor:creditCheck',
    guarantorStatus: 'guarantor:status',
    Vkyc: 'vkyc',
  },
  scoreCard: {
    upload: 'scorecard:upload',
  },
  loansList: {
    action: 'loans_list:action',
    statement: 'account_statement',
    applicationStatus: 'application_status',
  },
  personalDiscussion: {
    omcView: 'omc:view',
    omcEdit: 'omc:edit',
    businessView: 'business:view',
    businessEdit: 'business:edit',
    outletView: 'outlet:view',
    outletEdit: 'outlet:edit',
    infrastructureView: 'infrastructure:view',
    infrastructureEdit: 'infrastructure:edit',
    infrastructureAddTanker: 'infrastructure:add_tanker',
    assetView: 'asset:view',
    assetEdit: 'asset:edit',
    assetAdd: 'asset:add',
    assetDelete: 'asset:delete',
    bankView: 'bank:view',
    bankAdd: 'bank:add',
    bankEdit: 'bank:edit',
    bankDelete: 'bank:delete',
    bankVerify: 'bank:verify',
    loanView: 'loan:view',
    loanAdd: 'loan:add',
    loanEdit: 'loan:edit',
    loanDelete: 'loanDelete',
    incomeExpenceView: 'income_expence:view',
    incomeAdd: 'income:add',
    incomeEdit: 'income:edit',
    incomeDelete: 'income:delete',
    expenceAdd: 'expence:add',
    expenceEdit: 'expence:edit',
    expenceDelete: 'expence:delete',
    thirdPartyView: 'third_party:view',
    referenceAdd: 'reference:add',
    referenceEdit: 'referenceEdit',
    referenceDelete: 'referenceDelete',
    otherView: 'other:view',
    bunkAdd: 'bunk:add',
    bunkEdit: 'bunk:edit',
    bunkDelete: 'bunk:delete',
    creditPdView: 'credit_pd:view',
    creditPdEdit: 'credit_pd:edit',
    callLogView: 'call_log:view',
    callInitiate: 'call:initiate',
    callLogDelete: 'call_log:delete'
  },
  docChecklist: {
    upload: 'doc:upload',
    edit: 'doc_name:edit',
    delete: 'doc:delete',
  },
  transporters: {
    addOwner: 'owner:add',
    editOwner: 'owner:edit',
    addTransport: 'transport:add',
    editTransport: 'transport:edit',
  },
  fleetOperator: {
    add: 'operator:add',
    edit: 'operator:edit'
  }
}