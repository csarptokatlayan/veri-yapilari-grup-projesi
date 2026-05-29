import { useState } from 'react';

const ALGORITHMS = [
  {
    id: 'bfs',
    label: 'BFS',
    shortcut: 'B',
    icon: (
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
        <circle cx="2.5" cy="2.5" r="1.6" stroke="currentColor" strokeWidth="1.1" />
        <circle cx="10.5" cy="2.5" r="1.6" stroke="currentColor" strokeWidth="1.1" />
        <circle cx="2.5" cy="10.5" r="1.6" stroke="currentColor" strokeWidth="1.1" />
        <circle cx="10.5" cy="10.5" r="1.6" stroke="currentColor" strokeWidth="1.1" />
        <line x1="4" y1="2.5" x2="9" y2="2.5" stroke="currentColor" strokeWidth="1" />
        <line x1="2.5" y1="4" x2="2.5" y2="9" stroke="currentColor" strokeWidth="1" />
      </svg>
    ),
  },
  {
    id: 'dfs',
    label: 'DFS',
    shortcut: 'D',
    icon: (
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
        <circle cx="6.5" cy="2" r="1.5" stroke="currentColor" strokeWidth="1.1" />
        <circle cx="2.5" cy="7" r="1.5" stroke="currentColor" strokeWidth="1.1" />
        <circle cx="10.5" cy="7" r="1.5" stroke="currentColor" strokeWidth="1.1" />
        <circle cx="4" cy="11.5" r="1.5" stroke="currentColor" strokeWidth="1.1" />
        <line x1="5.2" y1="3.3" x2="3.2" y2="5.7" stroke="currentColor" strokeWidth="1" />
        <line x1="3.7" y1="8.3" x2="4" y2="10.1" stroke="currentColor" strokeWidth="1" />
      </svg>
    ),
  },
  {
    id: 'shortest',
    label: 'Shortest Path',
    shortcut: 'P',
    icon: (
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
        <circle cx="2" cy="6.5" r="1.5" stroke="currentColor" strokeWidth="1.1" />
        <circle cx="11" cy="6.5" r="1.5" stroke="currentColor" strokeWidth="1.1" />
        <line x1="3.5" y1="6.5" x2="9.5" y2="6.5" stroke="currentColor" strokeWidth="1" strokeDasharray="1.5 1.2" />
        <polyline points="8,4.5 10.5,6.5 8,8.5" stroke="currentColor" strokeWidth="1.1" fill="none" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'degrees',
    label: 'Degrees',
    shortcut: 'G',
    icon: (
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
        <circle cx="6.5" cy="6.5" r="2" stroke="currentColor" strokeWidth="1.1" />
        <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 1.5" />
      </svg>
    ),
  },
];

const STATS = [
  { key: 'DÜĞÜM' },
  { key: 'KENAR' },
  { key: 'BİLEŞEN' },
  { key: 'DERİNLİK' },
];
/**
 * Sol menu iskeleti, algoritmalar ve sorgu paneli yonetimi.
 * @author Semih Tuncel
 */
export default function LeftPanel() {
  const [activeAlgo, setActiveAlgo] = useState('bfs');

  return (
    <nav className="left-panel">

      {/* Algorithms */}
      <div className="panel-section">
        <div className="panel-section-header">
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <rect x="1" y="1" width="9" height="9" rx="1" stroke="currentColor" strokeWidth="1.2" />
            <line x1="3.5" y1="4" x2="7.5" y2="4" stroke="currentColor" strokeWidth="1.1" />
            <line x1="3.5" y1="6.5" x2="6" y2="6.5" stroke="currentColor" strokeWidth="1.1" />
          </svg>
          Algoritmalar
        </div>

        {ALGORITHMS.map((algo) => (
          <button
            key={algo.id}
            className={`algo-btn${activeAlgo === algo.id ? ' active' : ''}`}
            onClick={() => setActiveAlgo(algo.id)}
          >
            {algo.icon}
            {algo.label}
            <span className="algo-shortcut">{algo.shortcut}</span>
          </button>
        ))}
      </div>

      {/* Queries */}
      <div className="panel-section">
        <div className="panel-section-header">
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path d="M1.5 3h8M1.5 5.5h5.5M1.5 8h7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          Sorgular
        </div>

        <div className="query-row">
          <span className="query-label">Sorgu Tipi</span>
          <select className="query-select" defaultValue="">
            <option value="" disabled>— seçin —</option>
            <option>Düğüm Filtresi</option>
            <option>Kenar Filtresi</option>
            <option>Label Eşleşmesi</option>
            <option>Özellik Aralığı</option>
          </select>
        </div>

        <div className="query-row">
          <span className="query-label">Başlangıç Düğümü</span>
          <input className="query-input" type="text" placeholder="node_id" spellCheck={false} />
        </div>

        <div className="query-row">
          <span className="query-label">Bitiş Düğümü</span>
          <input className="query-input" type="text" placeholder="node_id" spellCheck={false} />
        </div>

        <button className="run-btn">▶ Çalıştır</button>
      </div>

      {/* Stats footer */}
      <div className="panel-footer">
        {STATS.map((s) => (
          <div key={s.key} className="stat-block">
            <span className="stat-val">—</span>
            <span className="stat-key">{s.key}</span>
          </div>
        ))}
      </div>
    </nav>
  );
}
