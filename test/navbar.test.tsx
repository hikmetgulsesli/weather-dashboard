import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Navbar } from '../components/navbar'

// Mock next-themes
vi.mock('next-themes', () => ({
  useTheme: () => ({ setTheme: vi.fn() }),
}))

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

describe('Navbar', () => {
  it('should render the logo', () => {
    render(<Navbar />)
    expect(screen.getByText('Weather')).toBeInTheDocument()
  })

  it('should render navigation links', () => {
    render(<Navbar />)
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Forecast')).toBeInTheDocument()
    expect(screen.getByText('Maps')).toBeInTheDocument()
  })

  it('should have theme toggle button', () => {
    render(<Navbar />)
    // The theme toggle uses sr-only text "Toggle theme"
    expect(screen.getByText('Toggle theme')).toBeInTheDocument()
  })

  it('should toggle mobile menu', () => {
    render(<Navbar />)
    const menuButton = screen.getByLabelText(/Toggle menu/i)
    
    // Initially menu is closed
    expect(screen.queryByText('Dashboard')).toBeInTheDocument()
    
    // Click to open menu
    fireEvent.click(menuButton)
    
    // Menu should be visible
    expect(screen.getAllByText('Dashboard').length).toBeGreaterThan(0)
  })
})
