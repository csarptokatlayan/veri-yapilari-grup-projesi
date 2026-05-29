import cytoscape from 'cytoscape';
import { Fragment, useEffect, useRef, useState } from 'react';

const ROOT_NODE_ID = '1';
const MAX_VISIBLE_NODES = 50;
const ZOOM_STEP = 1.2;
const FIT_PADDING = 40;
const INITIAL_CAMERA = {
  x: 0,
  y: 0,
  zoom: 1,
};

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
 * Seed edge icin tek tip id uretir; Cytoscape duplicate edge eklemesini bu id ile engeller.
 * @author Semih Tuncel
 */
function createEdgeId(edge, index) {
  return `edge-${index}-${edge.source}-${edge.target}-${edge.type}`;
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
      id: createEdgeId(edge, index),
      source: String(edge.source),
      target: String(edge.target),
      type: edge.type,
      directed: Boolean(edge.directed),
    },
  };
}

/**
 * Edge kaydini node indeksine ekler; Map uzerinden komsu edge aramasi hizli kalir.
 * @author Semih Tuncel
 */
function appendEdgeToNodeIndex(edgesByNodeId, nodeId, indexedEdge) {
  const edges = edgesByNodeId.get(nodeId) ?? [];

  edges.push(indexedEdge);
  edgesByNodeId.set(nodeId, edges);
}

/**
 * Seed graph icin node ve komsu edge indekslerini kurar; lazy expand icin Map secilir.
 * @author Semih Tuncel
 */
function createGraphIndex(graph) {
  // Insert: O(1)  Search: O(1)  Delete: O(1)
  const nodesById = new Map();
  // Insert: O(1)  Search: O(1)  Delete: O(1)
  const edgesByNodeId = new Map();
  const nodes = Array.isArray(graph.nodes) ? graph.nodes : [];
  const edges = Array.isArray(graph.edges) ? graph.edges : [];

  nodes.forEach((node) => {
    nodesById.set(String(node.id), node);
  });

  edges.forEach((edge, index) => {
    const indexedEdge = { edge, index };
    const sourceId = String(edge.source);
    const targetId = String(edge.target);

    appendEdgeToNodeIndex(edgesByNodeId, sourceId, indexedEdge);

    if (sourceId !== targetId) {
      appendEdgeToNodeIndex(edgesByNodeId, targetId, indexedEdge);
    }
  });

  return {
    nodesById,
    edgesByNodeId,
  };
}

/**
 * Ilk sahnede sadece root node'u ekler; devamindaki graph parcalari tiklama ile gelir.
 * @author Semih Tuncel
 */
function renderSeedGraph(cy, graphIndex) {
  const rootNode = graphIndex.nodesById.get(ROOT_NODE_ID);

  if (!rootNode) {
    return;
  }

  cy.add(createNodeElement(rootNode));
  cy.layout(COSE_LAYOUT).run();
}

/**
 * Edge'in tiklanan node disindaki ucunu bulur; expand akisi komsu node'a buradan ulasir.
 * @author Semih Tuncel
 */
function getOppositeNodeId(edge, nodeId) {
  const sourceId = String(edge.source);
  const targetId = String(edge.target);

  return sourceId === nodeId ? targetId : sourceId;
}

/**
 * Cytoscape sahnesindeki mevcut node id'lerini toplar; Set duplicate kontrolunu sabit tutar.
 * @author Semih Tuncel
 */
function createVisibleNodeIdSet(cy) {
  // Insert: O(1)  Search: O(1)  Delete: O(1)
  const visibleNodeIds = new Set();

  cy.nodes().forEach((node) => {
    visibleNodeIds.add(node.id());
  });

  return visibleNodeIds;
}

/**
 * Tiklanan node icin eklenecek node ve edge elementlerini secer; 50 node limitini korur.
 * @author Semih Tuncel
 */
function collectExpandableElements(cy, graphIndex, nodeId) {
  const neighborEdges = graphIndex.edgesByNodeId.get(nodeId) ?? [];
  const visibleNodeIds = createVisibleNodeIdSet(cy);
  const elements = [];
  let didHitLimit = false;

  neighborEdges.forEach(({ edge, index }) => {
    const oppositeNodeId = getOppositeNodeId(edge, nodeId);
    const oppositeNode = graphIndex.nodesById.get(oppositeNodeId);

    if (!oppositeNode) {
      return;
    }

    if (!visibleNodeIds.has(oppositeNodeId)) {
      if (visibleNodeIds.size >= MAX_VISIBLE_NODES) {
        didHitLimit = true;
        return;
      }

      elements.push(createNodeElement(oppositeNode));
      visibleNodeIds.add(oppositeNodeId);
    }

    const edgeId = createEdgeId(edge, index);
    const sourceId = String(edge.source);
    const targetId = String(edge.target);

    if (
      cy.getElementById(edgeId).empty()
      && visibleNodeIds.has(sourceId)
      && visibleNodeIds.has(targetId)
    ) {
      elements.push(createEdgeElement(edge, index));
    }
  });

  return {
    elements,
    didHitLimit,
  };
}

