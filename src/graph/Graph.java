package graph;

import edge.Edge;
import node.Node;
import node.NodeType;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Iterator;

public class Graph {

    // Her bir nodedan hangi kenarların çıktığını saklayan map yapısı
    private Map<Node, List<Edge>> nodeEdgeMap;

    // Nodeları ID leri ile birlikte saklayan map yapısı ( O(1) zamanda aradığımız ID'yi bulabilmek için)
    private Map<Integer, Node> nodeIdMap;

    public Graph()
    {
        nodeEdgeMap = new ConcurrentHashMap<>();
        nodeIdMap = new ConcurrentHashMap<>();
    }

    public void ahmetEfe_addNode(Node node)
    {
        nodeEdgeMap.put(node,new ArrayList<>());
        nodeIdMap.put(node.getID(), node);
    }


    public void ahmetEfe_addEdge(Edge edge,Node sourceNode, Node targetNode)
    {

        if(!nodeEdgeMap.containsKey(sourceNode) || !nodeEdgeMap.containsKey(targetNode))
        {
            throw new IllegalArgumentException("Düğüm veya düğümler grafta bulunamadı !");
        }

        if (edge.isDirected())
        {
            // Node'u tutan mapten aradıpımız node'u alıp ona karşılık gelen listeye kenar ekliyoruz.
            nodeEdgeMap.get(sourceNode).add(edge);
        }
        else
        {
            // Eğer yönsüz ise kenar, iki tarafada ekliyoruz.
            nodeEdgeMap.get(sourceNode).add(edge);
            nodeEdgeMap.get(targetNode).add(edge);
        }
    }

    public boolean ahmetEfe_nodeExist(int ID)
    {
        return nodeIdMap.containsKey(ID);
    }

    // Belirli bir türdeki düğümleri döndürür
    public List<Node> ahmetEfe_findNodesByType(NodeType nodeType)
    {
        List<Node> result = new ArrayList<>();
        // Tüm düğümleri tek tek kontrol ediyoruz ve aradığımız türde olanları sonuç listesine ekliyoruz
        for (Node node : nodeIdMap.values()) {
            if (node.getNodeType() == nodeType) {
                result.add(node);
            }
        }
        return result;
    }

    // Belirli bir anahtar-değer çiftine sahip düğümleri döndürür
    public List<Node> ahmetEfe_findNodesByProperty(String key, Object value) {
        List<Node> result = new ArrayList<>();
        // Tüm düğümleri tek tek kontrol ediyoruz ve aradığımız anahtar-değer çiftine sahip olanları sonuç listesine ekliyoruz
        for (Node node : nodeIdMap.values()) {
            if (node.getProperties().containsKey(key) && node.getProperties().get(key).equals(value)) {
                result.add(node);
            }
        }
        return result;
    }

    // İki düğümün birbirine bağlı olup olmadığını kontrol eder
    public boolean ahmetEfe_isConnected(Node node1, Node node2) {
        if (!nodeEdgeMap.containsKey(node1) || !nodeEdgeMap.containsKey(node2)) {
            return false; // Eğer düğümler grafta yoksa, bağlantı yoktur
        }

        for (Edge edge : nodeEdgeMap.get(node1)) {
            if(!edge.isDirected() && edge.getSource().equals(node2) && edge.getDestination().equals(node1))
            {
                return true; // İki düğüm arasında bir kenar varsa, bağlıdırlar
            }

            if (edge.getSource().equals(node1) && edge.getDestination().equals(node2))
            {
                return true; // İki düğüm arasında bir kenar varsa, bağlıdırlar
            }
        }
        return false; // Hiçbir kenar bulunmazsa, bağlı değiller
    }


// @fatihsoyer9008 o5 methods görevleri

    // --- FATİH'İN Ö5 METOTLARI (GRAPH QUERIES) ---

