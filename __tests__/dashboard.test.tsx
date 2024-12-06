import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from '../pages/dashboard/index';
import { BrowserRouter } from 'react-router-dom';
import { SessionProvider } from 'next-auth/react';
import { useRouter } from 'next/router';

// Polyfill TextEncoder
if (typeof TextEncoder === 'undefined') {
  global.TextEncoder = require('util').TextEncoder;
}
if (typeof TextDecoder === 'undefined') {
  global.TextDecoder = require('util').TextDecoder;
}

// Mock Firebase modules
jest.mock('firebase/analytics', () => ({
  getAnalytics: jest.fn(),
  isSupported: jest.fn(() => Promise.resolve(false))
}));

jest.mock('firebase/app', () => ({
  initializeApp: jest.fn()
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn()
}));

jest.mock('firebase/database', () => ({
  getDatabase: jest.fn(),
  ref: jest.fn(),
  get: jest.fn()
}));

// Mock Next Router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/dashboard',
    route: '/dashboard',
    asPath: '/dashboard',
    query: {},
  }),
}));

// Mock useFirebaseDB hook
jest.mock('../hooks/useFirebaseDB', () => ({
  useFirebaseDB: () => ({
    useDecks: () => ({
      decks: [],
      loading: false,
    }),
  }),
}));

beforeAll(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

it('renders Dashboard component', async () => {
  render(
    <SessionProvider session={null}>
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    </SessionProvider>
  );
  const linkElement = await screen.findByText(/Dashboard/i);
  expect(linkElement).toBeInTheDocument();
});
