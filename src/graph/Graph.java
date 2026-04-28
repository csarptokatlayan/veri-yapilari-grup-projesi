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

    // Nodeları ID leri ile birlikte saklayan map yapısı
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

}
