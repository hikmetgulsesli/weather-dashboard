import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorState } from '@/components/error-state';

describe('ErrorState', () => {
  it('renders error message', () => {
    render(<ErrorState message="Failed to fetch weather data" />);
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Failed to fetch weather data')).toBeInTheDocument();
  });

  it('renders retry button when onRetry is provided', () => {
    const mockRetry = jest.fn();
    render(<ErrorState message="Error" onRetry={mockRetry} />);
    
    const retryButton = screen.getByText('Try Again');
    expect(retryButton).toBeInTheDocument();
    
    fireEvent.click(retryButton);
    expect(mockRetry).toHaveBeenCalledTimes(1);
  });

  it('does not render retry button when onRetry is not provided', () => {
    render(<ErrorState message="Error" />);
    
    expect(screen.queryByText('Try Again')).not.toBeInTheDocument();
  });

  it('renders alert icon', () => {
    render(<ErrorState message="Error" />);
    
    // Lucide icons are SVGs with aria-hidden, check for the container instead
    expect(document.querySelector('svg')).toBeInTheDocument();
  });
});
