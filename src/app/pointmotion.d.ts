import { UserRole } from './users.enum';

export class Activity {
  id?: string;
  createdAt?: number; // unix epoch time in milliseconds
  updatedAt?: number; // unix epoch time in milliseconds
  name?: string;
  prompt?: string;
  details?: any;
  duration?: number; // duration in seconds
  durationInStr?: string; // duration in human friendly string
  reps?: number;
  correctMotions?: number;
  reactionTime?: number; // time in milliseconds
  achievementRatio?: number; // avg. achievement ratio (0 to 100%) of all the reps.
  difficulty?: ActivityDifficulty;
  selected?: boolean;
  events?: Array<ActivityEvent>;
}
export class ActivityEvent {
  activityName?: string;
  createdAt?: number; // unix epoch in milliseconds
  reactionTime?: number;
  score?: number;
  taskName?: string;
}

export enum ActivityDifficulty {
  easy = 'Easy',
  medium = 'Moderate',
  difficult = 'Hard',
}

export class CarePlan {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  name?: string;
  details?: any;
  provider?: string;
  tags?: any; // TODO have types for the "any" JSONB as well?
  createdBy?: Therapist;
  estimatedDuration?: number;
  medicalConditions?: Array<string>;
  difficultyLevel?: CarePlanDifficulty;
  description?: string;
  careplan_activities?: Array<ActivityByActivity>;
  careplan_activities_aggregate?: any;
  user_careplans_aggregate?: any;
  selected?: boolean;
}

export type ActivityByActivity = {
  activityByActivity?: Activity;
  reps?: number;
};

export enum CarePlanDifficulty {
  easy = 'Easy',
  moderate = 'Moderate',
  hard = 'Hard',
}

export class Patient {
  id?: string;
  identifier?: string;
  medicalConditions: any;
  preferredGenres: any;
  createdAt?: Date;
  updatedAt?: Date;
  onboardedBy?: Therapist;
  primaryTherapist?: Therapist;
  sessions?: Array<Session>;
  sessions_aggregate: any;
  primaryTherapistUser?: Therapist;
  games?: { [key: string]: any }[];
}
export class User {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  lastActive: Date;
  firstName: string;
  lastName: string;
  type: UserRole;
  status: string;
  phoneCountryCode: string;
  phoneNumber: string;
  orgId: string;
}
declare class PatientFrom {
  userFrom?: Patient;
  userTo?: Patient;
}

export class Profile {
  dob?: string;
  gender?: string;
  preferredGenre?: string;
  onboardedOn?: Date;
  updatedAt?: Date;
  createdAt?: Date;
  lastActive?: Date;
  phone?: string;
  medicalConditions?: object;
  otherConditions?: object;
}

export class Game {
  id: string;
  createdAt: Date;
  endedAt: Date;
  updatedAt: Date;
  game: string;
  repsCompleted: number;
  totalDuration: number;
  analytics: number;
  patient: string;
  calibrationDuration: number;
  aggregateAnalytics: number;
}

export class Session {
  id?: string;
  createdAt?: Date;
  endedAt?: Date;
  updatedAt?: Date;
  activityType?: string;
  timeDuration?: string;
  totalPerformanceRatio?: number;
  avgReactionTime?: number;
  patientByPatient?: {
    identifier?: string;
  };
  careplanByCareplan?: {
    name?: string;
  };
  sessionAnalytics: any; // Fix this later...
}

export class Therapist {
  id?: string;
  username?: string;
  role?: string;
  createdAt?: Date;
  updatedAt?: Date;
  lastActive?: Date;
  firstName?: string;
  lastName?: string;
  type?: string;
  status?: string;
}

export class IChart {
  activity?: string;
  activity_name?: string;
  attempt_id?: string;
  created_at?: string;
  reaction_time?: string;
  score?: number;
  session?: string;
  task_id?: string;
  task_name?: string;
}

export class SessionData {
  [key: string]: Session;
}

// class Session {
//     [key: string]: Activity
// }

// class Activity {
//     events?: Array<Event>
// }

declare class Event {
  activityName?: string;
  taskName?: string;
  reactionTime?: string;
  createdAt?: string;
  score?: number;
}

export class AchievementRatio {
  sessionId?: string;
  createdAt?: Date;
  careplanName?: string;
  avgAchievement?: number;
}

export class EngagementRatio {
  sessionId?: string;
  sessionCreatedAt?: Date;
  careplanId?: string;
  careplanName?: string;
  totalRepsCount?: number;
  totalTasksCount?: number;
  engagementRatio?: number;
}

export type Environment = {
  organizationName: string;
  name: string;
  production: boolean;
  gqlEndpoint: string;
  servicesEndpoint: string;
  activityEndpoint: string;
  websocketEndpoint: string;
};

export type OrganizationType = 'hospital' | 'clinic' | 'seniorHomeFacility';
export type BrandColorType =
  | 'primary'
  | 'secondary'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger';

export type TypeFace = 'Abel' | 'Inter' | 'Roboto' | 'Open Sans';
export type Tabs = 'Customization' | 'Billing' | 'Users and Access';

// export type Tabs = {
//   feature: string;
//   name: 'Customization' | 'Billing' | 'Users and Access';
// }

export interface Theme {
  colors?: {
    [key: string]: any;
  };
  font?: {
    family: string;
    url: string;
  };
  logoUrl?: string;
}

export class JwtToken {
  id: string;
  iat: number;
  exp: number;
  'https://hasura.io/jwt/claims': {
    'x-hasura-allowed-roles': UserRole[];
    'x-hasura-default-role': UserRole;
    'x-hasura-user-id': string;
    'x-hasura-organization-id': string;
  };
}

interface Rule {
  title: string;
  description: string;
  key: string;
  access: UserRole[];
}

interface RouteRule {
  title: string;
  description: string;
  path: string;
  rules: Rule[];
}

interface UiRbac {
  navigationBar: Rule[];
  routes: RouteRule[];
}

interface HasuraRbac {
  select_permissions: string[];
  insert_permissions: string[];
  update_permissions: string[];
  delete_permissions: boolean;
  table: string;
}

export interface Rbac {
  uiRbac: UiRbac;
  hasuraRbac: HasuraRbac[];
}

export interface ModalConfig {
  type?: 'primary' | 'warning';
  title?: string;
  body?: string;
  closeButtonLabel?: string;
  submitButtonLabel?: string;
  onClose?(): Promise<boolean> | boolean | void;
  onSubmit?(): Promise<boolean> | boolean | void;
}

export interface DashboardState {
  dateRange: number;
}

export type DashboardMetricGroup = 'conversion' | 'engagement' | 'retention';

export interface DashboardMetric {
  title: string;
  newCount: number | string;
  showPercentageChange: boolean;
  isPercentageIncrease?: boolean;
  percentageChange?: number;
  icon?: string;
}
