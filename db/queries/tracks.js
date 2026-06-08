import db from "#db/client";

export async function createTrack({ name, durationMs }) {
  const sql = `
    INSERT INTO tracks (name, duration_ms)
    VALUES ($1, $2)
    RETURNING *
  `;

  const {
    rows: [track],
  } = await db.query(sql, [name, durationMs]);

  return track;
}
