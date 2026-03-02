import { render, screen } from '@testing-library/react';
import Page from './page';

describe('Weather Dashboard', () => {
  it('renders the main page', () => {
    render(<Page />);
    expect(screen.getByText(/get started/i)).toBeInTheDocument();
  });
});
