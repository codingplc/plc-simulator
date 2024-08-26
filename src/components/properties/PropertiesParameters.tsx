import Select from 'react-select';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { ASSIGN_PARAMETER } from '../../store/types';
import { filterByType } from '../../helpers/variables';
import { ElementParameter, Store, VariableOption } from '../../interface';
import { Box, Typography } from '@mui/material';
import { nanoid } from 'nanoid';

export default function PropertiesParameters() {
  const dispatch = useDispatch();
  const selectedUuid = useSelector((state: Store) => state.temp.selectedUuid);
  const element = useSelector((state: Store) => state.elements[selectedUuid]);
  const variables = useSelector((state: Store) => state.variables, shallowEqual);

  const handleOnchange = (option: VariableOption, index: number, paramGrp: string, paramUuid: string) => {
    if (option.value === paramUuid) return;
    dispatch({
      type: ASSIGN_PARAMETER,
      payload: {
        variableUuid: option.value,
        index,
        type: paramGrp,
      },
    });
  };

  if (!element) return null;
  return (
    <Box
      sx={{
        backgroundColor: 'white',
        margin: '0px',
      }}
    >
      {Object.keys(element.parameters).map((paramGrp) => (
        <Box key={nanoid()}>
          <Typography mb={1} variant="h6">{`${paramGrp.charAt(0).toUpperCase() + paramGrp.slice(1)} parameters`}</Typography>
          {element.parameters[paramGrp].map((parameter: ElementParameter, index: number) => {
            const options = filterByType(variables, parameter.type);
            return (
              <Box key={nanoid()} mb={1}>
                <Select
                  isSearchable={false}
                  onChange={(option) => handleOnchange(option as VariableOption, index, paramGrp, parameter.uuid)}
                  options={options}
                  noOptionsMessage={() => `Add ${parameter.type.join(' or ')} variable in Variables tab`}
                  value={options.filter((option: VariableOption) => option.value === parameter.uuid)}
                />
              </Box>
            );
          })}
        </Box>
      ))}
    </Box>
  );
}
