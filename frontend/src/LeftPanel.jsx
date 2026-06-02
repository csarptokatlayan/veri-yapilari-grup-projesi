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
];

const STATS = [
    { key: 'DUGUM' },
    { key: 'KENAR' },
    { key: 'BILESEN' },
    { key: 'DERINLIK' },
];

/**
 * Sol menu iskeleti, algoritma ve zincirleme sorgu panellerini ayri state'lerle yonetir.
 * @author Semih Tuncel
 * @author Murat Kutku
 * @author Arda Asan
 */
export default function LeftPanel({ onAlgorithmResult, graphStats }) {
    const [activeAlgo, setActiveAlgo] = useState('bfs');
    const [startNode, setStartNode] = useState('');
    const [algoEndNode, setAlgoEndNode] = useState('');
    const [algorithmLoading, setAlgorithmLoading] = useState(false);
    const [algorithmError, setAlgorithmError] = useState(null);

    const [chainMode, setChainMode] = useState('bfs');
    const [chainStartNode, setChainStartNode] = useState('');
    const [edgeType, setEdgeType] = useState('');
    const [targetType, setTargetType] = useState('');
    const [depth, setDepth] = useState(1);
    const [chainLoading, setChainLoading] = useState(false);
    const [chainError, setChainError] = useState(null);

    const fetchJson = async (path) => {
        const response = await fetch(path);

        if (!response.ok) {
            throw new Error(`Backend istegi basarisiz: ${response.status}`);
        }

        return response.json();
    };

    const emitGraphResult = (type, data, startNode, endNode = null) => {
        onAlgorithmResult?.({
            type,
            resultKind: 'graph',
            data,
            startNode,
            endNode,
        });
    };

    const emitPathResult = (data, startNode, endNode) => {
        onAlgorithmResult?.({
            type: 'shortest',
            resultKind: 'path',
            data,
            startNode,
            endNode,
        });
    };

    const handleRunAlgorithm = async () => {
        const trimmedStartNode = startNode.trim();
        const trimmedEndNode = algoEndNode.trim();

        setAlgorithmError(null);

        if (!trimmedStartNode) {
            setAlgorithmError('Lutfen bir Baslangic Dugumu girin.');
            return;
        }

        if (activeAlgo === 'shortest' && !trimmedEndNode) {
            setAlgorithmError('Shortest Path icin Bitis Dugumu zorunludur.');
            return;
        }

        setAlgorithmLoading(true);

        try {
            if (activeAlgo === 'shortest') {
                const params = new URLSearchParams({
                    from: trimmedStartNode,
                    to: trimmedEndNode,
                });
                const data = await fetchJson(`/traversal/shortest-path?${params.toString()}`);

                emitPathResult(data, trimmedStartNode, trimmedEndNode);
                return;
            }

            const encodedStartNode = encodeURIComponent(trimmedStartNode);
            const data = await fetchJson(`/traversal/${activeAlgo}/${encodedStartNode}`);

            emitGraphResult(activeAlgo, data, trimmedStartNode);
        } catch (error) {
            setAlgorithmError(error.message);
        } finally {
            setAlgorithmLoading(false);
        }
    };

    const createDynamicChainPath = (mode, trimmedChainStartNode) => {
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

        return `/traversal/dynamic-chain-${mode}?${params.toString()}`;
    };

    const handleRunChainQuery = async () => {
        const trimmedChainStartNode = chainStartNode.trim();

        setChainError(null);

        if (!trimmedChainStartNode) {
            setChainError('Lutfen bir Baslangic Dugumu ID degeri girin.');
            return;
        }

        setChainLoading(true);

        try {
            const path = createDynamicChainPath(chainMode, trimmedChainStartNode);
            const data = await fetchJson(path);
            const resultType = `dynamic-chain-${chainMode}`;

            emitGraphResult(resultType, data, trimmedChainStartNode);
        } catch (error) {
            setChainError(error.message);
        } finally {
            setChainLoading(false);
        }
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
                    <span className="query-label">Baslangic Dugumu</span>
                    <input
                        className="query-input"
                        type="text"
                        placeholder="Orn: 1"
                        spellCheck={false}
                        value={startNode}
                        onChange={(event) => setStartNode(event.target.value)}
                    />
                </div>

                {activeAlgo === 'shortest' && (
                    <div className="query-row">
                        <span className="query-label">Bitis Dugumu</span>
                        <input
                            className="query-input"
                            type="text"
                            placeholder="Orn: 5"
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
                    {algorithmLoading ? 'Hesaplaniyor...' : 'Calistir'}
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
                    <span className="query-label">Baslangic Dugumu</span>
                    <input
                        className="query-input"
                        type="text"
                        placeholder="Orn: 1"
                        spellCheck={false}
                        value={chainStartNode}
                        onChange={(event) => setChainStartNode(event.target.value)}
                    />
                </div>

                <div className="query-row">
                    <span className="query-label">Iliski (Edge) Tipi</span>
                    <select
                        className="query-select"
                        value={edgeType}
                        onChange={(event) => setEdgeType(event.target.value)}
                    >
                        <option value="">Tum baglantilar</option>
                        <option value="FRIEND">Arkadas</option>
                        <option value="LIKES">Begendi</option>
                        <option value="ATTENDS">Katiliyor</option>
                    </select>
                </div>

                <div className="query-row">
                    <span className="query-label">Hedef Filtresi</span>
                    <select
                        className="query-select"
                        value={targetType}
                        onChange={(event) => setTargetType(event.target.value)}
                    >
                        <option value="">Tum hedefler</option>
                        <option value="USER">Kullanici Dugumu</option>
                        <option value="POST">Gonderi Dugumu</option>
                        <option value="EVENT">Etkinlik Dugumu</option>
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

                <div className="query-row">
                    <span className="query-label">Arama Modu</span>
                    <div className="chain-mode-toggle">
                        <button
                            className={`chain-mode-btn${chainMode === 'bfs' ? ' active' : ''}`}
                            type="button"
                            onClick={() => setChainMode('bfs')}
                        >
                            BFS
                        </button>
                        <button
                            className={`chain-mode-btn${chainMode === 'dfs' ? ' active' : ''}`}
                            type="button"
                            onClick={() => setChainMode('dfs')}
                        >
                            DFS
                        </button>
                    </div>
                </div>

                {chainError && (
                    <div className="error-message">
                        {chainError}
                    </div>
                )}

                <button className="run-btn" onClick={handleRunChainQuery} disabled={chainLoading}>
                    {chainLoading ? 'Hesaplaniyor...' : 'Zincirleme Sorgu Calistir'}
                </button>
            </div>

            <div className="panel-footer">
                {STATS.map((stat) => (
                    <div key={stat.key} className="stat-block">
                        <span className="stat-val">
                            {graphStats?.[stat.key] ?? '-'}
                        </span>
                        <span className="stat-key">{stat.key}</span>
                    </div>
                ))}
            </div>
        </nav>
    );
}
