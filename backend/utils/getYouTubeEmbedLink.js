function extractYouTubeVideoId(url) {
  try {
    const parsed = new URL(url);

    // youtube.com URLs
    if (parsed.hostname.includes("youtube.com")) {
      const v = parsed.searchParams.get("v");
      if (v) return v;

      // /embed/VIDEO_ID
      if (parsed.pathname.startsWith("/embed/")) {
        return parsed.pathname.split("/embed/")[1].split("/")[0];
      }

      // /shorts/VIDEO_ID
      if (parsed.pathname.startsWith("/shorts/")) {
        return parsed.pathname.split("/shorts/")[1].split("/")[0];
      }
    }

    // youtu.be short URLs
    if (parsed.hostname === "youtu.be") {
      return parsed.pathname.slice(1).split("/")[0];
    }

    return null;
  } catch (e) {
    return null;
  }
}

function getYouTubeEmbedUrl(url) {
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) return null;

  return `https://www.youtube.com/embed/${videoId}`;
}

module.exports = getYouTubeEmbedUrl