package com.grup15.socialnetwork.controller;

import com.grup15.socialnetwork.datastructures.list.CustomLinkedList;
import com.grup15.socialnetwork.model.Node;
import com.grup15.socialnetwork.service.TraversalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/traversal")
@RequiredArgsConstructor
public class TraversalController {

    final TraversalService traversalService;

    @GetMapping("/bfs/{startId}")
    public ResponseEntity bfs(@PathVariable Integer startId)
    {
        List<Node> result = traversalService.runBFS(startId);

        return ResponseEntity.ok().body(result);
    }

    @GetMapping("/dfs/{startId}")
    public ResponseEntity dfs(@PathVariable Integer startId)
    {
        List<Node> result = traversalService.runDFS(startId);

        return ResponseEntity.ok().body(result);
    }

}
