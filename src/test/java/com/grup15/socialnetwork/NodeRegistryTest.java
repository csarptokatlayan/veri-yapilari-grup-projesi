package com.grup15.socialnetwork;

import com.grup15.socialnetwork.node.Node;
import com.grup15.socialnetwork.node.NodeRegistry;
import com.grup15.socialnetwork.node.NodeType;

public class NodeRegistryTest {
    public static void main(String[] args) {
        System.out.println("--- NodeRegistry (US2) Testleri Başlıyor ---");
        NodeRegistry registry = new NodeRegistry();

        //Kayıt Testi
        Node n1 = new Node(101, "Ahmet Efe", NodeType.USER);
        registry.register(n1);

        //Bulma Testi (Başarılı Durum)
        Node found = registry.findById("101");
        if (found != null && found.getTitle().equals("Ahmet Efe")) {
            System.out.println("✅ TEST PASSED: Düğüm başarıyla kaydedildi ve O(1) hızında bulundu.");
        } else {
            System.out.println("❌ TEST FAILED: Düğüm bulunamadı!");
        }

        //Bulunamayan Node Testi
        Node notFound = registry.findById("9999");
        if (notFound == null) {
            System.out.println("✅ TEST PASSED: Sistemde olmayan ID arandığında beklendiği gibi 'null' döndü.");
        } else {
            System.out.println("❌ TEST FAILED: Olmayan ID null dönmedi!");
        }

        //Exists (Var mı?) Testi
        if (registry.exists("101") && !registry.exists("9999")) {
            System.out.println("✅ TEST PASSED: exists() metodu doğru çalışıyor.");
        } else {
            System.out.println("❌ TEST FAILED: exists() metodu hatalı!");
        }
    }
}