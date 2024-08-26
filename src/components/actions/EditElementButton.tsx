import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Store } from '../../interface';
import { OPEN_ELEM_PROPERTIES } from '../../store/types';
import { ReactComponent as EditPencil } from '../../svg/editPencil.svg';
import Properties from '../properties/Properties';
import ActionButton from './ActionButton';

export default function EditElementButton() {
  const dispatch = useDispatch();
  const selectedUuid = useSelector((state: Store) => state.temp.selectedUuid);
  const elementKeys = useSelector((state: Store) => Object.keys(state.elements), shallowEqual);
  const enabled = elementKeys.includes(selectedUuid);
  const handleClick = () => enabled && dispatch({ type: OPEN_ELEM_PROPERTIES, payload: true });

  return (
    <>
      <ActionButton enabled={enabled} onClick={() => handleClick()} Svg={EditPencil} />
      <Properties />
    </>
  );
}
