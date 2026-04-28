package node;

import edge.Edge;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

public class Node {

    private int id;
    private String title;
    private NodeType nodeType;
    private List<Edge> edgeList;
    private Map<String, Object> properties;

    public Node(int id,String title, NodeType nodeType, List<Edge> edgeList) {
        this.id = id;
        this.title=title;
        this.nodeType = nodeType;
        this.edgeList = edgeList;
        this.properties = new HashMap<>();
    }

public int getID(){
    return id;
}
public void setID(int id){
    this.id=id;
}
public String getTitle(){
    return title;
}
public void setTitle(String title){
    this.title=title;
}
public NodeType getNodeType(){
    return nodeType;
}
public void setNodeType(NodeType nodeType){
    this.nodeType=nodeType;
}
}