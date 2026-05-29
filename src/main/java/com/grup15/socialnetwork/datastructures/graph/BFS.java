package com.grup15.socialnetwork.datastructures.graph;

import com.grup15.socialnetwork.datastructures.list.CustomLinkedList;
import com.grup15.socialnetwork.datastructures.queue.GenericQueue;
import com.grup15.socialnetwork.model.Node;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

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
     public CustomLinkedList<Node> bfsTraversal(Node start) {
         CustomLinkedList<Node> traversalOrder = new CustomLinkedList<>();

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

    //  @author Semih Tuncel
    /*
      * 2 main.java.com.grup15.socialnetwork.node arasindaki en kisa yolu dondurur, ornek 1 den 5 e gidiyoruz 2 3 4 diye kaydeder bunu dondurur
     */

    public CustomLinkedList<Node> shortestPath(Node src, Node tgt) {
        CustomLinkedList<Node> emptyPath = new CustomLinkedList<>();

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
   private CustomLinkedList<Node> buildPath(Node src,
                                            Node tgt,
                                            Map<Node, Node> parentMap) {
       CustomLinkedList<Node> path = new CustomLinkedList<>();

       Node current = tgt;
       while (current != null) {
           path.add(current);
           if (current == src) break;
           current = parentMap.get(current);
       }

       path.reverse();
       return path;
   }
}
