import { Environment } from "src/app/pointmotion";

export const environment: Environment = {
  organizationName: 'imnf',
  production: true,
  name: 'prod',
  gqlEndpoint: 'https://api.prod.pointmotioncontrol.com/v1/graphql',
  servicesEndpoint: 'https://services.prod.pointmotioncontrol.com',
  activityEndpoint: 'https://session.imnf.pointmotioncontrol.com'
};
