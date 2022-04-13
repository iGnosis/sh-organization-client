export class Activity {
  id?: string;
  createdAt?: number; // unix epoch time in milliseconds
  updatedAt?: number; // unix epoch time in milliseconds
  name?: string;
  prompt?: string;
  details?: any;
  duration?: number; // duration in seconds
  reps?: number;
  correctMotions?: number;
  reactionTime?: number; // time in milliseconds
  achievementRatio?: number; // avg. achievement ratio (0 to 100%) of all the reps.
  difficulty?: ActivityDifficulty;
  selected?: boolean;
}
export class ActivityEvent {
  activityName?: string;
  repName?: string;
  createdAt?: number; // unix epoch in milliseconds
  reactionTime?: number;
  score?: number;
  taskName?: string;
}

export enum ActivityDifficulty {
  easy = 'Easy',
  medium = 'Moderate',
  difficult = 'Hard'
}
