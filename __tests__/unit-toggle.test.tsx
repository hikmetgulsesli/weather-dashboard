import { render, screen, fireEvent } from '@testing-library/react';
import { UnitToggle } from '@/components/unit-toggle';

describe('UnitToggle', () => {
  const mockOnToggle = jest.fn();

  beforeEach(() => {
    mockOnToggle.mockClear();
  });

  it('renders both unit buttons', () => {
    render(<UnitToggle unit="celsius" onToggle={mockOnToggle} />);
    
    expect(screen.getByText('°C')).toBeInTheDocument();
    expect(screen.getByText('°F')).toBeInTheDocument();
  });

  it('highlights celsius when unit is celsius', () => {
    render(<UnitToggle unit="celsius" onToggle={mockOnToggle} />);
    
    const celsiusButton = screen.getByLabelText('Switch to Celsius');
    const fahrenheitButton = screen.getByLabelText('Switch to Fahrenheit');
    
    expect(celsiusButton).toHaveAttribute('aria-pressed', 'true');
    expect(fahrenheitButton).toHaveAttribute('aria-pressed', 'false');
  });

  it('highlights fahrenheit when unit is fahrenheit', () => {
    render(<UnitToggle unit="fahrenheit" onToggle={mockOnToggle} />);
    
    const celsiusButton = screen.getByLabelText('Switch to Celsius');
    const fahrenheitButton = screen.getByLabelText('Switch to Fahrenheit');
    
    expect(celsiusButton).toHaveAttribute('aria-pressed', 'false');
    expect(fahrenheitButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('calls onToggle with celsius when celsius button is clicked', () => {
    render(<UnitToggle unit="fahrenheit" onToggle={mockOnToggle} />);
    
    const celsiusButton = screen.getByLabelText('Switch to Celsius');
    fireEvent.click(celsiusButton);
    
    expect(mockOnToggle).toHaveBeenCalledWith('celsius');
  });

  it('calls onToggle with fahrenheit when fahrenheit button is clicked', () => {
    render(<UnitToggle unit="celsius" onToggle={mockOnToggle} />);
    
    const fahrenheitButton = screen.getByLabelText('Switch to Fahrenheit');
    fireEvent.click(fahrenheitButton);
    
    expect(mockOnToggle).toHaveBeenCalledWith('fahrenheit');
  });

  it('has correct accessibility attributes', () => {
    render(<UnitToggle unit="celsius" onToggle={mockOnToggle} />);
    
    expect(screen.getByLabelText('Switch to Celsius')).toBeInTheDocument();
    expect(screen.getByLabelText('Switch to Fahrenheit')).toBeInTheDocument();
  });
});
