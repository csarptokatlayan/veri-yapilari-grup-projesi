package graph;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.Stack;

import node.Node;

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
    public List<Node> fatih_dfsRecursive(Node start) {
        List<Node> result = new ArrayList<>();
        Set<Node> visited = new HashSet<>();

        // Yardımcı fonksiyona da graph göndermiyoruz
        fatih_dfsRecursiveHelper(start, visited, result);
        return result;
    }

    // Recursive işlem için yardımcı fonksiyon
    private void fatih_dfsRecursiveHelper(Node current, Set<Node> visited, List<Node> result) {
        visited.add(current);
        result.add(current);

        // graph sınıfının kendi hafızasındaki haritayı kullanacak
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
    public List<Node> fatih_dfsIterative(Node start) {
        List<Node> result = new ArrayList<>();
        Set<Node> visited = new HashSet<>();

        Stack<Node> stack = new Stack<>();
        stack.push(start);

        while (!stack.isEmpty()) {
            Node current = stack.pop();

            if (!visited.contains(current)) {
                visited.add(current);
                result.add(current);

                // Yine sınıfın hafızasındaki harita devrede
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