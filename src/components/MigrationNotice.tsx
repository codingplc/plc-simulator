import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { usePostHog } from "@posthog/react";
import * as Sentry from "@sentry/react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";

import { Store } from "../interface";
import { store } from "../store/store";
import { OPEN_ALERT_SNACKBAR } from "../store/types";
import { Conversion, diagramToRungs } from "../rungs/diagramToRungs";
import { studioHomeLink, studioProjectLink } from "../rungs/projectLink";

const LINK_CONTENT = "migration_notice";

// Fired once per page load, like the other Studio surfaces.
let shownFired = false;

function convertCurrentDiagram() {
  const { branches, elements, runglist, rungs, variables } = store.getState() as unknown as Store;
  return diagramToRungs({ branches, elements, runglist, rungs, variables });
}

function reportFailure(error: unknown) {
  // Without this the person is left with no word of what went wrong.
  Sentry.captureException(error);
  store.dispatch({
    type: OPEN_ALERT_SNACKBAR,
    payload: { color: "error", open: true, text: "This project could not be opened in Rungs Studio." },
  });
}

/**
 * Tells people the simulator is moving, and takes their project with them.
 *
 * It cannot be dismissed, because it is the only place the button lives. It names no closing
 * date yet: that comes once the numbers show how many people have moved.
 *
 * Copy follows the survey notes in plc-simulator-docs/components/RungsCallout.tsx: introduce
 * Rungs Studio from zero, make a claim the reader can check, and say their work comes along.
 */
export default function MigrationNotice({ mobileUI }: { mobileUI: boolean }) {
  const posthog = usePostHog();
  // A conversion with notes waits here while the person reads them.
  const [pending, setPending] = useState<Conversion | null>(null);
  const hasProject = useSelector((state: Store) => Object.keys(state.elements).length > 0);

  useEffect(() => {
    if (shownFired) return;
    shownFired = true;
    posthog?.capture("studio_cta_shown", { surface: LINK_CONTENT });
  }, [posthog]);

  /** `rungsText` is null for an empty project, which goes to the Studio home page. */
  const openInStudio = async (rungsText: string | null, noteCount: number) => {
    // Opened now, not after the await: a browser only allows a new tab during the click.
    const tab = window.open("about:blank", "_blank");
    const empty = rungsText === null;
    posthog?.capture("studio_cta_click", { surface: LINK_CONTENT, empty_project: empty, note_count: noteCount });
    let link: string;
    try {
      link = empty ? studioHomeLink(LINK_CONTENT) : await studioProjectLink(rungsText, LINK_CONTENT);
    } catch (error) {
      tab?.close();
      reportFailure(error);
      return;
    }
    if (tab) {
      tab.opener = null;
      tab.location.href = link;
    } else if (empty) {
      window.location.href = link;
    } else {
      // The project lives only in this tab, so leaving it would lose the person's work.
      store.dispatch({
        type: OPEN_ALERT_SNACKBAR,
        payload: { color: "error", open: true, text: "Your browser blocked the new tab. Allow pop-ups for this site and try again." },
      });
    }
  };

  const handleClick = () => {
    if (!hasProject) {
      void openInStudio(null, 0);
      return;
    }
    let conversion: Conversion;
    try {
      conversion = convertCurrentDiagram();
    } catch (error) {
      reportFailure(error);
      return;
    }
    if (conversion.notes.length > 0) setPending(conversion);
    else void openInStudio(conversion.rungsText, 0);
  };

  return (
    <Box
      sx={{
        alignItems: "center",
        backgroundColor: "#14171d",
        color: "#fff",
        display: "flex",
        flexWrap: mobileUI ? "wrap" : "nowrap",
        gap: 1,
        gridArea: "notice",
        justifyContent: "center",
        px: 2,
        py: 0.75,
      }}
    >
      <Typography noWrap={mobileUI} sx={{ fontSize: "0.875rem", maxWidth: "100%" }}>
        {mobileUI
          ? "PLC Simulator Online is moving to Rungs Studio."
          : "PLC Simulator Online is moving to Rungs Studio, a free online editor with ladder logic, Structured Text, tests and an AI assistant."}
      </Typography>
      <Button onClick={handleClick} size="small" sx={{ flexShrink: 0 }} variant="contained">
        {hasProject ? "Open this project in Rungs Studio" : "Open Rungs Studio"}
      </Button>
      <Dialog onClose={() => setPending(null)} open={pending !== null}>
        <DialogTitle>Before you open this project</DialogTitle>
        <DialogContent>
          <DialogContentText component="div">
            <ul>
              {pending?.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
            Your project here stays as it is.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPending(null)}>Cancel</Button>
          <Button
            onClick={() => {
              if (!pending) return;
              setPending(null);
              void openInStudio(pending.rungsText, pending.notes.length);
            }}
            variant="contained"
          >
            Open in Rungs Studio
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
