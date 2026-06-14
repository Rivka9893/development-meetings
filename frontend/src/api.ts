import type { Meeting, MeetingFormData, Team } from "./types";

const API_BASE = "/api";

const parseJson = async <T>(res: Response): Promise<T> => {
    if (!res.ok) {
        const body = await res.json().catch(() => ({ message: "Request failed" }));
        throw new Error(body.message || "Request failed");
    }
    return res.json() as Promise<T>;
};

export const api = {
    getTeams: async (): Promise<Team[]> => {
        const res = await fetch(`${API_BASE}/teams`);
        return parseJson<Team[]>(res);
    },

    getMeetingsByTeam: async (teamId: number): Promise<Meeting[]> => {
        const res = await fetch(`${API_BASE}/teams/${teamId}/meetings`);
        return parseJson<Meeting[]>(res);
    },

    getMeetingById: async (meetingId: number): Promise<Meeting> => {
        const res = await fetch(`${API_BASE}/meetings/${meetingId}`);
        return parseJson<Meeting>(res);
    },

    createMeeting: async (payload: MeetingFormData): Promise<Meeting> => {
        const res = await fetch(`${API_BASE}/meetings`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        return parseJson<Meeting>(res);
    },

    updateMeeting: async (meetingId: number, payload: MeetingFormData): Promise<Meeting> => {
        const res = await fetch(`${API_BASE}/meetings/${meetingId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        return parseJson<Meeting>(res);
    },

    deleteMeeting: async (meetingId: number): Promise<void> => {
        const res = await fetch(`${API_BASE}/meetings/${meetingId}`, {
            method: "DELETE",
        });
        if (!res.ok) {
            const body = await res.json().catch(() => ({ message: "Delete failed" }));
            throw new Error(body.message || "Delete failed");
        }
    },
};
