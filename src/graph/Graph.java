package graph;

import edge.Edge;
import node.Node;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

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


// @fatihsoyer9008 o5 methods görevleri

    /**
     * Bir düğümün komşularını döndürür.
     */
    public List<Node> fatih_getNeighbors(Node node) {
        List<Node> neighbors = new ArrayList<>();
        if (!nodeEdgeMap.containsKey(node)) return neighbors;

        for (Edge edge : nodeEdgeMap.get(node)) {
            if (edge.getSource().equals(node)) {
                neighbors.add(edge.getDestination());
            } else {
                neighbors.add(edge.getSource());
            }
        }
        return neighbors;
    }

    /**
     * Bir düğümü ve ona bağlı olan tüm kenarları graftan tamamen siler.
     */
    public void fatih_removeNode(Node node) {
        if (!nodeEdgeMap.containsKey(node)) return;

        for (List<Edge> edges : nodeEdgeMap.values()) {
            edges.removeIf(edge -> edge.getSource().equals(node) || edge.getDestination().equals(node));
        }

        nodeEdgeMap.remove(node);
        nodeIdMap.remove(node.getID());
    }

    /**
     * Belirli bir kenarı graftan siler.
     */
    public void fatih_removeEdge(Edge edge) {
        Node source = edge.getSource();
        Node dest = edge.getDestination();

        if (nodeEdgeMap.containsKey(source)) {
            nodeEdgeMap.get(source).remove(edge);
        }

        if (!edge.isDirected() && nodeEdgeMap.containsKey(dest)) {
            nodeEdgeMap.get(dest).remove(edge);
        }
    }

    /**
     * İki düğüm arasındaki kenarları döndürür.
     */
    public List<Edge> fatih_getEdgesBetween(Node source, Node target) {
        List<Edge> result = new ArrayList<>();
        if (!nodeEdgeMap.containsKey(source)) return result;

        for (Edge edge : nodeEdgeMap.get(source)) {
            if ((edge.getSource().equals(source) && edge.getDestination().equals(target)) ||
                    (!edge.isDirected() && edge.getSource().equals(target) && edge.getDestination().equals(source))) {
                result.add(edge);
            }
        }
        return result;
    }
}
