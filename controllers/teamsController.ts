import { Request, Response, NextFunction } from "express";
import { RowDataPacket } from "mysql2";
import pool from "../config/db";
import { DevelopmentTeam, Meeting } from "../types";

type TeamRow = RowDataPacket & DevelopmentTeam;
type MeetingRow = RowDataPacket & Meeting;

export const getAllTeams = async (
    _req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const [rows] = await pool.query<TeamRow[]>(
            "SELECT team_id, team_name FROM development_teams ORDER BY team_name"
        );

        res.json(rows);
    } catch (err) {
        next(err);
    }
};

export const getMeetingsByTeam = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const teamId = Number(req.params.teamId);

        const [rows] = await pool.query<MeetingRow[]>(
            `SELECT meeting_id, team_id, start_datetime, end_datetime, description
       FROM meetings
       WHERE team_id = ?
       ORDER BY start_datetime`,
            [teamId]
        );

        res.json(rows);
    } catch (err) {
        next(err);
    }
};
