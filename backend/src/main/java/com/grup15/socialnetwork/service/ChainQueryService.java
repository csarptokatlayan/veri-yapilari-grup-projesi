package com.grup15.socialnetwork.service;

import com.grup15.socialnetwork.datastructures.graph.Graph;
import com.grup15.socialnetwork.datastructures.NodeRegistry;
import com.grup15.socialnetwork.model.Edge;
import com.grup15.socialnetwork.model.EdgeType;
import com.grup15.socialnetwork.model.Node;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ChainQueryService {

    private final Graph graph;
    private final NodeRegistry registry;

    public ChainQueryService(Graph graph, NodeRegistry registry) {
        this.graph = graph;
        this.registry = registry;
    }

    /**
     * Şablon 1: Kullanıcının arkadaşlarının beğendiği gönderiler
     * Yol: User -> FRIEND -> User -> LIKES -> Post
     */
    public Map<String, Object> getFriendsLikedPosts(int startUserId) {
        Set<Node> resultNodes = new HashSet<>();
        Set<Edge> resultEdges = new HashSet<>();

        Node startUser = registry.findById(String.valueOf(startUserId));
        if (startUser == null) return emptyResult();

        resultNodes.add(startUser);

        // 1. Adım: Arkadaşları bul
        List<Node> friends = new ArrayList<>();
        List<Node> neighbors = graph.fatih_getNeighbors(startUser);

        for (Node neighbor : neighbors) {
            List<Edge> edges = graph.fatih_getEdgesBetween(startUser, neighbor);
            for (Edge edge : edges) {
                if (edge.getType() == EdgeType.FRIEND) {
                    friends.add(neighbor);
                    resultNodes.add(neighbor);
                    resultEdges.add(edge);
                }
            }
        }

        // 2. Adım: Arkadaşların beğendiği içerikleri bul
        for (Node friend : friends) {
            List<Node> friendNeighbors = graph.fatih_getNeighbors(friend);
            for (Node content : friendNeighbors) {
                List<Edge> edges = graph.fatih_getEdgesBetween(friend, content);
                for (Edge edge : edges) {
                    if (edge.getType() == EdgeType.LIKES) {
                        resultNodes.add(content);
                        resultEdges.add(edge);
                    }
                }
            }
        }

        return formatForFrontend(resultNodes, resultEdges);
    }

    /**
     * Şablon 2: Kullanıcının arkadaşlarının katıldığı etkinlikler (HAS kaldırıldı, uyumlu hale getirildi)
     * Yol: User -> FRIEND -> User -> ATTENDS -> Event
     */
    public Map<String, Object> getFriendsAttendedEvents(int startUserId) {
        Set<Node> resultNodes = new HashSet<>();
        Set<Edge> resultEdges = new HashSet<>();

        Node startUser = registry.findById(String.valueOf(startUserId));
        if (startUser == null) return emptyResult();

        resultNodes.add(startUser);

        // 1. Adım: Arkadaşları bul
        List<Node> friends = new ArrayList<>();
        List<Node> neighbors = graph.fatih_getNeighbors(startUser);

        for (Node neighbor : neighbors) {
            List<Edge> edges = graph.fatih_getEdgesBetween(startUser, neighbor);
            for (Edge edge : edges) {
                if (edge.getType() == EdgeType.FRIEND) {
                    friends.add(neighbor);
                    resultNodes.add(neighbor);
                    resultEdges.add(edge);
                }
            }
        }

        // 2. Adım: Arkadaşların katıldığı etkinlikleri bul
        for (Node friend : friends) {
            List<Node> eventNeighbors = graph.fatih_getNeighbors(friend);
            for (Node event : eventNeighbors) {
                List<Edge> edges = graph.fatih_getEdgesBetween(friend, event);
                for (Edge edge : edges) {
                    if (edge.getType() == EdgeType.ATTENDS) {
                        resultNodes.add(event);
                        resultEdges.add(edge);
                    }
                }
            }
        }

        return formatForFrontend(resultNodes, resultEdges);
    }

    // --- FRONTEND FORMATLAYICI ---
    private Map<String, Object> formatForFrontend(Set<Node> nodes, Set<Edge> edges) {
        Map<String, Object> response = new HashMap<>();
        response.put("nodes", nodes);

        List<Map<String, Object>> formattedEdges = new ArrayList<>();
        for (Edge edge : edges) {
            Map<String, Object> edgeMap = new HashMap<>();
            edgeMap.put("source", edge.getSource().getID());
            edgeMap.put("target", edge.getDestination().getID());
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