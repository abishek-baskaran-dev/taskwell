import { useEffect, useMemo, useState } from 'react'
import { Check, Circle, ListTodo, Moon, Plus, Sparkles, Sun, Trash2 } from 'lucide-react'

const STORAGE_KEY = 'daymark-todos-v1'
const THEME_KEY = 'daymark-theme-v1'

function readTodos() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

function readTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    // Use the system preference when browser storage is unavailable.
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function App() {
  const [todos, setTodos] = useState(readTodos)
  const [draft, setDraft] = useState('')
  const [filter, setFilter] = useState('all')
  const [theme, setTheme] = useState(readTheme)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  useEffect(() => {
    try {
      localStorage.setItem(THEME_KEY, theme)
    } catch {
      // The selected theme still applies for this session.
    }
  }, [theme])

  const visibleTodos = useMemo(() => {
    if (filter === 'active') return todos.filter((todo) => !todo.completed)
    if (filter === 'completed') return todos.filter((todo) => todo.completed)
    return todos
  }, [filter, todos])

  const remaining = todos.filter((todo) => !todo.completed).length
  const completed = todos.length - remaining

  function addTodo(event) {
    event.preventDefault()
    const title = draft.trim()
    if (!title) return
    setTodos((current) => [{ id: crypto.randomUUID(), title, completed: false, createdAt: Date.now() }, ...current])
    setDraft('')
  }

  function toggleTodo(id) {
    setTodos((current) => current.map((todo) => todo.id === id ? { ...todo, completed: !todo.completed } : todo))
  }

  function removeTodo(id) {
    setTodos((current) => current.filter((todo) => todo.id !== id))
  }

  function clearCompleted() {
    setTodos((current) => current.filter((todo) => !todo.completed))
  }

  return (
    <main className="page-shell" data-theme={theme}>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Taskwell home">
          <span className="brand-mark"><Check size={16} strokeWidth={3} /></span>
          <span>taskwell<span className="brand-period">.</span></span>
        </a>
        <div className="top-actions">
          <span className="top-note"><span className="status-dot" /> a little more intentional</span>
          <button
            className="theme-toggle"
            type="button"
            onClick={() => setTheme((current) => current === 'light' ? 'dark' : 'light')}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            aria-pressed={theme === 'dark'}
          >
            {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
            <span>{theme === 'light' ? 'Dark' : 'Light'}</span>
          </button>
        </div>
      </header>

      <section className="workspace" id="top">
        <div className="intro">
          <div className="eyebrow"><Sparkles size={14} /> YOUR SPACE, YOUR PACE</div>
          <h1>Make room for<br /><span>what matters.</span></h1>
          <p className="intro-copy">A clear mind starts with a simple list.<br className="desktop-break" /> Take it one task at a time.</p>
        </div>

        <section className="todo-card" aria-label="Todo list">
          <div className="card-heading">
            <div>
              <div className="card-title-row"><ListTodo size={18} /><h2>My tasks</h2></div>
              <p className="task-count">{remaining === 0 ? 'All caught up' : `${remaining} ${remaining === 1 ? 'thing' : 'things'} to do`}</p>
            </div>
            <span className="date-chip">TODAY</span>
          </div>

          <form className="add-form" onSubmit={addTodo}>
            <label className="sr-only" htmlFor="new-todo">Add a task</label>
            <Plus className="input-plus" size={18} />
            <input id="new-todo" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="What needs your attention?" />
            <button className="add-button" type="submit" disabled={!draft.trim()}>Add task <span>↗</span></button>
          </form>

          <div className="list-toolbar">
            <div className="filter-tabs" aria-label="Filter tasks">
              {['all', 'active', 'completed'].map((item) => (
                <button key={item} className={`filter-tab ${filter === item ? 'selected' : ''}`} onClick={() => setFilter(item)} aria-pressed={filter === item}>
                  {item[0].toUpperCase() + item.slice(1)}{item === 'completed' && completed > 0 ? <span className="tab-count">{completed}</span> : null}
                </button>
              ))}
            </div>
            {completed > 0 && <button className="clear-button" onClick={clearCompleted}>Clear done</button>}
          </div>

          <ul className="todo-list">
            {visibleTodos.map((todo) => (
              <li className={`todo-row ${todo.completed ? 'is-complete' : ''}`} key={todo.id}>
                <button className="check-button" onClick={() => toggleTodo(todo.id)} aria-label={todo.completed ? `Mark ${todo.title} active` : `Complete ${todo.title}`}>
                  {todo.completed ? <span className="checked"><Check size={13} strokeWidth={3} /></span> : <Circle size={19} strokeWidth={1.5} />}
                </button>
                <span className="todo-title">{todo.title}</span>
                <button className="delete-button" onClick={() => removeTodo(todo.id)} aria-label={`Delete ${todo.title}`}><Trash2 size={16} /></button>
              </li>
            ))}
            {visibleTodos.length === 0 && (
              <li className="empty-state">
                <span className="empty-icon"><Check size={18} /></span>
                <span>{todos.length === 0 ? 'Your list is clear. Add a task to get started.' : filter === 'active' ? 'No open tasks. Enjoy the breathing room.' : filter === 'completed' ? 'Completed tasks will show up here.' : 'Nothing to show here.'}</span>
              </li>
            )}
          </ul>

          <div className="card-footer"><span>Small steps still move you forward.</span><span className="footer-spark">✳</span></div>
        </section>

        <footer className="page-footer">MADE FOR THE DAY YOU'RE IN <span>·</span> TASKWELL 2026</footer>
      </section>
    </main>
  )
}

export default App
