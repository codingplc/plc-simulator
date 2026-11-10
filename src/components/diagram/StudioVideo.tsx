import { useState } from "react";
import { Box, ButtonBase, Typography } from "@mui/material";
import { PlayArrowRounded } from "@mui/icons-material";
import { usePostHog } from "@posthog/react";

const VIDEO_ID = "UTNUnhqCoho";

/**
 * The "Moving to Rungs Studio" video, shown as its thumbnail until someone presses play.
 *
 * The YouTube player is only loaded on that click: embedding it straight away would load
 * YouTube's scripts and cookies on every empty canvas, for the few who watch. The thumbnail
 * is served from this site for the same reason.
 */
export default function StudioVideo({ surface }: { surface: string }) {
  const posthog = usePostHog();
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <Box className="video-responsive" sx={{ width: "100%", borderRadius: 1 }}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="PLC Simulator Online is moving to Rungs Studio"
        />
      </Box>
    );
  }

  return (
    <ButtonBase
      aria-label="Play video: PLC Simulator Online is moving to Rungs Studio"
      onClick={() => {
        posthog?.capture("studio_video_play", { surface });
        setPlaying(true);
      }}
      sx={{
        position: "relative",
        width: "100%",
        aspectRatio: "16 / 9",
        borderRadius: 1,
        overflow: "hidden",
        boxShadow: "0 1px 4px rgba(0, 0, 0, 0.25)",
        "&:hover .play, &:focus-visible .play": { backgroundColor: "#ff0000" },
      }}
    >
      <Box
        component="img"
        src="/video/move-to-rungs-studio.jpg"
        alt=""
        sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
      <Box
        className="play"
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 68,
          height: 48,
          borderRadius: 3,
          backgroundColor: "rgba(33, 33, 33, 0.85)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background-color 0.15s",
        }}
      >
        <PlayArrowRounded sx={{ color: "#fff", fontSize: 40 }} />
      </Box>
      <Typography
        component="span"
        sx={{
          position: "absolute",
          right: 8,
          bottom: 8,
          px: 0.75,
          borderRadius: 0.5,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          color: "#fff",
          fontSize: "0.8rem",
          fontWeight: 600,
        }}
      >
        3:54
      </Typography>
    </ButtonBase>
  );
}
