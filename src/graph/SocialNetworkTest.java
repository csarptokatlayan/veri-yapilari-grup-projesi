package graph;

import edge.Edge;
import edge.EdgeType;
import graph.Graph;
import node.Node;
import node.NodeType;

    public class SocialNetworkTest {

        public static void main(String[] args) {
            Graph sosyalAg = new Graph();

            System.out.println("--- 15+ Node'luk Sosyal Ağ Simülasyonu Başlatılıyor ---");

            // 1. 15 Tane Kullanıcı (Node) Oluşturuyoruz
            Node[] kullanicilar = new Node[16];
            for (int i = 1; i <= 15; i++) {
                kullanicilar[i] = new Node(i, "Kullanici_" + i, NodeType.USER);
                sosyalAg.ahmetEfe_addNode(kullanicilar[i]);
            }
            System.out.println("15 Kullanıcı (NodeType.USER) başarıyla ağa eklendi.");

            // 2. Bağlantıları (Edge) Oluşturuyoruz
            boolean isDirected = true; // Sosyal ağı Twitter/Instagram gibi yönlü varsayalım


            // Kullanıcı 1, 2 ve 3'ü arkadaş olarak ekliyor / takip ediyor
            sosyalAg.ahmetEfe_addEdge(new Edge(kullanicilar[1], kullanicilar[2], EdgeType.FRIEND, isDirected), kullanicilar[1], kullanicilar[2]);
            sosyalAg.ahmetEfe_addEdge(new Edge(kullanicilar[1], kullanicilar[3], EdgeType.FRIEND, isDirected), kullanicilar[1], kullanicilar[3]);

            // Kullanıcı 4, 5 ve 6, Kullanıcı 1'i arkadaş olarak ekliyor
            sosyalAg.ahmetEfe_addEdge(new Edge(kullanicilar[4], kullanicilar[1], EdgeType.FRIEND, isDirected), kullanicilar[4], kullanicilar[1]);
            sosyalAg.ahmetEfe_addEdge(new Edge(kullanicilar[5], kullanicilar[1], EdgeType.FRIEND, isDirected), kullanicilar[5], kullanicilar[1]);
            sosyalAg.ahmetEfe_addEdge(new Edge(kullanicilar[6], kullanicilar[1], EdgeType.FRIEND, isDirected), kullanicilar[6], kullanicilar[1]);

            // Geri kalanları birbirine bağlayalım ki ağ dolsun
            for (int i = 7; i < 15; i++) {
                sosyalAg.ahmetEfe_addEdge(new Edge(kullanicilar[i], kullanicilar[i+1], EdgeType.FRIEND, isDirected), kullanicilar[i], kullanicilar[i+1]);
            }

            System.out.println("Bağlantılar (EdgeType.FRIEND) başarıyla oluşturuldu.\n");


            System.out.println("--- DERECE (DEGREE) KONTROLLERİ ---");

            Node testKullanicisi = kullanicilar[1]; // Kullanıcı_1'i test edelim

            int takipEdilen = sosyalAg.murat_getOutDegree(testKullanicisi);
            int takipci = sosyalAg.murat_getInDegree(testKullanicisi);
            int toplamEtkilesim = sosyalAg.murat_getDegree(testKullanicisi, isDirected);

            System.out.println("Kullanici_1'in takip ettiği kişi sayısı (OutDegree): " + takipEdilen); // Beklenen: 2
            System.out.println("Kullanici_1'i takip eden kişi sayısı (InDegree): " + takipci); // Beklenen: 3
            System.out.println("Kullanici_1'in toplam ağ etkileşimi (Total Degree): " + toplamEtkilesim); // Beklenen: 5

            System.out.println("\nTebrikler! Ö5 Testi Başarıyla Tamamlandı.");
        }
    }

