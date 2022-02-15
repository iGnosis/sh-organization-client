export class Activity {
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
    name?: string;
    details?: any;
    duration?: number;
    difficulty?: ActivityDifficulty;
    selected?: boolean;
}


export enum ActivityDifficulty {
    easy = 'Easy',
    medium = 'Moderate',
    difficult = 'Hard'
}