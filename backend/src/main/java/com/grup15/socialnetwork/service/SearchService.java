package com.grup15.socialnetwork.service;

import com.grup15.socialnetwork.model.Node;
import com.grup15.socialnetwork.seed.SeedContext;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class SearchService {

    final SeedContext seedContext;

    public List<Map<String,Object>> searchNodes(String q)
    {
        List<String> foundIds = seedContext.getTrie().searchByPrefix(q);

        List<Map<String, Object>> formattedResults = new ArrayList<>();

        for (String idStr : foundIds) {
            Node node = seedContext.getGraph().ahmetEfe_findNodeById(Integer.parseInt(idStr));

            if (node != null) {
                formattedResults.add(Map.of(
                        "id", node.getID(),
                        "title", node.getTitle(),
                        "type", node.getNodeType().name()
                ));
            }
        }

        return formattedResults;
    }

}
