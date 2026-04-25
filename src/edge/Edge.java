package edge;

import node.Node;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

public class Edge {

    private Node source;
    private Node target;
    private Map<String, Objects> properties;

    public Edge(Node source, Node target) {
        this.source = source;
        this.target = target;
        this.properties = new HashMap<>();
    }
}
