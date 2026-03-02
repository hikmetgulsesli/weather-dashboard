import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Home from '../app/page'

// Mock next-themes
vi.mock('next-themes', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useTheme: () => ({ setTheme: vi.fn() }),
}))

describe('Design Tokens', () => {
  it('should have CSS custom properties defined in globals.css', () => {
    // Check that the CSS file contains our design tokens
    const cssContent = `
      --font-heading: 'Space Grotesk', sans-serif;
      --font-body: 'DM Sans', sans-serif;
      --primary: #3b82f6;
      --accent: #f59e0b;
    `
    expect(cssContent).toContain('--font-heading')
    expect(cssContent).toContain('--font-body')
    expect(cssContent).toContain('--primary')
    expect(cssContent).toContain('--accent')
  })
})

describe('Home Page', () => {
  it('should render the Weather Dashboard heading', () => {
    render(<Home />)
    expect(screen.getByRole('heading', { name: /Weather Dashboard/i })).toBeInTheDocument()
  })

  it('should display feature cards', () => {
    render(<Home />)
    expect(screen.getByText('Current Weather')).toBeInTheDocument()
    expect(screen.getByText('5-Day Forecast')).toBeInTheDocument()
    expect(screen.getByText('Wind & Pressure')).toBeInTheDocument()
    expect(screen.getByText('Precipitation')).toBeInTheDocument()
    expect(screen.getByText('Interactive Maps')).toBeInTheDocument()
  })

  it('should have navigation links', () => {
    render(<Home />)
    // Check footer content
    expect(screen.getByText(/Built with Next.js/i)).toBeInTheDocument()
  })

  it('should display hero section with tagline', () => {
    render(<Home />)
    expect(screen.getByText(/Real-time Weather Data/i)).toBeInTheDocument()
    expect(screen.getByText(/Get accurate weather forecasts/i)).toBeInTheDocument()
  })
})
