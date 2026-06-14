import { NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/httpError";
import { MeetingPayload } from "../types";

const parsePositiveInt = (value: unknown, fieldName: string): number => {
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed <= 0) {
        throw new HttpError(400, `${fieldName} must be a positive integer`);
    }
    return parsed;
};

const isValidDate = (value: string): boolean => !Number.isNaN(Date.parse(value));

export const validateTeamIdParam = (
    req: Request,
    _res: Response,
    next: NextFunction
): void => {
    try {
        req.params.teamId = String(parsePositiveInt(req.params.teamId, "teamId"));
        next();
    } catch (err) {
        next(err);
    }
};

export const validateMeetingIdParam = (
    req: Request,
    _res: Response,
    next: NextFunction
): void => {
    try {
        req.params.meetingId = String(parsePositiveInt(req.params.meetingId, "meetingId"));
        next();
    } catch (err) {
        next(err);
    }
};

const validateMeetingPayloadShape = (body: any): MeetingPayload => {
    const team_id = parsePositiveInt(body.team_id, "team_id");

    if (typeof body.start_datetime !== "string" || !isValidDate(body.start_datetime)) {
        throw new HttpError(400, "start_datetime must be a valid datetime string");
    }

    if (typeof body.end_datetime !== "string" || !isValidDate(body.end_datetime)) {
        throw new HttpError(400, "end_datetime must be a valid datetime string");
    }

    const start = new Date(body.start_datetime);
    const end = new Date(body.end_datetime);
    if (end <= start) {
        throw new HttpError(400, "end_datetime must be later than start_datetime");
    }

    if (typeof body.description !== "string" || body.description.trim().length < 3) {
        throw new HttpError(400, "description must contain at least 3 characters");
    }

    return {
        team_id,
        start_datetime: body.start_datetime,
        end_datetime: body.end_datetime,
        description: body.description.trim(),
    };
};

export const validateCreateMeeting = (
    req: Request,
    _res: Response,
    next: NextFunction
): void => {
    try {
        req.body = validateMeetingPayloadShape(req.body);
        next();
    } catch (err) {
        next(err);
    }
};

export const validateUpdateMeeting = (
    req: Request,
    _res: Response,
    next: NextFunction
): void => {
    try {
        req.params.meetingId = String(parsePositiveInt(req.params.meetingId, "meetingId"));
        req.body = validateMeetingPayloadShape(req.body);
        next();
    } catch (err) {
        next(err);
    }
};
