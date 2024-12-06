import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from '../pages/dashboard/index';

// Mock Firebase to prevent real initialization
jest.mock('../lib/firebase', () => ({
  ...jest.requireActual('../lib/firebase'),
  analytics: jest.fn(),
}));

// Suppress console warnings in tests
beforeAll(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

// Basic test to check if the Dashboard component renders without crashing
it('renders Dashboard component', async () => {
  render(<Dashboard />);
  const linkElement = await screen.findByText(/Dashboard/i);
  expect(linkElement).toBeInTheDocument();
});
