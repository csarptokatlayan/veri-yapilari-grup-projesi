package node;

import hashtable.HashTable;

public class NodeRegistry {

    private HashTable<String, Node> table;

    public NodeRegistry() {
        this.table = new HashTable<>();
    }

    //Sisteme Düğüm Kaydetme
    public void register(Node node) {
        if (node == null) return;
        // Node'un int ID'sini String yaparak tabloya anahtar olarak veriyoruz
        table.put(String.valueOf(node.getID()), node);
    }

    //ID'ye Göre Hızlı Bulma O(1)
    public Node findById(String id) {
        return table.get(id); // Yoksa null döner
    }

    //Var mı Kontrolü
    public boolean exists(String id) {
        return table.get(id) != null;
    }
}