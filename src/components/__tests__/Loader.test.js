import { create } from 'react-test-renderer';
import AtharesLoader from '../AtharesLoader.js';
import React from 'react';

describe('Loader component', () => {
  it('should render loader component', () => {
    const tree = create(<AtharesLoader />);

    expect(tree).toMatchSnapshot();
  });
});
