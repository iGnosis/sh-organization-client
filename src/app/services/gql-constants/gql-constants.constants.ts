export const GqlConstants = {
  GET_ALL_PATIENTS: `
query PatientList($startDate: timestamptz!, $endDate: timestamptz!) {
  patient {
    id
    createdAt
    nickname
    firstName
    identifier
    games(order_by: {createdAt: desc}, where: {endedAt: {_is_null: false, _lte: $endDate}, createdAt: {_gte: $startDate}}) {
      createdAt
      game
    }
    subscriptionBySubscription {
      status
    }
  }
}`,
  GET_PATIENT_CAREPLANS: `query GetPatientCarePlans($patientId: uuid!) {
    patient_by_pk(id: $patientId) {
      createdAt
      patient_careplans {
        careplanByCareplan {
          name
          id
        }
      }
    }
  }`,

  INSERT_PATIENT: `mutation InsertPatient($identifier:String, $medicalConditions:jsonb, $email:String, $careGiverEmail: String, $phoneNumber: String, $careGiverPhoneNumber: String) {
    insert_patient_one(object: {
      identifier: $identifier,
      medicalConditions: $medicalConditions,
      email: $email,
      careGiverEmail: $careGiverEmail,
      phoneNumber: $phoneNumber,
      careGiverPhoneNumber:$careGiverPhoneNumber
    }) {
        id
    }
  }`,
  GET_GAMES: `query GetGames($patientId: uuid) {
    game(order_by: {createdAt: desc}, where: {patient: {_eq: $patientId}, endedAt: {_is_null: false}}) {
      id
      game
      createdAt
      endedAt
      totalDuration
    }
    aggregate_analytics(where: {patient: {_eq: $patientId}, key: {_eq: "avgAchievementRatio"}}, order_by: {createdAt: desc}) {
      game
      createdAt
      organizationId
      patient
      key
      value
      noOfSamples
    }
  }`,
  GET_GAME_BY_PK: `query GetGameByPK($gameId: uuid!) {
    game_by_pk(id: $gameId) {
      game
      endedAt
      createdAt
      id
      patient
      patientByPatient {
        identifier
        nickname
        firstName
        lastName
      }
      repsCompleted
      totalDuration
      calibrationDuration
      analytics
    }
  }`,
  GET_PATIENT_CHARTS: `
  query PatientChart($startDate: String!, $endDate: String!, $userTimezone: String!, $patientId: ID!, $chartType: ChartTypeEnum!, $groupBy: GroupByEnum!, $isGroupByGames: Boolean = true) {
    patientChart(startDate: $startDate, endDate: $endDate, userTimezone: $userTimezone, patientId: $patientId, chartType: $chartType, groupBy: $groupBy, isGroupByGames: $isGroupByGames) {
      data
    }
  }`,
  GET_PATIENT_MONTHLY_COMPLETION: `
  query PatientMonthlyCompletion($startDate: String!, $userTimezone: String!, $sortDirection: SortDirectionEnum!, $sortBy: SortByEnum!, $showInactive: Boolean!, $offset: String!, $limit: String!, $endDate: String!) {
    patientMonthlyCompletion(endDate: $endDate, limit: $limit, offset: $offset, showInactive: $showInactive, sortBy: $sortBy, sortDirection: $sortDirection, startDate: $startDate, userTimezone: $userTimezone) {
      data
    }
  }`,
  GET_PATIENT_ADHERENCE_CHART: `
  query PatientAdherenceChart($startDate: String!, $endDate: String!, $groupBy: GroupByEnum!) {
    patientAdherenceChart(startDate: $startDate, endDate: $endDate, groupBy: $groupBy) {
      data {
        activePatientsCount
        totalNumOfPatients
      }
    }
  }`,
  GET_PATIENT_OVERVIEW_CHART: `
  query PatientOverviewChart($startDate: String!, $endDate: String!) {
    patientOverviewChart(startDate: $startDate, endDate: $endDate) {
      data {
        patient
        nickname
        gamesPlayedCount
        engagementRatio
        avgAchievementPercentage
      }
    }
  }`,
  GET_PATIENT_MOOD: `query FetchPatientMood($patientId: uuid!, $startDate: timestamptz!, $endDate: timestamptz!) {
    checkin(where: {type: {_eq: mood}, patient: {_eq: $patientId}, createdAt: {_gte: $startDate, _lte: $endDate}}, order_by: {createdAt: asc}) {
      createdAt
      mood: value
    }
  }`,
  GET_LATEST_GAMES: `
  query LatestGames($offset: Int!, $limit: Int!) {
    game(order_by: {createdAt: desc}, offset: $offset, limit: $limit, where: {endedAt: {_is_null: false}}) {
      id
      game
      createdAt
      patientByPatient {
        id
        nickname
        firstName
        lastName
      }
    }
  }
  `,
  GET_ACTIVE_PLANS: `query GetPatientCarePlan($patient: uuid) {
    patient(where: {id: {_eq: $patient}}) {
      id
      patient_careplans {
        careplanByCareplan {
          name
          id
          estimatedDuration
          careplan_activities_aggregate {
            aggregate {
              count
            }
          }
        }
      }
    }
  }
`,
  GET_PATIENT_ACTIVEPLANS: `query GetPatientCarePlans($patientId: uuid) {
  patient(where: {id: {_eq: $patientId}}) {
    patient_careplans {
      careplanByCareplan {
        name
        id
      }
    }
  }
  careplan {
    name
    id
  }
}
`,

  CREATE_SESSION: `mutation StartSession($careplan: uuid!, $patient: uuid!) {
    insert_session_one(object: {careplan: $careplan, patient: $patient}) {
      id
      createdAt
      updatedAt
      careplan
      patient
    }
  }`,

  GET_PATIENT_IDENTIFIER: `query GetPatientIdentifier($patientId: uuid) {
    patient(where: {id: {_eq: $patientId}}) {
      nickname
    }
  }`,
  GETCAREPLANDETAILS: `query GetCarePlanDetails($careplan: uuid = "40f81454-c97d-42bc-b20f-829cc3d2728e") {
    careplan(where: {id: {_eq: $careplan}}) {
      name
      id
      careplan_activities {
        activityByActivity {
          name
          duration
          id
        }
        reps
      }
      patient_careplans {
        patientByPatient {
          id
          identifier
          medicalConditions
          updatedAt
        }
      }
    }
  }
  `,
  POST_SESSION_ADDED_DATA: `
  mutation AssignCareplan($patient: uuid, $careplan: uuid) {
    insert_patient_careplan(objects: {patient: $patient, careplan: $careplan}) {
      returning {
        careplan
      }
    }
  }
  `,
  DELETE_PATIENT_CAREPLAN: `
  mutation DeleteCareplan($patient: uuid, $careplan: uuid) {
    delete_patient_careplan(where: {careplan: {_eq: $careplan}, patient: {_eq: $patient}}) {
      affected_rows
    }
  }`,
  ADD_PATIENT_IN_CAREPLAN: `
  query GetCarePlanDetails($careplan: uuid) {
    patient {
      identifier
      id
      patient_careplans(where: {careplan: {_neq: $careplan}}) {
        careplan
        patient
      }
    }
  }
  `,
  REQUEST_LOGIN_OTP: `mutation RequestLoginOtp($phoneCountryCode: String!, $phoneNumber: String!, $inviteCode: String = "") {
    requestLoginOtp(phoneCountryCode: $phoneCountryCode, phoneNumber: $phoneNumber, inviteCode: $inviteCode) {
      data {
        message
      }
    }
  }`,
  RESEND_LOGIN_OTP: `mutation ResendLoginOtp($phoneCountryCode: String!, $phoneNumber: String!) {
    resendLoginOtp(phoneCountryCode: $phoneCountryCode, phoneNumber: $phoneNumber) {
      data {
        message
      }
    }
  }`,
  VERIFY_LOGIN_OTP: `mutation VerifyLoginOtp($phoneCountryCode: String!, $phoneNumber: String!, $otp: Int!) {
    verifyLoginOtp(phoneCountryCode: $phoneCountryCode, phoneNumber: $phoneNumber, otp: $otp) {
      data {
        token
      }
    }
  }`,
  MOCK_LOGIN: `query MockLogin($userRole: StaffType!) {
    mockStaffJwt(userRole: $userRole) {
      data {
        jwt
      }
    }
  }`,
  GAME_ACHIEVEMENT_CHART: `query GameAchievementRatio($gameId: ID!) {
  gameAchievementRatio(gameId: $gameId) {
    data {
      labels
      data
    }
  }
}`,
  GET_ORGANIZATION_CONFIG: `
  query OrganizationConfig {
    organization {
      configuration
      logoUrl
    }
  }`,
  EDIT_ORGANIZATION_DETAILS: `
  mutation EditOrganizationDetails($name: String!, $type: organization_type_enum = clinic, $adminEmail: String!, $staffId: uuid!, $organizationId: uuid!) {
    update_staff_by_pk(pk_columns: {id: $staffId}, _set: {email: $adminEmail}) {
      id
    }
    update_organization_by_pk(pk_columns: {id: $organizationId}, _set: {name: $name, type: $type}) {
      id
    }
  }
  `,
  UPLOAD_ORGANIZATION_LOGO_URL: `
  mutation UploadOrganizationLogoUrl {
    uploadOrganizationLogo {
      data {
        uploadUrl
        logoAccessUrl
      }
    }
  }
  `,
  // run by guest user
  CREATE_PATIENT: `mutation CreatePatient($firstName: String!, $lastName: String!, $namePrefix: String!, $phoneCountryCode: String!, $phoneNumber: String!, $email: String!, $inviteCode: String!) {
  createPatient(firstName: $firstName, lastName: $lastName, namePrefix: $namePrefix, phoneCountryCode: $phoneCountryCode, phoneNumber: $phoneNumber, email: $email, inviteCode: $inviteCode) {
    data {
      message
    }
  }
}`,

  // run by guest user
  CREATE_STAFF: `mutation CreateStaff($email: String!, $firstName: String!, $inviteCode: String!, $lastName: String!, $phoneCountryCode: String!, $phoneNumber: String!) {
  createStaff(email: $email, firstName: $firstName, inviteCode: $inviteCode, lastName: $lastName, phoneCountryCode: $phoneCountryCode, phoneNumber: $phoneNumber) {
    data {
      message
    }
  }
}`,

  // run as org_admin
  CREATE_NEW_PATIENT: `
  mutation InsertPatient($firstName: String!, $lastName: String!, $namePrefix: String!, $email: String!, $phoneCountryCode: String!, $phoneNumber: String!) {
    insert_patient_one(object: {firstName: $firstName, lastName: $lastName, namePrefix: $namePrefix, email: $email, phoneCountryCode: $phoneCountryCode, phoneNumber: $phoneNumber}) {
      user {
        email
      }
    }
  }
`,
  CREATE_NEW_STAFF: `
    mutation InsertStaff($firstName: String!, $lastName: String!, $type: user_type_enum!, $email: String!, $phoneNumber: String!, $phoneCountryCode: String!) {
  insert_staff_one(object: {firstName: $firstName, lastName: $lastName, status: active, type: $type, email: $email, phoneNumber: $phoneNumber, phoneCountryCode: $phoneCountryCode}) {
    email
  }
}`,

  GET_STAFF: `
  query GetStaff {
    staff(where: {_or: [{type: {_eq: org_admin}}, {type: {_eq: therapist}}]}, order_by: {firstName: asc}) {
        id
        firstName
        lastName
        type
        email
      }
  }`,
  GET_PATIENTS: `
  query GetPatients {
  patient {
    firstName
    lastName
    id
  }
}
`,

  ARCHIVE_PATIENT: `
  mutation ArchivePatient($patientId: uuid!, $status: user_status_enum = archived) {
  update_patient_by_pk(pk_columns: {id: $patientId}, _set: {status: $status}) {
    id
  }
}`,
  ARCHIVE_STAFF: `mutation ArchiveStaff($staffId: uuid!) {
  update_staff_by_pk(pk_columns: {id: $staffId}, _set: {status: archived}) {
    id
  }
}`,

  GET_STFF_BY_PK: `
  query GetStaffByPK($id: uuid!) {
  staff_by_pk(id: $id) {
    email
    firstName
    id
    lastName
    phoneNumber
    phoneCountryCode
    type
  }
}`,

  GET_PATIENT_BY_PK: `
  query GetPatientByPK($id: uuid!) {
  patient_by_pk(id: $id) {
    email
    firstName
    lastName
    namePrefix
    phoneNumber
    phoneCountryCode
  }
}`,

  UPDATE_PATIENT_BY_PK: `
  mutation UpdatePatientByPK($id: uuid!, $email: String!, $firstName: String!, $lastName: String!, $namePrefix: String!, $phoneCountryCode: String!, $phoneNumber: String!) {
  update_patient_by_pk(pk_columns: {id: $id}, _set: {email: $email, firstName: $firstName, lastName: $lastName, namePrefix: $namePrefix, phoneCountryCode: $phoneCountryCode, phoneNumber: $phoneNumber}) {
    firstName
    id
    lastName
    namePrefix
    phoneNumber
    phoneCountryCode
  }
}
`,

  UPDATE_STAFF_BY_PK: `
  mutation UpdateStaffByPK($id: uuid!, $email: String!, $firstName: String!, $lastName: String!, $phoneCountryCode: String!, $phoneNumber: String!, $type: user_type_enum!) {
  update_staff_by_pk(pk_columns: {id: $id}, _set: {email: $email, firstName: $firstName, lastName: $lastName, phoneCountryCode: $phoneCountryCode, phoneNumber: $phoneNumber, type: $type}) {
    email
    firstName
    id
    lastName
    phoneNumber
    phoneCountryCode
    type
  }
}`,
  INVITE_STAFF: `
  query InviteStaff($shouldSendEmail: Boolean = false, $email: String = "", $staffType: StaffType!, $expiryAt: String = "") {
  inviteStaff(shouldSendEmail: $shouldSendEmail, email: $email, staffType: $staffType, expiryAt: $expiryAt) {
    data {
      inviteCode
    }
  }
}
`,
  INVITE_PATIENT: `
  query InvitePatient($email: String = "", $shouldSendEmail: Boolean = false, $expiryAt: String = "") {
  invitePatient(email: $email, shouldSendEmail: $shouldSendEmail, expiryAt: $expiryAt) {
    data {
      inviteCode
    }
  }
}`,

  GET_ORG_CONFIG: `
query GetOrganizationConfig {
  organization {
    configuration
    logoUrl
  }
}
`,
  UPDATE_ORG_CONFIG: `
mutation UpdateCustomizationConfig($id: uuid!, $configuration: jsonb!) {
  update_organization_by_pk(pk_columns: {id: $id}, _append: {configuration: $configuration}) {
    configuration(path: "theme")
  }
}
`,
  GET_SUBCRIPTION_PLAN: `
  query GetSubscriptionPlan($organizationId: uuid!) {
    subscription_plans(where: {organization: {_eq: $organizationId}}) {
      id
      requirePaymentDetails
      subscriptionFee
      trialPeriod
    }
  }`,
  GET_BILLING_HISTORY: `
  query GetBillingHistory($organization: uuid!) {
    billing_history(order_by: {createdAt: desc_nulls_last}, where: {organization: {_eq: $organization}}) {
      createdAt
      id
      revenue
    }
  }`,
  SET_PUBLIC_SIGNUP: `
  mutation SetPublicSignup($id: uuid!, $isPublicSignUpEnabled: Boolean = false) {
    update_organization_by_pk(pk_columns: {id: $id}, _set: {isPublicSignUpEnabled: $isPublicSignUpEnabled}) {
      isPublicSignUpEnabled
    }
  }`,
  GET_PUBLIC_SIGNUP: `
  query GetPublicSignupStatus {
    organization {
      isPublicSignUpEnabled
    }
  }`,
  DASHBOARD_CONVERSION: `query DashboardConversion($startDate: String!, $endDate: String!) {
    newUsers: dashboardConversion(type: new_users, startDate: $startDate, endDate: $endDate) {
      data {
        metric
        newCount
        percentageChange
        showPercentageChange
      }
    }
    activationMilestone: dashboardConversion(type: activation_milestone, startDate: $startDate, endDate: $endDate) {
      data {
        metric
        newCount
        percentageChange
        showPercentageChange
      }
    }
    activationRate: dashboardConversion(type: activation_rate, startDate: $startDate, endDate: $endDate) {
      data {
        metric
        newCount
        percentageChange
        showPercentageChange
      }
    }
  }`,
  DASHBOARD_ENGAGEMENT: `query DashboardEngagement($startDate: String!, $endDate: String!) {
    avgUserEngagement: dashboardEngagement(startDate: $startDate, endDate: $endDate, type: avg_user_engagement) {
      data {
        metric
        newCount
        percentageChange
        showPercentageChange
      }
    }
    avgActivitiesPlayed: dashboardEngagement(startDate: $startDate, endDate: $endDate, type: avg_activities_played) {
      data {
        metric
        newCount
        percentageChange
        showPercentageChange
      }
    }
    adoptionRate: dashboardEngagement(startDate: $startDate, endDate: $endDate, type: adoption_rate) {
      data {
        metric
        newCount
        percentageChange
        showPercentageChange
      }
    }
  }`,
  DASHBOARD_RETENTION: `query DashboardRetention($startDate: String!, $endDate: String!) {
    activeUsers: dashboardRetention(startDate: $startDate, endDate: $endDate, type: active_users) {
      data {
        metric
        newCount
        percentageChange
        showPercentageChange
      }
    }
    totalActiveUsers: dashboardRetention(startDate: $startDate, endDate: $endDate, type: total_users) {
      data {
        metric
        newCount
        percentageChange
        showPercentageChange
      }
    }
  }`,
  DASHBOARD_STICKINESS_METRIC: `query DashboardStickinessMetric($startDate: String!, $endDate: String!) {
    stickiness: dashboardRetention(startDate: $startDate, endDate: $endDate, type: stickiness) {
      data {
        metric
        newCount
        percentageChange
        showPercentageChange
      }
    }
  }`,
  GET_TESTING_VIDEOS: `
  query GetTesterVideos($patientId: uuid!) {
  tester_videos(where: {patient: {_eq: $patientId}}, order_by: {startedAt: desc}) {
    id
    startedAt
    endedAt
  }
}
`,
  VIEW_TESTING_VIDEOS: `
  query ViewTesterRecording($recordingId: String!) {
  viewTesterRecording(recordingId: $recordingId) {
    data {
      configUrl
      videoUrl
    }
  }
}`,
  SUBSCRIPTION_STATUS: `
  query SubscriptionStatus($subscriptionId: String!) {
  subscriptions(where: {subscriptionId: {_eq: $subscriptionId}}) {
    status
  }
}`,
  GET_SUBSCRIPTION_ID: `
  query GetSubscriptionId($patientId: uuid!) {
  patient_by_pk(id: $patientId){
    subscription
  }
}`,
};
