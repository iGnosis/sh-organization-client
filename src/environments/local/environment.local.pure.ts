import { Environment } from 'src/app/pointmotion';

export const environment: Environment = {
  organizationName: 'pointmotion',
  production: false,
  name: 'local',
  gqlEndpoint: 'http://localhost:8080/v1/graphql',
  servicesEndpoint: 'http://localhost:9000',
  websocketEndpoint: 'ws://localhost:9000',
  activityEndpoint: 'http://localhost:4201'
};
