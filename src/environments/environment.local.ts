import { Environment } from "src/app/pointmotion";

export const environment: Environment = {
  production: true,
  name: 'local',
  gqlEndpoint: 'https://api.dev.pointmotioncontrol.com/v1/graphql',
  servicesEndpoint: 'https://services.dev.pointmotioncontrol.com',
  // activityEndpoint: 'https://session.dev.pointmotioncontrol.com'
  activityEndpoint: 'http://localhost:4201'
};
