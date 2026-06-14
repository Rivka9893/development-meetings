import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import type { MeetingFormData, Team } from "../types";
import { DateTimeInput } from "../components/DateTimeInput";
import { TeamPicker } from "../components/TeamPicker";
import { QuoteTypewriter } from "../components/QuoteTypewriter";

const emptyForm: MeetingFormData = {
    team_id: 0,
    start_datetime: "",
    end_datetime: "",
    description: "",
};

export const AddMeetingPage = () => {
    const [teams, setTeams] = useState<Team[]>([]);
    const [form, setForm] = useState<MeetingFormData>(emptyForm);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        api.getTeams().then(setTeams).catch((err: Error) => setError(err.message));
    }, []);

    const validate = (): string => {
        if (!form.team_id || !form.start_datetime || !form.end_datetime || !form.description.trim()) {
            return "All fields are required.";
        }

        const start = new Date(form.start_datetime).getTime();
        const end = new Date(form.end_datetime).getTime();

        if (start < Date.now()) {
            return "Start time cannot be in the past.";
        }

        if (start >= end) {
            return "Start time must be earlier than end time.";
        }

        return "";
    };

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setSaving(true);
            setError("");
            await api.createMeeting(form);
            navigate("/meetings");
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <section className="form-layout">
            <section className="glass page-card form-card">
                <h2>Add New Meeting</h2>
                <form onSubmit={onSubmit} className="form-grid">
                    <label id="team-add-label">Team</label>
                    <TeamPicker
                        teams={teams}
                        selectedTeamId={form.team_id || ""}
                        onSelect={(teamId) => setForm((prev) => ({ ...prev, team_id: typeof teamId === "number" ? teamId : 0 }))}
                        labelId="team-add-label"
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
                        {saving ? "Saving..." : "Create Meeting"}
                    </button>
                </form>
            </section>

            <aside className="positive-notes" aria-label="Positive quotes">
                <QuoteTypewriter
                    quotes={[
                        "Small progress is still progress.",
                        "Clarity creates confidence.",
                        "Great teams talk, listen, and build.",
                        "One focused meeting can save a whole day.",
                        "You are building something meaningful.",
                    ]}
                />
            </aside>
        </section>
    );
};
