/**
 * Sag panel inspektor iskeleti ve dugum detay gosterimi.
 * @author Semih Tuncel
 */
export default function RightInspector() {
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
        <span className="inspector-badge">BOŞTA</span>
      </div>

      {/* Empty state */}
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
        <p className="inspector-empty-text">
          Bir düğüm seçin…<br />özellikler burada görünür
        </p>
      </div>

      {/*
        Property table — uncomment when Cytoscape node selection is wired up:

        <table className="prop-table">
          <tbody>
            <tr className="prop-row">
              <td className="prop-key">id</td>
              <td className="prop-val"><span className="prop-skeleton" style={{ width: 80 }} /></td>
            </tr>
            <tr className="prop-row">
              <td className="prop-key">label</td>
              <td className="prop-val"><span className="prop-skeleton" style={{ width: 60 }} /></td>
            </tr>
            <tr className="prop-row">
              <td className="prop-key">type</td>
              <td className="prop-val"><span className="prop-skeleton" style={{ width: 50 }} /></td>
            </tr>
            <tr className="prop-row">
              <td className="prop-key">weight</td>
              <td className="prop-val"><span className="prop-skeleton" style={{ width: 30 }} /></td>
            </tr>
          </tbody>
        </table>

        <div className="inspector-section">
          <div className="inspector-section-hdr">Kenarlar</div>
          <div className="edge-item">
            <span className="edge-arrow">→</span>
            <span className="prop-skeleton" style={{ width: 90 }} />
          </div>
          <div className="edge-item">
            <span className="edge-arrow">←</span>
            <span className="prop-skeleton" style={{ width: 70 }} />
          </div>
        </div>
      */}
    </aside>
  );
}
