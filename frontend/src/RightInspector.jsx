/**
 * API cevabindaki tip alanini tek gorunum degerine indirger.
 * @author Semih Tuncel
 */
function getNodeType(nodeDetails) {
  if (nodeDetails?.nodeType) {
    return nodeDetails.nodeType;
  }

  if (nodeDetails?.type) {
    return nodeDetails.type;
  }

  return '-';
}

/**
 * Property hash map'ini guvenli sekilde tablo girdilerine cevirir.
 * @author Semih Tuncel
 */
function getPropertyEntries(nodeDetails) {
  if (!nodeDetails?.properties || typeof nodeDetails.properties !== 'object') {
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
 * Bos veya eksik degerleri inspector icin okunur hale getirir.
 * @author Semih Tuncel
 */
function formatFieldValue(value) {
  if (value === undefined || value === null || value === '') {
    return '-';
  }

  return String(value);
}

/**
 * Sag panel inspektor iskeleti ve secili dugum gosterimi.
 * @author Semih Tuncel
 */
export default function RightInspector({ selectedNode }) {
  const propertyEntries = getPropertyEntries(selectedNode);
  const badgeText = selectedNode ? 'SECILI' : 'BOSTA';

  return (
    <aside className="right-inspector">

      {/* Header */}
      <div className="inspector-header">
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
          <rect x="1" y="1" width="9" height="9" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
          <line x1="3.5" y1="4" x2="7.5" y2="4" stroke="currentColor" strokeWidth="1.1" />
          <line x1="3.5" y1="6.2" x2="7.5" y2="6.2" stroke="currentColor" strokeWidth="1.1" />
        </svg>
        <span className="inspector-title">Inspektor</span>
        <span className="inspector-badge">{badgeText}</span>
      </div>

      {!selectedNode ? (
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
          <p className="inspector-empty-text">Incelenecek bir dugum secin</p>
        </div>
      ) : (
        <table className="prop-table">
          <tbody>
            <tr className="prop-row">
              <td className="prop-key">id</td>
              <td className="prop-val">{formatFieldValue(selectedNode.id)}</td>
            </tr>
            <tr className="prop-row">
              <td className="prop-key">title</td>
              <td className="prop-val">{formatFieldValue(selectedNode.title)}</td>
            </tr>
            <tr className="prop-row">
              <td className="prop-key">type</td>
              <td className="prop-val">{formatFieldValue(getNodeType(selectedNode))}</td>
            </tr>
            {propertyEntries.map(([key, value]) => (
              <tr className="prop-row" key={key}>
                <td className="prop-key">{key}</td>
                <td className="prop-val">{formatPropertyValue(value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

    </aside>
  );
}
