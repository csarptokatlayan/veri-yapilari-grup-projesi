package com.grup15.socialnetwork.service;

import com.grup15.socialnetwork.datastructures.graph.Graph;
import com.grup15.socialnetwork.seed.SeedContext;
import com.grup15.socialnetwork.model.Edge;
import com.grup15.socialnetwork.model.EdgeType;
import com.grup15.socialnetwork.model.Node;
import com.grup15.socialnetwork.model.NodeType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

class GraphFilterServiceTest {

    private Graph graph;
    private GraphFilterService filterService;
    private SeedContext seedContext;

    @BeforeEach
    void setUp() {
        graph = new Graph();

        // SeedContext'in constructor'ı public olmadığı için Mockito ile sahte bir örneğini oluşturuyoruz
        seedContext = Mockito.mock(SeedContext.class);

        // seedContext.getGraph() çağrıldığında bizim oluşturduğumuz test grafını dönmesini söylüyoruz
        when(seedContext.getGraph()).thenReturn(graph);

        // İŞTE DÜZELEN SATIR BURASI: Artık graph değil, seedContext yolluyoruz!
        filterService = new GraphFilterService(seedContext);

        // Test verilerini doldurma
        Node user1 = new Node(1, "Fatih", NodeType.USER);
        user1.getProperties().put("age", 21);

        Node user2 = new Node(2, "Ahmet Efe", NodeType.USER);
        user2.getProperties().put("age", 21);

        Node post1 = new Node(3, "Grup 15 Harika Bir Proje Yaptı", NodeType.POST);

        graph.ahmetEfe_addNode(user1);
        graph.ahmetEfe_addNode(user2);
        graph.ahmetEfe_addNode(post1);

        Edge likeEdge = new Edge(user1, post1, EdgeType.LIKES, true);
        graph.ahmetEfe_addEdge(likeEdge, user1, post1);
    }

    @Test
    void testFilterNodesByType_Success() {
        Map<String, Object> result = filterService.filterNodesByType("USER");
        List<Node> nodes = (List<Node>) result.get("nodes");

        assertNotNull(nodes);
        assertEquals(2, nodes.size());
    }

    @Test
    void testFilterNodesByType_InvalidType_ReturnsEmpty() {
        Map<String, Object> result = filterService.filterNodesByType("UZAYLI");
        List<Node> nodes = (List<Node>) result.get("nodes");

        assertNotNull(nodes);
        assertTrue(nodes.isEmpty());
    }

    @Test
    void testFilterEdgesByType_Success() {
        Map<String, Object> result = filterService.filterEdgesByType("LIKES");
        List<Edge> edges = (List<Edge>) result.get("edges");

        assertFalse(edges.isEmpty());
        assertEquals(EdgeType.LIKES, edges.get(0).getType());
    }

    @Test
    void testFilterNodesByProperty_Success() {
        Map<String, Object> result = filterService.filterNodesByProperty("age", 21);
        List<Node> nodes = (List<Node>) result.get("nodes");

        assertEquals(2, nodes.size());
    }
}