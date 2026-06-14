import { Router } from "express";
import {
    createMeeting,
    deleteMeeting,
    getMeetingById,
    updateMeeting,
} from "../controllers/meetingsController";
import {
    validateCreateMeeting,
    validateMeetingIdParam,
    validateUpdateMeeting,
} from "../middlewares/validateMeeting";

const meetingsRoutes = Router();

meetingsRoutes.get("/:meetingId", validateMeetingIdParam, getMeetingById);
meetingsRoutes.post("/", validateCreateMeeting, createMeeting);
meetingsRoutes.put("/:meetingId", validateUpdateMeeting, updateMeeting);
meetingsRoutes.delete("/:meetingId", validateMeetingIdParam, deleteMeeting);

export default meetingsRoutes;
