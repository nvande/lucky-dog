import React from 'react';
import { render, fireEvent, getByTestId } from '@testing-library/react';
import ToggleHelpBit from './ToggleHelpBit';

describe('ToggleHelpBit', () => {
  it('should render the component', () => {
    const { getByRole } = render(<ToggleHelpBit />);
    const button = getByTestId('show-help');
    expect(button).toBeInTheDocument();
  });

  it('should show help when the button is clicked', () => {
    const { getByRole } = render(<ToggleHelpBit />);
    const button = getByTestId('show-help');
    fireEvent.click(button);
    expect(button.innerHTML).toContain('TbHelpOff');
  });

  it('should hide help when the button is clicked twice', () => {
    const { getByRole } = render(<ToggleHelpBit />);
    const button = getByTestId('show-help');
    fireEvent.click(button);
    fireEvent.click(button);
    expect(button.innerHTML).toContain('TbHelp');
  });

  it('should hide tooltips when showHelp is false', () => {
    const { getByRole } = render(<ToggleHelpBit />);
    const button = getByTestId('show-help');
    expect(document.body.classList.contains('hide-tooltips')).toBeFalsy();
    fireEvent.click(button);
    expect(document.body.classList.contains('hide-tooltips')).toBeTruthy();
  });

  it('should set showHelp in local storage when it is toggled', () => {
    const { getByRole } = render(<ToggleHelpBit />);
    const button = getByTestId('show-help');
    expect(window.localStorage.getItem('showHelp')).toBeFalsy();
    fireEvent.click(button);
    expect(window.localStorage.getItem('showHelp')).toBeTruthy();
  });
});
