package com.grup15.socialnetwork.datastructures.graph.trie;

import java.util.*;

public class TrieNode {
    //Karakterleri ve alt düğümleri tutar
    public Map<Character, TrieNode>
            children= new HashMap<>();
    //Kelimenin (veya prefix'in) bittiği yer mi?
    public boolean isEnd;
    //main.java.com.grup15.socialnetwork.node id'lerini leaf'te tutma kuralı
    public List<String> ids =new ArrayList<>();
}
