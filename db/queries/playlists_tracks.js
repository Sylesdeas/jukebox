import db from "#db/client";

export async function addTrackToPlaylist({ playlistId, trackId }) {
  const sql = `
    INSERT INTO playlists_tracks (playlist_id, track_id)
    VALUES ($1, $2)
    ON CONFLICT (playlist_id, track_id) DO NOTHING
    RETURNING *
  `;

  const {
    rows: [playlistTrack],
  } = await db.query(sql, [playlistId, trackId]);

  return playlistTrack;
}
