package com.grup15.socialnetwork.controller;

import com.grup15.socialnetwork.services.ChainQueryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/query")
@CrossOrigin(origins = "*") // Semih'in localhost:5173'üne izin veriyoruz
public class ChainQueryController {

    private final ChainQueryService chainQueryService;

    public ChainQueryController(ChainQueryService chainQueryService) {
        this.chainQueryService = chainQueryService;
    }

    @GetMapping("/friends-liked-posts/{userId}")
    public ResponseEntity<Map<String, Object>> getFriendsLikedPosts(@PathVariable int userId) {
        Map<String, Object> result = chainQueryService.getFriendsLikedPosts(userId);
        return ResponseEntity.ok(result);
    }

    // URL ve metot adı yeni mantığa (Arkadaşların katıldığı etkinlikler) uyarlandı
    @GetMapping("/friends-attended-events/{userId}")
    public ResponseEntity<Map<String, Object>> getFriendsAttendedEvents(@PathVariable int userId) {
        Map<String, Object> result = chainQueryService.getFriendsAttendedEvents(userId);
        return ResponseEntity.ok(result);
    }
}