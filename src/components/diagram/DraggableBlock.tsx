import { useDispatch, useSelector } from 'react-redux';
import { ElementDropResult, Store } from '../../interface';
import { DROP_BLOCK, OPEN_ELEM_PROPERTIES, SELECT_OBJECT } from '../../store/types';
import { useDrag, useDrop } from 'react-dnd';
import { Box } from '@mui/system';
import { BLOCK, BRANCH } from '../../consts/itemTypes';
import LadderBlock from './LadderBlock';
import { useEffect } from 'react';
import { getEmptyImage } from 'react-dnd-html5-backend';

interface Props {
  blockIndex: number;
  isOnlyElementOf1stRung: boolean;
  parrentId: string;
  parrentSelected: boolean;
  uuid: string;
}

export default function DraggableBlock(props: Props) {
  const { blockIndex, isOnlyElementOf1stRung, parrentId, parrentSelected, uuid } = props;
  const dispatch = useDispatch();
  const simulation = useSelector((state: Store) => state.temp.simulation);
  const selectedUuid = useSelector((state: Store) => state.temp.selectedUuid);
  const selected = selectedUuid === uuid || parrentSelected;

  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: BLOCK,
      item: { dragBlockIndex: blockIndex, dragRungId: parrentId, uuid },
      end: (item, monitor) => {
        const dropResult: ElementDropResult | null = monitor.getDropResult();
        if (item && dropResult) {
          const { dragBlockIndex, dragRungId } = item;
          const { dropIndex, dropRungId, type } = dropResult;
          const wireDropIndex =
            dragRungId === dropRungId && dropIndex > dragBlockIndex ? dropIndex - 1 : dropIndex;
          const blockDropIndex = dragRungId === dropRungId ? dropIndex : dropIndex + 1;
          const modDropIndex = type === BLOCK ? blockDropIndex : wireDropIndex;
          return dispatch({
            type: DROP_BLOCK,
            payload: { dragRungId, dragIndex: dragBlockIndex, dropRungId, dropIndex: modDropIndex },
          });
        }
      },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [],
  );

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: [BLOCK, BRANCH],
      drop: (): ElementDropResult => ({
        type: BLOCK,
        dropId: uuid,
        dropIndex: blockIndex,
        dropRungId: parrentId,
      }),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
      canDrop: () => {
        return !isDragging;
      },
    }),
    [parrentId, blockIndex, isDragging],
  );

  const combinedRef = (node: HTMLElement) => {
    drag(node);
    drop(node);
  };

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, []);

  const handleOnClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    uuid === selectedUuid && !simulation
      ? dispatch({
          type: OPEN_ELEM_PROPERTIES,
          payload: true,
        })
      : dispatch({
          type: SELECT_OBJECT,
          payload: { uuid },
        });
  };

  return (
    <Box
      sx={{
        boxSizing: 'border-box',
        display: 'flex',
        flexShrink: 0,
        opacity: isDragging ? 0.5 : 1,
        pb: '0.5em',
        position: 'relative',
        zIndex: 0,
      }}
      ref={combinedRef}
      role="DraggableBox"
      onClick={(e) => {
        handleOnClick(e);
      }}
    >
      <LadderBlock
        isOnlyElementOf1stRung={isOnlyElementOf1stRung}
        isOver={isOver && !isDragging}
        parrentSelected={selected}
        uuid={uuid}
      />
    </Box>
  );
}
