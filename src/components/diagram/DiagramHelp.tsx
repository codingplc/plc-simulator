import { OpenInNew } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import { SlSocialYoutube } from 'react-icons/sl';
import { LuFileText } from 'react-icons/lu';
import { useDispatch } from 'react-redux';
import { LOAD_SAMPLE } from '../../store/types';

export default function DiagramHelp() {
  const dispatch = useDispatch();
  return (
    <Box marginX="auto" display="flex" flexDirection="column">
      <Typography mb={3} color="#868e96" fontFamily="Virgil" fontSize="1.75em">
        Don&apos;t know where to start?
      </Typography>
      <Button
        component="a"
        href="https://plcsimulator.online/docs"
        target="_blank"
        rel="noopener noreferrer"
        endIcon={<OpenInNew />}
      >
        <Typography fontSize="1.25em">Read the documentation</Typography>
      </Button>
      <Button
        component="a"
        href="https://youtu.be/Cgd_Or1Mcac"
        target="_blank"
        rel="noopener noreferrer"
        endIcon={<SlSocialYoutube />}
      >
        <Typography fontSize="1.25em">Watch tutorial video</Typography>
      </Button>
      <Button onClick={() => dispatch({ type: LOAD_SAMPLE })} endIcon={<LuFileText />}>
        <Typography fontSize="1.25em">Load sample diagram</Typography>
      </Button>
    </Box>
  );
}
