import React from 'react';
import { render } from '@testing-library/react';
import FooterComponent from './FooterComponent';

describe('FooterComponent', () => {
  it('renders footer text', () => {
    const footer = 'Copyright © 2023';
    const { getByText } = render(<FooterComponent footer={footer} />);
    expect(getByText(footer)).toBeInTheDocument();
  });

  it('renders attributes text', () => {
    const attributes = 'All rights reserved.';
    const { getByText } = render(<FooterComponent attributes={attributes} />);
    expect(getByText(attributes)).toBeInTheDocument();
  });

  it('renders both footer and attributes text', () => {
    const footer = 'Copyright © 2023';
    const attributes = 'All rights reserved.';
    const { getByText } = render(<FooterComponent footer={footer} attributes={attributes} />);
    expect(getByText(footer)).toBeInTheDocument();
    expect(getByText(attributes)).toBeInTheDocument();
  });
});
