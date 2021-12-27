
export const GqlConstants = {
  SEARCH_USER: `query SignIn($username:String, $password:String) {
    users(where: {_and: {username: {_eq: $username}, password: {_eq: $password}}, role: {_eq: "provider"}}) {
      firstName
      lastName
      password
      role
      username
    }
  }`
} as const
