package com.grup15.socialnetwork.controller;

import com.grup15.socialnetwork.service.TraversalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/nodes")
@RequiredArgsConstructor
public class NodeController {

    private final TraversalService traversalService;

    @GetMapping("/{id}/neighbors")
    public ResponseEntity<Map<String, Object>> getNeighbors(@PathVariable Integer id) {
        Map<String, Object> result = traversalService.getNeighbors(id);
        return ResponseEntity.ok(result);
    }
}