import cytoscape from 'cytoscape';
import { Fragment, useEffect, useRef, useState } from 'react';

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

/**
 * Ekrana sigdir ikonunu cizer; toolbar icin statik SVG yeterlidir.
 * @author Semih Tuncel
 */
const FitIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect x="2" y="2" width="10" height="10" rx="1" stroke="currentColor" strokeWidth="1.2" />
    <path d="M5 5h4v4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Insert: O(1)  Search: O(1)  Delete: O(1)
const GRAPH_STYLE = [
  {
    selector: 'node',
    style: {
      label: 'data(title)',
      width: 34,
      height: 34,
      color: '#c8cdd8',
      'font-size': 9,
      'font-family': 'Segoe UI, sans-serif',
      'text-halign': 'center',
      'text-valign': 'bottom',
      'text-margin-y': 6,
      'text-outline-color': '#16181c',
      'text-outline-width': 2,
      'border-width': 1,
      'border-color': '#2a2e38',
    },
  },
  {
    selector: 'node[nodeType = "USER"]',
    style: {
      shape: 'ellipse',
      'background-color': '#3a7bd5',
    },
  },
  {
    selector: 'node[nodeType = "POST"]',
    style: {
      shape: 'rectangle',
      'background-color': '#d6a93a',
    },
  },
  {
    selector: 'node[nodeType = "PHOTO"]',
    style: {
      shape: 'diamond',
      'background-color': '#8e5bd6',
    },
  },
  {
    selector: 'node[nodeType = "EVENT"]',
    style: {
      shape: 'hexagon',
      'background-color': '#3d8b5a',
    },
  },
  {
    selector: 'edge',
    style: {
      label: 'data(type)',
      width: 1.2,
      color: '#6b7385',
      'font-size': 7,
      'font-family': 'Courier New, monospace',
      'line-color': '#3f4558',
      'target-arrow-color': '#3f4558',
      'target-arrow-shape': 'triangle',
      'curve-style': 'bezier',
      'text-rotation': 'autorotate',
      'text-margin-y': -8,
      opacity: 0.72,
    },
  },
];

// Insert: O(1)  Search: O(1)  Delete: O(1)
const COSE_LAYOUT = {
  name: 'cose',
  animate: true,
  fit: true,
  padding: 40,
  nodeOverlap: 20,
  nodeRepulsion: 450000,
  idealEdgeLength: 110,
  edgeElasticity: 80,
  gravity: 0.25,
  numIter: 1200,
};

/**
 * Cytoscape motorunu olusturur; tek container uzerinden pan ve zoom saglanir.
 * @author Semih Tuncel
 */
function createCytoscapeInstance(container) {
  return cytoscape({
    container,
    elements: [],
    style: GRAPH_STYLE,
    minZoom: 0.12,
    maxZoom: 3,
    wheelSensitivity: 0.18,
  });
}

/**
 * Seed graph dosyasini indirir; AbortSignal ile unmount durumunda islem kesilir.
 * @author Semih Tuncel
 */
async function fetchSeedGraph(signal) {
  const response = await fetch('/seed_data.json', { signal });

  if (!response.ok) {
    throw new Error(`Seed graph yuklenemedi: ${response.status}`);
  }

  return response.json();
}

/**
 * Seed node kaydini Cytoscape node elementine cevirir; render motoru string id bekler.
 * @author Semih Tuncel
 */
function createNodeElement(node) {
  return {
    data: {
      id: String(node.id),
      title: node.title,
      nodeType: node.nodeType,
      properties: node.properties ?? {},
    },
  };
}

/**
 * Seed edge kaydini Cytoscape edge elementine cevirir; benzersiz id coklu edge durumunu korur.
 * @author Semih Tuncel
 */
function createEdgeElement(edge, index) {
  return {
    data: {
      id: `edge-${index}-${edge.source}-${edge.target}-${edge.type}`,
      source: String(edge.source),
      target: String(edge.target),
      type: edge.type,
      directed: Boolean(edge.directed),
    },
  };
}

/**
 * Seed graph verisini Cytoscape element dizisine cevirir; node ve edge akisi ayni formata iner.
 * @author Semih Tuncel
 */
function createCytoscapeElements(graph) {
  const nodes = Array.isArray(graph.nodes) ? graph.nodes.map(createNodeElement) : [];
  const edges = Array.isArray(graph.edges) ? graph.edges.map(createEdgeElement) : [];

  return [...nodes, ...edges];
}

/**
 * Elementleri sahneye ekleyip cose layout calistirir; overlap azaltan ayarlar kullanilir.
 * @author Semih Tuncel
 */
function renderSeedGraph(cy, graph) {
  cy.add(createCytoscapeElements(graph));
  cy.layout(COSE_LAYOUT).run();
}

/**
 * Abort disindaki seed yukleme hatalarini bildirir; iptal beklenen cleanup davranisidir.
 * @author Semih Tuncel
 */
function reportSeedLoadError(error) {
  if (error.name !== 'AbortError') {
    console.error('Seed graph yuklenemedi', error);
  }
}

/**
 * Orta kanvas alaninin UI iskeleti ve arac cubugu yonetimi.
 * @author Semih Tuncel
 */
export default function CenterCanvas() {
  const [activeTool, setActiveTool] = useState('select');
  const canvasRef = useRef(null);
  const cyRef = useRef(null);

  useEffect(() => {
    const container = canvasRef.current;

    if (!container || cyRef.current) {
      return undefined;
    }

    const abortController = new AbortController();
    let isMounted = true;
    const cy = createCytoscapeInstance(container);

    cyRef.current = cy;

    /**
     * Gelen seed graph verisini guvenli sekilde render eder; unmount sonrasi DOM'a dokunmaz.
     * @author Semih Tuncel
     */
    function handleSeedGraphLoaded(graph) {
      if (isMounted) {
        renderSeedGraph(cy, graph);
      }
    }

    fetchSeedGraph(abortController.signal)
      .then(handleSeedGraphLoaded)
      .catch(reportSeedLoadError);

    return () => {
      isMounted = false;
      abortController.abort();
      cy.destroy();
      cyRef.current = null;
    };
  }, []);

  return (
    <main className="center-canvas">

      {/* Toolbar */}
      <div className="canvas-toolbar">
        {TOOLS.map((tool, i) => (
          <Fragment key={tool.id}>
            {/* Separator after zoom-out (index 3) would be after pan (1), insert manually */}
            <button
              className={`canvas-tool-btn${activeTool === tool.id ? ' active' : ''}`}
              title={tool.title}
              onClick={() => setActiveTool(tool.id)}
            >
              {tool.icon}
            </button>
            {i === 1 && <div key="sep1" className="canvas-tool-sep" />}
          </Fragment>
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
      <div id="cy-canvas" ref={canvasRef}>
        <div className="canvas-hud">x: - &nbsp; y: - &nbsp;&nbsp; zoom: 1.00</div>
      </div>
    </main>
  );
}
