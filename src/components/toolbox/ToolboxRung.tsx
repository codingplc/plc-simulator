import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { RungDropResult } from '../../interface';
import { Box } from '@mui/material';
import { useDrag } from 'react-dnd';
import { TOOL_RUNG } from '../../consts/itemTypes';
import ToolboxIcon from './ToolboxIcon';
import { ADD_RUNG } from '../../store/types';
import { getEmptyImage } from 'react-dnd-html5-backend';

interface Props {
  Svg: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
}

export default function ToolboxRung({ Svg }: Props) {
  const dispatch = useDispatch();

  const [, drag, preview] = useDrag(
    () => ({
      type: TOOL_RUNG,
      item: {},
      end: (item, monitor) => {
        const dropResult: RungDropResult | null = monitor.getDropResult();
        if (item && dropResult) {
          const { dropIndex } = dropResult;
          return dispatch({
            type: ADD_RUNG,
            payload: { dropIndex },
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
      onClick={() => dispatch({ type: ADD_RUNG, payload: {} })}
    >
      <ToolboxIcon Svg={Svg} />
    </Box>
  );
}
