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
    name?: string
  };
  sessionAnalytics: any; // Fix this later...
}
