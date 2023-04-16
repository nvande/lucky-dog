import React from 'react';
import { render } from '@testing-library/react';
import TooltipBit from './TooltipBit';

describe('TooltipBit', () => {
  it('renders without crashing', () => {
    render(
      <TooltipBit tip="This is a tooltip">
        <button>Click me</button>
      </TooltipBit>
    );
  });
});
