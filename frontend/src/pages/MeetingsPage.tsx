import { useEffect, useState } from "react";
import { api } from "../api";
import type { Meeting, Team } from "../types";
import { MeetingCard } from "../components/MeetingCard";
import { TeamPicker } from "../components/TeamPicker";

export const MeetingsPage = () => {
    const [teams, setTeams] = useState<Team[]>([]);
    const [selectedTeamId, setSelectedTeamId] = useState<number | "">("");
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        api.getTeams()
            .then(setTeams)
            .catch((err: Error) => setError(err.message));
    }, []);

    useEffect(() => {
        if (!selectedTeamId) {
            setMeetings([]);
            return;
        }

        setLoading(true);
        setError("");

        api.getMeetingsByTeam(selectedTeamId)
            .then(setMeetings)
            .catch((err: Error) => setError(err.message))
            .finally(() => setLoading(false));
    }, [selectedTeamId]);

    const handleDelete = async (meetingId: number) => {
        const confirmed = window.confirm("Delete this meeting?");
        if (!confirmed) return;

        try {
            await api.deleteMeeting(meetingId);
            setMeetings((prev) => prev.filter((meeting) => meeting.meeting_id !== meetingId));
        } catch (err) {
            setError((err as Error).message);
        }
    };

    return (
        <section className="page-stack">
            <div className="glass page-card">
                <h2>Meetings</h2>
                <label id="team-select-label">Select Development Team</label>
                <TeamPicker
                    teams={teams}
                    selectedTeamId={selectedTeamId}
                    onSelect={setSelectedTeamId}
                    labelId="team-select-label"
                />
            </div>

            {error && <p className="error-text">{error}</p>}
            {loading && <p className="muted">Loading meetings...</p>}

            <div className="meetings-grid">
                {meetings.map((meeting) => (
                    <MeetingCard key={meeting.meeting_id} meeting={meeting} teams={teams} onDelete={handleDelete} />
                ))}
            </div>
        </section>
    );
};
