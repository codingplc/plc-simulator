import type { CSSProperties } from 'react';
import type { XYCoord } from 'react-dnd';
import { useDragLayer } from 'react-dnd';
import { Box } from '@mui/material';
import { BLOCK, BRANCH, TOOL_RUNG } from './consts/itemTypes';
import LadderBlock from './components/diagram/LadderBlock';
import Wire from './components/diagram/Wire';
import { POWER_RAIL_WIDTH } from './consts/blockDimensions';
import { ELEMENT } from './consts/colors';
import { Identifier } from 'dnd-core';

const layerStyles: CSSProperties = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
};

function getItemStyles(itemType: Identifier | null, initialOffset: XYCoord | null, currentOffset: XYCoord | null, clientOffset: XYCoord | null) {
  if (!initialOffset || !currentOffset || !clientOffset) {
    return {
      display: 'none',
    };
  }

  let x = clientOffset.x;
  const y = clientOffset.y;
  if (itemType === BRANCH) x = x - 32;
  if (itemType === TOOL_RUNG) x = x - 120;

  const transform = `translate(${x}px, ${y}px)`;
  return {
    transform,
    WebkitTransform: transform,
  };
}

export const CustomDragLayer = () => {
  const { itemType, isDragging, item, initialOffset, currentOffset, clientOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    clientOffset: monitor.getClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  function renderItem() {
    switch (itemType) {
      case BLOCK:
        return (
          <Box
            sx={{
              opacity: 0.7,
            }}
          >
            <LadderBlock isOnlyElementOf1stRung={false} isOver={false} parrentSelected={false} uuid={item.uuid} toolboxType={item.type} />
          </Box>
        );
      case BRANCH:
        return (
          <Box
            sx={{
              borderLeft: '0.25em solid black',
              borderBottom: '0.25em solid black',
              borderRight: '0.25em solid black',
              height: '5em',
              width: '4em',
              opacity: 0.7,
            }}
          />
        );
      case TOOL_RUNG:
        return (
          <Box
            sx={{
              display: 'flex',
              height: '6em',
              width: '16em',
              opacity: 0.7,
            }}
          >
            <Box flexShrink={0} bgcolor={ELEMENT} width={POWER_RAIL_WIDTH} />
            <Box
              sx={{
                display: 'flex',
                py: '0.25em',
                minWidth: 'calc(100% - 0.5em)',
                flexShrink: 0,
              }}
            >
              <Wire color={ELEMENT} flexIndex={0} parrentId={''} />
            </Box>
            <Box
              sx={{
                bgcolor: ELEMENT,
                flexShrink: 0,
                width: POWER_RAIL_WIDTH,
              }}
            />
          </Box>
        );
      default:
        return null;
    }
  }

  if (!isDragging) {
    return null;
  }
  return (
    <div style={layerStyles}>
      <div style={getItemStyles(itemType, initialOffset, currentOffset, clientOffset)}>{renderItem()}</div>
    </div>
  );
};
