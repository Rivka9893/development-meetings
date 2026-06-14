import express, { Request, Response } from "express";
import teamsRoutes from "./routes/teamsRoutes";
import meetingsRoutes from "./routes/meetingsRoutes";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler";

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
    res.json({ message: "Development meetings API is running" });
});

app.use("/api/teams", teamsRoutes);
app.use("/api/meetings", meetingsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
