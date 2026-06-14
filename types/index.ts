export interface DevelopmentTeam {
    team_id: number;
    team_name: string;
}

export interface Meeting {
    meeting_id: number;
    team_id: number;
    start_datetime: string;
    end_datetime: string;
    description: string;
}

export interface MeetingPayload {
    team_id: number;
    start_datetime: string;
    end_datetime: string;
    description: string;
}
