package com.grup15.socialnetwork.seed;

import com.grup15.socialnetwork.datastructures.graph.graph.Graph;
import com.grup15.socialnetwork.datastructures.graph.trie.Trie;
import com.grup15.socialnetwork.datastructures.graph.NodeRegistry;

import java.util.Objects;

public class SeedContext {

    // Graph komsuluk ve ID indeks referansi.
    // # Insert: O(1) ortalama  Search: O(1) ID ile ortalama  Delete: O(V + E) node silme icin
    private final Graph graph;

    // Hash table registry referansi.
    // # Insert: O(1) ortalama  Search: O(1) ID ile ortalama  Delete: O(1) ortalama, API acilirsa
    private final NodeRegistry registry;

    // Baslik aramasi icin prefix tree referansi.
    // # Insert: O(k)  Search: O(p + r)  Delete: Mevcut Trie API'sinde acik degil
    private final Trie trie;

    /**
     * Seed sonucu hafif kalsin diye sadece kurulan yapi referanslarini tutar.
     */
    // @author Semih Tuncel
    SeedContext(Graph graph, NodeRegistry registry, Trie trie) {
        this.graph = Objects.requireNonNull(graph, "graph");
        this.registry = Objects.requireNonNull(registry, "registry");
        this.trie = Objects.requireNonNull(trie, "trie");
    }

    /**
     * Gezinme demolari ortak komsuluk yapisina ihtiyac duydugu icin graph dondurur.
     */
    // @author Semih Tuncel
    public Graph getGraph() {
        return graph;
    }

    /**
     * ID aramalari ortalama O(1) kalsin diye registry dondurur.
     */
    // @author Semih Tuncel
    public NodeRegistry getRegistry() {
        return registry;
    }

    /**
     * UI prefix aramasi kurulan indeksi yeniden kullansin diye trie dondurur.
     */
    // @author Semih Tuncel
    public Trie getTrie() {
        return trie;
    }
}
