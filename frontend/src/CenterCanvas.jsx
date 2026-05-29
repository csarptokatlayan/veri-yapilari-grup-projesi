import { useState } from 'react';

const TOOLS = [
  {
    id: 'select',
    title: 'Seç',
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M2 2l3.5 9.5 2-4 4.5 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'pan',
    title: 'Kaydır',
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M7 1v12M1 7h12M3.5 3.5l7 7M10.5 3.5l-7 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'zoomin',
    title: 'Yakınlaştır',
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.2" />
        <line x1="4" y1="6" x2="8" y2="6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="6" y1="4" x2="6" y2="8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="9.3" y1="9.3" x2="12.3" y2="12.3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'zoomout',
    title: 'Uzaklaştır',
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.2" />
        <line x1="4" y1="6" x2="8" y2="6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="9.3" y1="9.3" x2="12.3" y2="12.3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
];

const FitIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect x="2" y="2" width="10" height="10" rx="1" stroke="currentColor" strokeWidth="1.2" />
    <path d="M5 5h4v4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * Orta kanvas alaninin UI iskeleti ve arac cubugu yonetimi.
 * @author Semih Tuncel
 */
export default function CenterCanvas() {
  const [activeTool, setActiveTool] = useState('select');

  return (
    <main className="center-canvas">

      {/* Toolbar */}
      <div className="canvas-toolbar">
        {TOOLS.map((tool, i) => (
          <>
            {/* Separator after zoom-out (index 3) would be after pan (1), insert manually */}
            <button
              key={tool.id}
              className={`canvas-tool-btn${activeTool === tool.id ? ' active' : ''}`}
              title={tool.title}
              onClick={() => setActiveTool(tool.id)}
            >
              {tool.icon}
            </button>
            {i === 1 && <div key="sep1" className="canvas-tool-sep" />}
          </>
        ))}

        <div className="canvas-tool-sep" />

        <button
          className="canvas-tool-btn"
          title="Ekrana sığdır"
          onClick={() => setActiveTool('fit')}
        >
          <FitIcon />
        </button>

        <span className="canvas-tool-label">GRAPH CANVAS</span>

        <div className="canvas-zoom">
          <span className="zoom-val">100%</span>
        </div>
      </div>

      {/* Cytoscape mount point */}
      <div id="cy-canvas">
        <div className="canvas-empty-hint">
          <svg
            className="canvas-empty-icon"
            width="72"
            height="72"
            viewBox="0 0 72 72"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="36" cy="36" r="10" stroke="#c8cdd8" strokeWidth="2" />
            <circle cx="12" cy="14" r="6" stroke="#c8cdd8" strokeWidth="2" />
            <circle cx="60" cy="14" r="6" stroke="#c8cdd8" strokeWidth="2" />
            <circle cx="12" cy="58" r="6" stroke="#c8cdd8" strokeWidth="2" />
            <circle cx="60" cy="58" r="6" stroke="#c8cdd8" strokeWidth="2" />
            <line x1="17.5" y1="17.5" x2="28" y2="28" stroke="#c8cdd8" strokeWidth="1.5" />
            <line x1="54.5" y1="17.5" x2="44" y2="28" stroke="#c8cdd8" strokeWidth="1.5" />
            <line x1="17.5" y1="54.5" x2="28" y2="44" stroke="#c8cdd8" strokeWidth="1.5" />
            <line x1="54.5" y1="54.5" x2="44" y2="44" stroke="#c8cdd8" strokeWidth="1.5" />
          </svg>
          <span className="canvas-empty-text">
            GRAPH YÜKLENMEDİ — /api/graph çağrısı bekleniyor
          </span>
        </div>

        <div className="canvas-hud">x: — &nbsp; y: — &nbsp;&nbsp; zoom: 1.00</div>
      </div>
    </main>
  );
}
