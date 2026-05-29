package com.grup15.socialnetwork.seed;

import com.grup15.socialnetwork.model.Edge;
import com.grup15.socialnetwork.model.EdgeType;
import com.grup15.socialnetwork.datastructures.graph.Graph;
import com.grup15.socialnetwork.datastructures.trie.Trie;
import com.grup15.socialnetwork.model.Node;
import com.grup15.socialnetwork.datastructures.NodeRegistry;
import com.grup15.socialnetwork.model.NodeType;

import java.util.Locale;

public final class FixedSocialNetworkSeed {

    static final int USER_FIRST_ID = 1;
    static final int USER_COUNT = 60;
    static final int USER_LAST_ID = USER_FIRST_ID + USER_COUNT - 1;

    static final int POST_FIRST_ID = USER_LAST_ID + 1;
    static final int POST_COUNT = 80;
    static final int POST_LAST_ID = POST_FIRST_ID + POST_COUNT - 1;

    static final int PHOTO_FIRST_ID = POST_LAST_ID + 1;
    static final int PHOTO_COUNT = 20;
    static final int PHOTO_LAST_ID = PHOTO_FIRST_ID + PHOTO_COUNT - 1;

    static final int EVENT_FIRST_ID = PHOTO_LAST_ID + 1;
    static final int EVENT_COUNT = 20;
    static final int EVENT_LAST_ID = EVENT_FIRST_ID + EVENT_COUNT - 1;

    static final int FRIEND_EDGE_COUNT = 90;
    static final int POSTED_EDGE_COUNT = 100;
    static final int LIKES_EDGE_COUNT = 180;
    static final int ATTENDS_EDGE_COUNT = 120;
    static final int TOTAL_EDGE_COUNT = FRIEND_EDGE_COUNT + POSTED_EDGE_COUNT + LIKES_EDGE_COUNT + ATTENDS_EDGE_COUNT;

    static final String TEAM_MEMBER_PROPERTY = "teamMember";
    static final String TEAM_MEMBER_ASCII_PROPERTY = "teamMemberNameAscii";

    private static final int CONTENT_COUNT = POST_COUNT + PHOTO_COUNT;

    // Deterministik seed metadata icin sabit takim ismi dizisi.
    // # Insert: O(1) sinif yuklenirken  Search: O(n) tarama ile  Delete: O(n) yeniden kurma ile
    static final String[] TEAM_MEMBER_NAMES = {
            "Semih Tuncel",
            "Ahmet Efe Gencel",
            "Arda Asan",
            "Fatih Soyer",
            "Murat Kutku",
            
    };

    /**
     * Nesne olusturmayi engeller cunku bu builder nesneye ozel durum tutmaz.
     */
    // @author Semih Tuncel
    private FixedSocialNetworkSeed() {
    }

    /**
     * Her node ve edge uzerinden bir kez gecerek sabit sosyal agi O(V + E) kurar.
     */
    // @author Semih Tuncel
    public static SeedContext build() {
        Graph graph = new Graph();
        NodeRegistry registry = new NodeRegistry();
        Trie trie = new Trie();
        trie.setNodeRegistry(registry);

        addUsers(graph, registry, trie);
        addPosts(graph, registry, trie);
        addPhotos(graph, registry, trie);
        addEvents(graph, registry, trie);

        visitPlannedEdges((sourceId, targetId, type, directed) ->
                addEdge(graph, registry, sourceId, targetId, type, directed));

        return new SeedContext(graph, registry, trie);
    }

