package com.grup15.socialnetwork.controller;

import com.grup15.socialnetwork.datastructures.list.CustomLinkedList;
import com.grup15.socialnetwork.dto.ShortestPathResponse;
import com.grup15.socialnetwork.model.Node;
import com.grup15.socialnetwork.service.TraversalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/traversal")
@RequiredArgsConstructor
public class TraversalController {

    final TraversalService traversalService;

    @GetMapping("/bfs/{startId}")
    public ResponseEntity bfs(@PathVariable Integer startId)
    {

        Map<String,Object> result = traversalService.runBFS(startId);

        return ResponseEntity.ok().body(result);
    }

    @GetMapping("/dfs/{startId}")
    public ResponseEntity dfs(@PathVariable Integer startId)
    {
        Map<String,Object> result = traversalService.runDFS(startId);

        return ResponseEntity.ok().body(result);
    }

    @GetMapping("/shortest-path")
    public ResponseEntity<ShortestPathResponse> getShortestPath(
            @RequestParam("from") Integer fromId,
            @RequestParam("to") Integer toId) {

        ShortestPathResponse response = traversalService.shortestPath(fromId, toId);

        if (response.getDistance() == -1) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/dynamic-chain-bfs")
    public ResponseEntity<Map<String, Object>> getDynamicChain(
            @RequestParam("startId") Integer startId,
            @RequestParam(value = "edgeType", required = false) String edgeType,
            @RequestParam(value = "targetType", required = false) String targetType,
            @RequestParam(value = "depth", defaultValue = "1") Integer depth) {

        if ("".equals(edgeType)) edgeType = null;
        if ("".equals(targetType)) targetType = null;

        Map<String, Object> result = traversalService.getDynamicChainBfs(startId, edgeType, targetType, depth);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/dynamic-chain-dfs")
    public ResponseEntity<Map<String, Object>> getDynamicChainDfs(
            @RequestParam("startId") Integer startId,
            @RequestParam(value = "edgeType", required = false) String edgeType,
            @RequestParam(value = "targetType", required = false) String targetType,
            @RequestParam(value = "depth", defaultValue = "1") Integer depth) {

        if ("".equals(edgeType)) edgeType = null;
        if ("".equals(targetType)) targetType = null;

        Map<String, Object> result = traversalService.getDynamicChainDfs(startId, edgeType, targetType, depth);
        return ResponseEntity.ok(result);
    }

}
