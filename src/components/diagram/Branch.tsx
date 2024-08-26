import React from 'react';
import { useSelector } from 'react-redux';
import { ELEMENT, OUT_ON, SELECTED } from '../../consts/colors';
import { Store } from '../../interface';
import BranchRung from './BranchRung';
import { Box } from '@mui/material';
import { MID_CELL_HEIGHT, TYPE_HEIGHT, VAR_HEIGHT } from '../../consts/blockDimensions';
import { nanoid } from 'nanoid';

interface Props {
  uuid: string;
  parrentSelected: boolean;
}

export default function Branch(props: Props) {
  const { uuid, parrentSelected } = props;
  const branches = useSelector((state: Store) => state.branches);
  const simulation = useSelector((state: Store) => state.temp.simulation);
  const selectedUuid = useSelector((state: Store) => state.temp.selectedUuid);
  const branch = branches[uuid];
  const branchRungs = branch.rungs;
  const { input, out } = branch;
  const fillTopLeft = simulation ? (input ? OUT_ON : ELEMENT) : parrentSelected ? SELECTED : ELEMENT;

  const fillMarginRight = simulation ? (out ? OUT_ON : ELEMENT) : parrentSelected ? SELECTED : ELEMENT;

  return (
    <Box display="flex" flexShrink="0">
      <Box
        sx={{
          backgroundColor: fillTopLeft,
          flexShrink: 0,
          marginTop: `calc(${TYPE_HEIGHT} + ${VAR_HEIGHT} - 0.125em + (${MID_CELL_HEIGHT} / 2))`,
          height: '0.25em',
          width: '0.5em',
        }}
      />
      <Box
        sx={{
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
        }}
      >
        {branchRungs.map((rungId, index) => {
          const selected = selectedUuid === rungId || parrentSelected;
          let position: 'middle' | 'top' | 'bottom' = 'middle';
          let fillLeft = simulation ? (input ? OUT_ON : ELEMENT) : selected ? SELECTED : ELEMENT;
          let fillRight = simulation ? (out ? OUT_ON : ELEMENT) : selected ? SELECTED : ELEMENT;
          if (index === 0) {
            position = 'top';
            fillLeft = simulation ? (input ? OUT_ON : ELEMENT) : selected ? SELECTED : ELEMENT;
            fillRight = simulation ? (out ? OUT_ON : ELEMENT) : selected ? SELECTED : ELEMENT;
          } else if (index === branchRungs.length - 1) {
            position = 'bottom';
            fillLeft = simulation ? (input ? OUT_ON : ELEMENT) : selected ? SELECTED : ELEMENT;
            fillRight = simulation ? (out ? OUT_ON : ELEMENT) : selected ? SELECTED : ELEMENT;
          }
          return <BranchRung key={nanoid()} uuid={rungId} parrentSelected={parrentSelected} position={position} fillLeft={fillLeft} fillRight={fillRight} />;
        })}
      </Box>
      <Box
        sx={{
          backgroundColor: fillMarginRight,
          flexShrink: 0,
          marginTop: `calc(${TYPE_HEIGHT} + ${VAR_HEIGHT} - 0.125em + (${MID_CELL_HEIGHT} / 2))`,
          height: '0.25em',
          width: '0.5em',
        }}
      />
    </Box>
  );
}
