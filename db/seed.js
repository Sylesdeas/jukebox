import db from "#db/client";
import { createTrack } from "./queries/tracks.js";
import { createPlaylist } from "./queries/playlists.js";
import { addTrackToPlaylist } from "./queries/playlists_tracks.js";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  await db.query("DELETE FROM playlists_tracks");
  await db.query("DELETE FROM playlists");
  await db.query("DELETE FROM tracks");

  const tracks = [
    ["Blinding Lights", 200040],
    ["Levitating", 203064],
    ["As It Was", 167303],
    ["Good 4 U", 178147],
    ["Bad Habit", 232067],
    ["Heat Waves", 238805],
    ["Stay", 141806],
    ["Peaches", 198082],
    ["Anti-Hero", 200690],
    ["Flowers", 200455],
    ["Cruel Summer", 178426],
    ["Circles", 215280],
    ["Watermelon Sugar", 174000],
    ["About Damn Time", 191822],
    ["Shivers", 207853],
    ["Sunflower", 158040],
    ["Dance Monkey", 209438],
    ["Save Your Tears", 215627],
    ["Drivers License", 242014],
    ["Golden Hour", 209260],
  ];

  const playlists = [
    ["Morning Boost", "Upbeat songs to start the day."],
    ["Late Night Drive", "Smooth tracks for nighttime driving."],
    ["Workout Mix", "High-energy songs for exercise."],
    ["Chill Vibes", "Relaxed songs for unwinding."],
    ["Pop Favorites", "Popular pop tracks."],
    ["Focus Flow", "Songs for studying or working."],
    ["Party Starter", "Songs to get people moving."],
    ["Road Trip", "Fun songs for long drives."],
    ["Feel Good", "Positive songs for a better mood."],
    ["Weekend Mix", "Tracks for Saturday and Sunday."],
  ];

  const playlistsTracks = [
    [1, 1],
    [1, 2],
    [1, 3],
    [2, 6],
    [2, 12],
    [2, 18],
    [3, 4],
    [3, 7],
    [3, 15],
    [4, 5],
    [4, 20],
    [5, 8],
    [5, 9],
    [6, 10],
    [6, 19],
    [7, 11],
    [7, 14],
    [8, 13],
    [9, 16],
    [10, 17],
  ];

  for (const [name, durationMs] of tracks) {
    await db.query(
      `
        INSERT INTO tracks (name, duration_ms)
        VALUES ($1, $2)
      `,
      [name, durationMs],
    );
  }

  for (const [name, description] of playlists) {
    await db.query(
      `
        INSERT INTO playlists (name, description)
        VALUES ($1, $2)
      `,
      [name, description],
    );
  }

  for (const [playlistId, trackId] of playlistsTracks) {
    await db.query(
      `
        INSERT INTO playlists_tracks (playlist_id, track_id)
        VALUES ($1, $2)
      `,
      [playlistId, trackId],
    );
  }
}
