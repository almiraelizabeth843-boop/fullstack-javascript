import express from "express";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import cors from "cors";

import { auth } from "./lib/auth";
import { authGuard } from "./middleware/auth";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend's origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  }),
);

app.all("/api/auth/*splat", toNodeHandler(auth)); 

app.use(express.json());

app.get("/", authGuard, (req, res) => {
  //res.send("Hello Full Stack Developer!");
  res.status(200).json({
    message: "Hello FullStack Developer!",
    session: (req as any).session.user,
  });
});

app.get("/api/me", async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  return res.json(session);
});

export default app;