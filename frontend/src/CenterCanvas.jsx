import cytoscape from 'cytoscape';
import { Fragment, useEffect, useRef, useState } from 'react';

const ROOT_NODE_ID = '1';
const MAX_VISIBLE_NODES = 500;
const ZOOM_STEP = 1.2;
const FIT_PADDING = 40;
const EXPAND_SPAWN_DURATION = 700;
const COLLAPSE_DURATION = 360;
const ALGORITHM_STEP_DELAY = 400;
const ALGORITHM_OVERLAY_PREFIX = 'algo-overlay';
const EXPAND_SPAWN_RADIUS = 140;
const EXPAND_SPAWN_RING_GAP = 90;
const EXPAND_SPAWN_RING_COUNT = 15;
const EXPAND_SPAWN_ANGLE_COUNT = 36;
const EXPAND_SPAWN_MIN_DISTANCE = 140;
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
    title: 'Sec',
    icon: (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2 2l3.5 9.5 2-4 4.5 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
  },
  {
    id: 'pan',
    title: 'Kaydir',
    icon: (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 1v12M1 7h12M3.5 3.5l7 7M10.5 3.5l-7 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
    ),
  },
  {
    id: 'zoomin',
    title: 'Yakinlastir',
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
    title: 'Uzaklastir',
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
 * Ekrana sigdir ikonunu cizer; toolbar icin statik SVG secildi.
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
    selector: 'edge',
    style: {
      label: 'data(type)',
      width: 1.2,
      color: '#6b7385',
      'font-size': 7,
      'font-family': 'Courier New, monospace',
      'line-color': '#3f4558',
      'curve-style': 'bezier',
      'text-rotation': 'autorotate',
      'text-margin-y': -8,
      opacity: 0.72,
      'target-arrow-shape': 'none', // Bütün oklari varsayılan olarak kaldırdık (Düz çizgi)
    },
  },
  {
    selector: 'edge[type = "LIKES"], edge[type = "POSTED"], edge[type = "ATTENDS"]',
    style: {
      'target-arrow-color': '#3f4558',
      'target-arrow-shape': 'triangle', // Sadece bu aksiyonlara ok ekledik
    }
  },
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
    selector: 'node[nodeType = "UNKNOWN"]',
    style: {
      shape: 'ellipse',
      'background-color': '#596070',
    },
  },
  
  
  
  // F3-US4: Algoritma Sonucu Vurgulama Stilleri (Murat Kutku Entegrasyonu)
  {
    selector: 'node.highlighted',
    style: {
      'border-width': 3,
      'border-color': '#00ffcc',
      width: 42,
      height: 42,
      'font-size': 11,
      color: '#fff',
    },
  },
  {
    selector: 'node.algo-start',
    style: {
      'border-width': 4,
      'border-color': '#3df253',
      'background-color': '#1b5e20',
    },
  },
  {
    selector: 'node.algo-end',
    style: {
      'border-width': 4,
      'border-color': '#f44336',
      'background-color': '#b71c1c',
    },
  },
  {
    selector: 'edge.highlighted',
    style: {
      width: 3.5,
      'line-color': '#00ffcc',
      'target-arrow-color': '#00ffcc',
      opacity: 1,
    },
  },
  {
    selector: 'edge.algo-overlay',
    style: {
      width: 4,
      'line-color': '#ffce45',
      'target-arrow-color': '#ffce45',
      'target-arrow-shape': 'triangle',
      'curve-style': 'bezier',
      'control-point-step-size': 36,
      'z-index': 999,
      opacity: 1,
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
    wheelSensitivity: 0.40,
  });
}

/**
 * Graph endpoint cevabini okur; backend graph sozlesmesini tek yerde toplar.
 * @author Semih Tuncel
 */
async function fetchGraphEndpoint(path, signal) {
  const response = await fetch(path, { signal });

  if (!response.ok) {
    throw new Error(`Graph yuklenemedi: ${response.status}`);
  }

  return response.json();
}

/**
 * Backend kapaliyken local seed graph dosyasini indirir.
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
 * Ilk graph parcasini backend init endpointinden getirir.
 * @author Semih Tuncel
 */
function fetchInitialGraph(signal) {
  return fetchGraphEndpoint(`/nodes/${ROOT_NODE_ID}/neighbors`, signal);
}

/**
 * Tiklanan dugumun komsu graph parcasini backend endpointinden getirir.
 * @author Semih Tuncel
 */
function fetchNodeNeighbors(nodeId, signal) {
  const encodedNodeId = encodeURIComponent(nodeId);

  return fetchGraphEndpoint(`/nodes/${encodedNodeId}/neighbors`, signal);
}

/**
 * Backend dugum kimligini string Cytoscape id formatina indirger.
 * @author Semih Tuncel
 */
function getNodeIdValue(node) {
  return node?.id ?? node?.ID ?? node?.nodeId;
}

/**
 * Backend tip alanini tek nodeType degerine indirger.
 * @author Semih Tuncel
 */
function getNodeTypeValue(node) {
  return node?.nodeType ?? node?.type ?? 'UNKNOWN';
}

/**
 * Property degerini hash map gorunumune uygun guvenli nesneye cevirir.
 * @author Semih Tuncel
 */
function normalizeProperties(properties) {
  if (!properties || typeof properties !== 'object' || Array.isArray(properties)) {
    return {};
  }

  return properties;
}

/**
 * Backend node kaydini secim ve Cytoscape icin ortak node payloadina cevirir.
 * @author Semih Tuncel
 */
function normalizeNode(node) {
  const id = String(getNodeIdValue(node));
  const title = node?.title ? String(node.title) : id;
  const nodeType = String(getNodeTypeValue(node));

  return {
    id,
    title,
    nodeType,
    properties: normalizeProperties(node?.properties),
  };
}

/**
 * Edge ucundaki id veya node nesnesinden string id alir.
 * @author Semih Tuncel
 */
function getEdgeEndpointId(endpoint) {
  if (endpoint && typeof endpoint === 'object') {
    return String(getNodeIdValue(endpoint));
  }

  return String(endpoint);
}

/**
 * Edge icin backend id yoksa deterministik duplicate onleyici id uretir.
 * @author Semih Tuncel
 */
function createDeterministicEdgeId(edge) {
  const sourceId = getEdgeEndpointId(edge.source);
  const targetId = getEdgeEndpointId(edge.target ?? edge.destination);
  const type = edge.type ?? 'EDGE';
  const directed = Boolean(edge.directed);

  return `${sourceId}-${targetId}-${type}-${directed}`;
}

/**
 * Backend edge kaydini Cytoscape edge payloadina cevirir.
 * @author Semih Tuncel
 */
function normalizeEdge(edge) {
  const source = getEdgeEndpointId(edge?.source);
  const target = getEdgeEndpointId(edge?.target ?? edge?.destination);
  const type = String(edge?.type ?? 'EDGE');
  const directed = Boolean(edge?.directed);
  const id = edge?.id ? String(edge.id) : createDeterministicEdgeId({
    source,
    target,
    type,
    directed,
  });

  return {
    id,
    source,
    target,
    type,
    directed,
  };
}

