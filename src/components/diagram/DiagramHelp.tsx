import { OpenInNew } from "@mui/icons-material";
import { Box, Button, Link, Typography } from "@mui/material";
import { SlSocialYoutube } from "react-icons/sl";
import { LuFileText } from "react-icons/lu";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { usePostHog } from "@posthog/react";
import { LOAD_SAMPLE } from "../../store/types";

// Successor notice. Shown on an empty canvas, which is where switching costs the
// reader nothing — they have not built anything yet. Campaign matches the docs
// callouts (plcsimulator-docs/components/RungsCallout.tsx) so both surfaces roll
// up as one migration campaign.
// The inline link and the button carry different utm_content so the two can be
// told apart, matching how the docs callouts tag their inline link.
const studioUrl = (content: string) => {
  const params = new URLSearchParams({
    utm_source: "plcsimulator.online",
    utm_medium: "referral",
    utm_campaign: "successor",
    utm_content: content,
  });
  return `https://studio.rungs.dev/?${params.toString()}`;
};

// DiagramHelp remounts whenever the canvas empties again, so the impression is
// tracked per page load rather than per mount.
let shownFired = false;

export default function DiagramHelp() {
  const dispatch = useDispatch();
  const posthog = usePostHog();

  useEffect(() => {
    if (shownFired) return;
    shownFired = true;
    posthog?.capture("studio_cta_shown", { surface: "empty_canvas" });
  }, [posthog]);

  return (
    <Box
      sx={{
        marginX: "auto",
        maxWidth: "36em",
        px: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography
        sx={{
          mb: 1,
          textAlign: "center",
          color: "#868e96",
          fontFamily: "Virgil",
          fontSize: "1.5em",
        }}
      >
        I am not developing this simulator any more.
      </Typography>
      <Typography
        sx={{
          mb: 1,
          textAlign: "center",
          color: "#495057",
          fontSize: "1em",
          lineHeight: 1.7,
        }}
      >
        All my effort goes to{" "}
        <Link
          href={studioUrl("app_empty_canvas_inline")}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => posthog?.capture("studio_cta_click", { surface: "empty_canvas_inline" })}
          sx={{
            fontWeight: 600
          }}
        >
          studio.rungs.dev
        </Link>{" "}
        now. It is free and browser-based like this simulator, but it does more:
      </Typography>
      {/* Left-aligned inside a centered block — centered bullets read ragged. */}
      <Box
        component="ul"
        sx={{
          m: 0,
          mb: 3,
          pl: 3,
          textAlign: "left",
          color: "#495057",
          fontSize: "1em",
          lineHeight: 1.9,
        }}
      >
        <li>supports more instructions, data types and arrays</li>
        <li>Structured Text and Ladder Diagram editors</li>
        <li>saves projects to your own device</li>
        <li>shares without signing up</li>
        <li>charts your variables while the program runs</li>
        <li>has an AI assistant built to teach PLC programming</li>
      </Box>
      <Button
        component="a"
        href={studioUrl("app_empty_canvas")}
        target="_blank"
        rel="noopener noreferrer"
        variant="outlined"
        endIcon={<OpenInNew />}
        onClick={() => posthog?.capture("studio_cta_click", { surface: "empty_canvas" })}
        sx={{ mb: 4 }}
      >
        <Typography sx={{
          fontSize: "1.25em"
        }}>Open Rungs Studio</Typography>
      </Button>

      <Typography
        sx={{
          mb: 1,
          textAlign: "center",
          color: "#868e96",
          fontFamily: "Virgil",
          fontSize: "1.5em",
        }}
      >
        Or keep building here
      </Typography>
      <Button
        component="a"
        href="https://plcsimulator.online/docs"
        target="_blank"
        rel="noopener noreferrer"
        endIcon={<OpenInNew />}
      >
        <Typography sx={{
          fontSize: "1.25em"
        }}>Read the documentation</Typography>
      </Button>
      <Button
        component="a"
        href="https://youtu.be/Cgd_Or1Mcac"
        target="_blank"
        rel="noopener noreferrer"
        endIcon={<SlSocialYoutube />}
      >
        <Typography sx={{
          fontSize: "1.25em"
        }}>Watch tutorial video</Typography>
      </Button>
      <Button onClick={() => dispatch({ type: LOAD_SAMPLE })} endIcon={<LuFileText />}>
        <Typography sx={{
          fontSize: "1.25em"
        }}>Load sample diagram</Typography>
      </Button>
    </Box>
  );
}
