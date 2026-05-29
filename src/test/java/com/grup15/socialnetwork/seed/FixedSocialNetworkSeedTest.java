package com.grup15.socialnetwork.seed;

import com.grup15.socialnetwork.model.EdgeType;
import com.grup15.socialnetwork.datastructures.graph.graph.Graph;
import com.grup15.socialnetwork.model.Node;
import com.grup15.socialnetwork.datastructures.graph.NodeRegistry;
import com.grup15.socialnetwork.model.NodeType;
import org.junit.jupiter.api.Test;

import java.util.EnumMap;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

class FixedSocialNetworkSeedTest {

    /**
     * Seed'i kurar ve uretilen edge planini mevcut graph ID'lerine gore kontrol eder.
     */
    @Test
    // @author Semih Tuncel
    void buildCompletesAndPlannedEdgesUseExistingEndpoints() {
        SeedContext context = assertDoesNotThrow(FixedSocialNetworkSeed::build);
        assertNotNull(context.getGraph());
        assertNotNull(context.getRegistry());
        assertNotNull(context.getTrie());

        Graph graph = context.getGraph();

        // EnumMap planlanan edge'leri sabit EdgeType anahtarlarina gore sayar.
        // # Insert: O(1)  Search: O(1)  Delete: O(1)
        EnumMap<EdgeType, Integer> edgeCounts = new EnumMap<>(EdgeType.class);
        AtomicInteger totalEdges = new AtomicInteger(0);

        FixedSocialNetworkSeed.visitPlannedEdges((sourceId, targetId, type, directed) -> {
            assertTrue(graph.ahmetEfe_nodeExist(sourceId), "Missing planned source ID: " + sourceId);
            assertTrue(graph.ahmetEfe_nodeExist(targetId), "Missing planned target ID: " + targetId);
            countEdge(edgeCounts, type);
            totalEdges.incrementAndGet();

            if (type == EdgeType.FRIEND) {
                assertFalse(directed, "FRIEND edges must be undirected.");
            } else {
                assertTrue(directed, type + " edges must be directed.");
            }
        });

        assertEquals(FixedSocialNetworkSeed.TOTAL_EDGE_COUNT, totalEdges.get());
        assertEquals(FixedSocialNetworkSeed.FRIEND_EDGE_COUNT, edgeCount(edgeCounts, EdgeType.FRIEND));
        assertEquals(FixedSocialNetworkSeed.POSTED_EDGE_COUNT, edgeCount(edgeCounts, EdgeType.POSTED));
        assertEquals(FixedSocialNetworkSeed.LIKES_EDGE_COUNT, edgeCount(edgeCounts, EdgeType.LIKES));
        assertEquals(FixedSocialNetworkSeed.ATTENDS_EDGE_COUNT, edgeCount(edgeCounts, EdgeType.ATTENDS));
    }

    /**
     * Graph indeksinden node ID araliklarini ve tip dagilimini dogrular.
     */
    @Test
    // @author Semih Tuncel
    void nodeRangesAndTypeDistributionAreExpected() {
        SeedContext context = FixedSocialNetworkSeed.build();
        Graph graph = context.getGraph();

        int existingNodes = 0;
        for (int id = FixedSocialNetworkSeed.USER_FIRST_ID; id <= FixedSocialNetworkSeed.EVENT_LAST_ID; id++) {
            if (graph.ahmetEfe_nodeExist(id)) {
                existingNodes++;
            }
        }

        assertEquals(180, existingNodes);
        assertFalse(graph.ahmetEfe_nodeExist(FixedSocialNetworkSeed.EVENT_LAST_ID + 1));

        assertEquals(FixedSocialNetworkSeed.USER_COUNT, graph.ahmetEfe_findNodesByType(NodeType.USER).size());
        assertEquals(FixedSocialNetworkSeed.POST_COUNT, graph.ahmetEfe_findNodesByType(NodeType.POST).size());
        assertEquals(FixedSocialNetworkSeed.PHOTO_COUNT, graph.ahmetEfe_findNodesByType(NodeType.PHOTO).size());
        assertEquals(FixedSocialNetworkSeed.EVENT_COUNT, graph.ahmetEfe_findNodesByType(NodeType.EVENT).size());
    }

    /**
     * Takim metadata bilgisini, trie prefix aramasini ve ornek graph komsulugunu kontrol eder.
     */
    @Test
    // @author Semih Tuncel
    void teamMetadataTrieAndNeighborsAreAvailable() {
        SeedContext context = FixedSocialNetworkSeed.build();
        Graph graph = context.getGraph();
        NodeRegistry registry = context.getRegistry();

        for (int offset = 0; offset < FixedSocialNetworkSeed.TEAM_MEMBER_NAMES.length; offset++) {
            int id = FixedSocialNetworkSeed.USER_FIRST_ID + offset;
            String expectedName = FixedSocialNetworkSeed.TEAM_MEMBER_NAMES[offset];
            Node teamNode = registry.findById(String.valueOf(id));

            assertNotNull(teamNode);
            assertEquals(expectedName, teamNode.getTitle());
            assertEquals(Boolean.TRUE, teamNode.getProperties().get(FixedSocialNetworkSeed.TEAM_MEMBER_PROPERTY));
            assertEquals(expectedName, teamNode.getProperties().get(FixedSocialNetworkSeed.TEAM_MEMBER_ASCII_PROPERTY));
        }

        List<String> ahResults = context.getTrie().searchByPrefix("Ah");
        assertTrue(ahResults.contains(String.valueOf(FixedSocialNetworkSeed.USER_FIRST_ID)));

        Node sampleTeamNode = registry.findById(String.valueOf(FixedSocialNetworkSeed.USER_FIRST_ID));
        assertFalse(graph.fatih_getNeighbors(sampleTeamNode).isEmpty());
    }

    /**
     * Lambda degisebilir bir tasiyici istedigi icin bir enum sayacini artirir.
     */
    // @author Semih Tuncel
    private static void countEdge(EnumMap<EdgeType, Integer> edgeCounts, EdgeType type) {
        int nextCount = edgeCount(edgeCounts, type) + 1;
        edgeCounts.put(type, nextCount);
    }

    /**
     * Bir enum sayacini okur ve eksik anahtarlari sifir kabul eder.
     */
    // @author Semih Tuncel
    private static int edgeCount(EnumMap<EdgeType, Integer> edgeCounts, EdgeType type) {
        Integer count = edgeCounts.get(type);

        if (count == null) {
            return 0;
        }

        return count;
    }
}
