package edge;

import node.Node;


public class Edge {
    private Node source;
    private Node destination;
    private EdgeType type;
    private boolean directed;

    // Dinamik özellikleri tutmak için gerekli alan ve metotlar
    private final java.util.Map<String, Object> properties = new java.util.HashMap<>();

    public void setProperty(String key, Object value) {
        properties.put(key, value);
    }

    public boolean has(String key) {
        return properties.containsKey(key);
    }

    public Object get(String key) {
        return properties.get(key);
    }

    public Edge(Node source, Node destination, EdgeType type, boolean directed) {
        this.source = source;
        this.destination = destination;
        this.type = type;
        this.directed = directed;
    }

    // Getter ve Setter metotları 
    public Node getSource() { return source; } //Private olan değişkenleri dışarıdan okumamıza izin verir.
    public void setSource(Node source) { this.source = source; } // Private olan değişkenleri güvenli bir şekilde değiştirmemize izin verir.

    public Node getDestination() { return destination; }
    public void setDestination(Node destination) { this.destination = destination; }

    public EdgeType getType() { return type; }
    public void setType(EdgeType type) { this.type = type; }

    public boolean isDirected() { return directed; }
    public void setDirected(boolean directed) { this.directed = directed; }
}