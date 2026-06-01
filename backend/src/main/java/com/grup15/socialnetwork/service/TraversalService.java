package com.grup15.socialnetwork.service;

import com.grup15.socialnetwork.datastructures.graph.BFS;
import com.grup15.socialnetwork.datastructures.graph.DFS;
import com.grup15.socialnetwork.datastructures.graph.Graph;
import com.grup15.socialnetwork.datastructures.list.CustomLinkedList;
import com.grup15.socialnetwork.dto.ShortestPathResponse;
import com.grup15.socialnetwork.model.Edge;
import com.grup15.socialnetwork.model.Node;
import com.grup15.socialnetwork.seed.SeedContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;


@Service
@RequiredArgsConstructor
public class TraversalService {

    final SeedContext seedContext;
    final BFS bfs;
    final DFS dfs;

    public Map<String, Object> runBFS(Integer startNodeId)
    {
        Node startNode = seedContext.getGraph().ahmetEfe_findNodeById(startNodeId);
        if (startNode == null) {
            return emptyResult();
        }

        List<Node> visitedNodesList = bfs.bfsTraversal(startNode);

        Set<Node> visitedNodes = new HashSet<>(visitedNodesList);
        Set<Edge> traversedEdges = new HashSet<>();

        for (Node currentNode : visitedNodes) {
            List<Node> neighbors = seedContext.getGraph().fatih_getNeighbors(currentNode);
            for (Node neighbor : neighbors) {
                if (visitedNodes.contains(neighbor)) {
                    List<Edge> edgesBetween = seedContext.getGraph().fatih_getEdgesBetween(currentNode, neighbor);
                    traversedEdges.addAll(edgesBetween);
                }
            }
        }

        return formatForFrontend(visitedNodes, traversedEdges);
    }

    public Map<String, Object> runDFS(Integer startNodeId) {
        Node startNode = seedContext.getGraph().ahmetEfe_findNodeById(startNodeId);
        if (startNode == null) {
            return emptyResult();
        }

        List<Node> visitedNodesList = dfs.fatih_dfsIterative(startNode);

        Set<Node> visitedNodes = new HashSet<>(visitedNodesList);
        Set<Edge> traversedEdges = new HashSet<>();

        for (Node currentNode : visitedNodes) {
            List<Node> neighbors = seedContext.getGraph().fatih_getNeighbors(currentNode);
            for (Node neighbor : neighbors) {
                if (visitedNodes.contains(neighbor)) {
                    List<Edge> edgesBetween = seedContext.getGraph().fatih_getEdgesBetween(currentNode, neighbor);
                    traversedEdges.addAll(edgesBetween);
                }
            }
        }

        return formatForFrontend(visitedNodes, traversedEdges);
    }

    public ShortestPathResponse shortestPath(Integer fromId, Integer toId) {
        Node fromNode = seedContext.getGraph().ahmetEfe_findNodeById(fromId);
        Node toNode = seedContext.getGraph().ahmetEfe_findNodeById(toId);

        if (fromNode == null || toNode == null) {
            return new ShortestPathResponse(new ArrayList<>(), -1);
        }

        List<Node> pathNodes = bfs.shortestPath(fromNode, toNode);

        if (pathNodes == null || pathNodes.isEmpty()) {
            return new ShortestPathResponse(new ArrayList<>(), -1);
        }

        List<Integer> pathIds = pathNodes.stream()
                .map(Node::getID)
                .toList();


        int distance = pathIds.size() - 1;

        return new ShortestPathResponse(pathIds, distance);
    }

    public Map<String, Object> getNeighbors(Integer nodeId) {
        Node centerNode = seedContext.getGraph().ahmetEfe_findNodeById(nodeId);
        if (centerNode == null) {
            return emptyResult();
        }

        Set<Node> nodes = new HashSet<>();
        Set<Edge> edges = new HashSet<>();

        nodes.add(centerNode);

        List<Node> neighbors = seedContext.getGraph().fatih_getNeighbors(centerNode);
        nodes.addAll(neighbors);

        for (Node neighbor : neighbors) {
            List<Edge> edgesBetween = seedContext.getGraph().fatih_getEdgesBetween(centerNode, neighbor);
            edges.addAll(edgesBetween);
        }

        return formatForFrontend(nodes, edges);
    }

    private Map<String, Object> formatForFrontend(Set<Node> nodes, Set<Edge> edges) {
        Map<String, Object> response = new HashMap<>();

        List<Map<String, Object>> formattedNodes = new ArrayList<>();
        for (Node node : nodes) {
            Map<String, Object> nodeMap = new HashMap<>();
            nodeMap.put("id", String.valueOf(node.getID()));
            nodeMap.put("title", node.getTitle());
            nodeMap.put("nodeType", node.getNodeType());
            nodeMap.put("properties", node.getProperties());
            formattedNodes.add(nodeMap);
        }
        response.put("nodes", formattedNodes);

        List<Map<String, Object>> formattedEdges = new ArrayList<>();
        for (Edge edge : edges) {
            Map<String, Object> edgeMap = new HashMap<>();
            edgeMap.put("source", String.valueOf(edge.getSource().getID()));
            edgeMap.put("target", String.valueOf(edge.getDestination().getID()));
            edgeMap.put("type", edge.getType());
            edgeMap.put("directed", edge.isDirected());
            formattedEdges.add(edgeMap);
        }
        response.put("edges", formattedEdges);

        return response;
    }

    private Map<String, Object> emptyResult() {
        Map<String, Object> response = new HashMap<>();
        response.put("nodes", new ArrayList<>());
        response.put("edges", new ArrayList<>());
        return response;
    }

}