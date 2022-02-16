import { Activity } from "./activity";
import { Therapist } from "./therapist";

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

export class ActivityByActivity {
    activityByActivity?: Activity
    reps?: number = 1
}


export enum CarePlanDifficulty {
    easy = 'Easy',
    medium = 'Medium',
    difficult = 'Difficult'
}