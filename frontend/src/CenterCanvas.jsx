import cytoscape from 'cytoscape';
import { Fragment, useEffect, useRef, useState } from 'react';

const ROOT_NODE_ID = '1';
const MAX_VISIBLE_NODES = 500;
const ZOOM_STEP = 1.2;
const FIT_PADDING = 40;
const EXPAND_SPAWN_DURATION = 700;
const COLLAPSE_DURATION = 360;
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
 * Algoritma endpointinden gelen graph parcasini sahneye ekler ve yerlesimi yeniler.
 * @author Semih Tuncel
 */
function mergeAlgorithmGraph(cy, graph) {
  const normalizedGraph = normalizeGraphResponse(graph);
  const { elements, didHitLimit } = collectGraphElementsForAdd(cy, normalizedGraph);

  if (didHitLimit) {
    console.log(`Maksimum ${MAX_VISIBLE_NODES} node limitine ulasildi`);
  }

  if (elements.length > 0) {
    cy.add(elements);
  }

  if (normalizedGraph.nodes.length > 0 || normalizedGraph.edges.length > 0) {
    cy.layout(COSE_LAYOUT).run();
  }
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

  const viewportSnapshot = createViewportSnapshot(cy);

  if (newNodeIds.length === 0) {
    cy.add(elements);
    restoreViewport(cy, viewportSnapshot);
    return Promise.resolve(expansionRecord);
  }

  const existingNodes = cy.nodes();
  const restoreNodeLocks = lockNodesForAnimation(existingNodes);
  const spawnTargetPositions = createSpawnTargetPositions(spawnPosition, existingNodes, newNodeIds);

  cy.add(elements);
  restoreViewport(cy, viewportSnapshot);

  return animateSpawnedNodes(cy, newNodeIds, spawnTargetPositions).then(() => {
    if (cy.destroyed()) {
      return expansionRecord;
    }

    restoreNodeLocks();
    restoreViewport(cy, viewportSnapshot);
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
 * Sonuc path ve dugumlerini highlight siniflariyla gorsellestirir.
 * @author Murat Kutku
 */
function highlightPathEdges(cy, path) {
  if (!Array.isArray(path)) {
    return;
  }

  for (let index = 0; index < path.length - 1; index++) {
    const current = String(path[index]);
    const next = String(path[index + 1]);

    cy.elements(`edge[source="${current}"][target="${next}"], edge[source="${next}"][target="${current}"]`)
        .addClass('highlighted');
  }
}

/**
 * Sol panelden gelen mock algoritma sonuclarini canvas uzerinde gorsellestirir.
 * F3-US4: Sonuc path highlight, baslangic/bitis dugumu renklendirmeleri.
 * @author Murat Kutku
 */
function handleVisualAlgorithmResult(cy, result) {
  if (!cy || !result) {
    return;
  }

  cy.elements().removeClass('highlighted algo-start algo-end');

  const { type, data = {}, startNode, endNode } = result;

  if (startNode) {
    cy.getElementById(String(startNode)).addClass('algo-start');
  }

  if (endNode) {
    cy.getElementById(String(endNode)).addClass('algo-end');
  }

  if (result.resultKind === 'graph') {
    const graph = normalizeGraphResponse(data);

    graph.nodes.forEach((node) => {
      cy.getElementById(node.id).addClass('highlighted');
    });

    graph.edges.forEach((edge) => {
      cy.getElementById(edge.id).addClass('highlighted');
    });

    return;
  }

  if (type === 'bfs' || type === 'dfs') {
    if (Array.isArray(data.visitedNodes)) {
      data.visitedNodes.forEach((id) => {
        cy.getElementById(String(id)).addClass('highlighted');
      });
    }

    highlightPathEdges(cy, data.path);
    return;
  }

  if (type === 'shortest') {
    if (Array.isArray(data.path)) {
      data.path.forEach((id) => {
        cy.getElementById(String(id)).addClass('highlighted');
      });
    }

    highlightPathEdges(cy, data.path);
    return;
  }

  if (type === 'degrees' && data.targetNode) {
    const targetNodeId = String(data.targetNode);

    cy.getElementById(targetNodeId).addClass('highlighted');

    if (Array.isArray(data.neighbors)) {
      data.neighbors.forEach((id) => {
        const neighborId = String(id);

        cy.getElementById(neighborId).addClass('highlighted');
        cy.elements(`edge[source="${targetNodeId}"][target="${neighborId}"], edge[source="${neighborId}"][target="${targetNodeId}"]`)
            .addClass('highlighted');
      });
    }
  }
}

/**
 * Orta kanvas alaninin UI iskeleti, backend graph ve algoritma highlight akisini yonetir.
 * @author Semih Tuncel
 * @author Murat Kutku (AlgorithmResult Prop Altyapisi ve Harita Uzerinde Renklendirme Entegrasyonu)
 */
export default function CenterCanvas({ algorithmResult, searchSelection, onNodeSelect }) {
  const [activeTool, setActiveTool] = useState('select');
  const [cameraState, setCameraState] = useState(INITIAL_CAMERA);
  const canvasRef = useRef(null);
  const cyRef = useRef(null);
  const seedGraphCacheRef = useRef({
    graphIndex: null,
    promise: null,
  });
  const isExpandingRef = useRef(false);
  const onNodeSelectRef = useRef(onNodeSelect);
  const latestSearchRequestIdRef = useRef(null);
  const canvasGenerationRef = useRef(0);
  const expansionRecordsRef = useRef(new Map());

  useEffect(() => {
    onNodeSelectRef.current = onNodeSelect;
  }, [onNodeSelect]);

  useEffect(() => {
    if (cyRef.current && algorithmResult) {
      if (algorithmResult.resultKind === 'graph') {
        mergeAlgorithmGraph(cyRef.current, algorithmResult.data);
      }

      handleVisualAlgorithmResult(cyRef.current, algorithmResult);
    }
  }, [algorithmResult]);

  useEffect(() => {
    const cy = cyRef.current;

    if (!cy || !searchSelection?.node) {
      return undefined;
    }

    const abortController = new AbortController();
    const selectedNode = normalizeNode(searchSelection.node);
    const requestId = searchSelection.requestId;

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
     * Node tiklamasinda secimi yukari yollar ve komsulari getirir.
     * @author Semih Tuncel
     */
    function handleNodeTap(event) {
      const nodeId = event.target.id();
      const spawnPosition = event.target.position();
      const expandGeneration = canvasGenerationRef.current;
      const expansionRecords = expansionRecordsRef.current;

      onNodeSelectRef.current?.(createSelectedNodePayload(event.target));

      if (isExpandingRef.current) {
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
    cy.on('tap', 'node', handleNodeTap);

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
