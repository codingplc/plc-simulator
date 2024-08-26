import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { ReactComponent as Delete } from '../../svg/varDelete.svg';
import { DELETE_VARIABLE } from '../../store/types';
import { DELETE_COL_WIDTH } from '../../consts/variableTableStyles';

const Container = styled.td`
  flex: 0 0 ${DELETE_COL_WIDTH};
  opacity: 0.8;
`;

interface Props {
  uuid: string;
}

export default function VariableDelete({ uuid }: Props) {
  const dispatch = useDispatch();
  const handleClick = () => {
    dispatch({ type: DELETE_VARIABLE, payload: { uuid: uuid } });
  };

  return (
    <Container>
      <Delete height={'calc(1.4rem - 2px)'} onClick={() => handleClick()} />
    </Container>
  );
}