/**
 * Graph cevabini guvenli node ve edge dizilerine ayirir.
 * @author Semih Tuncel
 */
function normalizeGraphResponse(graph) {
  const rawNodes = Array.isArray(graph?.nodes) ? graph.nodes : [];
  const rawEdges = Array.isArray(graph?.edges) ? graph.edges : [];

  return {
    nodes: rawNodes.map(normalizeNode),
    edges: rawEdges.map(normalizeEdge),
  };
}

/**
 * Edge kaydini node indeksine ekler; Map uzerinden komsu edge aramasi hizli kalir.
 * @author Semih Tuncel
 */
function appendEdgeToNodeIndex(edgesByNodeId, nodeId, edge) {
  const edges = edgesByNodeId.get(nodeId) ?? [];

  edges.push(edge);
  edgesByNodeId.set(nodeId, edges);
}

/**
 * Seed graph icin node ve komsu edge indekslerini kurar; lazy fallback icin Map secilir.
 * @author Semih Tuncel
 */
function createGraphIndex(graph) {
  const normalizedGraph = normalizeGraphResponse(graph);
  // Insert: O(1)  Search: O(1)  Delete: O(1)
  const nodesById = new Map();
  // Insert: O(1)  Search: O(1)  Delete: O(1)
  const edgesByNodeId = new Map();

  normalizedGraph.nodes.forEach((node) => {
    nodesById.set(node.id, node);
  });

  normalizedGraph.edges.forEach((edge) => {
    appendEdgeToNodeIndex(edgesByNodeId, edge.source, edge);

    if (edge.source !== edge.target) {
      appendEdgeToNodeIndex(edgesByNodeId, edge.target, edge);
    }
  });

  return {
    nodesById,
    edgesByNodeId,
  };
}

/**
 * Edge'in verilen node disindaki ucunu bulur; local expand komsuyu buradan alir.
 * @author Semih Tuncel
 */
function getOppositeNodeId(edge, nodeId) {
  return edge.source === nodeId ? edge.target : edge.source;
}

/**
 * Seed indexinden baslangic icin kullanilacak root node id degerini secer.
 * @author Semih Tuncel
 */
function getSeedRootNodeId(graphIndex) {
  if (graphIndex.nodesById.has(ROOT_NODE_ID)) {
    return ROOT_NODE_ID;
  }

  return graphIndex.nodesById.keys().next().value;
}

/**
 * Seed indexinden secili node ve birinci derece komsulari icin graph parcasi uretir.
 * @author Semih Tuncel
 */
function createLocalNeighborGraph(graphIndex, nodeId) {
  const centerNode = graphIndex.nodesById.get(nodeId);
  const neighborEdges = graphIndex.edgesByNodeId.get(nodeId) ?? [];
  // Insert: O(1)  Search: O(1)  Delete: O(1)
  const nodeIds = new Set();
  // Insert: O(1)  Search: O(1)  Delete: O(1)
  const edgeIds = new Set();
  const nodes = [];
  const edges = [];

  if (centerNode) {
    nodeIds.add(centerNode.id);
    nodes.push(centerNode);
  }

  neighborEdges.forEach((edge) => {
    const oppositeNodeId = getOppositeNodeId(edge, nodeId);
    const oppositeNode = graphIndex.nodesById.get(oppositeNodeId);

    if (oppositeNode && !nodeIds.has(oppositeNode.id)) {
      nodeIds.add(oppositeNode.id);
      nodes.push(oppositeNode);
    }

    if (!edgeIds.has(edge.id)) {
      edgeIds.add(edge.id);
      edges.push(edge);
    }
  });

  return {
    nodes,
    edges,
  };
}

/**
 * Seed indexinden ilk gorunum icin root ve komsularini uretir.
 * @author Semih Tuncel
 */
function createLocalInitialGraph(graphIndex) {
  const rootNodeId = getSeedRootNodeId(graphIndex);

  if (!rootNodeId) {
    return {
      nodes: [],
      edges: [],
    };
  }

  return createLocalNeighborGraph(graphIndex, rootNodeId);
}

/**
 * Seed graph indexini cache ile yukler; tekrar eden fallback fetchlerini onler.
 * @author Semih Tuncel
 */
function loadSeedGraphIndex(seedGraphCache, signal) {
  if (seedGraphCache.graphIndex) {
    return Promise.resolve(seedGraphCache.graphIndex);
  }

  if (!seedGraphCache.promise) {
    seedGraphCache.promise = fetchSeedGraph(signal)
        .then((graph) => {
          const graphIndex = createGraphIndex(graph);

          seedGraphCache.graphIndex = graphIndex;
          return graphIndex;
        })
        .catch((error) => {
          seedGraphCache.promise = null;
          throw error;
        });
  }

  return seedGraphCache.promise;
}

/**
 * Node payloadini Cytoscape elementine cevirir; spawn varsa pozisyon ekler.
 * @author Semih Tuncel
 */
