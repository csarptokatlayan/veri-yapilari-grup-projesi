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
 * Sol menu iskeleti, dinamik algoritmalar ve hatasız sorgu paneli yönetimi.
 * F3-US4: UI'dan algoritmaları kesin parametre sınırlarına göre mock veriyle tetikleme.
 * @author Semih Tuncel
 * @author Murat Kutku (Sorgu Yapısının Temizlenmesi, Bağımsız Mock Veri Entegrasyonu ve Parametre Dinamikliği)
 */
export default function LeftPanel({ onAlgorithmResult, graphStats }) {
    const [activeAlgo, setActiveAlgo] = useState('bfs');
    const [startNode, setStartNode] = useState('');
    const [endNode, setEndNode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Algoritma çalıştırma fonksiyonu (Backend hazır olmadığı için geçici olarak Mock çalışıyor)
    const handleRunAlgorithm = () => {
        setError(null);

        // 1. Girdi Kontrolleri
        if (!startNode.trim()) {
            setError('Lütfen bir Başlangıç Düğümü girin!');
            return;
        }

        if (activeAlgo === 'shortest' && !endNode.trim()) {
            setError('Shortest Path algoritmaları için Bitiş Düğümü zorunludur!');
            return;
        }

        setLoading(true);

        // UI'daki loading (hesaplanıyor) durumunu test edebilmek için 800ms gecikme simüle ediyoruz
        setTimeout(() => {
            try {
                let mockData = {};

                // Seçilen algoritmaya göre Cytoscape canvas'ının renklendirebileceği mock çıktılar üretiyoruz
                if (activeAlgo === 'bfs' || activeAlgo === 'dfs') {
                    mockData = {
                        visitedNodes: [startNode.trim(), "2", "3", "4"], // Gezilen örnek düğümler
                        path: [startNode.trim(), "2", "3"]
                    };
                } else if (activeAlgo === 'shortest') {
                    mockData = {
                        source: startNode.trim(),
                        target: endNode.trim(),
                        path: [startNode.trim(), "3", endNode.trim()], // Aradaki en kısa yol rotası
                        distance: 2
                    };
                } else if (activeAlgo === 'degrees') {
                    mockData = {
                        targetNode: startNode.trim(),
                        degreeCentrality: 4,
                        neighbors: ["2", "5", "7", "9"]
                    };
                }

                // Sonucu üst bileşene (App.jsx / CenterCanvas) aktar
                if (onAlgorithmResult) {
                    onAlgorithmResult({
                        type: activeAlgo,
                        data: mockData,
                        startNode: startNode.trim(),
                        endNode: activeAlgo === 'shortest' ? endNode.trim() : null
                    });
                }

                setLoading(false);
            } catch (err) {
                setError('Mock veri işlenirken bir hata oluştu!');
                setLoading(false);
            }
        }, 800);
    };

    return (
        <nav className="left-panel">
            {/* Algorithms Section */}
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
                        onClick={() => {
                            setActiveAlgo(algo.id);
                            setError(null);
                        }}
                    >
                        {algo.icon}
                        {algo.label}
                        <span className="algo-shortcut">{algo.shortcut}</span>
                    </button>
                ))}
            </div>

            {/* Parameters & Queries Section */}
            <div className="panel-section">
                <div className="panel-section-header">
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                        <path d="M1.5 3h8M1.5 5.5h5.5M1.5 8h7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                    Parametreler & Sorgular
                </div>

                <div className="query-row">
                    <span className="query-label">Başlangıç Düğümü</span>
                    <input
                        className="query-input"
                        type="text"
                        placeholder="Örn: 1"
                        spellCheck={false}
                        value={startNode}
                        onChange={(e) => setStartNode(e.target.value)}
                    />
                </div>

                {activeAlgo === 'shortest' && (
                    <div className="query-row">
                        <span className="query-label">Bitiş Düğümü</span>
                        <input
                            className="query-input"
                            type="text"
                            placeholder="Örn: 5"
                            spellCheck={false}
                            value={endNode}
                            onChange={(e) => setEndNode(e.target.value)}
                        />
                    </div>
                )}

                {error && (
                    <div className="error-message" style={{ color: '#ff6b6b', fontSize: '11px', marginTop: '8px', padding: '0 4px' }}>
                        ⚠️ {error}
                    </div>
                )}

                <button
                    className="run-btn"
                    onClick={handleRunAlgorithm}
                    disabled={loading}
                    style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
                >
                    {loading ? '⏳ Hesaplanıyor...' : '▶ Çalıştır'}
                </button>
            </div>

            {/* Stats Footer Section */}
            <div className="panel-footer">
                {STATS.map((s) => (
                    <div key={s.key} className="stat-block">
                        <span className="stat-val">
                            {graphStats && graphStats[s.key] ? graphStats[s.key] : '—'}
                        </span>
                        <span className="stat-key">{s.key}</span>
                    </div>
                ))}
            </div>
        </nav>
    );
}