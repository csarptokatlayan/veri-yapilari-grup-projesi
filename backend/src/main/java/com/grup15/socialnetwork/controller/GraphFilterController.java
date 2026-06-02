package com.grup15.socialnetwork.controller;

import com.grup15.socialnetwork.service.GraphFilterService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/filter")
public class GraphFilterController {

    private final GraphFilterService filterService;

    public GraphFilterController(GraphFilterService filterService) {
        this.filterService = filterService;
    }

    // Örn: GET /filter/node/type/USER
    @GetMapping("/node/type/{nodeType}")
    public ResponseEntity<Map<String, Object>> getNodesByType(@PathVariable String nodeType) {
        return ResponseEntity.ok(filterService.filterNodesByType(nodeType));
    }

    // Örn: GET /filter/node/property?key=age&value=20
    @GetMapping("/node/property")
    public ResponseEntity<Map<String, Object>> getNodesByProperty(
            @RequestParam String key,
            @RequestParam String value) {

        // Burada value'yu string olarak alıyoruz ama ileride yaş gibi sayısal
        // işlemler gerekirse parseInt ile Object dönüşümü yapılabilir.
        return ResponseEntity.ok(filterService.filterNodesByProperty(key, value));
    }

    // Örn: GET /filter/edge/type/FRIEND
    @GetMapping("/edge/type/{edgeType}")
    public ResponseEntity<Map<String, Object>> getEdgesByType(@PathVariable String edgeType) {
        return ResponseEntity.ok(filterService.filterEdgesByType(edgeType));
    }
}