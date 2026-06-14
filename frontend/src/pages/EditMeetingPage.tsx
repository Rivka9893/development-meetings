import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api";
import type { MeetingFormData, Team } from "../types";
import { toDateTimeLocalValue } from "../utils/date";
import { DateTimeInput } from "../components/DateTimeInput";
import { TeamPicker } from "../components/TeamPicker";
import { QuoteTypewriter } from "../components/QuoteTypewriter";

export const EditMeetingPage = () => {
    const { meetingId } = useParams();
    const [teams, setTeams] = useState<Team[]>([]);
    const [form, setForm] = useState<MeetingFormData>({
        team_id: 0,
        start_datetime: "",
        end_datetime: "",
        description: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const id = Number(meetingId);
        if (!id) {
            setError("Invalid meeting id.");
            setLoading(false);
            return;
        }

        Promise.all([api.getTeams(), api.getMeetingById(id)])
            .then(([teamList, meeting]) => {
                setTeams(teamList);
                setForm({
                    team_id: meeting.team_id,
                    start_datetime: toDateTimeLocalValue(meeting.start_datetime),
                    end_datetime: toDateTimeLocalValue(meeting.end_datetime),
                    description: meeting.description,
                });
            })
            .catch((err: Error) => setError(err.message))
            .finally(() => setLoading(false));
    }, [meetingId]);

    const validate = (): string => {
        if (!form.team_id || !form.start_datetime || !form.end_datetime || !form.description.trim()) {
            return "All fields are required.";
        }

        const start = new Date(form.start_datetime).getTime();
        const end = new Date(form.end_datetime).getTime();
        if (start >= end) {
            return "Start time must be earlier than end time.";
        }

        return "";
    };

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const id = Number(meetingId);
        const validationError = validate();

        if (!id) {
            setError("Invalid meeting id.");
            return;
        }

        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setSaving(true);
            setError("");
            await api.updateMeeting(id, form);
            navigate("/meetings");
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p className="muted">Loading meeting...</p>;

    return (
        <section className="form-layout">
            <section className="glass page-card form-card">
                <h2>Edit Meeting</h2>
                <form onSubmit={onSubmit} className="form-grid">
                    <label id="team-edit-label">Team</label>
                    <TeamPicker
                        teams={teams}
                        selectedTeamId={form.team_id || ""}
                        onSelect={(teamId) => setForm((prev) => ({ ...prev, team_id: typeof teamId === "number" ? teamId : 0 }))}
                        labelId="team-edit-label"
                    />

                    <DateTimeInput
                        idPrefix="start"
                        label="Start Date & Time"
                        value={form.start_datetime}
                        onChange={(nextValue) => setForm((prev) => ({ ...prev, start_datetime: nextValue }))}
                    />

                    <DateTimeInput
                        idPrefix="end"
                        label="End Date & Time"
                        value={form.end_datetime}
                        onChange={(nextValue) => setForm((prev) => ({ ...prev, end_datetime: nextValue }))}
                    />

                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        value={form.description}
                        onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                        required
                        rows={4}
                    />

                    {error && <p className="error-text">{error}</p>}

                    <button type="submit" className="btn primary" disabled={saving}>
                        {saving ? "Saving..." : "Update Meeting"}
                    </button>
                </form>
            </section>

            <aside className="positive-notes" aria-label="Positive quotes">
                <QuoteTypewriter
                    quotes={[
                        "Refine, improve, repeat.",
                        "Better planning, calmer execution.",
                        "Details matter and you are doing great.",
                        "Every update makes the workflow smarter.",
                        "Consistency turns effort into results.",
                    ]}
                />
            </aside>
        </section>
    );
};
