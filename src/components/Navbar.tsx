import { useLibraryStore } from '../store/libraryStore'
import './Navbar.css'

const Navbar = () => {
  const { currentView, setCurrentView } = useLibraryStore()

  const navItems = [
    { id: 'library', label: '📚 论文库', view: 'library' },
    { id: 'mindmap', label: '🗺️ 思维导图', view: 'mindmap' },
    { id: 'reading', label: '📖 阅读模式', view: 'reading' },
    { id: 'notes-only', label: '📝 纯笔记', view: 'notes-only' },
  ] as const

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <div className="logo-icon">🧠</div>
        <h1>Journal Reader <span className="version">v0.3</span></h1>
      </div>

      <div className="nav-links">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${currentView === item.view ? 'active' : ''}`}
            onClick={() => setCurrentView(item.view)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="nav-actions">
        <button className="icon-btn" title="设置">⚙️</button>
      </div>
    </nav>
  )
}

export default Navbar
