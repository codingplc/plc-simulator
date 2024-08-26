import React from 'react';
import { __COMPONENT_NAME__ } from './__COMPONENT_NAME__';
import { mount } from 'enzyme';

describe('__COMPONENT_NAME__', () => {
    it('renders correctly', () => {
        const props = {
            show: true
        }
        const tree = mount(<__COMPONENT_NAME__ {...props} />);
        expect(tree).toMatchSnapshot();
    });
})