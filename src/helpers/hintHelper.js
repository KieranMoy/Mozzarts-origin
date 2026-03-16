// Simple hint generator for music trivia tracks.
// Previous versions had a more elaborate stage-based system; here we
// just offer one hint per round, based on artist or title.

import { arrayFill } from "ascii-table";
import { CommandInteractionOptionResolver } from "discord.js";

// `type` corresponds to the kind of question that was asked.  The
// old implementation ignored both the difficulty and stage parameters and
// always returned the same hint; this could be misleading when the question
// was asking for a release year or album name.  Rather than guess based on
// difficulty we now accept an explicit `type` so the caller can provide the
// exact field that was used in the question.  The third argument is kept for
// backwards compatibility (tests, etc.) but we prefer the caller to pass
// the type string directly.
export function makeHint(track, type = "artist") {
  // tracks coming from the iTunes API may lack some fields so we default to
  // "unknown" to avoid runtime errors.
  const artist = track.artistName || "unknown";
  const title = track.trackName || "unknown";
  const album = track.collectionName || "unknown";
  const genre = track.primaryGenreName || "unknown";

  // helper to get year safely
  const getYear = () => {
    try {
      const d = new Date(track.releaseDate);
      return Number.isFinite(d.getFullYear()) ? String(d.getFullYear()) : "unknown";
    } catch {
      return "unknown";
    }
  };

  // The potential types of hint to give
  const hintTypes = ["artist", "genre", "album", "title"];

  // Based on the question type, remove that hint type so the hint doesn't give away the answer
  switch (type) {
    case "artist":
      hintTypes.splice(hintTypes.indexOf("artist"), 1);
      break;
    case "genre":
      hintTypes.splice(hintTypes.indexOf("genre"), 1);
      break;
    case "album":
      hintTypes.splice(hintTypes.indexOf("album"), 1);
      break;
    case "title":
      hintTypes.splice(hintTypes.indexOf("title"), 1);
      break;
  }

  // Randomly choose a hint type
  let index = Math.floor(Math.random() * hintTypes.length);
  let hintType = hintTypes[index];

  // Return the proper hint based on the hint type
  switch(hintType) {
    case "artist":
      return `This song's artist is **${artist}**`;
    case "genre":
      return `This song's genre is **${genre}**`;
    case "album":
      return `This song's album is **${album}**`;
    case "title":
      return `This song's title is **${title}**`;
    default:
      return "Could not get a hint for this song."; // Error case, should never happen
  }
}
