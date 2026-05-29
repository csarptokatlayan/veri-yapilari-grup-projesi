package com.grup15.socialnetwork;

import com.grup15.socialnetwork.model.Node;
import com.grup15.socialnetwork.datastructures.graph.NodeRegistry;
import com.grup15.socialnetwork.model.NodeType;
import com.grup15.socialnetwork.datastructures.graph.trie.Trie;

import java.util.List;
 // @fatihsoyer9008
public class SeedDataGenerator {

    public static void main(String[] args) {
        System.out.println("--- Sahte veri üretimi ve entegrasyon testi ---\n");


        NodeRegistry registry = new NodeRegistry(); // burası asıl hashtableımız proje ekibi arkadaşım arda yazdı
        Trie trie = new Trie(); // burada ise kelimerin harf harf saklndığı arama olarak kullancağımız indexler
        trie.setNodeRegistry(registry);

        // sistemi test edebilmek için burada sanal düğümler oluşturdum her düğümün id,bir başlığı ve bir tipi var
        Node node1 = new Node(101, "Ahmet Efe Gencel", NodeType.USER);
        Node node2 = new Node(102, "Murat Kutku", NodeType.USER);
        Node node3 = new Node(103, "Bahar Şenliği", NodeType.EVENT);
        Node node4 = new Node(104, "OTAGG Yalova gezisi", NodeType.POST);
        Node node5 = new Node(105, "Fatih Soyer", NodeType.USER);

        Node[] seedNodes = {node1, node2, node3, node4, node5};

        // 3. Kayıt ve İndeksleme
        System.out.println("-> Üretilen sahte düğümler NodeRegistry'ye kaydediliyor ve Trie'ye indeksleniyor...");
        for (Node node : seedNodes) {
            // Önce NodeRegistry'ye O(1) erişim için kaydet
            registry.register(node);

            // Sonra başlığı (kelimeyi) ve ID'sini Trie'ye ekle
            // (Küçük harfe çevirme işlemi Trie'nin kendi insert metodunda Locale.ENGLISH ile yapılıyor)
            trie.insert(node.getTitle(), String.valueOf(node.getID()));
        }
        System.out.println("✅ Kayıt ve indeksleme başarıyla tamamlandı.\n");

        // 4. Test Etme: prefix ile arama
        String searchPrefix = "Bah"; // Arama motoruna "Bah" yazıldığını simüle ediyor. Trie ağacı kökten başlayarak 'B' -> 'a' -> 'h' yollarını izliyor (harf büyüklüğünü umursamadan)
        System.out.println("-> Trie üzerinde '" + searchPrefix + "' araması yapılıyor...");

        List<String> foundIds = trie.searchByPrefix(searchPrefix);
        System.out.println("Bulunan ID'ler: " + foundIds + "\n");

        System.out.println("-> Bulunan ID'lerin detayları NodeRegistry'den O(1) hızında çekiliyor:");
        if (foundIds.isEmpty()) {
            System.out.println("Sonuç bulunamadı.");
        } else {
            for (String id : foundIds) { // hashtableın sunduğu O(1) karmaşıklıkla direkt objeye gidiyoruz
                Node detailedNode = registry.findById(id);
                if (detailedNode != null) {
                    System.out.println(">> ID: " + detailedNode.getID() +
                            " | Başlık: " + detailedNode.getTitle() +
                            " | Tip: " + detailedNode.getNodeType());
                }
            }
        }

        System.out.println("\n--- testimiz tamamlandı ---");
    }
}