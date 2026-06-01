package com.grup15.socialnetwork.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ShortestPathResponse {

    private List<Integer> path;
    private int distance;

}
