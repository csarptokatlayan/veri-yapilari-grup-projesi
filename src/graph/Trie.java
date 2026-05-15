package graph;

import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;
import java.util.Locale;

import node.NodeRegistry;
import node.TrieNode;
import node.NodeType;
import node.Node;

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
    // --- K4 GÖREVİ: TİP FİLTRELİ ARAMA ---
    public List<String> searchByPrefix(String prefix, NodeType type) {
        // 1. Mevcut K3 metodunu kullanarak tüm ID'leri çekiyoruz
        List<String> allIds = searchByPrefix(prefix);

        // 2. Filtre belirtilmemişse direkt listeyi dön (Edge case kontrolü)
        if (type == null) {
            return allIds;
        }

        // 3. Tip filtresini uyguluyoruz
        List<String> filteredResults = new ArrayList<>();
        for (String id : allIds) {
            Node nodeObj = NodeRegistry.findById(id);

            // Düğüm mevcutsa ve tipi istenen tiple eşleşiyorsa listeye ekle
            if (nodeObj != null && nodeObj.getNodeType() == type) {
                filteredResults.add(id);
            }
        }
        return filteredResults;
    }
}