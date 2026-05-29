package com.grup15.socialnetwork.services;

import com.grup15.socialnetwork.datastructures.graph.BFS;
import com.grup15.socialnetwork.datastructures.graph.Graph;
import com.grup15.socialnetwork.datastructures.list.CustomLinkedList;
import com.grup15.socialnetwork.model.Node;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class TraversalService {

    final Graph graph;
    final BFS bfs;

    public CustomLinkedList<Node> runBFS(Integer startNodeId)
    {
        Node startNode = graph.ahmetEfe_findNodeById(startNodeId);

        if(startNode == null)
        {
            return new CustomLinkedList<Node>();
        }

        return bfs.bfsTraversal(startNode);
    }

}