    /**
     * Bir düğümün komşularını döndürür.
     */
    public List<Node> fatih_getNeighbors(Node node) {
        // Komşuları tutacağımız boş bir liste oluşturuyoruz
        List<Node> neighbors = new ArrayList<>();

        // Eğer aradığımız düğüm grafta hiç yoksa, boş listeyi geri döndürüyoruz
        if (!nodeEdgeMap.containsKey(node)) return neighbors;

        // Düğümün bağlı olduğu tüm kenarları (edgeleri) tek tek geziyoruz
        for (Edge edge : nodeEdgeMap.get(node)) {
            // Eğer kenarın çıkış noktası (source) bizim düğümümüzse, demek ki hedef (destination) komşumuzdur
            if (edge.getSource().equals(node)) {
                neighbors.add(edge.getDestination());
            }
            // Eğer kenarın hedef noktası bizim düğümümüzse, demek ki çıkış noktası (source) komşumuzdur
            else {
                neighbors.add(edge.getSource());
            }
        }
        return neighbors;
    }

    /**
     * Bir düğümü ve ona bağlı olan tüm kenarları graftan tamamen siler.
     */
    public void fatih_removeNode(Node node) {
        // Eğer silinecek düğüm zaten grafta yoksa, hiçbir işlem yapmadan çıkıyoruz
        if (!nodeEdgeMap.containsKey(node)) return;

        // ÖNCE diğer tüm düğümlerin listelerini gezip, bu silinecek düğüme gelen/giden kenarları temizliyoruz
        for (List<Edge> edges : nodeEdgeMap.values()) {

            // Listeden eleman silerken hata almamak için klasik Iterator yapısını kullanıyoruz (Lambda kaldırıldı)
            Iterator<Edge> iterator = edges.iterator();
            while (iterator.hasNext()) {
                Edge edge = iterator.next();
                // Eğer kenarın ucu veya başı bizim silmek istediğimiz düğüme değiyorsa, o kenarı siliyoruz
                if (edge.getSource().equals(node) || edge.getDestination().equals(node)) {
                    iterator.remove();
                }
            }
        }

        // Bütün bağlantılar koptuktan SONRA, düğümün kendisini haritalardan komple siliyoruz
        nodeEdgeMap.remove(node);
        nodeIdMap.remove(node.getID());
    }

    /**
     * Belirli bir kenarı graftan siler.
     */
    public void fatih_removeEdge(Edge edge) {
        // Kenarın başını ve sonunu alıyoruz
        Node source = edge.getSource();
        Node dest = edge.getDestination();

        // Eğer kaynak düğüm grafta varsa, onun bağlantı listesinden bu kenarı siliyoruz
        if (nodeEdgeMap.containsKey(source)) {
            nodeEdgeMap.get(source).remove(edge);
        }

        // Eğer kenar yönsüz ise (iki taraflı eklendiyse), hedef düğümün bağlantı listesinden de siliyoruz
        if (!edge.isDirected() && nodeEdgeMap.containsKey(dest)) {
            nodeEdgeMap.get(dest).remove(edge);
        }
    }

    /**
     * İki düğüm arasındaki kenarları (bağlantıları) döndürür.
     */
    public List<Edge> fatih_getEdgesBetween(Node source, Node target) {
        // İki düğüm arasındaki kenarları tutacağımız boş liste
        List<Edge> result = new ArrayList<>();

        // Kaynak düğüm grafta yoksa, boş listeyi döndür
        if (!nodeEdgeMap.containsKey(source)) return result;

        // Kaynak düğümden çıkan tüm kenarları tek tek kontrol ediyoruz
        for (Edge edge : nodeEdgeMap.get(source)) {
            // 1. Durum: Kenar source'dan çıkıp target'a gidiyorsa
            boolean sourceToTarget = edge.getSource().equals(source) && edge.getDestination().equals(target);

            // 2. Durum: Kenar yönsüzse ve target'tan çıkıp source'a geliyorsa
            boolean targetToSourceUndirected = !edge.isDirected() && edge.getSource().equals(target) && edge.getDestination().equals(source);

            // Eğer bu iki durumdan biri geçerliyse, aradığımız kenarı bulduk demektir, listeye ekliyoruz
            if (sourceToTarget || targetToSourceUndirected) {
                result.add(edge);
            }
        }
        return result;
    }
}