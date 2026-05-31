package com.grup15.socialnetwork.service;

import com.grup15.socialnetwork.datastructures.graph.BFS;
import com.grup15.socialnetwork.datastructures.graph.DFS;
import com.grup15.socialnetwork.datastructures.graph.Graph;
import com.grup15.socialnetwork.datastructures.list.CustomLinkedList;
import com.grup15.socialnetwork.model.Node;
import com.grup15.socialnetwork.seed.SeedContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


@Service
@RequiredArgsConstructor
public class TraversalService {

    final SeedContext seedContext;
    final BFS bfs;
    final DFS dfs;

    public List<Node> runBFS(Integer startNodeId)
    {
        Node startNode = seedContext.getGraph().ahmetEfe_findNodeById(startNodeId);

        if(startNode == null)
        {
            return new ArrayList<>();
        }

        return bfs.bfsTraversal(startNode);
    }

    public List<Node> runDFS(Integer startNodeId)
    {
        Node startNode = seedContext.getGraph().ahmetEfe_findNodeById(startNodeId);

        if(startNode == null)
        {
            return new ArrayList<>();
        }

        return dfs.fatih_dfsIterative(startNode);
    }

}