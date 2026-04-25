package node;

import edge.Edge;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

public class Node {

    private int ID;
    private NodeType nodeType;
    private List<Edge> edgeList;
    private Map<String, Objects> properties;

    public Node(int ID, NodeType nodeType, List<Edge> edgeList) {
        this.ID = ID;
        this.nodeType = nodeType;
        this.edgeList = edgeList;
        this.properties = new HashMap<>();
    }
}
