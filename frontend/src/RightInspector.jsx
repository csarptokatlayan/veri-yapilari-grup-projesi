import { useEffect, useState } from 'react';

// Insert: O(1)  Search: O(1)  Delete: O(1)
const FALLBACK_PROPERTIES = {
  age: 24,
  location: 'Istanbul',
  status: 'Active',
};

/**
 * Fallback dugum detayini uretir; hash map sekli tabloya dogrudan uyar.
 * @author Semih Tuncel
 */
function createFallbackNodeDetails(selectedNodeId) {
  return {
    id: selectedNodeId,
    type: 'USER',
    properties: FALLBACK_PROPERTIES,
  };
}

/**
 * Dugum detayini backend'den okur; AbortSignal eski secimleri iptal eder.
 * @author Semih Tuncel
 */
async function fetchNodeDetails(selectedNodeId, signal) {
  const encodedNodeId = encodeURIComponent(selectedNodeId);
  const response = await fetch(`/api/nodes/${encodedNodeId}`, { signal });

  if (!response.ok) {
    throw new Error(`Node detayi yuklenemedi: ${response.status}`);
  }

  return response.json();
}

/**
 * API cevabindaki tip alanini tek gorunum degerine indirger.
 * @author Semih Tuncel
 */
function getNodeType(nodeDetails) {
  if (nodeDetails.type) {
    return nodeDetails.type;
  }

  if (nodeDetails.nodeType) {
    return nodeDetails.nodeType;
  }

  return '-';
}

/**
 * Property hash map'ini guvenli sekilde tablo girdilerine cevirir.
 * @author Semih Tuncel
 */
function getPropertyEntries(nodeDetails) {
  if (!nodeDetails.properties || typeof nodeDetails.properties !== 'object') {
    return [];
  }

  if (Array.isArray(nodeDetails.properties)) {
    return [];
  }

  return Object.entries(nodeDetails.properties);
}

/**
 * Tablo hucrelerinde karmasik degerleri okunabilir string yapar.
 * @author Semih Tuncel
 */
function formatPropertyValue(value) {
  if (value === null) {
    return 'null';
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return String(value);
}

/**
 * Sag panel inspektor iskeleti ve dugum detay gosterimi.
 * @author Semih Tuncel
 */
export default function RightInspector({ selectedNodeId }) {
  const [nodeFetchResult, setNodeFetchResult] = useState(null);

  useEffect(() => {
    if (!selectedNodeId) {
      return undefined;
    }

    const abortController = new AbortController();

    fetchNodeDetails(selectedNodeId, abortController.signal)
      .then((details) => {
        setNodeFetchResult({
          selectedNodeId,
          nodeDetails: details,
          isFallbackActive: false,
        });
      })
      .catch((error) => {
        if (error.name === 'AbortError') {
          return;
        }

        setNodeFetchResult({
          selectedNodeId,
          nodeDetails: createFallbackNodeDetails(selectedNodeId),
          isFallbackActive: true,
        });
      });

    return () => {
      abortController.abort();
    };
  }, [selectedNodeId]);

  const matchingFetchResult = nodeFetchResult?.selectedNodeId === selectedNodeId
    ? nodeFetchResult
    : null;
  const currentNodeDetails = matchingFetchResult?.nodeDetails ?? {
    id: selectedNodeId,
    type: selectedNodeId ? 'Yükleniyor' : '-',
    properties: {},
  };
  const propertyEntries = getPropertyEntries(currentNodeDetails);
  const badgeText = selectedNodeId ? 'SEÇİLİ' : 'BOŞTA';
  const isFallbackActive = Boolean(matchingFetchResult?.isFallbackActive);

  return (
    <aside className="right-inspector">

      {/* Header */}
      <div className="inspector-header">
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
          <rect x="1" y="1" width="9" height="9" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
          <line x1="3.5" y1="4" x2="7.5" y2="4" stroke="currentColor" strokeWidth="1.1" />
          <line x1="3.5" y1="6.2" x2="7.5" y2="6.2" stroke="currentColor" strokeWidth="1.1" />
        </svg>
        <span className="inspector-title">İnspektör</span>
        <span className="inspector-badge">{badgeText}</span>
      </div>

      {!selectedNodeId ? (
        <div className="inspector-empty">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <circle cx="18" cy="18" r="8" stroke="#3f4558" strokeWidth="1.5" strokeDasharray="3 2" />
            <circle cx="8" cy="8" r="3" stroke="#3f4558" strokeWidth="1.2" />
            <circle cx="28" cy="8" r="3" stroke="#3f4558" strokeWidth="1.2" />
            <circle cx="8" cy="28" r="3" stroke="#3f4558" strokeWidth="1.2" />
            <line x1="10.8" y1="10.8" x2="14.5" y2="14.5" stroke="#3f4558" strokeWidth="1" />
            <line x1="25.2" y1="10.8" x2="21.5" y2="14.5" stroke="#3f4558" strokeWidth="1" />
            <line x1="10.8" y1="25.2" x2="14.5" y2="21.5" stroke="#3f4558" strokeWidth="1" />
          </svg>
          <p className="inspector-empty-text">İncelenecek bir düğüm seçin</p>
        </div>
      ) : (
        <>
          {isFallbackActive && (
            <div className="inspector-section">
              <div className="edge-item">Backend kapalı, Fallback veri gösteriliyor</div>
            </div>
          )}

          <table className="prop-table">
            <tbody>
              <tr className="prop-row">
                <td className="prop-key">id</td>
                <td className="prop-val">{currentNodeDetails.id}</td>
              </tr>
              <tr className="prop-row">
                <td className="prop-key">type</td>
                <td className="prop-val">{getNodeType(currentNodeDetails)}</td>
              </tr>
              {propertyEntries.map(([key, value]) => (
                <tr className="prop-row" key={key}>
                  <td className="prop-key">{key}</td>
                  <td className="prop-val">{formatPropertyValue(value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

    </aside>
  );
}
