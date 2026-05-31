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
    /**
     * Zincirleme sorgu state'leri ve Mock fonksiyonu
     * @author Arda Aşan
     */
    const [startNode, setStartNode] = useState('');
    const [edgeType, setEdgeType] = useState('');
    const [targetType, setTargetType] = useState('');
    const [depth, setDepth] = useState(1);

    const handleMockQuery = () => {
        console.log("Mock Veri İstediği:", { startNode, edgeType, targetType, depth });
        alert("Kişi 2'nin F2-US3 endpoint'i bekleniyor. Mock çalışıyor!");
    };

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

        {/* F3-US1: Zincirleme Sorgu Paneli */}

        <div className="panel-section">
            <div className="panel-section-header">
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <path d="M1.5 3h8M1.5 5.5h5.5M1.5 8h7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                Zincirleme Sorgular
            </div>

            <div className="query-row">
                <span className="query-label">Başlangıç (Kök)</span>
                <input
                    className="query-input"
                    type="text"
                    placeholder="örn: Kullanıcı A"
                    value={startNode}
                    onChange={(e) => setStartNode(e.target.value)}
                    spellCheck={false}
                />
            </div>

            <div className="query-row">
                <span className="query-label">İlişki (Edge) Tipi</span>
                <select
                    className="query-select"
                    value={edgeType}
                    onChange={(e) => setEdgeType(e.target.value)}
                >
                    <option value="" disabled>— Bağlantı Seç —</option>
                    <option value="FOLLOWS">Takip Ediyor</option>
                    <option value="LIKES">Beğendi</option>
                    <option value="KNOWS">Tanıyor</option>
                </select>
            </div>

            <div className="query-row">
                <span className="query-label">Hedef Filtresi</span>
                <select
                    className="query-select"
                    value={targetType}
                    onChange={(e) => setTargetType(e.target.value)}
                >
                    <option value="" disabled>— Hedef Türü —</option>
                    <option value="USER">Kullanıcı Düğümü</option>
                    <option value="POST">Gönderi Düğümü</option>
                    <option value="PAGE">Sayfa Düğümü</option>
                </select>
            </div>

            <div className="query-row">
                <span className="query-label">Derinlik (Step)</span>
                <input
                    className="query-input"
                    type="number"
                    min="1"
                    max="5"
                    value={depth}
                    onChange={(e) => setDepth(e.target.value)}
                />
            </div>

            <button className="run-btn" onClick={handleMockQuery}>
                ▶ Zinciri Çalıştır
            </button>
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