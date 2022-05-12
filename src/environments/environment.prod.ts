import { Environment } from "src/app/pointmotion";

export const environment: Environment = {
  name: 'prod',
  production: true,
  gqlEndpoint: 'https://api.dev.pointmotioncontrol.com/v1/graphql',
  servicesEndpoint: 'https://services.dev.pointmotioncontrol.com',
  activityEndpoint: 'https://session.dev.pointmotioncontrol.com'
};
