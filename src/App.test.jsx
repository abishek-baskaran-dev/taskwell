import { beforeEach, describe, expect, it } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App.jsx'

const STORAGE_KEY = 'daymark-todos-v1'
const THEME_KEY = 'daymark-theme-v1'

describe('Taskwell', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('adds a task and saves it in local storage', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByRole('textbox', { name: 'Add a task' }), 'Write unit tests')
    await user.click(screen.getByRole('button', { name: /Add task/ }))

    expect(screen.getByText('Write unit tests')).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toEqual([
      expect.objectContaining({ title: 'Write unit tests', completed: false }),
    ])
  })

  it('marks a task complete and filters completed tasks', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByRole('textbox', { name: 'Add a task' }), 'Review the pull request')
    await user.click(screen.getByRole('button', { name: /Add task/ }))
    await user.click(screen.getByRole('button', { name: 'Complete Review the pull request' }))
    await user.click(screen.getByRole('button', { name: /^Completed/ }))

    expect(screen.getByText('Review the pull request')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Mark Review the pull request active' })).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY))[0].completed).toBe(true)
  })

  it('switches themes and saves the choice', async () => {
    const user = userEvent.setup()
    render(<App />)

    const app = screen.getByRole('main')
    expect(app).toHaveAttribute('data-theme', 'light')

    await user.click(screen.getByRole('button', { name: 'Switch to dark mode' }))

    expect(app).toHaveAttribute('data-theme', 'dark')
    expect(localStorage.getItem(THEME_KEY)).toBe('dark')
  })
})
