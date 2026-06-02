package com.grup15.socialnetwork.datastructures.graph;

import com.grup15.socialnetwork.datastructures.stack.GenericStack;
import com.grup15.socialnetwork.model.Edge;
import com.grup15.socialnetwork.model.Node;

import java.util.ArrayList;
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
    public List<Node> fatih_dfsRecursive(Node start) {
        List<Node> result = new ArrayList<>();
        Set<Node> visited = new HashSet<>();
        fatih_dfsRecursiveHelper(start, visited, result);
        return result;
    }

    // Recursive işlem için yardımcı fonksiyon
    private void fatih_dfsRecursiveHelper(Node current,
                                          Set<Node> visited,
                                          List<Node> result) {
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
    public List<Node> fatih_dfsIterative(Node start) {
        List<Node> result = new ArrayList<>();
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

    //  @author Ahmet Efe Gencel
    /*
     * Arayüzden gelen filtrelere (Edge tipi, Node tipi ve Derinlik sınırı) göre
     * dinamik olarak çalışan sınırlandırılmış DFS (Depth-Limited Search) algoritması.
     */
    public List<Node> dynamicDfs(Node start, String edgeType, String targetType, int maxDepth) {
        List<Node> resultNodes = new ArrayList<>();

        if (start == null) {
            return resultNodes;
        }

        Set<Node> visited = new HashSet<>();

        // Başlangıç düğümünü her halükarda listeye ekliyoruz (BFS ile aynı davranış)
        resultNodes.add(start);

        // Rekürsif (kendi kendini çağıran) yardımcı metodu başlat
        dfsRecursiveHelper(start, edgeType, targetType, 0, maxDepth, visited, resultNodes);

        return resultNodes;
    }

    private void dfsRecursiveHelper(Node current, String edgeType, String targetType, int currentDepth, int maxDepth, Set<Node> visited, List<Node> resultNodes) {
        // Ziyaret edildi olarak işaretle
        visited.add(current);

        // Derinlik sınırına ulaştıysak daha dibe inme, geri dön (Backtrack)
        if (currentDepth >= maxDepth) {
            return;
        }

        List<Node> neighbors = this.graph.fatih_getNeighbors(current);

        for (Node neighbor : neighbors) {
            if (!visited.contains(neighbor)) {

                // 1. İlişki (Edge) tipini kontrol et
                List<Edge> edges = this.graph.fatih_getEdgesBetween(current, neighbor);
                boolean edgeMatches = false;

                for (Edge edge : edges) {
                    if (edgeType == null || edgeType.isEmpty() || edge.getType().name().equalsIgnoreCase(edgeType)) {
                        edgeMatches = true;
                        break;
                    }
                }

                // Eğer ilişki uyuyorsa yola devam et
                if (edgeMatches) {

                    // 2. Hedef (Node) tipini kontrol et ve sonuca ekle
                    boolean nodeMatches = (targetType == null || targetType.isEmpty() || neighbor.getNodeType().name().equalsIgnoreCase(targetType));
                    if (nodeMatches && !resultNodes.contains(neighbor)) {
                        resultNodes.add(neighbor);
                    }

                    // Bir alt derinliğe (currentDepth + 1) inerek algoritmayı tekrar çağır
                    dfsRecursiveHelper(neighbor, edgeType, targetType, currentDepth + 1, maxDepth, visited, resultNodes);
                }
            }
        }
    }
}