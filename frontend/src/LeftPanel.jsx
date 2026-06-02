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
 * Sol menu iskeleti, algoritma ve zincirleme sorgu panellerini ayri state'lerle yonetir.
 * @author Semih Tuncel
 * @author Murat Kutku
 * @author Arda Aşan
 */
export default function LeftPanel({ onAlgorithmResult, graphStats }) {
    const [activeAlgo, setActiveAlgo] = useState('bfs');
    const [algoStartNode, setAlgoStartNode] = useState('');
    const [algoEndNode, setAlgoEndNode] = useState('');
    const [algorithmLoading, setAlgorithmLoading] = useState(false);
    const [algorithmError, setAlgorithmError] = useState(null);

    const [chainStartNode, setChainStartNode] = useState('');
    const [edgeType, setEdgeType] = useState('');
    const [targetType, setTargetType] = useState('');
    const [depth, setDepth] = useState(1);

    const handleRunAlgorithm = () => {
        const trimmedStartNode = algoStartNode.trim();
        const trimmedEndNode = algoEndNode.trim();

        setAlgorithmError(null);

        if (!trimmedStartNode) {
            setAlgorithmError('Lütfen bir Başlangıç Düğümü girin!');
            return;
        }

        if (activeAlgo === 'shortest' && !trimmedEndNode) {
            setAlgorithmError('Shortest Path algoritması için Bitiş Düğümü zorunludur!');
            return;
        }

        setAlgorithmLoading(true);

        setTimeout(() => {
            let mockData = {};

            if (activeAlgo === 'bfs' || activeAlgo === 'dfs') {
                mockData = {
                    visitedNodes: [trimmedStartNode, '2', '3', '4'],
                    path: [trimmedStartNode, '2', '3'],
                };
            } else if (activeAlgo === 'shortest') {
                mockData = {
                    source: trimmedStartNode,
                    target: trimmedEndNode,
                    path: [trimmedStartNode, '3', trimmedEndNode],
                    distance: 2,
                };
            } else if (activeAlgo === 'degrees') {
                mockData = {
                    targetNode: trimmedStartNode,
                    degreeCentrality: 4,
                    neighbors: ['2', '5', '7', '9'],
                };
            }

            onAlgorithmResult?.({
                type: activeAlgo,
                data: mockData,
                startNode: trimmedStartNode,
                endNode: activeAlgo === 'shortest' ? trimmedEndNode : null,
            });

            setAlgorithmLoading(false);
        }, 800);
    };

    const handleRunChainQuery = () => {
        const trimmedChainStartNode = chainStartNode.trim();

        if (!trimmedChainStartNode) {
            alert('Lütfen bir Başlangıç Düğümü (ID) girin!');
            return;
        }

        const params = new URLSearchParams({
            startId: trimmedChainStartNode,
            depth: String(depth),
        });

        if (edgeType) {
            params.set('edgeType', edgeType);
        }

        if (targetType) {
            params.set('targetType', targetType);
        }

        fetch(`http://localhost:8080/traversal/dynamic-chain-bfs?${params.toString()}`)
            .then((response) => response.json())
            .then((data) => {
                console.log('Gelen Veri:', data);
                alert('Sorgu başarılı! Sonuçlar konsola yazdırıldı.');
            })
            .catch((error) => {
                console.error('Bağlantı hatası:', error);
                alert("Backend'e ulaşılamadı. Spring Boot açık mı?");
            });
    };

    return (
        <nav className="left-panel">
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
                            setAlgorithmError(null);
                        }}
                    >
                        {algo.icon}
                        {algo.label}
                        <span className="algo-shortcut">{algo.shortcut}</span>
                    </button>
                ))}
            </div>

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
                        value={algoStartNode}
                        onChange={(event) => setAlgoStartNode(event.target.value)}
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
                            value={algoEndNode}
                            onChange={(event) => setAlgoEndNode(event.target.value)}
                        />
                    </div>
                )}

                {algorithmError && (
                    <div className="error-message">
                        {algorithmError}
                    </div>
                )}

                <button
                    className="run-btn"
                    onClick={handleRunAlgorithm}
                    disabled={algorithmLoading}
                    style={{ opacity: algorithmLoading ? 0.7 : 1, cursor: algorithmLoading ? 'not-allowed' : 'pointer' }}
                >
                    {algorithmLoading ? 'Hesaplanıyor...' : 'Çalıştır'}
                </button>
            </div>

            <div className="panel-section">
                <div className="panel-section-header">
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                        <path d="M2 2.5h2.5v2H7M7 4.5v2H4.5M4.5 6.5v2H9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Zincirleme Sorgular
                </div>

                <div className="query-row">
                    <span className="query-label">Başlangıç (Kök)</span>
                    <input
                        className="query-input"
                        type="text"
                        placeholder="Örn: Kullanıcı A"
                        value={chainStartNode}
                        onChange={(event) => setChainStartNode(event.target.value)}
                        spellCheck={false}
                    />
                </div>

                <div className="query-row">
                    <span className="query-label">İlişki (Edge) Tipi</span>
                    <select
                        className="query-select"
                        value={edgeType}
                        onChange={(event) => setEdgeType(event.target.value)}
                    >
                        <option value="">Tüm bağlantılar</option>
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
                        onChange={(event) => setTargetType(event.target.value)}
                    >
                        <option value="">Tüm hedefler</option>
                        <option value="USER">Kullanıcı Düğümü</option>
                        <option value="POST">Gönderi Düğümü</option>
                        <option value="EVENT">Etkinlik Düğümü</option>
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
                        onChange={(event) => setDepth(event.target.value)}
                    />
                </div>

                <button className="run-btn" onClick={handleRunChainQuery}>
                    Zinciri Çalıştır
                </button>
            </div>

            <div className="panel-footer">
                {STATS.map((stat) => (
                    <div key={stat.key} className="stat-block">
                        <span className="stat-val">
                            {graphStats?.[stat.key] ?? '—'}
                        </span>
                        <span className="stat-key">{stat.key}</span>
                    </div>
                ))}
            </div>
        </nav>
    );
}