/**
 * Tiklanan node'u genisletir; yeni element varsa layout tekrar calistirilir.
 * @author Semih Tuncel
 */
function expandNode(cy, graphIndex, nodeId) {
  const { elements, didHitLimit } = collectExpandableElements(cy, graphIndex, nodeId);

  if (didHitLimit) {
    console.log('Max 50 node limitine ulaşıldı');
  }

  if (elements.length === 0) {
    return;
  }

  cy.add(elements);
  cy.layout(COSE_LAYOUT).run();
}

/**
 * Cytoscape kamerasi icin guncel pan ve zoom degerlerini sade state formatina cevirir.
 * @author Semih Tuncel
 */
function createCameraSnapshot(cy) {
  const pan = cy.pan();

  return {
    x: pan.x,
    y: pan.y,
    zoom: cy.zoom(),
  };
}

/**
 * Toolbar zoom komutunu uygular; zoom merkezi kanvasin ortasi secilir.
 * @author Semih Tuncel
 */
function zoomCanvas(cy, factor) {
  if (!cy) {
    return;
  }

  cy.zoom({
    level: cy.zoom() * factor,
    renderedPosition: {
      x: cy.width() / 2,
      y: cy.height() / 2,
    },
  });
}

/**
 * Tum gorunur elementleri ekrana sigdirir; padding sabit tutularak UI dengesi korunur.
 * @author Semih Tuncel
 */
function fitCanvas(cy) {
  if (!cy) {
    return;
  }

  cy.fit(cy.elements(), FIT_PADDING);
}

/**
 * Select ve pan modlarini Cytoscape motoruna uygular; zoom araclari anlik komuttur.
 * @author Semih Tuncel
 */
function applyCanvasMode(cy, activeTool) {
  if (!cy) {
    return;
  }

  const isPanMode = activeTool === 'pan';

  cy.userPanningEnabled(isPanMode);
  cy.boxSelectionEnabled(!isPanMode);
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
  const [cameraState, setCameraState] = useState(INITIAL_CAMERA);
  const canvasRef = useRef(null);
  const cyRef = useRef(null);
  const graphIndexRef = useRef(null);

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
     * Kamera degisince React state'i gunceller; HUD ve toolbar ayni kaynaktan beslenir.
     * @author Semih Tuncel
     */
    function handleCameraChanged() {
      setCameraState(createCameraSnapshot(cy));
    }

    /**
     * Node tiklamasinda seed indeksinden yalnizca komsulari sahneye ekler.
     * @author Semih Tuncel
     */
    function handleNodeTap(event) {
      const graphIndex = graphIndexRef.current;

      if (!graphIndex) {
        return;
      }

      expandNode(cy, graphIndex, event.target.id());
    }

    /**
     * Gelen seed graph verisini guvenli sekilde render eder; unmount sonrasi DOM'a dokunmaz.
     * @author Semih Tuncel
     */
    function handleSeedGraphLoaded(graph) {
      if (isMounted) {
        const graphIndex = createGraphIndex(graph);

        graphIndexRef.current = graphIndex;
        renderSeedGraph(cy, graphIndex);
        handleCameraChanged();
      }
    }

    cy.on('pan zoom', handleCameraChanged);
    cy.on('tap', 'node', handleNodeTap);

    fetchSeedGraph(abortController.signal)
      .then(handleSeedGraphLoaded)
      .catch(reportSeedLoadError);

    return () => {
      isMounted = false;
      abortController.abort();
      cy.destroy();
      cyRef.current = null;
      graphIndexRef.current = null;
    };
  }, []);

  useEffect(() => {
    applyCanvasMode(cyRef.current, activeTool);
  }, [activeTool]);

  /**
   * Toolbar tiklamalarini motor komutuna cevirir; select ve pan mod olarak saklanir.
   * @author Semih Tuncel
   */
  function handleToolClick(toolId) {
    const cy = cyRef.current;

    if (toolId === 'zoomin') {
      zoomCanvas(cy, ZOOM_STEP);
      return;
    }

    if (toolId === 'zoomout') {
      zoomCanvas(cy, 1 / ZOOM_STEP);
      return;
    }

    if (toolId === 'fit') {
      fitCanvas(cy);
      return;
    }

    setActiveTool(toolId);
  }

  const hudText = `x: ${Math.round(cameraState.x)}  y: ${Math.round(cameraState.y)}  zoom: ${cameraState.zoom.toFixed(2)}x`;
  const zoomPercent = `${Math.round(cameraState.zoom * 100)}%`;

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
              onClick={() => handleToolClick(tool.id)}
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
          onClick={() => handleToolClick('fit')}
        >
          <FitIcon />
        </button>

        <span className="canvas-tool-label">GRAPH CANVAS</span>

        <div className="canvas-zoom">
          <span className="zoom-val">{zoomPercent}</span>
        </div>
      </div>

      {/* Cytoscape mount point */}
      <div id="cy-canvas" ref={canvasRef}>
        <div className="canvas-hud">{hudText}</div>
      </div>
    </main>
  );
}
