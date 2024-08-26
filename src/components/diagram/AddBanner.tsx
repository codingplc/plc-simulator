import { Box } from '@mui/material';
import { nanoid } from 'nanoid';
import AdSense from './AdSense';

export default function AddBanner() {
  return (
    <Box width={'100%'} height={'120px'} p={1}>
      <AdSense key={nanoid()} />
    </Box>
  );
}
