package graph;

import node.Node;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Queue;
import java.util.Set;

public class BFS {

    private Graph graph;

    //  @author Semih Tuncel
    public BFS(Graph graph) {
        this.graph = graph;
    }

    
    
     //  @author Semih Tuncel
     /*
      * bir node'nin baglantisi olan butun nodeleri dondurur, merkezden uzaga dogru ilerler
     */
    public List<Node> bfsTraversal(Node start) {
       
        List<Node> traversalOrder = new ArrayList<>();

        if (start == null) {
            return traversalOrder;
        }

        
        Set<Node> visited = new HashSet<>();

       
        Queue<Node> frontier = new ArrayDeque<>();

        visited.add(start);
        frontier.add(start);

        while (!frontier.isEmpty()) {
            Node current = frontier.remove();
            traversalOrder.add(current);

            List<Node> neighbors = this.graph.fatih_getNeighbors(current);
            for (Node neighbor : neighbors) {
                if (!visited.contains(neighbor)) {
                    visited.add(neighbor);
                    frontier.add(neighbor);
                }
            }
        }

        return traversalOrder;
    }

    //  @author Semih Tuncel
    /*
      * 2 node arasindaki en kisa yolu dondurur, ornek 1 den 5 e gidiyoruz 2 3 4 diye kaydeder bunu dondurur
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

        
        Queue<Node> frontier = new ArrayDeque<>();

       
        Map<Node, Node> parentMap = new HashMap<>();

        visited.add(src);
        frontier.add(src);

        while (!frontier.isEmpty()) {
            Node current = frontier.remove();
            List<Node> neighbors = this.graph.fatih_getNeighbors(current);

            for (Node neighbor : neighbors) {
                if (!visited.contains(neighbor)) {
                    visited.add(neighbor);
                    parentMap.put(neighbor, current);

                    if (neighbor == tgt) {
                        return buildPath(src, tgt, parentMap);
                    }

                    frontier.add(neighbor);
                }
            }
        }

        return emptyPath;
    }

   //  @author Semih Tuncel
   /*
      * bir node'nin baglantisi olan butun nodeleri dondurur
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
        }

        Collections.reverse(path);
        return path;
    }
}
