/**
 * Ust arama cubugu, logo ve durum gostergesi iskeleti.
 * @author Semih Tuncel
 */
export default function Topbar() {
  return (
    <header className="topbar">
      {/* Brand */}
      <div className="topbar-brand">
        <svg className="brand-icon" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="11" cy="11" r="2.5" fill="#5b8af0" />
          <circle cx="3.5" cy="5.5" r="2" stroke="#3a5fd6" strokeWidth="1.2" />
          <circle cx="18.5" cy="5.5" r="2" stroke="#3a5fd6" strokeWidth="1.2" />
          <circle cx="3.5" cy="16.5" r="2" stroke="#3a5fd6" strokeWidth="1.2" />
          <circle cx="18.5" cy="16.5" r="2" stroke="#3a5fd6" strokeWidth="1.2" />
          <line x1="5.3" y1="6.8" x2="9.2" y2="10" stroke="#2a3550" strokeWidth="1.1" />
          <line x1="12.8" y1="10" x2="16.7" y2="6.8" stroke="#2a3550" strokeWidth="1.1" />
          <line x1="5.3" y1="15.2" x2="9.2" y2="12" stroke="#2a3550" strokeWidth="1.1" />
          <line x1="12.8" y1="12" x2="16.7" y2="15.2" stroke="#2a3550" strokeWidth="1.1" />
        </svg>
        <span className="brand-name">PropertyGraph</span>
        <span className="brand-version">v0.1</span>
      </div>

      <div className="topbar-sep" />

      {/* Search */}
      <div className="topbar-search-wrap">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <circle cx="5" cy="5" r="3.5" stroke="currentColor" strokeWidth="1.3" />
          <line x1="7.8" y1="7.8" x2="11" y2="11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
        <input
          className="topbar-search"
          type="text"
          placeholder="Düğüm ara… (ID, label, property)"
          spellCheck={false}
        />
      </div>

      {/* Status */}
      <div className="topbar-meta">
        <div className="status-dot" />
        <span className="status-label">READY</span>
      </div>
    </header>
  );
}
