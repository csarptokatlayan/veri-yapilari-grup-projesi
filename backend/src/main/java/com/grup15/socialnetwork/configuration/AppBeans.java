package com.grup15.socialnetwork.configuration;

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
    public SeedContext seedContext()
    {
        return FixedSocialNetworkSeed.build();
    }

    @Bean
    public DFS dfs()
    {
        return new DFS(seedContext().getGraph());
    }

    @Bean
    public BFS bfs()
    {
        return new BFS(seedContext().getGraph());
    }

}
