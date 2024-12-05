import { render, screen } from '@testing-library/react';
import Dashboard from '../pages/dashboard/index';

// Basic test to check if the Dashboard component renders without crashing
it('renders Dashboard component', () => {
  render(<Dashboard />);
  const linkElement = screen.getByText(/Dashboard/i);
  expect(linkElement).toBeInTheDocument();
});
