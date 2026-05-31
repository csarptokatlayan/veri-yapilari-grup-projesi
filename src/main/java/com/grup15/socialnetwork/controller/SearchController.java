package com.grup15.socialnetwork.controller;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.grup15.socialnetwork.datastructures.trie.Trie;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // Frontend'in backend'e erişebilmesi için CORS izni
public class SearchController {

    // Gerçek projede bunu Spring @Service ile bağlayacaksın.
    // Şimdilik test edebilmen için singleton veya statik referans gibi düşünebilirsin.
    private final Trie trie = new Trie();

    @GetMapping("/search")
    public ResponseEntity<List<String>> searchByPrefix(@RequestParam String prefix) {
        if (prefix == null || prefix.trim().isEmpty()) {
            return ResponseEntity.ok(List.of());
        }

        // K3 görevinde yazdığın metodu tetikliyoruz
        List<String> matchedNodeIds = trie.searchByPrefix(prefix);
        return ResponseEntity.ok(matchedNodeIds);
    }
}


