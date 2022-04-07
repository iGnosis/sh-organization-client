export class Session {
  id?: string;
  createdAt?: Date;
  endedAt?: Date;
  updatedAt?: Date;
  activityType?: string;
  timeDuration?: string;
  performanceRatio?: number;
  patientByPatient?: {
    identifier?: string;
  };
  careplanByCareplan?: {
    name?: string
  }
}
