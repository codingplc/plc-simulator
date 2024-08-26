import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ElementDropResult, ElementsAll } from '../../interface';
import { Box } from '@mui/material';
import { useDrag } from 'react-dnd';
import { BLOCK, WIRE } from '../../consts/itemTypes';
import { ADD_ELEMENT } from '../../store/types';
import ToolboxIcon from './ToolboxIcon';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { nanoid } from 'nanoid';

interface Props {
  block: ElementsAll;
  Svg: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
}

export default function ToolboxBlock({ block, Svg }: Props) {
  const dispatch = useDispatch();

  const [, drag, preview] = useDrag(
    () => ({
      type: BLOCK,
      item: { type: block.type },
      end: (item, monitor) => {
        const dropResult: ElementDropResult | null = monitor.getDropResult();
        if (item && dropResult) {
          const { dropIndex, dropRungId, type } = dropResult;
          const modDropIndex = type === WIRE ? dropIndex : dropIndex + 1;
          return dispatch({
            type: ADD_ELEMENT,
            payload: { block, blockId: nanoid(), dropRungId, dropIndex: modDropIndex },
          });
        }
      },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [],
  );

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, []);

  return (
    <Box
      sx={{
        margin: '0.25rem',
        position: 'relative',
        width: '4rem',
        '&::after': {
          content: '""',
          display: 'block',
          paddingBottom: '100%',
        },
      }}
      ref={drag}
      onClick={() => dispatch({ type: ADD_ELEMENT, payload: { block, blockId: nanoid() } })}
    >
      <ToolboxIcon Svg={Svg} />
    </Box>
  );
}
