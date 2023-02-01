import { Environment } from "src/app/pointmotion";

export const environment: Environment = {
  organizationName: 'pointmotion',
  production: false,
  name: 'dev',
  gqlEndpoint: 'https://api.dev.pointmotioncontrol.com/v1/graphql',
  servicesEndpoint: 'https://services.dev.pointmotioncontrol.com',
  activityEndpoint: 'https://session.dev.pointmotioncontrol.com'
};
