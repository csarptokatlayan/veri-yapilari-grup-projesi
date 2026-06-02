package com.grup15.socialnetwork.controller;

import com.grup15.socialnetwork.service.SearchService;
import com.grup15.socialnetwork.service.TraversalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/nodes")
@RequiredArgsConstructor
public class NodeController {

    final TraversalService traversalService;
    final SearchService searchService;

    @GetMapping("/{id}/neighbors")
    public ResponseEntity<Map<String, Object>> getNeighbors(@PathVariable Integer id) {
        Map<String, Object> result = traversalService.getNeighbors(id);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Map<String, Object>>> search(@RequestParam("q") String query) {
        List<Map<String, Object>> results = searchService.searchNodes(query);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/init/{id}")
    public ResponseEntity<Map<String, Object>> getInit(@PathVariable Integer id) {
        Map<String, Object> result = traversalService.getInitialGraph(id);
        return ResponseEntity.ok(result);
    }
}