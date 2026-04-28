public enum NodeType{
    USER,
    POST,
    PHOTO,
    EVENT,

}


public class Node{
    private String id;
    private String title;
    private NodeType type;
    private Object data;
}
public Node(String id, String title, NodeType type){

    this.id=id;
    this.title=title;
    this.type=type;

}
public String getTitle(){
    return title;
}
public void setTitle(String title){
    this.title=title;
}

public String getTitle(){
    return title;
}
public void setId(String id){
    this.id=id;
}
public String getType(){
    return type;
}
public void setType(NodeType type){
    this.type=type;
}
public Object getData(){
    return data;
}
public Object setData(Object data){
    this.data=data;

}