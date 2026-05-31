package com.grup15.socialnetwork.configuration;

import com.grup15.socialnetwork.datastructures.NodeRegistry;
import com.grup15.socialnetwork.datastructures.graph.BFS;
import com.grup15.socialnetwork.datastructures.graph.DFS;
import com.grup15.socialnetwork.datastructures.graph.Graph;
import com.grup15.socialnetwork.seed.FixedSocialNetworkSeed;
import com.grup15.socialnetwork.seed.SeedContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppBeans {
    @Bean
    public SeedContext seedContext() {
        return FixedSocialNetworkSeed.build();
    }
    @Bean
    public Graph graph(SeedContext context) {
        return context.getGraph();
    }
    @Bean
    public NodeRegistry nodeRegistry(SeedContext context) {
        return context.getRegistry();
    }
    @Bean
    public DFS dfs(Graph graph) {
        return new DFS(graph);
    }
    @Bean
    public BFS bfs(Graph graph) {
        return new BFS(graph);
    }
}
