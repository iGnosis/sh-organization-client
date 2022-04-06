export class IChart {
    activity?: string;
    activity_name?: string;
    attempt_id?: string;
    created_at?: string;
    reaction_time?: string;
    score?: number;
    session?: string;
    task_id?: string;
    task_name?: string
}

export class ChartSessionData {
    [key: string]: Session
}

class Session {
    [key: string]: Activity
}

class Activity {
    events?: Array<Event>
}

class Event {
    activityName?: string;
    taskName?: string;
    reactionTime?: string;
    createdAt?: string;
    score?: number;
}