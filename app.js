import express from "express";
import tracksRouter from "./api/tracks.js";
import playlistsRouter from "./api/playlists.js";
const app = express();

app.use(express.json());

app.use("/tracks", tracksRouter);
app.use("/playlists", playlistsRouter);

export default app;
