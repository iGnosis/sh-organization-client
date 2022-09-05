export const GqlConstants = {
  SEARCH_USER: `query SignIn($email:String, $password:String) {
    user(where: {_and: {email: {_eq: $email}, password: {_eq: $password}}, type: {_eq: provider}}) {
      firstName
      lastName
      password
      email
    }
  }`,

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
      }
      games_aggregate(where: {endedAt: {_is_null: false}}) {
        aggregate {
          count
        }
      }
    }
  }`,

  GET_CAREPLANS: `query GetCarePlans {
    careplan {
      createdAt
      careplan_activities_aggregate {
        aggregate {
          count
        }
      }
      user_careplans_aggregate {
        aggregate {
          count
        }
      }
      name
      createdBy
      id
      tags
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

  GET_PATIENT_DETAILS: `query GetUserDetails($user:uuid!) {
    user_by_pk(id: $user) {
      createdAt
      firstName
      id
      lastActive
      lastName
      sessions {
        id
        createdAt
        endedAt
      }
      status
      sessions_aggregate {
        aggregate {
          count
        }
      }
      subscriptions {
        expiry
      }
      user_profile {
        dob
        gender
        medicalConditions
        onboardedOn
        otherConditions
        phone
        preferredGenre
      }
      userRelationsByTo {
        userFrom {
          firstName
          lastName
          lastActive
          status
          email
          user_profile {
            createdAt
            dob
            gender
            onboardedOn
            phone
          }
        }
      }}}`,

  GET_GAMES: `query GetGames($offset: Int, $limit: Int, $patientId: uuid) {
        game_aggregate(where: {patient: {_eq: $patientId}, endedAt: {_is_null: false}}) {
          aggregate {
            count
          }
        }
        game(order_by: {createdAt: desc}, limit: $limit, offset: $offset, where: {patient: {_eq: $patientId}, endedAt: {_is_null: false}}) {
          id
          game
          createdAt
          endedAt
          totalDuration
        }
      }`,
  GET_PATIENT_CHARTS: `
  query PatientChart($startDate: String!, $endDate: String!, $userTimezone: String!, $patientId: ID!, $chartType: ChartTypeEnum!, $groupBy: GroupByEnum!, $isGroupByGames: Boolean = true) {
    patientChart(startDate: $startDate, endDate: $endDate, userTimezone: $userTimezone, patientId: $patientId, chartType: $chartType, groupBy: $groupBy, isGroupByGames: $isGroupByGames) {
      data
    }
  }`,
  GET_SESSION_BY_PK: `query GetSessionByPk($sessionId: uuid = "") {
    session_by_pk(id: $sessionId) {
      id
      createdAt
      endedAt
      careplanByCareplan {
        name
      }
      patientByPatient {
        identifier
        medicalConditions
      }
    }
  }`,

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
      identifier
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
  REQUEST_LOGIN_OTP: `mutation RequestLoginOtp($phoneCountryCode: String!, $phoneNumber: String!) {
    requestLoginOtp(phoneCountryCode: $phoneCountryCode, phoneNumber: $phoneNumber) {
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
};
