import { NextFunction, Request, Response } from "express";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../config/db";
import { Meeting, MeetingPayload } from "../types";
import { HttpError } from "../utils/httpError";

type CountResult = RowDataPacket & { count: number };
type MeetingRow = RowDataPacket & Meeting;

const ensureTeamExists = async (teamId: number): Promise<void> => {
    const [rows] = await pool.query<CountResult[]>(
        "SELECT COUNT(*) AS count FROM development_teams WHERE team_id = ?",
        [teamId]
    );

    if (!rows[0] || rows[0].count === 0) {
        throw new HttpError(404, "Development team not found");
    }
};

const ensureMeetingExists = async (meetingId: number): Promise<void> => {
    const [rows] = await pool.query<CountResult[]>(
        "SELECT COUNT(*) AS count FROM meetings WHERE meeting_id = ?",
        [meetingId]
    );

    if (!rows[0] || rows[0].count === 0) {
        throw new HttpError(404, "Meeting not found");
    }
};

const ensureNoConflict = async (
    payload: MeetingPayload,
    excludedMeetingId?: number
): Promise<void> => {
    const params: Array<number | string> = [
        payload.team_id,
        payload.start_datetime,
        payload.end_datetime,
    ];

    let sql = `
    SELECT COUNT(*) AS count
    FROM meetings
    WHERE team_id = ?
      AND (? < end_datetime AND ? > start_datetime)
  `;

    if (excludedMeetingId) {
        sql += " AND meeting_id <> ?";
        params.push(excludedMeetingId);
    }

    const [rows] = await pool.query<CountResult[]>(sql, params);
    if (rows[0] && rows[0].count > 0) {
        throw new HttpError(409, "Meeting time overlaps with another meeting");
    }
};

export const getMeetingById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const meetingId = Number(req.params.meetingId);

        const [rows] = await pool.query<MeetingRow[]>(
            `SELECT meeting_id, team_id, start_datetime, end_datetime, description
       FROM meetings
       WHERE meeting_id = ?`,
            [meetingId]
        );

        if (rows.length === 0) {
            throw new HttpError(404, "Meeting not found");
        }

        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
};

export const createMeeting = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const payload = req.body as MeetingPayload;

        await ensureTeamExists(payload.team_id);
        await ensureNoConflict(payload);

        const [result] = await pool.query<ResultSetHeader>(
            `INSERT INTO meetings (team_id, start_datetime, end_datetime, description)
       VALUES (?, ?, ?, ?)`,
            [
                payload.team_id,
                payload.start_datetime,
                payload.end_datetime,
                payload.description,
            ]
        );

        const [rows] = await pool.query<MeetingRow[]>(
            `SELECT meeting_id, team_id, start_datetime, end_datetime, description
       FROM meetings
       WHERE meeting_id = ?`,
            [result.insertId]
        );

        res.status(201).json(rows[0]);
    } catch (err) {
        next(err);
    }
};

export const updateMeeting = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const meetingId = Number(req.params.meetingId);
        const payload = req.body as MeetingPayload;

        await ensureMeetingExists(meetingId);
        await ensureTeamExists(payload.team_id);
        await ensureNoConflict(payload, meetingId);

        await pool.query<ResultSetHeader>(
            `UPDATE meetings
       SET team_id = ?, start_datetime = ?, end_datetime = ?, description = ?
       WHERE meeting_id = ?`,
            [
                payload.team_id,
                payload.start_datetime,
                payload.end_datetime,
                payload.description,
                meetingId,
            ]
        );

        const [rows] = await pool.query<MeetingRow[]>(
            `SELECT meeting_id, team_id, start_datetime, end_datetime, description
       FROM meetings
       WHERE meeting_id = ?`,
            [meetingId]
        );

        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
};

export const deleteMeeting = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const meetingId = Number(req.params.meetingId);
        await ensureMeetingExists(meetingId);

        await pool.query<ResultSetHeader>(
            "DELETE FROM meetings WHERE meeting_id = ?",
            [meetingId]
        );

        res.status(204).send();
    } catch (err) {
        next(err);
    }
};
