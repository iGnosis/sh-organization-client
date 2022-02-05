
export const GqlConstants = {
  SEARCH_USER: `query SignIn($email:String, $password:String) {
    user(where: {_and: {email: {_eq: $email}, password: {_eq: $password}}, type: {_eq: provider}}) {
      firstName
      lastName
      password
      email
    }
  }`,
  
  GET_ALL_PATIENTS: `query MyQuery {
    user(where: {type: {_eq: patient}}) {
      id
      email
      user_profile {
        dob
        gender
      }
      type
      status
      firstName
      lastName
      lastActive
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
      }}}`
      
      
    } as const
    