    /**
     * Ayri edge listesi tutmadan sabit edge planini yeniden yurutur.
     */
    // @author Semih Tuncel
    static void visitPlannedEdges(PlannedEdgeVisitor visitor) {
        if (visitor == null) {
            throw new IllegalArgumentException("Visitor cannot be null.");
        }

        for (int offset = 0; offset < USER_COUNT; offset++) {
            int sourceId = userIdAtIndex(offset);
            int targetId = userIdAtIndex(offset + 1);
            visitor.visit(sourceId, targetId, EdgeType.FRIEND, false);
        }

        for (int offset = 0; offset < FRIEND_EDGE_COUNT - USER_COUNT; offset++) {
            int sourceId = userIdAtIndex(offset);
            int targetId = userIdAtIndex(offset + 30);
            visitor.visit(sourceId, targetId, EdgeType.FRIEND, false);
        }

        for (int offset = 0; offset < POST_COUNT; offset++) {
            int sourceId = userIdAtIndex(offset);
            int targetId = POST_FIRST_ID + offset;
            visitor.visit(sourceId, targetId, EdgeType.POSTED, true);
        }

        for (int offset = 0; offset < PHOTO_COUNT; offset++) {
            int sourceId = userIdAtIndex(POST_COUNT + offset);
            int targetId = PHOTO_FIRST_ID + offset;
            visitor.visit(sourceId, targetId, EdgeType.POSTED, true);
        }

        for (int userOffset = 0; userOffset < USER_COUNT; userOffset++) {
            for (int likeOffset = 0; likeOffset < 3; likeOffset++) {
                int sourceId = userIdAtIndex(userOffset);
                int contentIndex = userOffset * 3 + likeOffset * 17;
                int targetId = contentIdAtIndex(contentIndex);
                visitor.visit(sourceId, targetId, EdgeType.LIKES, true);
            }
        }

        for (int userOffset = 0; userOffset < USER_COUNT; userOffset++) {
            for (int attendOffset = 0; attendOffset < 2; attendOffset++) {
                int sourceId = userIdAtIndex(userOffset);
                int eventIndex = userOffset * 2 + attendOffset * 7;
                int targetId = eventIdAtIndex(eventIndex);
                visitor.visit(sourceId, targetId, EdgeType.ATTENDS, true);
            }
        }
    }

    /**
     * Planlanan her edge kullanicidan basladigi icin once user nodelarini ekler.
     */
    // @author Semih Tuncel
    private static void addUsers(Graph graph, NodeRegistry registry, Trie trie) {
        for (int offset = 0; offset < USER_COUNT; offset++) {
            int id = USER_FIRST_ID + offset;
            String title = userTitle(offset, id);
            Node node = new Node(id, title, NodeType.USER);

            if (offset < TEAM_MEMBER_NAMES.length) {
                markTeamMember(node, title);
            }

            registerNode(graph, registry, trie, node);
        }
    }

    /**
     * Testler ve demolarda araliklara guvenmek icin post nodelarini sabit ID ile ekler.
     */
    // @author Semih Tuncel
    private static void addPosts(Graph graph, NodeRegistry registry, Trie trie) {
        for (int offset = 0; offset < POST_COUNT; offset++) {
            int id = POST_FIRST_ID + offset;
            String title = String.format(Locale.ENGLISH, "Post %03d", offset + 1);
            Node node = new Node(id, title, NodeType.POST);
            registerNode(graph, registry, trie, node);
        }
    }

    /**
     * Paylasilan icerik tam 100 oge olsun diye photo nodelarini sabit ID ile ekler.
     */
    // @author Semih Tuncel
    private static void addPhotos(Graph graph, NodeRegistry registry, Trie trie) {
        for (int offset = 0; offset < PHOTO_COUNT; offset++) {
            int id = PHOTO_FIRST_ID + offset;
            String title = String.format(Locale.ENGLISH, "Photo %03d", offset + 1);
            Node node = new Node(id, title, NodeType.PHOTO);
            registerNode(graph, registry, trie, node);
        }
    }

    /**
     * ID araliklari bitisik kalsin diye event nodelarini icerik nodelarindan sonra ekler.
     */
    // @author Semih Tuncel
    private static void addEvents(Graph graph, NodeRegistry registry, Trie trie) {
        for (int offset = 0; offset < EVENT_COUNT; offset++) {
            int id = EVENT_FIRST_ID + offset;
            String title = String.format(Locale.ENGLISH, "Event %03d", offset + 1);
            Node node = new Node(id, title, NodeType.EVENT);
            registerNode(graph, registry, trie, node);
        }
    }

