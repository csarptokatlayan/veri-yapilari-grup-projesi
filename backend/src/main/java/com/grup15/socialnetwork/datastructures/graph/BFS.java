package com.grup15.socialnetwork.datastructures.graph;

import com.grup15.socialnetwork.datastructures.queue.GenericQueue;
import com.grup15.socialnetwork.model.Edge;
import com.grup15.socialnetwork.model.Node;

import java.util.*;

public class BFS {

    private Graph graph;

    //  @author Semih Tuncel
    public BFS(Graph graph) {
        this.graph = graph;
    }



    //  @author Semih Tuncel
    /*
     * bir main.java.com.grup15.socialnetwork.node'nin baglantisi olan butun nodeleri dondurur, merkezden uzaga dogru ilerler
     */
    public List<Node> bfsTraversal(Node start) {

        List<Node> traversalOrder = new ArrayList<>();

        if (start == null) {
            return traversalOrder;
        }


        Set<Node> visited = new HashSet<>();


       GenericQueue<Node> frontier = new GenericQueue<>();

        visited.add(start);
        frontier.enqueue(start);

        while (!frontier.isEmpty()) {
            Node current = frontier.dequeue();
            traversalOrder.add(current);

            List<Node> neighbors = this.graph.fatih_getNeighbors(current);
            for (Node neighbor : neighbors) {
                if (!visited.contains(neighbor)) {
                    visited.add(neighbor);
                    frontier.enqueue(neighbor);
                }
            }
        }

        return traversalOrder;
    }

    //  @author Ahmet Efe Gencel
    /*
     * Arayüzden gelen filtrelere (Edge tipi, Node tipi ve Derinlik sınırı) göre
     * dinamik olarak çalışan sınırlandırılmış BFS algoritması.
     */
    public List<Node> dynamicBfs(Node start, String edgeType, String targetType, int maxDepth) {
        List<Node> resultNodes = new ArrayList<>();

        if (start == null) {
            return resultNodes;
        }

        Set<Node> visited = new HashSet<>();
        GenericQueue<Node> frontier = new GenericQueue<>(); // Kendi kuyruğunuzu kullanıyoruz!

        frontier.enqueue(start);
        visited.add(start);
        resultNodes.add(start); // Başlangıç düğümü her zaman dahil edilir

        int currentDepth = 0;

        // Seviye (Derinlik) takipli BFS Döngüsü
        while (!frontier.isEmpty() && currentDepth < maxDepth) {
            int levelSize = frontier.size();

            for (int i = 0; i < levelSize; i++) {
                Node current = frontier.dequeue();
                List<Node> neighbors = this.graph.fatih_getNeighbors(current);

                for (Node neighbor : neighbors) {
                    List<Edge> edges = this.graph.fatih_getEdgesBetween(current, neighbor);
                    boolean edgeMatches = false;

                    // 1. İlişki (Edge) tipini kontrol et
                    for (Edge edge : edges) {
                        if (edgeType == null || edgeType.isEmpty() || edge.getType().name().equalsIgnoreCase(edgeType)) {
                            edgeMatches = true;
                            break;
                        }
                    }

                    // Eğer ilişki uyuyorsa ve daha önce gidilmediyse kuyruğa al
                    if (edgeMatches && !visited.contains(neighbor)) {
                        visited.add(neighbor);
                        frontier.enqueue(neighbor);

                        // 2. Hedef (Node) tipini kontrol et ve sonuca ekle
                        boolean nodeMatches = (targetType == null || targetType.isEmpty() || neighbor.getNodeType().name().equalsIgnoreCase(targetType));
                        if (nodeMatches) {
                            resultNodes.add(neighbor);
                        }
                    }
                }
            }
            currentDepth++; // Bir alt seviyeye indik
        }

        return resultNodes;
    }

    //  @author Semih Tuncel
    /*
     * 2 main.java.com.grup15.socialnetwork.node arasindaki en kisa yolu dondurur, ornek 1 den 5 e gidiyoruz 2 3 4 diye kaydeder bunu dondurur
     */

    public List<Node> shortestPath(Node src, Node tgt) {

        List<Node> emptyPath = new ArrayList<>();

        if (src == null || tgt == null) {
            return emptyPath;
        }

        if (src == tgt) {
            emptyPath.add(src);
            return emptyPath;
        }


        Set<Node> visited = new HashSet<>();


        GenericQueue<Node> frontier = new GenericQueue<>();


        Map<Node, Node> parentMap = new HashMap<>();

        visited.add(src);
        frontier.enqueue(src);

        while (!frontier.isEmpty()) {
            Node current = frontier.dequeue();
            List<Node> neighbors = this.graph.fatih_getNeighbors(current);

            for (Node neighbor : neighbors) {
                if (!visited.contains(neighbor)) {
                    visited.add(neighbor);
                    parentMap.put(neighbor, current);

                    if (neighbor == tgt) {
                        return buildPath(src, tgt, parentMap);
                    }

                    frontier.enqueue(neighbor);
                }
            }
        }

        return emptyPath;
    }

    //  @author Semih Tuncel
    /*
     * bir main.java.com.grup15.socialnetwork.node'nin baglantisi olan butun nodeleri dondurur
     */
    private List<Node> buildPath(Node src, Node tgt, Map<Node, Node> parentMap) {

        List<Node> path = new ArrayList<>();

        Node current = tgt;
        while (current != null) {
            path.add(current);

            if (current == src) {
                break;
            }

            if (!parentMap.containsKey(current) && current != src) {
                return new ArrayList<>(); // guard
            }

            current = parentMap.get(current);

        }

        Collections.reverse(path);
        return path;
    }
}