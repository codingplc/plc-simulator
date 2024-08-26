import { BG_TOOLBOX } from '../../consts/colors';
import { coil, compare, contact, counter, math, move, timer } from './elements';
import { ReactComponent as Branch } from '../../svg/toolbox/branch.svg';
import { ReactComponent as Coil } from '../../svg/toolbox/coil.svg';
import { ReactComponent as Contact } from '../../svg/toolbox/contact.svg';
import { ReactComponent as Counter } from '../../svg/toolbox/counter.svg';
import { ReactComponent as Compare } from '../../svg/toolbox/compare.svg';
import { ReactComponent as Math } from '../../svg/toolbox/math.svg';
import { ReactComponent as Move } from '../../svg/toolbox/move.svg';
import { ReactComponent as Rung } from '../../svg/toolbox/rung.svg';
import { ReactComponent as Timer } from '../../svg/toolbox/timer.svg';
import ToolboxBlock from './ToolboxBlock';
import { Box } from '@mui/material';
import ToolboxBranch from './ToolboxBranch';
import ToolboxRung from './ToolboxRung';

export default function Toolbox() {
  return (
    <Box
      sx={{
        backgroundColor: BG_TOOLBOX,
        display: 'flex',
        flex: '1 1 auto',
        gridArea: 'toolbox',
      }}
    >
      <ToolboxBlock block={contact} Svg={Contact} />
      <ToolboxBlock block={coil} Svg={Coil} />
      <ToolboxBlock block={timer} Svg={Timer} />
      <ToolboxBlock block={counter} Svg={Counter} />
      <ToolboxBlock block={math} Svg={Math} />
      <ToolboxBlock block={compare} Svg={Compare} />
      <ToolboxBlock block={move} Svg={Move} />
      <ToolboxBranch Svg={Branch} />
      <ToolboxRung Svg={Rung} />
    </Box>
  );
}
