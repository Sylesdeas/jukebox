import db from "#db/client";

export async function getTracks() {
  const sql = `
    SELECT *
    FROM tracks
    ORDER BY id
  `;

  const { rows } = await db.query(sql);
  return rows;
}

export async function getTrackById(id) {
  const sql = `
    SELECT *
    FROM tracks
    WHERE id = $1
  `;

  const {
    rows: [track],
  } = await db.query(sql, [id]);

  return track;
}
