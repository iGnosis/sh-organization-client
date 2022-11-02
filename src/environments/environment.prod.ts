import { Environment } from "src/app/pointmotion";

export const environment: Environment = {
  name: 'prod',
  production: true,
  gqlEndpoint: 'https://api.prod.pointmotioncontrol.com/v1/graphql',
  servicesEndpoint: 'https://services.prod.pointmotioncontrol.com',
  activityEndpoint: 'https://session.prod.pointmotioncontrol.com'
};
