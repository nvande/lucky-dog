import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Cookies from 'universal-cookie';
import { MemoryRouter } from 'react-router-dom';

import * as LoginUtility from '../utility/LoginUtility';

jest.mock('../utility/LoginUtility');


import HeaderComponent from './HeaderComponent';

// Mocks
jest.mock('../utility/LoginUtility', () => ({
  logout: jest.fn(),
}));

// Constants
const user = 'John Doe';

describe('HeaderComponent', () => {
  // Before each test, reset the cookies and mock functions
  beforeEach(() => {
    jest.clearAllMocks();
    const cookies = new Cookies();
    cookies.remove('name', { path: '/' });
    cookies.remove('user', { path: '/' });
  });

  it('renders the logo when there is no user', () => {
    render(
      <MemoryRouter>
        <HeaderComponent />
      </MemoryRouter>
    );
    const logo = screen.getByText('lucky dog!');
    expect(logo).toBeInTheDocument();
  });

  it('renders the logo, username, and logout button when there is a user', () => {
    const cookies = new Cookies();
    cookies.set('user', user, { path: '/' });
    render(
      <MemoryRouter>
        <HeaderComponent />
      </MemoryRouter>
    );
    const logo = screen.getByText('lucky dog!');
    expect(logo).toBeInTheDocument();
    const username = screen.getByText(user);
    expect(username).toBeInTheDocument();
    const logoutButton = screen.getByText('Log Out');
    expect(logoutButton).toBeInTheDocument();
  });

  it('logs out when the logout button is clicked', () => {
    const cookies = new Cookies();
    cookies.set('user', user, { path: '/' });
    render(
      <MemoryRouter>
        <HeaderComponent />
      </MemoryRouter>
    );
    const logoutButton = screen.getByText('Log Out');
    fireEvent.click(logoutButton);
    expect(LoginUtility.logout).toHaveBeenCalled();
    expect(window.location.pathname).toBe('/');
  });
});
