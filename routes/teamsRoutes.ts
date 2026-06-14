import { Router } from "express";
import { getAllTeams, getMeetingsByTeam } from "../controllers/teamsController";
import { validateTeamIdParam } from "../middlewares/validateMeeting";

const teamsRoutes = Router();

teamsRoutes.get("/", getAllTeams);
teamsRoutes.get("/:teamId/meetings", validateTeamIdParam, getMeetingsByTeam);

export default teamsRoutes;
