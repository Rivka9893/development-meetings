import { Link } from "react-router-dom";
import type { Meeting, Team } from "../types";
import { formatDateTime, formatDuration, isFutureStart } from "../utils/date";

interface MeetingCardProps {
    meeting: Meeting;
    teams: Team[];
    onDelete: (meetingId: number) => void;
}

export const MeetingCard = ({ meeting, teams, onDelete }: MeetingCardProps) => {
    const future = isFutureStart(meeting.start_datetime);
    const teamName = teams.find((team) => team.team_id === meeting.team_id)?.team_name || "Unknown Team";

    return (
        <article className={`glass meeting-card ${future ? "meeting-future" : "meeting-past"}`}>
            <p className="meeting-team">{teamName}</p>
            <p className="meeting-description">{meeting.description}</p>

            <div className="meeting-meta">
                <span>Start: {formatDateTime(meeting.start_datetime)}</span>
                <span>End: {formatDateTime(meeting.end_datetime)}</span>
            </div>

            <p className="duration-pill">Duration: {formatDuration(meeting.start_datetime, meeting.end_datetime)}</p>

            <div className="meeting-actions">
                <Link className="btn ghost" to={`/meetings/${meeting.meeting_id}/edit`}>
                    Edit
                </Link>
                <button
                    className="btn danger"
                    onClick={() => onDelete(meeting.meeting_id)}
                    type="button"
                >
                    Delete
                </button>
            </div>
        </article>
    );
};
