import { Profile } from "./profile";

export class Patient {
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
    user_profile?: Profile;
    userRelationsByTo?: Array<PatientFrom>;
}


class PatientFrom {
    userFrom?: Patient;
    userTo?: Patient;
}