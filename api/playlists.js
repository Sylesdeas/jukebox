import express from "express";
import {
  createPlaylist,
  getPlaylistById,
  getPlaylists,
  getTracksByPlaylistId,
} from "#db/queries/playlists";
import { getTrackById } from "#db/queries/tracks";
import { addTrackToPlaylist } from "#db/queries/playlists_tracks";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const playlists = await getPlaylists();
    res.send(playlists);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    if (!req.body) {
      return res.status(400).send("Request body is required.");
    }

    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).send("Name and description are required.");
    }

    const playlist = await createPlaylist({ name, description });
    res.status(201).send(playlist);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const playlistId = Number(req.params.id);

    if (!Number.isInteger(playlistId)) {
      return res.status(400).send("Playlist id must be a number.");
    }

    const playlist = await getPlaylistById(playlistId);

    if (!playlist) {
      return res.status(404).send("Playlist not found.");
    }

    res.send(playlist);
  } catch (error) {
    next(error);
  }
});

router.get("/:id/tracks", async (req, res, next) => {
  try {
    const playlistId = Number(req.params.id);

    if (!Number.isInteger(playlistId)) {
      return res.status(400).send("Playlist id must be a number.");
    }

    const playlist = await getPlaylistById(playlistId);

    if (!playlist) {
      return res.status(404).send("Playlist not found.");
    }

    const tracks = await getTracksByPlaylistId(playlistId);
    res.send(tracks);
  } catch (error) {
    next(error);
  }
});

router.post("/:id/tracks", async (req, res, next) => {
  try {
    const playlistId = Number(req.params.id);

    if (!Number.isInteger(playlistId)) {
      return res.status(400).send("Playlist id must be a number.");
    }

    if (!req.body || req.body.trackId === undefined) {
      return res.status(400).send("trackId is required.");
    }

    const trackId = Number(req.body.trackId);

    if (!Number.isInteger(trackId)) {
      return res.status(400).send("trackId must be a number.");
    }

    const playlist = await getPlaylistById(playlistId);

    if (!playlist) {
      return res.status(404).send("Playlist not found.");
    }

    const track = await getTrackById(trackId);

    if (!track) {
      return res.status(400).send("Track does not exist.");
    }

    const playlistTrack = await addTrackToPlaylist({ playlistId, trackId });

    if (!playlistTrack) {
      return res.status(400).send("Track is already in playlist.");
    }

    res.status(201).send(playlistTrack);
  } catch (error) {
    next(error);
  }
});

export default router;
