import React from 'react';
import {cleanup, render, screen} from '@testing-library/react';

import {LoginLinkHeader} from '../src/header';


afterEach(() => cleanup());

test('jsx test', () => {
  const { queryByLabelText, queryByText } = render(<LoginLinkHeader />);
  expect(queryByText("login")).toBeTruthy();
  expect(queryByText("register")).toBeTruthy();  
});
