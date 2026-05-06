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

    // Nodeları ID leri ile birlikte saklayan map yapısı
    private Map<Integer, Node> nodeIdMap;

    public Graph() {
        nodeEdgeMap = new ConcurrentHashMap<>();
        nodeIdMap = new ConcurrentHashMap<>();
    }

        public void ahmetEfe_addNode (Node node){
            nodeEdgeMap.put(node, new ArrayList<>());
            nodeIdMap.put(node.getID(), node);
        }

        public void ahmetEfe_addEdge (Edge edge, Node sourceNode, Node targetNode){
            if (!nodeEdgeMap.containsKey(sourceNode) || !nodeEdgeMap.containsKey(targetNode)) {
                throw new IllegalArgumentException("Düğüm veya düğümler grafta bulunamadı !");
            }

            if (edge.isDirected()) {
                nodeEdgeMap.get(sourceNode).add(edge);
            } else {
                // Eğer yönsüz ise kenar, iki tarafa da ekliyoruz.
                nodeEdgeMap.get(sourceNode).add(edge);
                nodeEdgeMap.get(targetNode).add(edge);
            }
        }

        public boolean ahmetEfe_nodeExist ( int ID){
            return nodeIdMap.containsKey(ID);
        }

        public List<Node> ahmetEfe_findNodesByType (NodeType nodeType){
            List<Node> result = new ArrayList<>();
            for (Node node : nodeIdMap.values()) {
                if (node.getNodeType() == nodeType) {
                    result.add(node);
                }
            }
            return result;
        }

        public List<Node> ahmetEfe_findNodesByProperty (String key, Object value){
            List<Node> result = new ArrayList<>();
            for (Node node : nodeIdMap.values()) {
                if (node.getProperties().containsKey(key) && node.getProperties().get(key).equals(value)) {
                    result.add(node);
                }
            }
            return result;
        }

        public boolean ahmetEfe_isConnected (Node node1, Node node2){
            if (!nodeEdgeMap.containsKey(node1) || !nodeEdgeMap.containsKey(node2)) {
                return false;
            }

            for (Edge edge : nodeEdgeMap.get(node1)) {
                if (!edge.isDirected() && edge.getSource().equals(node2) && edge.getDestination().equals(node1)) {
                    return true;
                }

                if (edge.getSource().equals(node1) && edge.getDestination().equals(node2)) {
                    return true;
                }
            }
            return false;
        }

        // --- FATİH'İN METOTLARI ---

        public List<Node> fatih_getNeighbors (Node node){
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

        public void fatih_removeNode (Node node){
            if (!nodeEdgeMap.containsKey(node)) return;

            for (List<Edge> edges : nodeEdgeMap.values()) {
                Iterator<Edge> iterator = edges.iterator();
                while (iterator.hasNext()) {
                    Edge edge = iterator.next();
                    if (edge.getSource().equals(node) || edge.getDestination().equals(node)) {
                        iterator.remove();
                    }
                }
            }
            nodeEdgeMap.remove(node);
            nodeIdMap.remove(node.getID());
        }

        public void fatih_removeEdge (Edge edge){
            Node source = edge.getSource();
            Node dest = edge.getDestination();

            if (nodeEdgeMap.containsKey(source)) {
                nodeEdgeMap.get(source).remove(edge);
            }

            if (!edge.isDirected() && nodeEdgeMap.containsKey(dest)) {
                nodeEdgeMap.get(dest).remove(edge);
            }
        }

        public List<Edge> fatih_getEdgesBetween (Node source, Node target){
            List<Edge> result = new ArrayList<>();
            if (!nodeEdgeMap.containsKey(source)) return result;

            for (Edge edge : nodeEdgeMap.get(source)) {
                boolean sourceToTarget = edge.getSource().equals(source) && edge.getDestination().equals(target);
                boolean targetToSourceUndirected = !edge.isDirected() && edge.getSource().equals(target) && edge.getDestination().equals(source);

                if (sourceToTarget || targetToSourceUndirected) {
                    result.add(edge);
                }
            }
            return result;
        }

        // --- MURAT'IN  METOTLARI ---

        /**
         * Dışarı çıkan bağlantı sayısını verir (Kimi takip ediyor?)
         */
        public int murat_getOutDegree (Node n){
            if (!nodeEdgeMap.containsKey(n)) {
                return 0;
            }
            return nodeEdgeMap.get(n).size();
        }

        /**
         * İçeri giren bağlantı sayısını verir (Kaç takipçisi var?)
         */
        public int murat_getInDegree (Node n){
            if (!nodeEdgeMap.containsKey(n)) {
                return 0;
            }

            int count = 0;
            // Tüm düğümlerin kenar listelerini kontrol ediyoruz
            for (List<Edge> edges : nodeEdgeMap.values()) {
                for (Edge edge : edges) {
                    // Eğer kenarın hedef noktası bizim düğümümüz ise sayacı artır
                    if (edge.getDestination().equals(n)) {
                        count++;
                    }
                }
            }
            return count;
        }

        /**
         * Toplam dereceyi hesaplar (Yönlü/Yönsüz ayrımına dikkat ederek)
         */
        public int murat_getDegree (Node n,boolean isDirected){
            if (!nodeEdgeMap.containsKey(n)) {
                return 0;
            }

            if (isDirected) {
                // Yönlü ağlarda (Örn: Twitter) Toplam Etkileşim = Takipçi (In) + Takip Edilen (Out)
                return murat_getInDegree(n) + murat_getOutDegree(n);
            } else {
                // Yönsüz ağlarda  kenarlar zaten iki tarafa da eklendiği için kendi listesi yeterlidir
                return nodeEdgeMap.get(n).size();
            }
        }
    }




