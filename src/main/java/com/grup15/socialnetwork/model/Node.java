package com.grup15.socialnetwork.model;

import com.grup15.socialnetwork.datastructures.graph.hashtable.HashTable;

public class Node {

    private int id;
    private String title;
    private NodeType nodeType;

    /*
     * Hash table ozellik saklama yapisi.
     * Insert: O(1) ortalama, O(n) en kotu
     * Search: O(1) ortalama, O(n) en kotu
     * Delete: O(1) ortalama, O(n) en kotu
     */
    private HashTable<String, Object> properties;

    /**
     * Dugumun temel bilgilerini ve ozellik tablosunu baslatir.
     */
    // @author Semih Tuncel
    public Node(int id, String title, NodeType nodeType) {
        this.id = id;
        this.title = title;
        this.nodeType = nodeType;
        this.properties = new HashTable<>();
    }

    /**
     * Dugum kimligini O(1) erisimle dondurur.
     */
    // @author Semih Tuncel
    public int getID() {
        return id;
    }

    /**
     * Dugum kimligini gunceller.
     */
    // @author Semih Tuncel
    public void setID(int id) {
        this.id = id;
    }

    /**
     * Dugum basligini dondurur.
     */
    // @author Semih Tuncel
    public String getTitle() {
        return title;
    }

    /**
     * Dugum basligini gunceller.
     */
    // @author Semih Tuncel
    public void setTitle(String title) {
        this.title = title;
    }

    /**
     * Dugum turunu dondurur.
     */
    // @author Semih Tuncel
    public NodeType getNodeType() {
        return nodeType;
    }

    /**
     * Dugum turunu gunceller.
     */
    // @author Semih Tuncel
    public void setNodeType(NodeType nodeType) {
        this.nodeType = nodeType;
    }

    /**
     * Dugum ozelliklerini hizli anahtar erisimi icin hash table olarak dondurur.
     */
    // @author Semih Tuncel
    public HashTable<String, Object> getProperties() {
        return properties;
    }

    /**
     * Dugum ozellik tablosunu disaridan verilen hash table ile degistirir.
     */
    // @author Semih Tuncel
    public void setProperties(HashTable<String, Object> properties) {
        this.properties = properties;
    }
}
