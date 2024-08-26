import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ElementDropResult, ElementsAll } from '../../interface';
import { Box } from '@mui/material';
import { useDrag } from 'react-dnd';
import { BRANCH } from '../../consts/itemTypes';
import ToolboxIcon from './ToolboxIcon';
import { ADD_BRANCH, DROP_BRANCH } from '../../store/types';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { nanoid } from 'nanoid';

interface Props {
  Svg: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
}

export default function ToolboxBranch({ Svg }: Props) {
  const dispatch = useDispatch();

  const handleOnClick = (type: string, block?: ElementsAll) => dispatch({ type, payload: { block, blockId: nanoid() } });

  const [, drag, preview] = useDrag(
    () => ({
      type: BRANCH,
      item: {},
      end: (item, monitor) => {
        const dropResult: ElementDropResult | null = monitor.getDropResult();
        if (item && dropResult) {
          const { dropId } = dropResult;
          return dispatch({
            type: DROP_BRANCH,
            payload: { targetId: dropId },
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
      onClick={() => handleOnClick(ADD_BRANCH)}
    >
      <ToolboxIcon Svg={Svg} />
    </Box>
  );
}
