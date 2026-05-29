package com.grup15.socialnetwork.datastructures.graph;

import com.grup15.socialnetwork.datastructures.list.CustomLinkedList;
import com.grup15.socialnetwork.datastructures.stack.GenericStack;
import com.grup15.socialnetwork.model.Node;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Bu sınıf, Graph (Çizge) üzerinde DFS (Derinlik Öncelikli Arama) algoritmalarını
 * çalıştırmak için yazılmıştır.
 *
 * Kodun okunabilirliğini artırmak ve single responsibility kuralına
 * uymak adına DFS işlemleri ana Graph sınıfından ayrılmıştır. Ayrıca Graph objesini
 * her metoda tek tek parametre olarak göndermek yerine constructor üzerinden bir kez
 * alıp sınıf içinde ortak kullanıyoruz.
 *
 * İki farklı arama yöntemi içerir:
 * - Recursive: Klasik özyineli yöntemle derine iner.
 * - Iterative: Java'nın kendi Stack yapısını kullanarak aynı işlemi döngüyle yapar.
 *
 *
 */
public class DFS {

    private Graph graph; // graphı yani haritayı bir kere alıp hep kullanacağız
    // önceden iki parametreli işlemler yapıyordum şimdi teke düşürdüm

    // Constructor : DFS arama motorunu kurarken haritayı içine veriyoruz
    public DFS(Graph graph) {
        this.graph = graph;
    }

    /**
     * DFS - Recursive (Özyineli) Yaklaşım
     * Artık sadece başlangıç düğümünü alması yeterli!
     */
    public CustomLinkedList<Node> fatih_dfsRecursive(Node start) {
        CustomLinkedList<Node> result = new CustomLinkedList<>();
        Set<Node> visited = new HashSet<>();
        fatih_dfsRecursiveHelper(start, visited, result);
        return result;
    }

    // Recursive işlem için yardımcı fonksiyon
    private void fatih_dfsRecursiveHelper(Node current,
                                          Set<Node> visited,
                                          CustomLinkedList<Node> result) {
        visited.add(current);
        result.add(current);

        List<Node> neighbors = this.graph.fatih_getNeighbors(current);
        for (Node neighbor : neighbors) {
            if (!visited.contains(neighbor)) {
                fatih_dfsRecursiveHelper(neighbor, visited, result);
            }
        }
    }

    /**
     * DFS - Iterative (Yinelemeli / Stack Kullanarak) Yaklaşım
     * Artık sadece başlangıç düğümünü alması yeterli!
     */
    public CustomLinkedList<Node> fatih_dfsIterative(Node start) {
        CustomLinkedList<Node> result = new CustomLinkedList<>();
        Set<Node> visited = new HashSet<>();

        GenericStack<Node> stack = new GenericStack<>();
        stack.push(start);

        while (!stack.isEmpty()) {
            Node current = stack.pop();

            if (!visited.contains(current)) {
                visited.add(current);
                result.add(current);

                List<Node> neighbors = this.graph.fatih_getNeighbors(current);
                for (Node neighbor : neighbors) {
                    if (!visited.contains(neighbor)) {
                        stack.push(neighbor);
                    }
                }
            }
        }
        return result;
    }
}