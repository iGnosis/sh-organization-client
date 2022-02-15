import { Profile } from "./profile";
import { Session } from "./session";
import { Therapist } from "./therapist";

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
}


class PatientFrom {
    userFrom?: Patient;
    userTo?: Patient;
}