    /**
     * Basligi once sabit isimlerden, sonra uretilen ASCII etiketlerden secer.
     */
    // @author Semih Tuncel
    private static String userTitle(int offset, int id) {
        if (offset < TEAM_MEMBER_NAMES.length) {
            return TEAM_MEMBER_NAMES[offset];
        }

        return String.format(Locale.ENGLISH, "User %03d", id);
    }

    /**
     * Ayri metadata objesi gerekmedigi icin takim bilgisini user node uzerinde saklar.
     */
    // @author Semih Tuncel
    private static void markTeamMember(Node node, String nameAscii) {
        node.getProperties().put(TEAM_MEMBER_PROPERTY, Boolean.TRUE);
        node.getProperties().put(TEAM_MEMBER_ASCII_PROPERTY, nameAscii);
    }

    /**
     * Graph, hash table ve trie uyumlu kalsin diye bir node'u tum arama yapilarina ekler.
     */
    // @author Semih Tuncel
    private static void registerNode(Graph graph, NodeRegistry registry, Trie trie, Node node) {
        graph.ahmetEfe_addNode(node);
        registry.register(node);
        trie.insert(node.getTitle(), String.valueOf(node.getID()));
    }

    /**
     * Iki uc ID'nin de graphta var oldugunu kanitladiktan sonra bir edge ekler.
     */
    // @author Semih Tuncel
    private static void addEdge(Graph graph, NodeRegistry registry, int sourceId, int targetId, EdgeType type, boolean directed) {
        if (!graph.ahmetEfe_nodeExist(sourceId)) {
            throw new IllegalStateException("Missing source node in graph: " + sourceId);
        }

        if (!graph.ahmetEfe_nodeExist(targetId)) {
            throw new IllegalStateException("Missing target node in graph: " + targetId);
        }

        Node source = requireRegisteredNode(registry, sourceId, "source");
        Node target = requireRegisteredNode(registry, targetId, "target");
        Edge edge = new Edge(source, target, type, directed);

        graph.ahmetEfe_addEdge(edge, source, target);
    }

    /**
     * ID ile bulma ortalama O(1) oldugu icin node'u NodeRegistry uzerinden getirir.
     */
    // @author Semih Tuncel
    private static Node requireRegisteredNode(NodeRegistry registry, int id, String role) {
        Node node = registry.findById(String.valueOf(id));

        if (node == null) {
            throw new IllegalStateException("Missing " + role + " node in registry: " + id);
        }

        return node;
    }

    /**
     * Herhangi bir tamsayi offsetini modulo ile sabit user ID araligina esler.
     */
    // @author Semih Tuncel
    private static int userIdAtIndex(int index) {
        int normalizedIndex = Math.floorMod(index, USER_COUNT);
        return USER_FIRST_ID + normalizedIndex;
    }

    /**
     * Like hedefleri icin herhangi bir tamsayi offsetini post ve photo ID'lerine esler.
     */
    // @author Semih Tuncel
    private static int contentIdAtIndex(int index) {
        int normalizedIndex = Math.floorMod(index, CONTENT_COUNT);

        if (normalizedIndex < POST_COUNT) {
            return POST_FIRST_ID + normalizedIndex;
        }

        return PHOTO_FIRST_ID + normalizedIndex - POST_COUNT;
    }

    /**
     * Katilim edge'leri icin herhangi bir tamsayi offsetini sabit event ID araligina esler.
     */
    // @author Semih Tuncel
    private static int eventIdAtIndex(int index) {
        int normalizedIndex = Math.floorMod(index, EVENT_COUNT);
        return EVENT_FIRST_ID + normalizedIndex;
    }

    @FunctionalInterface
    interface PlannedEdgeVisitor {

        /**
         * Cagiranlar ayni plani kurabilsin veya dogrulayabilsin diye bir planlanan edge alir.
         */
        // @author Semih Tuncel
        void visit(int sourceId, int targetId, EdgeType type, boolean directed);
    }
}
