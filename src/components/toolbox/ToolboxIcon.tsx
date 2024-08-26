import React from 'react';
import { Box } from '@mui/material';

interface Props {
  Svg: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
}

export default function ToolboxIcon({ Svg }: Props) {
  return (
    <Box
      sx={{
        background: 'rgba(255, 255, 255, 0.7)',
        borderRadius: '10%',
        display: 'flex',
        position: 'absolute',
        height: '100%',
        width: '100%',
      }}
    >
      <Svg
        style={{
          height: '100%',
          margin: 'auto',
          opacity: '0.8',
          width: '100%',
        }}
      />
    </Box>
  );
}
