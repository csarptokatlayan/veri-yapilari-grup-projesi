package com.grup15.socialnetwork.controller;

import com.grup15.socialnetwork.service.ChainQueryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/chain") // apiyi kaldırdım
public class ChainQueryController {

    private final ChainQueryService chainQueryService;

    public ChainQueryController(ChainQueryService chainQueryService) {
        this.chainQueryService = chainQueryService;
    }

    // Path daha kısa, okunaklı ve öz hale getirildi
    @GetMapping("/{userId}/friends-likes")
    public ResponseEntity<Map<String, Object>> getFriendsLikedPosts(@PathVariable int userId) {
        Map<String, Object> result = chainQueryService.getFriendsLikedPosts(userId);
        return ResponseEntity.ok(result);
    }

    // Path daha kısa, okunaklı ve öz hale getirildi
    @GetMapping("/{userId}/friends-events")
    public ResponseEntity<Map<String, Object>> getFriendsAttendedEvents(@PathVariable int userId) {
        Map<String, Object> result = chainQueryService.getFriendsAttendedEvents(userId);
        return ResponseEntity.ok(result);
    }
}
