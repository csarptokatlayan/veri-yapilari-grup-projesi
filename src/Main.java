import edge.Edge;
import edge.EdgeType;
import graph.Graph;
import node.Node;
import node.NodeType;

import java.util.List;

public class Main {
    public static void main(String[] args) {
        Graph graph = new Graph();

        System.out.println("--- 1. Ekip Düğümleri (Nodes) Oluşturuluyor ---");
        // 5 tane USER (Kullanıcı)
        Node n1 = new Node(1, "Fatih", NodeType.USER);
        Node n2 = new Node(2, "Ahmet", NodeType.USER);
        Node n3 = new Node(3, "Semih", NodeType.USER);
        Node n4 = new Node(4, "Arda", NodeType.USER);
        Node n5 = new Node(5, "Murat", NodeType.USER);

        // 5 tane de POST, PHOTO ve EVENT
        Node n6 = new Node(6, "Fatih'in Postu", NodeType.POST);
        Node n7 = new Node(7, "Ulujam Etkinliği", NodeType.EVENT);
        Node n8 = new Node(8, "Arda'nın Fotoğrafı", NodeType.PHOTO);
        Node n9 = new Node(9, "Murat'ın Postu", NodeType.POST);
        Node n10 = new Node(10, "Bursa Gezisi", NodeType.EVENT);

        // Nodeları Graph'a ekliyoruz
        graph.ahmetEfe_addNode(n1); graph.ahmetEfe_addNode(n2);
        graph.ahmetEfe_addNode(n3); graph.ahmetEfe_addNode(n4);
        graph.ahmetEfe_addNode(n5); graph.ahmetEfe_addNode(n6);
        graph.ahmetEfe_addNode(n7); graph.ahmetEfe_addNode(n8);
        graph.ahmetEfe_addNode(n9); graph.ahmetEfe_addNode(n10);

        System.out.println("Tüm ekip ve içerikler eklendi. Murat (Düğüm 5) mevcut mu? : " + graph.ahmetEfe_nodeExist(5));

        System.out.println("\n--- 2. Ekip İçi Etkileşimler (Edges) Oluşturuluyor ---");
        Edge e1 = new Edge(n1, n2, EdgeType.FRIEND, false); // Fatih <-> Ahmet arkadaş (Yönsüz)
        Edge e2 = new Edge(n1, n6, EdgeType.POSTED, true);  // Fatih -> Post paylaştı (Yönlü)
        Edge e3 = new Edge(n3, n6, EdgeType.LIKES, true);   // Semih -> Fatih'in Postunu beğendi
        Edge e4 = new Edge(n4, n7, EdgeType.ATTENDS, true); // Arda -> Ulujam Etkinliğine katılıyor
        Edge e5 = new Edge(n5, n1, EdgeType.FRIEND, false); // Murat <-> Fatih arkadaş

        graph.ahmetEfe_addEdge(e1, n1, n2);
        graph.ahmetEfe_addEdge(e2, n1, n6);
        graph.ahmetEfe_addEdge(e3, n3, n6);
        graph.ahmetEfe_addEdge(e4, n4, n7);
        graph.ahmetEfe_addEdge(e5, n5, n1);

        System.out.println("\n--- 3. Senin Metotların (Queries) Test Ediliyor ---");

        List<Node> fatihNeighbors = graph.fatih_getNeighbors(n1);
        System.out.print("Fatih'in (Node 1) Etkileşimde Oldukları (Komşuları): ");
        for (Node neighbor : fatihNeighbors) {
            System.out.print(neighbor.getTitle() + " | ");
        }
        System.out.println();

        List<Edge> edgesBetweenFatihAhmet = graph.fatih_getEdgesBetween(n1, n2);
        System.out.println("Fatih ve Ahmet arasındaki bağ sayısı: " + edgesBetweenFatihAhmet.size());

        System.out.println("\n--- 4. Silme İşlemleri ---");
        graph.fatih_removeEdge(e5);
        System.out.println("Murat-Fatih arkadaşlık bağı (Edge) silindi.");

        graph.fatih_removeNode(n6);
        System.out.println("Fatih'in Postu (Node 6) tamamen silindi.");

        List<Node> semihNeighbors = graph.fatih_getNeighbors(n3);
        System.out.print("Post silindikten sonra Semih'in (Node 3) etkileşimleri: ");
        if (semihNeighbors.isEmpty()) {
            System.out.println("Hiçbir şey kalmadı.");
        } else {
            for (Node neighbor : semihNeighbors) {
                System.out.print(neighbor.getTitle() + " | ");
            }
            System.out.println();
        }
    }
}