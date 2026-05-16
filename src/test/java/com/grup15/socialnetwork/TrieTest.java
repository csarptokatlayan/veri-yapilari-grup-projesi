package com.grup15.socialnetwork;

import com.grup15.socialnetwork.graph.Trie;
import com.grup15.socialnetwork.node.Node;
import com.grup15.socialnetwork.node.NodeRegistry;
import com.grup15.socialnetwork.node.NodeType;

import java.util.List;

public class TrieTest {

    public static void main(String[] args) {
        System.out.println("--- Trie K4 Görevi Tip Filtresi Testleri Başlatılıyor ---\n");

        Trie trie = new Trie();
        NodeRegistry registry = new NodeRegistry();

        //  Trie'ye NodeRegistry referansını veriyoruz.
        trie.setNodeRegistry(registry);

        // Testler için örnek Düğümler (Node) oluşturuyoruz.
        Node node1 = new Node(1, "Ahmet Yıldız", NodeType.USER);
        Node node2 = new Node(2, "ahmet yılmaz", NodeType.USER);
        Node node3 = new Node(3, "Bahar Festivali", NodeType.EVENT);
        Node node4 = new Node(4, "Yeni bir gönderi", NodeType.POST);

        registry.register(node1);
        registry.register(node2);
        registry.register(node3);
        registry.register(node4);

        trie.insert("Ahmet Kaya", String.valueOf(node1.getID()));
        trie.insert("ahmet yılmaz", String.valueOf(node2.getID()));
        trie.insert("Bahar Festivali", String.valueOf(node3.getID()));
        trie.insert("Yeni bir gönderi", String.valueOf(node4.getID()));

        // Test Senrayoalrı

        // 1. Büyük/Küçük Harf ve Türkçe Karakter Testi
        List<String> results1 = trie.searchByPrefix("ahmet");
        System.out.print("1. Büyük/Küçük Harf Testi (ahmet): ");
        if (results1.size() == 2 && results1.contains("1") && results1.contains("2")) {
            System.out.println("BAŞARILI ✅");
        } else {
            System.out.println("HATA ❌");
        }

        // 2. Prefix Ortadan Sonuç Yok Testi
        List<String> results2 = trie.searchByPrefix("Kaya");
        System.out.print("2. Prefix Ortadan Arama Testi (Kaya): ");
        if (results2.isEmpty()) {
            System.out.println("BAŞARILI ✅");
        } else {
            System.out.println("HATA ❌");
        }

        // 3. Tip Filtresiyle Sonuç Daralması Testi
        List<String> results3 = trie.searchByPrefix("ahmet", NodeType.USER);
        List<String> results4 = trie.searchByPrefix("ahmet", NodeType.EVENT);
        System.out.print("3. Tip Filtresi Testi (USER ve EVENT filtrelemesi): ");
        if (results3.size() == 2 && results4.isEmpty()) {
            System.out.println("BAŞARILI ✅");
        } else {
            System.out.println("HATA ❌");
        }

        // 4. Null Type Filtre Yok Testi
        List<String> results5 = trie.searchByPrefix("ahmet", null);
        System.out.print("4. Null Type Testi (Tip null ise filtreleme yapma): ");
        if (results5.size() == 2) {
            System.out.println("BAŞARILI ✅");
        } else {
            System.out.println("HATA ❌");
        }

        // 5. Boş Prefix Tümü Testi
        List<String> results6 = trie.searchByPrefix("");
        System.out.print("5. Boş Prefix Testi (Arama boş ise tüm düğümleri getir): ");
        if (results6.size() == 4) {
            System.out.println("BAŞARILI ✅");
        } else {
            System.out.println("HATA ❌");
        }

        System.out.println("\n--- Bütün Testler Tamamlandı ---");
    }
}