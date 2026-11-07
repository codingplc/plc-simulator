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
import { diagramToRungs } from "../rungs/diagramToRungs";
import { studioHomeLink, studioProjectLink } from "../rungs/projectLink";

const LINK_CONTENT = "migration_notice";

// Fired once per page load, like the other Studio surfaces.
let shownFired = false;

function convertCurrentDiagram() {
  const { branches, elements, runglist, rungs, variables } = store.getState() as unknown as Store;
  return diagramToRungs({ branches, elements, runglist, rungs, variables });
}

const isEmptyDiagram = () => Object.keys((store.getState() as unknown as Store).elements).length === 0;

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
  const [notes, setNotes] = useState<string[]>([]);
  const hasProject = useSelector((state: Store) => Object.keys(state.elements).length > 0);

  useEffect(() => {
    if (shownFired) return;
    shownFired = true;
    posthog?.capture("studio_cta_shown", { surface: LINK_CONTENT });
  }, [posthog]);

  const openInStudio = async (noteCount: number) => {
    // Opened now, not after the await: a browser only allows a new tab during the click.
    const tab = window.open("about:blank", "_blank");
    const empty = isEmptyDiagram();
    posthog?.capture("studio_cta_click", { surface: LINK_CONTENT, empty_project: empty, note_count: noteCount });
    let link: string;
    try {
      link = empty
        ? studioHomeLink(LINK_CONTENT)
        : await studioProjectLink(convertCurrentDiagram().rungsText, LINK_CONTENT);
    } catch (error) {
      // Without this the person is left with an empty tab and no word of what went wrong.
      tab?.close();
      Sentry.captureException(error);
      store.dispatch({
        type: OPEN_ALERT_SNACKBAR,
        payload: { color: "error", open: true, text: "This project could not be opened in Rungs Studio." },
      });
      return;
    }
    if (tab) {
      tab.opener = null;
      tab.location.href = link;
    } else {
      window.location.href = link;
    }
  };

  const handleClick = () => {
    const found = isEmptyDiagram() ? [] : convertCurrentDiagram().notes;
    if (found.length > 0) setNotes(found);
    else void openInStudio(0);
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
      <Dialog onClose={() => setNotes([])} open={notes.length > 0}>
        <DialogTitle>Before you open this project</DialogTitle>
        <DialogContent>
          <DialogContentText component="div">
            <ul>
              {notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
            Your project here stays as it is.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNotes([])}>Cancel</Button>
          <Button
            onClick={() => {
              const noteCount = notes.length;
              setNotes([]);
              void openInStudio(noteCount);
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
