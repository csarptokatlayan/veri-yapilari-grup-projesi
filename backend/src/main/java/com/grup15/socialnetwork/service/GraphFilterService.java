package com.grup15.socialnetwork.service;

import com.grup15.socialnetwork.seed.SeedContext;
import com.grup15.socialnetwork.model.Edge;
import com.grup15.socialnetwork.model.EdgeType;
import com.grup15.socialnetwork.model.Node;
import com.grup15.socialnetwork.model.NodeType;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GraphFilterService {

    // ahmet efe arkadaşımın uyarısı üzerine graphı buradan çektim.
    private final SeedContext seedContext;

    public GraphFilterService(SeedContext seedContext) {
        this.seedContext = seedContext;
    }

    // 1. Düğüm Tipine Göre Filtreleme - O(V)
    public Map<String, Object> filterNodesByType(String typeStr) {
        Map<String, Object> response = new HashMap<>();
        try {
            NodeType type = NodeType.valueOf(typeStr.toUpperCase());
            // Grafı anlık olarak context'ten çekiyoruz
            List<Node> nodes = seedContext.getGraph().ahmetEfe_findNodesByType(type);
            response.put("nodes", nodes);
        } catch (IllegalArgumentException e) {
            response.put("nodes", List.of());
        }
        return response;
    }

    // 2. Özelliğe (Property) Göre Filtreleme - O(V)
    public Map<String, Object> filterNodesByProperty(String key, Object value) {
        Map<String, Object> response = new HashMap<>();
        // Grafı anlık olarak context'ten çekiyoruz
        List<Node> nodes = seedContext.getGraph().ahmetEfe_findNodesByProperty(key, value);
        response.put("nodes", nodes);
        return response;
    }

    // 3. İlişki (Edge) Tipine Göre Filtreleme - O(V + E)
    public Map<String, Object> filterEdgesByType(String typeStr) {
        Map<String, Object> response = new HashMap<>();
        try {
            EdgeType type = EdgeType.valueOf(typeStr.toUpperCase());
            // Grafı anlık olarak context'ten çekiyoruz
            List<Edge> edges = seedContext.getGraph().fatih_getEdgesByType(type);
            response.put("edges", edges);
        } catch (IllegalArgumentException e) {
            response.put("edges", List.of());
        }
        return response;
    }
}