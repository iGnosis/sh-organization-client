
export const GqlConstants = {
  SEARCH_USER: `query SignIn($username:String, $password:String) {
    user(where: {_and: {username: {_eq: $username}, password: {_eq: $password}}, role: {_eq: "provider"}}) {
      firstName
      lastName
      password
      role
      username
    }
  }`,
  
  GET_ALL_PATIENTS: `query MyQuery {
    user(where: {role: {_eq: "patient"}}) {
      id
      username
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
      username
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
          username
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
    