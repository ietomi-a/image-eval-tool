import React from 'react';
import {cleanup, render, screen} from '@testing-library/react';

import {LoginLinkHeader} from '../src/header';


afterEach(() => cleanup());

test('jsx test', () => {
  const { queryByText } = render(<LoginLinkHeader />);
  expect(queryByText("login")).toBeTruthy();
});

test('jsx test2', () => {
  const { queryByText } = render(<LoginLinkHeader />);
  expect(queryByText("register")).toBeTruthy();  
});
