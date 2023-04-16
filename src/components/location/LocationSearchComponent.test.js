import { render, screen, fireEvent } from '@testing-library/react';
import LocationSearchComponent from './LocationSearchComponent';

describe('LocationSearchComponent', () => {
  it('should render without errors', () => {
    render(<LocationSearchComponent />);
    expect(screen.getByRole('textbox', { name: /filter/i })).toBeInTheDocument();
  });
});
