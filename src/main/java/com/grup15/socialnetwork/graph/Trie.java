package com.grup15.socialnetwork.graph;

import java.util.List;
import java.util.ArrayList;
import java.util.Locale;

import com.grup15.socialnetwork.node.NodeRegistry;
import com.grup15.socialnetwork.node.TrieNode;
import com.grup15.socialnetwork.node.NodeType;
import com.grup15.socialnetwork.node.Node;

public class Trie {
    private TrieNode root = new TrieNode();

    // insert(String normalizedKey, String nodeId)
    public void insert(String key, String nodeId) {
        // KURAL: toLowerCase zorunlu!
        String normalizedKey = key.toLowerCase(Locale.ENGLISH);
        TrieNode current = root;
        for (char c : normalizedKey.toCharArray()) {
            current = current.children.computeIfAbsent(c, k -> new TrieNode());
        }
        current.isEnd = true;
        current.ids.add(nodeId);
    }

    // searchByPrefix(String prefix) -> List<String> id listesi
    public List<String> searchByPrefix(String prefix) {
        String normalizedPrefix = prefix.toLowerCase(Locale.ENGLISH);
        TrieNode current = root;

        // 1. Prefix'in bittiği düğüme git
        for (char c : normalizedPrefix.toCharArray()) {
            current = current.children.get(c);
            if (current == null) return new ArrayList<>(); // Bulunamadı
        }

        // 2. Alt ağaçtaki (subtree) tüm id'leri DFS ile topla
        List<String> results = new ArrayList<>();
        collectAllIds(current, results);
        return results;
    }

    private void collectAllIds(TrieNode node, List<String> results) {
        if (node.isEnd) {
            results.addAll(node.ids);
        }
        for (TrieNode child : node.children.values()) {
            collectAllIds(child, results);
        }
    }
    //  @ArdaAsan1448 k4 görevi tip filtresi ve test (overload)
    private NodeRegistry registry;

    public void setNodeRegistry(NodeRegistry registry) {
        this.registry = registry;
    }

    public List<String> searchByPrefix(String prefix, NodeType type) {


        //  Arama algoritmasını çağırıyoruz.
        List<String> allIds = this.searchByPrefix(prefix);
        // Eğer dışarıdan tip parametresi gönderilmemişse (null), elimizdeki tüm listeyi direkt döndürüyoruz.
        if (type == null) {
            return allIds;
        }
        // 3. Tip kontrolünden geçen (filtrelenen) ID'leri tutacağımız yeni liste.
        List<String> filteredIds = new ArrayList<>();

        // 4. Bulunan tüm ID'leri tek tek dönüyoruz.
        for (String id : allIds) {


            if (this.registry != null) {
                Node node = this.registry.findById(id);

                // Eğer Node bulunduysa ve Tipi (USER, POST, EVENT) bizim aradığımız tipe eşitse listeye ekliyoruz.
                if (node != null && node.getNodeType() == type) {
                    filteredIds.add(id);
                }
            }
        }
        return filteredIds;
    }
}