import express from "express";
import { getTrackById, getTracks } from "#db/queries/tracks";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const tracks = await getTracks();
    res.send(tracks);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const trackId = Number(req.params.id);

    if (!Number.isInteger(trackId)) {
      return res.status(400).send("Track id must be a number.");
    }

    const track = await getTrackById(trackId);

    if (!track) {
      return res.status(404).send("Track not found.");
    }

    res.send(track);
  } catch (error) {
    next(error);
  }
});

export default router;
