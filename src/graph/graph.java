package graph;

import node.Node;

public class graph {
     public static void main(String[] args) {
        System.out.println("gencel bey kodu yazınca startı vereceğim");}
    public int getDegree(Node n){
         if(!n.isDirected()){
             return getNeighbors(n).size();
         }
         return getInDegree(n)+getOutDegree(n);
    }
    public int getInDegree(Node n){
         int count=0;
         for(Node node : allNodes){
             for(Edge edge : node.get.Edges()){
                 if(edge.getDestination().equals(n)){
                     count++;
                 }
             }
         }
         return count;
    }
    public int getOutDegree(Node n){
         return n.getEdges().size();
    }
}

