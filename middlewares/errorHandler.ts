import { NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/httpError";

export const notFoundHandler = (_req: Request, res: Response): void => {
    res.status(404).json({ message: "Route not found" });
};

export const errorHandler = (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    if (err instanceof HttpError) {
        res.status(err.statusCode).json({ message: err.message });
        return;
    }

    console.error(err);
    res.status(500).json({ message: "Internal server error" });
};
