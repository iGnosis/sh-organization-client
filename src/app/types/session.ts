export class Session {
  id?: string;
  createdAt?: Date;
  endedAt?: Date;
  updatedAt?: Date;
  activityType?: string;
  timeDuration?: string;
  performance?: number;
  patientByPatient?: {
    identifier?: string;
  };
  careplanByCareplan?: {
    name?: string
  }
}
