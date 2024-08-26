import { Box, Button, Link, Typography } from '@mui/material';
import { FiInfo, FiMail } from 'react-icons/fi';
import styled from 'styled-components';

const Container = styled.div`
  background-color: #abcdef;
  bottom: 0;
  display: flex;
  grid-area: footer;
  height: 1.75rem;
  justify-content: space-between;
  left: 0;
  position: relative;
  right: 0;
`;

type Props = {
  mobileUI: boolean;
};

export default function Footer({ mobileUI }: Props) {
  return (
    <Container>
      {!mobileUI && (
        <Box sx={{ color: '#5C5C5C' }} my="auto">
          <Button color="inherit" href="https://plcsimulator.online/about" target="_blank" rel="noopener noreferrer" size="small" startIcon={<FiInfo />}>
            About
          </Button>
          <Button color="inherit" target="_blank" rel="noopener noreferrer" href="https://plcsimulator.online/contact" size="small" startIcon={<FiMail />}>
            Contact
          </Button>
        </Box>
      )}
      <Box mx={1} my="auto">
        <Typography variant="body2" align="center">
          <Link href="https://www.patreon.com/plc_simulator_online" color="inherit" target="_blank" rel="noopener noreferrer">
            SUPPORT US ON PATREON
          </Link>
        </Typography>
      </Box>
      <Box sx={{ color: '#5C5C5C' }} mx={1} my="auto">
        <Typography variant="body2" align="center" color="inherit">
          {'© '}
          <Link href="https://www.codingplc.com/" color="inherit" target="_blank" rel="noopener noreferrer">
            CodingPLC
          </Link>{' '}
          {new Date().getFullYear()}
        </Typography>
      </Box>
    </Container>
  );
}