function createNodeElement(node, spawnPosition) {
  const element = {
    data: node,
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
 * Edge payloadini Cytoscape elementine cevirir.
 * @author Semih Tuncel
 */
function createEdgeElement(edge) {
  return {
    data: edge,
  };
}

/**
 * Cytoscape node datasini inspector icin sade payloada cevirir.
 * @author Semih Tuncel
 */
function createSelectedNodePayload(cyNode) {
  const data = cyNode.data();

  return {
    id: data.id,
    title: data.title,
    nodeType: data.nodeType,
    properties: normalizeProperties(data.properties),
  };
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
 * Graph parcasindan yalnizca yeni elementleri secer.
 * @author Semih Tuncel
 */
function collectGraphElementsForAdd(cy, graph, spawnPosition) {
  const visibleNodeIds = createVisibleNodeIdSet(cy);
  const elements = [];
  const newNodeIds = [];
  const newEdgeIds = [];
  let didHitLimit = false;

  graph.nodes.forEach((node) => {
    const existingNode = cy.getElementById(node.id);

    if (!existingNode.empty()) {
      existingNode.data(node);
      return;
    }

    if (visibleNodeIds.size >= MAX_VISIBLE_NODES) {
      didHitLimit = true;
      return;
    }

    elements.push(createNodeElement(node, spawnPosition));
    newNodeIds.push(node.id);
    visibleNodeIds.add(node.id);
  });

  graph.edges.forEach((edge) => {
    if (
        cy.getElementById(edge.id).empty()
        && visibleNodeIds.has(edge.source)
        && visibleNodeIds.has(edge.target)
    ) {
      elements.push(createEdgeElement(edge));
      newEdgeIds.push(edge.id);
    }
  });

  return {
    elements,
    newNodeIds,
    newEdgeIds,
    didHitLimit,
  };
}

/**
 * Bastan render edilen graph parcasini acik dugum kaydina cevirir.
 * @author Semih Tuncel
 */
function createExpansionRecordFromGraph(graph, expandedNodeId) {
  return {
    nodeIds: graph.nodes
        .map((node) => node.id)
        .filter((nodeId) => nodeId !== expandedNodeId),
    edgeIds: graph.edges.map((edge) => edge.id),
  };
}

/**
 * Bos expand kayitlarini map'e yazmadan ayirir.
 * @author Semih Tuncel
 */
function hasExpansionRecordContent(expansionRecord) {
  return expansionRecord.nodeIds.length > 0 || expansionRecord.edgeIds.length > 0;
}

/**
 * Render edilen graph icin kaydi yalnizca ilgili merkez dugum sahnedeyse ekler.
 * @author Semih Tuncel
 */
function registerRenderedExpansion(cy, expansionRecords, expandedNodeId, graph) {
  if (cy.getElementById(expandedNodeId).empty()) {
    return;
  }

  const expansionRecord = createExpansionRecordFromGraph(graph, expandedNodeId);

  if (hasExpansionRecordContent(expansionRecord)) {
    expansionRecords.set(expandedNodeId, expansionRecord);
  }
}

/**
 * Acik kalan diger expand kayitlari verilen node'a hala ihtiyac duyuyor mu kontrol eder.
 * @author Semih Tuncel
 */
function isNodeUsedByOtherExpansion(cy, expansionRecords, expandedNodeId, nodeId) {
  for (const [recordNodeId, record] of expansionRecords.entries()) {
    if (recordNodeId === expandedNodeId) {
      continue;
    }

    if (record.nodeIds.includes(nodeId)) {
      return true;
    }

    const hasLinkedEdge = record.edgeIds.some((edgeId) => {
      const edge = cy.getElementById(edgeId);

      return !edge.empty() && (edge.data('source') === nodeId || edge.data('target') === nodeId);
    });

    if (hasLinkedEdge) {
      return true;
    }
  }

  return false;
}

/**
 * Daha once acilmis bir dugumun getirdigi edge ve node'lari animasyonla geri kaldirir.
 * @author Semih Tuncel
 */
function collapseExpandedNode(cy, expansionRecords, expandedNodeId) {
  const record = expansionRecords.get(expandedNodeId);

  if (!record) {
    return Promise.resolve();
  }

  const parentNode = cy.getElementById(expandedNodeId);
  const collapsePosition = parentNode.empty() ? null : parentNode.position();
  const removableEdges = [];
  const removableNodes = [];

  record.edgeIds.forEach((edgeId) => {
    const edge = cy.getElementById(edgeId);
    if (!edge.empty()) {
      removableEdges.push(edge);
    }
  });

  record.nodeIds.forEach((nodeId) => {
    const node = cy.getElementById(nodeId);

    if (node.empty() || isNodeUsedByOtherExpansion(cy, expansionRecords, expandedNodeId, nodeId)) {
      return;
    }

    removableNodes.push(node);
  });

  expansionRecords.delete(expandedNodeId);

  const fadeAnimations = removableEdges.map((edge) => (
      edge.animation({
        style: { opacity: 0 },
        duration: COLLAPSE_DURATION,
        easing: 'ease-out-cubic',
      }).play().promise()
  ));

  const nodeAnimations = removableNodes.map((node) => {
    const animationConfig = {
      style: { opacity: 0 },
      duration: COLLAPSE_DURATION,
      easing: 'ease-in-cubic',
    };

    if (collapsePosition) {
      animationConfig.position = collapsePosition;
    }

    return node.animation(animationConfig).play().promise();
  });

  return Promise.all([...fadeAnimations, ...nodeAnimations]).then(() => {
    if (cy.destroyed()) {
      return;
    }

    removableEdges.forEach((edge) => {
      if (!edge.empty()) {
        edge.remove();
      }
    });

    removableNodes.forEach((node) => {
      if (!node.empty()) {
        node.remove();
      }
    });
  });
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
 * Spatial memory icin eski node'lari animasyon boyunca sabitler.
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
 * Iki pozisyon arasindaki uzakligin karesini hesaplar; kok alma maliyeti gerekmez.
 * @author Semih Tuncel
 */
function getDistanceSquared(firstPosition, secondPosition) {
  const distanceX = firstPosition.x - secondPosition.x;
  const distanceY = firstPosition.y - secondPosition.y;

  return distanceX * distanceX + distanceY * distanceY;
}

/**
 * Parent merkezinden verilen aci ve yaricapla yeni hedef pozisyon uretir.
 * @author Semih Tuncel
 */
function createRadialPosition(parentPosition, angle, radius) {
  return {
    x: parentPosition.x + Math.cos(angle) * radius,
    y: parentPosition.y + Math.sin(angle) * radius,
  };
}

/**
 * Bosluk ararken parent noktasini engel listesinden ayirir.
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
 * Base aciya yakin acilari once deneyerek fan hissini korur.
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
 * Aday noktanin mevcut hedeflere en yakin mesafesini olcer.
 * @author Semih Tuncel
 */
function getClosestDistanceSquared(candidatePosition, occupiedPositions) {
  return occupiedPositions.reduce(
      (closest, position) => Math.min(closest, getDistanceSquared(candidatePosition, position)),
      Infinity,
  );
}

/**
 * Adaylar arasindan carpisma yapmayan en yakin slotu secer.
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
 * Yeni node id'leri icin parent cevresindeki bos slotlari secer.
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
 * Yeni node'lari parent'tan fan hedeflerine dogru tasir.
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
 * Ilk graph parcasini sahneye koyar ve layout calistirir.
 * @author Semih Tuncel
 */
function renderInitialGraph(cy, graph) {
  const { elements, didHitLimit } = collectGraphElementsForAdd(cy, graph);

  if (didHitLimit) {
    console.log(`Maksimum ${MAX_VISIBLE_NODES} node limitine ulasildi`);
  }

  if (elements.length === 0) {
    return;
  }

  cy.add(elements);
  cy.layout(COSE_LAYOUT).run();
}

/**
 * Arama seciminden gelen graph icinde secili node yoksa onu basa ekler.
 * @author Semih Tuncel
 */
function ensureSelectedNodeInGraph(graph, selectedNode) {
  const hasSelectedNode = graph.nodes.some((node) => node.id === selectedNode.id);

  if (hasSelectedNode) {
    return graph;
  }

  return {
    nodes: [selectedNode, ...graph.nodes],
    edges: graph.edges,
  };
}

/**
 * Kanvasi tamamen temizler ve verilen graph parcasini bastan render eder.
 * @author Semih Tuncel
 */
function renderFreshGraph(cy, graph) {
  cy.elements().remove();
  renderInitialGraph(cy, graph);
}

/**
 * Komsu graph parcasini mevcut sahneye duplicate olmadan ekler.
 * @author Semih Tuncel
 */
function mergeExpandedGraph(cy, graph, spawnPosition) {
  const { elements, newNodeIds, newEdgeIds, didHitLimit } = collectGraphElementsForAdd(cy, graph, spawnPosition);
  const expansionRecord = {
    nodeIds: newNodeIds,
    edgeIds: newEdgeIds,
  };

  if (didHitLimit) {
    console.log(`Maksimum ${MAX_VISIBLE_NODES} node limitine ulasildi`);
  }

  if (elements.length === 0) {
    return Promise.resolve(expansionRecord);
  }

  if (newNodeIds.length === 0) {
    cy.add(elements);
    return Promise.resolve(expansionRecord);
  }

  const existingNodes = cy.nodes();
  const restoreNodeLocks = lockNodesForAnimation(existingNodes);
  const spawnTargetPositions = createSpawnTargetPositions(spawnPosition, existingNodes, newNodeIds);

  cy.add(elements);

  return animateSpawnedNodes(cy, newNodeIds, spawnTargetPositions).then(() => {
    if (cy.destroyed()) {
      return expansionRecord;
    }

    restoreNodeLocks();
    return expansionRecord;
  });
}

/**
 * Cytoscape kamerasi icin pan ve zoom degerlerini sade state formatina cevirir.
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
 * Kanvastaki gorunur dugum ve gercek edge sayisini panel state'ine hazirlar.
 * @author Semih Tuncel
 */
function createGraphStats(cy) {
  return {
    DUGUM: cy.nodes().length,
    EDGE: cy.edges().filter((edge) => !edge.hasClass('algo-overlay')).length,
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
 * Tum gorunur elementleri ekrana sigdirir.
 * @author Semih Tuncel
 */
function fitCanvas(cy) {
  if (!cy) {
    return;
  }

  cy.fit(cy.elements(), FIT_PADDING);
}

/**
 * Select ve pan modlarini Cytoscape motoruna uygular.
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
 * Abort disindaki graph hatalarini bildirir; mevcut sahne korunur.
 * @author Semih Tuncel
 */
function reportGraphLoadError(error, label) {
  if (error.name !== 'AbortError') {
    console.error(`${label} yuklenemedi`, error);
  }
}

/**
 * Abort durumunu normal Error nesnesiyle temsil eder; runner temiz cikis yapar.
 * @author Semih Tuncel
 */
function createAlgorithmAbortError() {
  const error = new Error('Algoritma animasyonu iptal edildi.');

  error.name = 'AbortError';
  return error;
}

/**
 * Iptal sinyalini ortak noktada kontrol eder; async animasyon akisi sade kalir.
 * @author Semih Tuncel
 */
function throwIfAlgorithmAborted(signal) {
  if (signal?.aborted) {
    throw createAlgorithmAbortError();
  }
}

/**
 * Adim arasi beklemeyi iptal edilebilir timer ile yapar; UI thread bloklanmaz.
 * @author Semih Tuncel
 */
function waitForAlgorithmStep(signal) {
  throwIfAlgorithmAborted(signal);

  return new Promise((resolve, reject) => {
    const timerId = window.setTimeout(resolve, ALGORITHM_STEP_DELAY);

    signal?.addEventListener('abort', () => {
      window.clearTimeout(timerId);
      reject(createAlgorithmAbortError());
    }, { once: true });
  });
}

/**
 * Algoritma tipinden frontend traversal modunu secer; zincirleme tipleri korunur.
 * @author Semih Tuncel
 */
function getAlgorithmTraversalMode(type) {
  if (type === 'bfs' || type === 'dynamic-chain-bfs') {
    return 'bfs';
  }

  if (type === 'dfs' || type === 'dynamic-chain-dfs') {
    return 'dfs';
  }

  return null;
}

/**
 * Node id siralamasini sayisal deger varsa sayisal, yoksa string yapar.
 * @author Semih Tuncel
 */
function compareNodeIds(firstNodeId, secondNodeId) {
  const firstNumber = Number(firstNodeId);
  const secondNumber = Number(secondNodeId);

  if (Number.isFinite(firstNumber) && Number.isFinite(secondNumber)) {
    return firstNumber - secondNumber;
  }

  return String(firstNodeId).localeCompare(String(secondNodeId));
}

/**
 * Traversal komsularini deterministik siraya sokar; BFS/DFS farki stabil gorunur.
 * @author Semih Tuncel
 */
function sortTraversalEntries(entries) {
  return entries.sort((firstEntry, secondEntry) => {
    const nodeCompare = compareNodeIds(firstEntry.nodeId, secondEntry.nodeId);

    if (nodeCompare !== 0) {
      return nodeCompare;
    }

    return firstEntry.edge.id.localeCompare(secondEntry.edge.id);
  });
}

/**
 * Node dizisini Map indeksine cevirir; id ile node aramasi sabit zamanda kalir.
 * @author Semih Tuncel
 */
function createNodeMap(nodes) {
  // Insert: O(1)  Search: O(1)  Delete: O(1)
  const nodesById = new Map();

  nodes.forEach((node) => {
    nodesById.set(node.id, node);
  });

  return nodesById;
}

/**
 * Komsuluk Map kaydina tek edge gecisi ekler; traversal grafinda queue/stack beslenir.
 * @author Semih Tuncel
 */
function appendTraversalAdjacency(adjacencyByNodeId, sourceId, targetId, edge) {
  const entries = adjacencyByNodeId.get(sourceId) ?? [];

  entries.push({
    nodeId: targetId,
    edge,
  });
  adjacencyByNodeId.set(sourceId, entries);
}

/**
 * Backend alt grafini adjacency map yapar; BFS/DFS ayni indeks uzerinden calisir.
 * @author Semih Tuncel
 */
function createTraversalAdjacency(graph, nodesById) {
  // Insert: O(1)  Search: O(1)  Delete: O(1)
  const adjacencyByNodeId = new Map();

  graph.nodes.forEach((node) => {
    adjacencyByNodeId.set(node.id, []);
  });

  graph.edges.forEach((edge) => {
    if (!nodesById.has(edge.source) || !nodesById.has(edge.target)) {
      return;
    }

    appendTraversalAdjacency(adjacencyByNodeId, edge.source, edge.target, edge);

    if (edge.source !== edge.target) {
      appendTraversalAdjacency(adjacencyByNodeId, edge.target, edge.source, edge);
    }
  });

  adjacencyByNodeId.forEach((entries) => {
    sortTraversalEntries(entries);
  });

  return adjacencyByNodeId;
}

/**
 * Backend node verisi yoksa gorsel akisi koparmayan sade node verisi uretir.
 * @author Semih Tuncel
 */
function createFallbackAlgorithmNode(nodeId) {
  return {
    id: String(nodeId),
    title: String(nodeId),
    nodeType: 'UNKNOWN',
    properties: {},
  };
}

/**
 * BFS adimlarini queue ile uretir; genislik oncelikli sira gorunur kalir.
 * @author Semih Tuncel
 */
function createBfsTraversalSteps(startNodeId, adjacencyByNodeId) {
  // Insert: O(1)  Search: O(1)  Delete: O(1)
  const visitedNodeIds = new Set([startNodeId]);
  const queue = [{
    nodeId: startNodeId,
    parentNodeId: null,
    edge: null,
  }];
  const steps = [];
  let queueCursor = 0;

  while (queueCursor < queue.length) {
    const currentStep = queue[queueCursor];

    queueCursor += 1;
    steps.push(currentStep);

    const entries = adjacencyByNodeId.get(currentStep.nodeId) ?? [];

    entries.forEach((entry) => {
      if (visitedNodeIds.has(entry.nodeId)) {
        return;
      }

      visitedNodeIds.add(entry.nodeId);
      queue.push({
        nodeId: entry.nodeId,
        parentNodeId: currentStep.nodeId,
        edge: entry.edge,
      });
    });
  }

  return steps;
}

/**
 * DFS adimlarini stack ile uretir; derinlik oncelikli ilerleme ekranda ayrisir.
 * @author Semih Tuncel
 */
function createDfsTraversalSteps(startNodeId, adjacencyByNodeId) {
  // Insert: O(1)  Search: O(1)  Delete: O(1)
  const visitedNodeIds = new Set();
  const stack = [{
    nodeId: startNodeId,
    parentNodeId: null,
    edge: null,
  }];
  const steps = [];

  while (stack.length > 0) {
    const currentStep = stack.pop();

    if (visitedNodeIds.has(currentStep.nodeId)) {
      continue;
    }

    visitedNodeIds.add(currentStep.nodeId);
    steps.push(currentStep);

    const entries = adjacencyByNodeId.get(currentStep.nodeId) ?? [];

    for (let index = entries.length - 1; index >= 0; index--) {
      const entry = entries[index];

      if (visitedNodeIds.has(entry.nodeId)) {
        continue;
      }

      stack.push({
        nodeId: entry.nodeId,
        parentNodeId: currentStep.nodeId,
        edge: entry.edge,
      });
    }
  }

  return steps;
}

/**
 * Secili moda gore traversal adimlarini hazirlar; graph normalizasyonu burada biter.
 * @author Semih Tuncel
 */
function createTraversalSteps(graph, mode, startNodeId) {
  const nodesById = createNodeMap(graph.nodes);

  if (!nodesById.has(startNodeId)) {
    nodesById.set(startNodeId, createFallbackAlgorithmNode(startNodeId));
  }

  const adjacencyByNodeId = createTraversalAdjacency(graph, nodesById);

  if (!adjacencyByNodeId.has(startNodeId)) {
    adjacencyByNodeId.set(startNodeId, []);
  }

  const steps = mode === 'dfs'
      ? createDfsTraversalSteps(startNodeId, adjacencyByNodeId)
      : createBfsTraversalSteps(startNodeId, adjacencyByNodeId);

  return {
    nodesById,
    steps,
  };
}

/**
 * Mevcut viewport merkezini model koordinatina cevirir; eksik start node burada dogar.
 * @author Semih Tuncel
 */
function createViewportCenterPosition(cy) {
  const extent = cy.extent();

  return {
    x: (extent.x1 + extent.x2) / 2,
    y: (extent.y1 + extent.y2) / 2,
  };
}

/**
 * Algoritma node'unu sahnede garanti eder; eksikse parent uzerinden spawn eder.
 * @author Semih Tuncel
 */
async function ensureAlgorithmNodeVisible(cy, node, parentNodeId, signal) {
  throwIfAlgorithmAborted(signal);

  const existingNode = cy.getElementById(node.id);

  if (!existingNode.empty()) {
    existingNode.data(node);
    return existingNode;
  }

  if (cy.nodes().length >= MAX_VISIBLE_NODES) {
    console.log(`Maksimum ${MAX_VISIBLE_NODES} node limitine ulasildi`);
    return null;
  }

  const parentNode = parentNodeId ? cy.getElementById(parentNodeId) : null;
  const hasVisibleParent = parentNode && !parentNode.empty();
  const spawnPosition = hasVisibleParent ? parentNode.position() : createViewportCenterPosition(cy);

  if (!hasVisibleParent) {
    cy.add(createNodeElement(node, spawnPosition));
    return cy.getElementById(node.id);
  }

  const existingNodes = cy.nodes();
  const restoreNodeLocks = lockNodesForAnimation(existingNodes);
  const targetPositions = createSpawnTargetPositions(spawnPosition, existingNodes, [node.id]);

  cy.add(createNodeElement(node, spawnPosition));

  await animateSpawnedNodes(cy, [node.id], targetPositions);

  if (!cy.destroyed()) {
    restoreNodeLocks();
  }

  throwIfAlgorithmAborted(signal);
  return cy.getElementById(node.id);
}

/**
 * Verilen iki node arasindaki gorunur edge'i bulur; ters kayitli edge de kabul edilir.
 * @author Semih Tuncel
 */
function findVisibleConnectingEdge(cy, fromNodeId, toNodeId) {
  const visibleEdges = cy.edges();

  for (let index = 0; index < visibleEdges.length; index++) {
    const edge = visibleEdges[index];

    if (edge.hasClass('algo-overlay')) {
      continue;
    }

    const source = String(edge.data('source'));
    const target = String(edge.data('target'));
    const isForward = source === fromNodeId && target === toNodeId;
    const isReverse = source === toNodeId && target === fromNodeId;

    if (isForward || isReverse) {
      return edge;
    }
  }

  return null;
}

/**
 * Algoritma edge'ini sahneye ekler; yoksa gorunur ters edge'i kullanir.
 * @author Semih Tuncel
 */
function ensureAlgorithmEdgeVisible(cy, edge) {
  if (!edge) {
    return null;
  }

  const existingEdge = cy.getElementById(edge.id);

  if (!existingEdge.empty()) {
    existingEdge.data(edge);
    return existingEdge;
  }

  const visibleEdge = findVisibleConnectingEdge(cy, edge.source, edge.target);

  if (visibleEdge) {
    return visibleEdge;
  }

  const sourceNode = cy.getElementById(edge.source);
  const targetNode = cy.getElementById(edge.target);

  if (sourceNode.empty() || targetNode.empty()) {
    return null;
  }

  cy.add(createEdgeElement(edge));

  return cy.getElementById(edge.id);
}

/**
 * Eski algoritma vurgularini temizler; kalici graph node'lari sahnede kalir.
 * @author Semih Tuncel
 */
function clearAlgorithmVisualState(cy) {
  cy.elements().removeClass('highlighted algo-start algo-end');
  cy.elements('edge.algo-overlay').remove();
}

/**
 * Traversal adimini uygular; node spawn ve edge highlight tek yerde islenir.
 * @author Semih Tuncel
 */
async function applyTraversalStep(cy, step, nodesById, startNodeId, record, signal) {
  const node = nodesById.get(step.nodeId) ?? createFallbackAlgorithmNode(step.nodeId);

  const isNodeNew = cy.getElementById(node.id).empty();

  const cyNode = await ensureAlgorithmNodeVisible(cy, node, step.parentNodeId, signal);

  if (!cyNode || cyNode.empty()) {
    return;
  }


  if (isNodeNew && node.id !== startNodeId) {
    if (!record.nodeIds.includes(node.id)) {
      record.nodeIds.push(node.id);
    }
  }

  cyNode.addClass('highlighted');

  if (step.nodeId === startNodeId) {
    cyNode.addClass('algo-start');
  }

  if (step.edge) {
    const isEdgeNew = cy.getElementById(step.edge.id).empty();
    const cyEdge = ensureAlgorithmEdgeVisible(cy, step.edge);

    if (cyEdge && !cyEdge.empty()) {
      cyEdge.addClass('highlighted');
      if (isEdgeNew && !record.edgeIds.includes(step.edge.id)) {
        record.edgeIds.push(step.edge.id);
      }
    }
  }
}
/**
 * BFS/DFS graph sonucunu 400ms araliklarla sahneye uygular.
 * @author Semih Tuncel
 */
async function runTraversalAnimation(cy, result, mode, record, signal) {
  const graph = normalizeGraphResponse(result.data);
  const startNodeId = String(result.startNode);
  const { nodesById, steps } = createTraversalSteps(graph, mode, startNodeId);

  for (const step of steps) {
    throwIfAlgorithmAborted(signal);
    await applyTraversalStep(cy, step, nodesById, startNodeId, record, signal);
    await waitForAlgorithmStep(signal);
  }
}

/**
 * Path icindeki iki node'u baglayan edge kaydini alt graftan secer.
 * @author Semih Tuncel
 */
function findConnectingEdge(edges, fromNodeId, toNodeId) {
  return edges.find((edge) => {
    const source = String(edge.source);
    const target = String(edge.target);
    const isForward = source === fromNodeId && target === toNodeId;
    const isReverse = source === toNodeId && target === fromNodeId;

    return isForward || isReverse;
  }) ?? null;
}

/**
 * Shortest path segmenti icin yalniz gerekli komsu graph parcasini getirir.
 * @author Semih Tuncel
 */
async function fetchPathSegmentGraph(fromNodeId, signal) {
  try {
    const graph = await fetchNodeNeighbors(fromNodeId, signal);

    return normalizeGraphResponse(graph);
  } catch (error) {
    if (error.name === 'AbortError') {
      throw error;
    }

    reportGraphLoadError(error, 'Shortest path segment graph');

    return {
      nodes: [],
      edges: [],
    };
  }
}

/**
 * Path node'u eksikse parent komsularindan sadece gerekli node ve edge'i ekler.
 * @author Semih Tuncel
 */
async function ensureShortestPathNodeVisible(cy, fromNodeId, toNodeId, record, signal) {
  const existingNode = cy.getElementById(toNodeId);

  if (!existingNode.empty()) {
    return existingNode;
  }

  const segmentGraph = await fetchPathSegmentGraph(fromNodeId, signal);
  const nodesById = createNodeMap(segmentGraph.nodes);
  const nextNode = nodesById.get(toNodeId) ?? createFallbackAlgorithmNode(toNodeId);
  const connectingEdge = findConnectingEdge(segmentGraph.edges, fromNodeId, toNodeId);

  const isNodeNew = cy.getElementById(nextNode.id).empty();
  const cyNode = await ensureAlgorithmNodeVisible(cy, nextNode, fromNodeId, signal);


  if (isNodeNew && record) {
    if (!record.nodeIds.includes(nextNode.id)) {
      record.nodeIds.push(nextNode.id);
    }
  }

  if (connectingEdge) {
    const isEdgeNew = cy.getElementById(connectingEdge.id).empty();
    ensureAlgorithmEdgeVisible(cy, connectingEdge)?.addClass('highlighted');


    if (isEdgeNew && record) {
      if (!record.edgeIds.includes(connectingEdge.id)) {
        record.edgeIds.push(connectingEdge.id);
      }
    }
  }

  return cyNode;
}

/**
 * Shortest path icin path yonunde gecici ok edge'i ekler.
 * @author Semih Tuncel
 */
function addShortestPathOverlayEdge(cy, fromNodeId, toNodeId, index) {
  const overlayEdgeId = `${ALGORITHM_OVERLAY_PREFIX}-${index}-${fromNodeId}-${toNodeId}`;
  const existingOverlay = cy.getElementById(overlayEdgeId);

  if (!existingOverlay.empty()) {
    return existingOverlay;
  }

  cy.add({
    data: {
      id: overlayEdgeId,
      source: fromNodeId,
      target: toNodeId,
      type: '',
    },
    classes: 'algo-overlay highlighted',
  });

  return cy.getElementById(overlayEdgeId);
}

/**
 * Shortest path sonucunu segment segment spawn eder ve path yonunu overlay okla gosterir.
 * @author Semih Tuncel
 */
async function runShortestPathAnimation(cy, result, record, signal) {
  const path = Array.isArray(result.data?.path) ? result.data.path.map((id) => String(id)) : [];

  if (path.length === 0) {
    return;
  }

  const startNodeId = path[0];
  const isStartNew = cy.getElementById(startNodeId).empty();
  const startNode = cy.getElementById(startNodeId).empty()
      ? createFallbackAlgorithmNode(startNodeId)
      : normalizeNode(cy.getElementById(startNodeId).data());
  const cyStartNode = await ensureAlgorithmNodeVisible(cy, startNode, null, signal);

  if (isStartNew && startNodeId !== String(result.startNode)) {
    if (!record.nodeIds.includes(startNodeId)) record.nodeIds.push(startNodeId);
  }

  cyStartNode?.addClass('highlighted algo-start');
  await waitForAlgorithmStep(signal);

  for (let index = 1; index < path.length; index++) {
    throwIfAlgorithmAborted(signal);

    const fromNodeId = path[index - 1];
    const toNodeId = path[index];

    const cyNode = await ensureShortestPathNodeVisible(cy, fromNodeId, toNodeId, record, signal);

    cyNode?.addClass('highlighted');

    if (toNodeId === String(result.endNode)) {
      cyNode?.addClass('algo-end');
    }

    const overlayEdgeId = `${ALGORITHM_OVERLAY_PREFIX}-${index}-${fromNodeId}-${toNodeId}`;
    const isOverlayNew = cy.getElementById(overlayEdgeId).empty();
    addShortestPathOverlayEdge(cy, fromNodeId, toNodeId, index);

   
    if (isOverlayNew && record) {
      record.edgeIds.push(overlayEdgeId);
    }

    await waitForAlgorithmStep(signal);
  }
}

/**
 * Sol panel algoritma sonucunu iptal edilebilir tek animasyon runner ile isler.
 * @author Semih Tuncel
 */
async function runAlgorithmAnimation(cy, result, expansionRecords, signal) {
  if (!cy || !result) {
    return;
  }

  clearAlgorithmVisualState(cy);

  // Başlangıç düğümü için hafızada bir kayıt yoksa oluşturalım
  const startNodeId = String(result.startNode);
  if (!expansionRecords.has(startNodeId)) {
    expansionRecords.set(startNodeId, { nodeIds: [], edgeIds: [] });
  }
  const record = expansionRecords.get(startNodeId);

  const traversalMode = getAlgorithmTraversalMode(result.type);

  if (traversalMode) {

    await runTraversalAnimation(cy, result, traversalMode, record, signal);
    return;
  }

  if (result.type === 'shortest') {

    await runShortestPathAnimation(cy, result, record, signal);
  }
}

/**
 * Orta kanvas alaninin UI iskeleti, backend graph ve algoritma highlight akisini yonetir.
 * @author Semih Tuncel
 * @author Murat Kutku (AlgorithmResult Prop Altyapisi ve Harita Uzerinde Renklendirme Entegrasyonu)
 */
export default function CenterCanvas({ algorithmResult, searchSelection, onNodeSelect, onGraphStatsChange }) {
  const [activeTool, setActiveTool] = useState('select');
  const [cameraState, setCameraState] = useState(INITIAL_CAMERA);
  const [isAnimating, setIsAnimating] = useState(false);
  const canvasRef = useRef(null);
  const cyRef = useRef(null);
  const seedGraphCacheRef = useRef({
    graphIndex: null,
    promise: null,
  });
  const isExpandingRef = useRef(false);
  const onNodeSelectRef = useRef(onNodeSelect);
  const onGraphStatsChangeRef = useRef(onGraphStatsChange);
  const latestSearchRequestIdRef = useRef(null);
  const canvasGenerationRef = useRef(0);
  const expansionRecordsRef = useRef(new Map());
  const algorithmAbortRef = useRef(null);
  const isAlgorithmAnimatingRef = useRef(false);

  useEffect(() => {
    onNodeSelectRef.current = onNodeSelect;
  }, [onNodeSelect]);

  useEffect(() => {
    onGraphStatsChangeRef.current = onGraphStatsChange;
  }, [onGraphStatsChange]);

  useEffect(() => {
    const cy = cyRef.current;

    if (!cy || !algorithmResult) {
      return undefined;
    }

    algorithmAbortRef.current?.abort();

    const abortController = new AbortController();
    algorithmAbortRef.current = abortController;
    isAlgorithmAnimatingRef.current = true;
    setIsAnimating(true);


    const startNodeId = algorithmResult.startNode ? String(algorithmResult.startNode) : null;
    if (startNodeId && cy.getElementById(startNodeId).empty()) {
      cy.elements().remove();
      expansionRecordsRef.current.clear();
      canvasGenerationRef.current += 1;
    }

    runAlgorithmAnimation(cy, algorithmResult, expansionRecordsRef.current, abortController.signal)
        .catch((error) => {
          reportGraphLoadError(error, 'Algoritma animasyonu');
        })
        .finally(() => {
          if (algorithmAbortRef.current === abortController) {
            algorithmAbortRef.current = null;
            isAlgorithmAnimatingRef.current = false;
            setIsAnimating(false);
          }

          if (!cy.destroyed()) {
            setCameraState(createCameraSnapshot(cy));
          }
        });

    return () => {
      abortController.abort();
    };
  }, [algorithmResult]);

  useEffect(() => {
    const cy = cyRef.current;

    if (!cy || !searchSelection?.node) {
      return undefined;
    }

    const abortController = new AbortController();
    const selectedNode = normalizeNode(searchSelection.node);
    const requestId = searchSelection.requestId;

    algorithmAbortRef.current?.abort();
    latestSearchRequestIdRef.current = requestId;
    canvasGenerationRef.current += 1;
    expansionRecordsRef.current.clear();

    const searchGeneration = canvasGenerationRef.current;

    if (searchSelection.clearCanvas) {
      cy.elements().remove();
    }

    onNodeSelectRef.current?.(selectedNode);

    fetchNodeNeighbors(selectedNode.id, abortController.signal)
        .then((graph) => {
          if (
              abortController.signal.aborted
              || cy.destroyed()
              || latestSearchRequestIdRef.current !== requestId
              || canvasGenerationRef.current !== searchGeneration
          ) {
            return;
          }

          const normalizedGraph = normalizeGraphResponse(graph);
          const graphWithSelection = ensureSelectedNodeInGraph(normalizedGraph, selectedNode);

          renderFreshGraph(cy, graphWithSelection);
          registerRenderedExpansion(cy, expansionRecordsRef.current, selectedNode.id, graphWithSelection);
          setCameraState(createCameraSnapshot(cy));
        })
        .catch((error) => {
          if (error.name === 'AbortError') {
            return;
          }

          reportGraphLoadError(error, 'Arama secimi komsu graph');

          if (
              cy.destroyed()
              || latestSearchRequestIdRef.current !== requestId
              || canvasGenerationRef.current !== searchGeneration
          ) {
            return;
          }

          const fallbackGraph = {
            nodes: [selectedNode],
            edges: [],
          };

          renderFreshGraph(cy, fallbackGraph);
          registerRenderedExpansion(cy, expansionRecordsRef.current, selectedNode.id, fallbackGraph);
          setCameraState(createCameraSnapshot(cy));
        });

    return () => {
      abortController.abort();
    };
  }, [searchSelection]);

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
     * Graph elemanlari degistikce sol paneldeki anlik sayaclari yeniler.
     * @author Semih Tuncel
     */
    function handleGraphStatsChanged() {
      onGraphStatsChangeRef.current?.(createGraphStats(cy));
    }

    /**
     * Node tiklamasinda secimi yukari yollar ve komsulari getirir.
     * @author Semih Tuncel
     */
    function handleNodeTap(event) {
      const nodeId = event.target.id();
      const spawnPosition = event.target.position();
      const expandGeneration = canvasGenerationRef.current;
      const expansionRecords = expansionRecordsRef.current;

      onNodeSelectRef.current?.(createSelectedNodePayload(event.target));

      if (isExpandingRef.current || isAnimating) {
        return;
      }

      if (expansionRecords.has(nodeId)) {
        isExpandingRef.current = true;
        collapseExpandedNode(cy, expansionRecords, nodeId)
            .finally(() => {
              isExpandingRef.current = false;

              if (!cy.destroyed()) {
                setCameraState(createCameraSnapshot(cy));
              }
            });
        return;
      }

      isExpandingRef.current = true;
      fetchNodeNeighbors(nodeId, abortController.signal)
          .then((graph) => {
            if (!isMounted || cy.destroyed() || canvasGenerationRef.current !== expandGeneration) {
              return Promise.resolve();
            }

            return mergeExpandedGraph(cy, normalizeGraphResponse(graph), spawnPosition);
          })
          .catch((error) => {
            reportGraphLoadError(error, 'Komsu graph');

            if (error.name === 'AbortError') {
              return Promise.resolve();
            }

            return loadSeedGraphIndex(seedGraphCacheRef.current, abortController.signal)
                .then((graphIndex) => {
                  if (!isMounted || cy.destroyed() || canvasGenerationRef.current !== expandGeneration) {
                    return Promise.resolve();
                  }

                  return mergeExpandedGraph(cy, createLocalNeighborGraph(graphIndex, nodeId), spawnPosition);
                })
                .catch((seedError) => {
                  reportGraphLoadError(seedError, 'Seed fallback graph');
                });
          })
          .then((expansionRecord) => {
            if (
                !isMounted
                || cy.destroyed()
                || canvasGenerationRef.current !== expandGeneration
                || !expansionRecord
                || !hasExpansionRecordContent(expansionRecord)
            ) {
              return;
            }

            expansionRecords.set(nodeId, expansionRecord);
          })
          .finally(() => {
            isExpandingRef.current = false;
          });
    }

    /**
     * Gelen init graph verisini guvenli sekilde render eder.
     * @author Semih Tuncel
     */
    function handleInitialGraphLoaded(graph) {
      if (!isMounted || cy.destroyed() || canvasGenerationRef.current !== 0) {
        return;
      }

      const normalizedGraph = normalizeGraphResponse(graph);

      renderInitialGraph(cy, normalizedGraph);
      registerRenderedExpansion(cy, expansionRecordsRef.current, ROOT_NODE_ID, normalizedGraph);
      handleCameraChanged();
    }

    cy.on('pan zoom', handleCameraChanged);
    cy.on('add remove', handleGraphStatsChanged);
    cy.on('tap', 'node', handleNodeTap);
    handleGraphStatsChanged();

    fetchInitialGraph(abortController.signal)
        .then(handleInitialGraphLoaded)
        .catch((error) => {
          reportGraphLoadError(error, 'Init graph');

          if (error.name === 'AbortError') {
            return Promise.resolve();
          }

          return loadSeedGraphIndex(seedGraphCacheRef.current, abortController.signal)
              .then((graphIndex) => {
                if (!isMounted || cy.destroyed() || canvasGenerationRef.current !== 0) {
                  return;
                }

                const rootNodeId = getSeedRootNodeId(graphIndex);
                const initialGraph = createLocalInitialGraph(graphIndex);

                renderInitialGraph(cy, initialGraph);

                if (rootNodeId) {
                  registerRenderedExpansion(cy, expansionRecordsRef.current, rootNodeId, initialGraph);
                }

                handleCameraChanged();
              })
              .catch((seedError) => {
                reportGraphLoadError(seedError, 'Seed fallback graph');
              });
        });

    return () => {
      isMounted = false;
      abortController.abort();
      algorithmAbortRef.current?.abort();
      cy.destroy();
      cyRef.current = null;
      seedGraphCacheRef.current = {
        graphIndex: null,
        promise: null,
      };
    };
  }, []);

  /**
   * F3-US4: LeftPanel'den yeni bir algoritma sonucu tetiklendiginde haritayi guncelle
   * @author Murat Kutku
   */

  useEffect(() => {
    applyCanvasMode(cyRef.current, activeTool);
  }, [activeTool]);
  /**
   * Ekrani ve hafizayi tamamen temizler, kanvasi ilk acilis (Root Node) haline dondurur.
   * @author Semih Tuncel
   */
  function handleResetCanvas() {
    const cy = cyRef.current;
    if (!cy) return;

    // 1. Varsa calisan animasyonlari durdur
    algorithmAbortRef.current?.abort();
    isAlgorithmAnimatingRef.current = false;
    setIsAnimating(false);

    // 2. Kanvasi sil, expand hafizasini sifirla
    cy.elements().remove();
    expansionRecordsRef.current.clear();
    canvasGenerationRef.current += 1;

    const currentGen = canvasGenerationRef.current;
    const abortController = new AbortController();

    // 3. Ilk (Root) komsuluk grafigini bastan cek ve ekrana bas
    fetchInitialGraph(abortController.signal)
        .then((graph) => {
          if (cy.destroyed() || canvasGenerationRef.current !== currentGen) return;
          const normalizedGraph = normalizeGraphResponse(graph);
          renderInitialGraph(cy, normalizedGraph);
          registerRenderedExpansion(cy, expansionRecordsRef.current, ROOT_NODE_ID, normalizedGraph);
          setCameraState(createCameraSnapshot(cy));
        })
        .catch((error) => {
          if (error.name !== 'AbortError') {
            // Backend yoksa Seed uzerinden toparla
            loadSeedGraphIndex(seedGraphCacheRef.current, abortController.signal).then(graphIndex => {
              if (cy.destroyed() || canvasGenerationRef.current !== currentGen) return;
              const rootNodeId = getSeedRootNodeId(graphIndex);
              const initialGraph = createLocalInitialGraph(graphIndex);
              renderInitialGraph(cy, initialGraph);
              if (rootNodeId) {
                registerRenderedExpansion(cy, expansionRecordsRef.current, rootNodeId, initialGraph);
              }
              setCameraState(createCameraSnapshot(cy));
            });
          }
        });
  }


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
        <div className="canvas-toolbar">
          {TOOLS.map((tool, index) => (
              <Fragment key={tool.id}>
                <button
                    className={`canvas-tool-btn${activeTool === tool.id ? ' active' : ''}`}
                    title={tool.title}
                    onClick={() => handleToolClick(tool.id)}
                >
                  {tool.icon}
                </button>
                {index === 1 && <div key="sep1" className="canvas-tool-sep" />}
              </Fragment>
          ))}

          <div className="canvas-tool-sep" />

          <button
              className="canvas-tool-btn"
              title="Ekrana sigdir"
              onClick={() => handleToolClick('fit')}
          >
            <FitIcon />

          </button>
          {/* DURDUR BUTONU  */}
          {isAnimating && (
              <button
                  className="canvas-tool-btn active"
                  title="Animasyonu Durdur"
                  onClick={() => {
                    algorithmAbortRef.current?.abort();
                    isAlgorithmAnimatingRef.current = false;
                    setIsAnimating(false);
                  }}
                  style={{ color: '#f44336' }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                  <rect x="3" y="3" width="8" height="8" rx="1" />
                </svg>
              </button>
          )}

          {/* VURGULARI TEMIZLE BUTONU */}
          <button
              className="canvas-tool-btn"
              title="Vurguları Temizle"
              onClick={() => clearAlgorithmVisualState(cyRef.current)}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2.5 11.5L11.5 2.5M11.5 2.5H6.5M11.5 2.5V7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {/* RESET / SIFIRLA BUTONU */}
          <button
              className="canvas-tool-btn"
              title="Kanvası Sıfırla (Başlangıca Dön)"
              onClick={handleResetCanvas}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2.5 7a4.5 4.5 0 1 1 .9 2.7L2 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 7.5V11h3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <span className="canvas-tool-label">GRAPH CANVAS</span>

          <div className="canvas-zoom">
            <span className="zoom-val">{zoomPercent}</span>
          </div>
        </div>

        <div id="cy-canvas" ref={canvasRef}>
          <div className="canvas-hud">{hudText}</div>
        </div>
      </main>
  );
}
