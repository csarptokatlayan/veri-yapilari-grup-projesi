package com.grup15.socialnetwork.configuration;

import com.grup15.socialnetwork.datastructures.graph.BFS;
import com.grup15.socialnetwork.datastructures.graph.DFS;
import com.grup15.socialnetwork.datastructures.graph.Graph;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppBeans {

    @Bean
    public Graph graph()
    {
        return new Graph();
    }

    @Bean
    public DFS dfs()
    {
        return new DFS(graph());
    }

    @Bean
    public BFS bfs()
    {
        return new BFS(graph());
    }

}
