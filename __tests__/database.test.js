import { describe, expect, it, beforeAll, afterAll } from "vitest";
import db from "#db/client";

beforeAll(async () => {
  await db.connect();
});

afterAll(async () => {
  await db.end();
});

describe("seeded database", () => {
  it("has at least 20 tracks", async () => {
    const { rows } = await db.query("SELECT COUNT(*)::int AS count FROM tracks");

    expect(rows[0].count).toBeGreaterThanOrEqual(20);
  });

  it("has at least 10 playlists", async () => {
    const { rows } = await db.query(
      "SELECT COUNT(*)::int AS count FROM playlists"
    );

    expect(rows[0].count).toBeGreaterThanOrEqual(10);
  });

  it("has at least 15 playlist-track relationships", async () => {
    const { rows } = await db.query(
      "SELECT COUNT(*)::int AS count FROM playlists_tracks"
    );

    expect(rows[0].count).toBeGreaterThanOrEqual(15);
  });

  it("does not have duplicate tracks in the same playlist", async () => {
    const { rows } = await db.query(`
      SELECT playlist_id, track_id, COUNT(*)::int AS count
      FROM playlists_tracks
      GROUP BY playlist_id, track_id
      HAVING COUNT(*) > 1
    `);

    expect(rows).toHaveLength(0);
  });

  it("only links existing playlists and tracks", async () => {
    const { rows } = await db.query(`
      SELECT playlists_tracks.*
      FROM playlists_tracks
      LEFT JOIN playlists ON playlists.id = playlists_tracks.playlist_id
      LEFT JOIN tracks ON tracks.id = playlists_tracks.track_id
      WHERE playlists.id IS NULL OR tracks.id IS NULL
    `);

    expect(rows).toHaveLength(0);
  });

  it("cascades deleted playlists to playlist-track relationships", async () => {
    const {
      rows: [playlist],
    } = await db.query(`
      INSERT INTO playlists (name, description)
      VALUES ('Cascade Test Playlist', 'Temporary playlist for cascade test.')
      RETURNING *
    `);

    const {
      rows: [track],
    } = await db.query(`
      INSERT INTO tracks (name, duration_ms)
      VALUES ('Cascade Test Track', 123456)
      RETURNING *
    `);

    await db.query(
      `
        INSERT INTO playlists_tracks (playlist_id, track_id)
        VALUES ($1, $2)
      `,
      [playlist.id, track.id]
    );

    await db.query("DELETE FROM playlists WHERE id = $1", [playlist.id]);

    const { rows } = await db.query(
      "SELECT * FROM playlists_tracks WHERE playlist_id = $1",
      [playlist.id]
    );

    await db.query("DELETE FROM tracks WHERE id = $1", [track.id]);

    expect(rows).toHaveLength(0);
  });

  it("cascades deleted tracks to playlist-track relationships", async () => {
    const {
      rows: [playlist],
    } = await db.query(`
      INSERT INTO playlists (name, description)
      VALUES ('Cascade Test Playlist 2', 'Temporary playlist for cascade test.')
      RETURNING *
    `);

    const {
      rows: [track],
    } = await db.query(`
      INSERT INTO tracks (name, duration_ms)
      VALUES ('Cascade Test Track 2', 123456)
      RETURNING *
    `);

    await db.query(
      `
        INSERT INTO playlists_tracks (playlist_id, track_id)
        VALUES ($1, $2)
      `,
      [playlist.id, track.id]
    );

    await db.query("DELETE FROM tracks WHERE id = $1", [track.id]);

    const { rows } = await db.query(
      "SELECT * FROM playlists_tracks WHERE track_id = $1",
      [track.id]
    );

    await db.query("DELETE FROM playlists WHERE id = $1", [playlist.id]);

    expect(rows).toHaveLength(0);
  });
});
