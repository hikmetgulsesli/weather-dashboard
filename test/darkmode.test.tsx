import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeToggle } from '../components/theme-toggle'

const mockSetTheme = vi.fn()

vi.mock('next-themes', () => ({
  useTheme: () => ({
    setTheme: mockSetTheme,
  }),
}))

describe('ThemeToggle', () => {
  it('should render theme toggle button', () => {
    render(<ThemeToggle />)
    // The theme toggle has sr-only text "Toggle theme"
    expect(screen.getByText('Toggle theme')).toBeInTheDocument()
  })

  it('should have sun and moon icons', () => {
    render(<ThemeToggle />)
    // Check for SVG icons (sun and moon are rendered as SVG)
    const svgs = document.querySelectorAll('svg')
    expect(svgs.length).toBeGreaterThanOrEqual(2)
  })
})
