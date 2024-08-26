import { useSelector } from 'react-redux';
import { Store } from '../../interface';
import Rung from './Rung';
import AddBanner from './AddBanner';
import { Box } from '@mui/material';
import { BG_DIAGRAM } from '../../consts/colors';
import DiagramHelp from './DiagramHelp';

interface Props {
  mobileUI: boolean;
}

export default function Diagram(props: Props) {
  const mobileUI = props.mobileUI;
  const runglist = useSelector((state: Store) => state.runglist);
  const displayDiagramHelp = runglist.length === 1;

  return (
    <Box
      sx={{
        background: BG_DIAGRAM,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        fontSize: mobileUI ? '12px' : '16px',
        gridArea: 'diagram',
        height: '100%',
        justifyContent: 'space-between',
        overflow: 'auto',
        outline: 'none',
      }}
    >
      <Box p="0.25em">
        {runglist.map((uuid: string, index) => (
          <Rung key={`rung-${uuid}`} index={index} uuid={uuid} mobileUI={mobileUI} />
        ))}
      </Box>
      {displayDiagramHelp && <DiagramHelp />}
      <AddBanner />
    </Box>
  );
}
