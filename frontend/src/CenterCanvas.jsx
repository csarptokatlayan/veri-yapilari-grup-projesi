import cytoscape from 'cytoscape';
import { Fragment, useEffect, useRef, useState } from 'react';

const ROOT_NODE_ID = '1';
const MAX_VISIBLE_NODES = 500;
const ZOOM_STEP = 1.2;
const FIT_PADDING = 40;
const EXPAND_SPAWN_DURATION = 700;
const EXPAND_SPAWN_RADIUS = 120;
const EXPAND_SPAWN_RING_GAP = 76;
const EXPAND_SPAWN_RING_COUNT = 7;
const EXPAND_SPAWN_ANGLE_COUNT = 24;
const EXPAND_SPAWN_MIN_DISTANCE = 96;
const EXPAND_SPAWN_PROBE_DISTANCE = 230;
const EXPAND_SPAWN_FALLBACK_ANGLE = -Math.PI / 2;
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
function createNodeElement(node, spawnPosition) {
  const element = {
    data: {
      id: String(node.id),
      title: node.title,
      nodeType: node.nodeType,
      properties: node.properties ?? {},
    },
  };

  if (!spawnPosition) {
    return element;
  }

  return {
    ...element,
    position: {
      x: spawnPosition.x,
      y: spawnPosition.y,
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
 * Expand sirasinda mevcut kamerayi korur; layout kaynakli viewport ziplama etkisini bastirir.
 * @author Semih Tuncel
 */
function createViewportSnapshot(cy) {
  const pan = cy.pan();

  return {
    pan: {
      x: pan.x,
      y: pan.y,
    },
    zoom: cy.zoom(),
  };
}

/**
 * Snapshot alinmis pan ve zoom'u Cytoscape viewport'una geri uygular.
 * @author Semih Tuncel
 */
function restoreViewport(cy, viewportSnapshot) {
  cy.viewport({
    pan: viewportSnapshot.pan,
    zoom: viewportSnapshot.zoom,
  });
}

/**
 * Spatial memory icin eski node'lari animasyon boyunca sabitler ve onceki lock durumlarini saklar.
 * @author Semih Tuncel
 */
function lockNodesForAnimation(nodes) {
  const nodeLockStates = [];

  nodes.forEach((node) => {
    nodeLockStates.push({
      node,
      wasLocked: node.locked(),
    });
    node.lock();
  });

  return () => {
    nodeLockStates.forEach(({ node, wasLocked }) => {
      if (wasLocked) {
        node.lock();
        return;
      }

      node.unlock();
    });
  };
}

/**
 * Iki pozisyon arasindaki uzakligin karesini hesaplar; kok alma maliyetine gerek yoktur.
 * @author Semih Tuncel
 */
function getDistanceSquared(firstPosition, secondPosition) {
  const distanceX = firstPosition.x - secondPosition.x;
  const distanceY = firstPosition.y - secondPosition.y;

  return distanceX * distanceX + distanceY * distanceY;
}

/**
 * Parent merkezinden verilen aci ve yaricapla yeni bir hedef pozisyon uretir.
 * @author Semih Tuncel
 */
function createRadialPosition(parentPosition, angle, radius) {
  return {
    x: parentPosition.x + Math.cos(angle) * radius,
    y: parentPosition.y + Math.sin(angle) * radius,
  };
}

/**
 * Bosluk ararken parent'in kendisini ve ayni noktadaki node'lari engel listesinden ayirir.
 * @author Semih Tuncel
 */
function collectBlockingNodePositions(nodes, parentPosition) {
  const blockingPositions = [];

  nodes.forEach((node) => {
    const position = node.position();

    if (getDistanceSquared(position, parentPosition) > 1) {
      blockingPositions.push(position);
    }
  });

  return blockingPositions;
}

/**
 * Parent cevresinde mevcut node'lardan en uzak kalan aciyi secer.
 * @author Semih Tuncel
 */
function findOpenSpawnAngle(parentPosition, blockingPositions) {
  if (blockingPositions.length === 0) {
    return EXPAND_SPAWN_FALLBACK_ANGLE;
  }

  let bestAngle = EXPAND_SPAWN_FALLBACK_ANGLE;
  let bestScore = -Infinity;

  for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 12) {
    const probePosition = createRadialPosition(parentPosition, angle, EXPAND_SPAWN_PROBE_DISTANCE);
    const closestDistance = blockingPositions.reduce(
      (closest, position) => Math.min(closest, getDistanceSquared(probePosition, position)),
      Infinity,
    );

    if (closestDistance > bestScore) {
      bestScore = closestDistance;
      bestAngle = angle;
    }
  }

  return bestAngle;
}

/**
 * Base aciya yakin acilari once deneyerek cicek hissini korur.
 * @author Semih Tuncel
 */
function createOrderedSpawnAngles(baseAngle) {
  const angleStep = (Math.PI * 2) / EXPAND_SPAWN_ANGLE_COUNT;
  const angles = [baseAngle];

  for (let offset = 1; angles.length < EXPAND_SPAWN_ANGLE_COUNT; offset++) {
    angles.push(baseAngle + angleStep * offset);

    if (angles.length < EXPAND_SPAWN_ANGLE_COUNT) {
      angles.push(baseAngle - angleStep * offset);
    }
  }

  return angles;
}

/**
 * Parent etrafinda yakin halkalardan baslayarak aday slotlar uretir.
 * @author Semih Tuncel
 */
function createSpawnSlotCandidates(parentPosition, baseAngle) {
  const candidates = [];
  const angles = createOrderedSpawnAngles(baseAngle);

  for (let ringIndex = 0; ringIndex < EXPAND_SPAWN_RING_COUNT; ringIndex++) {
    const radius = EXPAND_SPAWN_RADIUS + ringIndex * EXPAND_SPAWN_RING_GAP;

    angles.forEach((angle) => {
      candidates.push(createRadialPosition(parentPosition, angle, radius));
    });
  }

  return candidates;
}

/**
 * Aday noktanin mevcut ve bu expand icinde secilen hedeflere ne kadar yakin oldugunu olcer.
 * @author Semih Tuncel
 */
function getClosestDistanceSquared(candidatePosition, occupiedPositions) {
  return occupiedPositions.reduce(
    (closest, position) => Math.min(closest, getDistanceSquared(candidatePosition, position)),
    Infinity,
  );
}

/**
 * Adaylar arasindan carpisma yapmayan en yakin slotu, yoksa en genis boslugu secer.
 * @author Semih Tuncel
 */
function findAvailableSpawnSlot(candidates, occupiedPositions) {
  const minDistanceSquared = EXPAND_SPAWN_MIN_DISTANCE * EXPAND_SPAWN_MIN_DISTANCE;
  let fallbackCandidate = candidates[0];
  let fallbackScore = -Infinity;

  for (const candidate of candidates) {
    const closestDistanceSquared = getClosestDistanceSquared(candidate, occupiedPositions);

    if (closestDistanceSquared >= minDistanceSquared) {
      return candidate;
    }

    if (closestDistanceSquared > fallbackScore) {
      fallbackScore = closestDistanceSquared;
      fallbackCandidate = candidate;
    }
  }

  return fallbackCandidate;
}

/**
 * Yeni node id'leri icin parent cevresindeki gercek bos slotlari secer.
 * @author Semih Tuncel
 */
function createSpawnTargetPositions(parentPosition, existingNodes, newNodeIds) {
  const blockingPositions = collectBlockingNodePositions(existingNodes, parentPosition);
  const baseAngle = findOpenSpawnAngle(parentPosition, blockingPositions);
  const slotCandidates = createSpawnSlotCandidates(parentPosition, baseAngle);
  const occupiedPositions = [];
  const targetPositions = new Map();

  existingNodes.forEach((node) => {
    occupiedPositions.push(node.position());
  });

  newNodeIds.forEach((nodeId) => {
    const targetPosition = findAvailableSpawnSlot(slotCandidates, occupiedPositions);

    targetPositions.set(nodeId, targetPosition);
    occupiedPositions.push(targetPosition);
  });

  return targetPositions;
}

/**
 * Yeni node'lari parent'tan fan hedeflerine dogru kisa ve gorunur bir acilimla tasir.
 * @author Semih Tuncel
 */
function animateSpawnedNodes(cy, newNodeIds, targetPositions) {
  const animations = [];

  newNodeIds.forEach((nodeId) => {
    const node = cy.getElementById(nodeId);
    const position = targetPositions.get(nodeId);

    if (node.empty() || !position) {
      return;
    }

    animations.push(
      node.animation({
        position,
        duration: EXPAND_SPAWN_DURATION,
        easing: 'ease-out-cubic',
      }).play().promise(),
    );
  });

  return Promise.all(animations);
}

/**
 * Tiklanan node icin eklenecek node ve edge elementlerini secer; 50 node limitini korur.
 * @author Semih Tuncel
 */
function collectExpandableElements(cy, graphIndex, nodeId, spawnPosition) {
  const neighborEdges = graphIndex.edgesByNodeId.get(nodeId) ?? [];
  const visibleNodeIds = createVisibleNodeIdSet(cy);
  const elements = [];
  const newNodeIds = [];
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

      elements.push(createNodeElement(oppositeNode, spawnPosition));
      newNodeIds.push(oppositeNodeId);
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
    newNodeIds,
    didHitLimit,
  };
}

/**
 * Tiklanan node'u genisletir; yeni node'lar bos yone dogru fan halinde acilir.
 * @author Semih Tuncel
 */
function expandNode(cy, graphIndex, nodeId, spawnPosition) {
  const { elements, newNodeIds, didHitLimit } = collectExpandableElements(cy, graphIndex, nodeId, spawnPosition);

  if (didHitLimit) {
    console.log('Max 50 node limitine ulaşıldı');
  }

  if (elements.length === 0) {
    return Promise.resolve();
  }

  const viewportSnapshot = createViewportSnapshot(cy);

  if (newNodeIds.length === 0) {
    cy.add(elements);
    restoreViewport(cy, viewportSnapshot);
    return Promise.resolve();
  }

  const existingNodes = cy.nodes();
  const restoreNodeLocks = lockNodesForAnimation(existingNodes);
  const spawnTargetPositions = createSpawnTargetPositions(spawnPosition, existingNodes, newNodeIds);

  cy.add(elements);
  restoreViewport(cy, viewportSnapshot);

  return animateSpawnedNodes(cy, newNodeIds, spawnTargetPositions).then(() => {
    if (cy.destroyed()) {
      return;
    }

    restoreNodeLocks();
    restoreViewport(cy, viewportSnapshot);
  });
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
export default function CenterCanvas({ onNodeSelect }) {
  const [activeTool, setActiveTool] = useState('select');
  const [cameraState, setCameraState] = useState(INITIAL_CAMERA);
  const canvasRef = useRef(null);
  const cyRef = useRef(null);
  const graphIndexRef = useRef(null);
  const isExpandingRef = useRef(false);
  const onNodeSelectRef = useRef(onNodeSelect);

  useEffect(() => {
    onNodeSelectRef.current = onNodeSelect;
  }, [onNodeSelect]);

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
      const nodeId = event.target.id();
      const graphIndex = graphIndexRef.current;

      onNodeSelectRef.current?.(nodeId);

      if (!graphIndex || isExpandingRef.current) {
        return;
      }

      isExpandingRef.current = true;
      expandNode(cy, graphIndex, nodeId, event.target.position())
        .finally(() => {
          isExpandingRef.current = false;
        });
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
