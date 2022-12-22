export const GqlConstants = {
  GET_ALL_PATIENTS: `query PatientList {
    patient_aggregate(where: {nickname: {_is_null: false}}) {
      aggregate {
        count
      }
    }
    patient(where: {nickname: {_is_null: false}}) {
      id
      createdAt
      nickname
      preferredGenres
      games(order_by: {createdAt: desc}, limit: 1, where: {endedAt: {_is_null: false}}) {
        createdAt
        game
      }
      games_aggregate {
        aggregate {
          sum {
            totalDuration
          }
        }
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
  }`,
  GET_GAME_BY_PK: `query GetGameByPK($gameId: uuid!) {
    game_by_pk(id: $gameId) {
      game
      endedAt
      createdAt
      id
      patient
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
    email
  }
}
`,
  CREATE_NEW_STAFF: `
    mutation InsertStaff($firstName: String!, $lastName: String!, $type: user_type_enum!, $email: String!, $phoneNumber: String!, $phoneCountryCode: String!) {
  insert_staff_one(object: {firstName: $firstName, lastName: $lastName, status: invited, type: $type, email: $email, phoneNumber: $phoneNumber, phoneCountryCode: $phoneCountryCode}) {
    email
  }
}`,

  GET_STAFF: `
  query GetStaff {
  staff(where: {_or: [{type: {_eq: org_admin}}, {type: {_eq: therapist}}]}) {
    id
    firstName
    lastName
    type
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
};
