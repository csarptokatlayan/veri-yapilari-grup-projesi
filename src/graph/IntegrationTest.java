import edge.EdgeType;
import node.NodeType;

public class IntegrationTest{
    public static void main(String[] args){
        Graph socialNetwork=new Graph();
        for(int i=1;i<=16;i++){
            Node user=new Node("u" + i, NodeType.USER);
            socialNetwork.addNode(user);
        }
        socialNetwork.addEdge("u1", "u2", EdgeType.FRIEND, false); //Yönsüz
        socialNetwork.addEdge("u1", "u3", EdgeType.LIKES, true);   //Yönlü

        Node testNode=socialNetwork.findNodeById("u1");
        System.out.println("Node: " + testNode.getTitle());
        System.out.println("Out Degree: " + socialNetwork.getOutDegree(testNode));
        System.out.println("InDegree: "+ socialNetwork.getInDegree(testNode));

    }
}