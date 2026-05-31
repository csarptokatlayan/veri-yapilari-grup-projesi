package com.grup15.socialnetwork.datastructures.hashtable;

import java.util.Iterator;
import java.util.LinkedList;

public class HashTable<K, V> {

    private static final int DEFAULT_CAPACITY = 16;
    private static final double MAX_LOAD_FACTOR = 0.75;

    private LinkedList<Entry<K, V>>[] buckets;

    private int size;

    /**
     * Varsayilan kapasite ile bos bir hash table olusturur.
     */
    // @author Semih Tuncel
    public HashTable() {
        this(DEFAULT_CAPACITY);
    }

    /**
     * Verilen kapasite ile bos bir hash table olusturur.
     */
    // @author Semih Tuncel
    public HashTable(int initialCapacity) {
        validateCapacity(initialCapacity);
        this.buckets = createBuckets(initialCapacity);
        this.size = 0;
    }

    /**
     * Anahtar varsa degeri gunceller, yoksa yeni anahtar-deger ciftini ekler.
     */
    // @author Semih Tuncel
    public synchronized void put(K key, V value) {
        validateKey(key);
        validateValue(value);

        Entry<K, V> existingEntry = findEntry(key);
        if (existingEntry != null) {
            existingEntry.value = value;
            return;
        }

        if (willExceedLoadFactor()) {
            resize();
        }

        int index = bucketIndex(key);
        buckets[index].add(new Entry<>(key, value));
        size++;
    }

    /**
     * Verilen anahtarin degerini bulur, yoksa null dondurur.
     */
    // @author Semih Tuncel
    public synchronized V get(K key) {
        validateKey(key);

        Entry<K, V> entry = findEntry(key);
        if (entry == null) {
            return null;
        }

        return entry.value;
    }

    /**
     * Verilen anahtari kendi zincirinde arar ve bulursa siler.
     */
    // @author Semih Tuncel
    public synchronized V remove(K key) {
        validateKey(key);

        int index = bucketIndex(key);
        Iterator<Entry<K, V>> iterator = buckets[index].iterator();

        while (iterator.hasNext()) {
            Entry<K, V> entry = iterator.next();
            if (entry.key.equals(key)) {
                iterator.remove();
                size--;
                return entry.value;
            }
        }

        return null;
    }

    /**
     * Verilen anahtarin tabloda olup olmadigini kontrol eder.
     */
    // @author Semih Tuncel
    public synchronized boolean containsKey(K key) {
        validateKey(key);
        return findEntry(key) != null;
    }

    /**
     * Tablodaki kayit sayisini O(1) olarak dondurur.
     */
    // @author Semih Tuncel
    public synchronized int size() {
        return size;
    }

    /**
     * Mevcut bucket sayisini dondurur.
     */
    // @author Semih Tuncel
    public synchronized int capacity() {
        return buckets.length;
    }

    /**
     * Her bucket icin bos LinkedList olusturan yeni bucket dizisi kurar.
     */
    @SuppressWarnings("unchecked")
    // @author Semih Tuncel
    private LinkedList<Entry<K, V>>[] createBuckets(int capacity) {
        LinkedList<Entry<K, V>>[] newBuckets = new LinkedList[capacity];

        for (int i = 0; i < newBuckets.length; i++) {
            newBuckets[i] = new LinkedList<>();
        }

        return newBuckets;
    }

    /**
     * Verilen anahtari ilgili bucket zincirinde arar.
     */
    // @author Semih Tuncel
    private Entry<K, V> findEntry(K key) {
        int index = bucketIndex(key);

        for (Entry<K, V> entry : buckets[index]) {
            if (entry.key.equals(key)) {
                return entry;
            }
        }

        return null;
    }

    /**
     * Anahtarin hash degerinden negatif olmayan bucket indeksi hesaplar.
     */
    // @author Semih Tuncel
    private int bucketIndex(K key) {
        return Math.floorMod(key.hashCode(), buckets.length);
    }

    /**
     * Yeni kayit eklenirse load factor sinirinin asilip asilmayacagini kontrol eder.
     */
    // @author Semih Tuncel
    private boolean willExceedLoadFactor() {
        double nextLoadFactor = (double) (size + 1) / buckets.length;
        return nextLoadFactor > MAX_LOAD_FACTOR;
    }

    /**
     * Kapasiteyi iki katina cikarir ve kayitlari yeni bucketlara yeniden dagitir.
     */
    // @author Semih Tuncel
    private void resize() {
        LinkedList<Entry<K, V>>[] oldBuckets = buckets;
        buckets = createBuckets(oldBuckets.length * 2);

        for (LinkedList<Entry<K, V>> bucket : oldBuckets) {
            for (Entry<K, V> entry : bucket) {
                int index = bucketIndex(entry.key);
                buckets[index].add(entry);
            }
        }
    }

    /**
     * Gecersiz kapasite gelirse indeksleme bozulmasin diye hata firlatir.
     */
    // @author Semih Tuncel
    private void validateCapacity(int capacity) {
        if (capacity <= 0) {
            throw new IllegalArgumentException("Initial capacity must be positive.");
        }
    }

    /**
     * Null anahtar gelirse hash hesaplanamayacagi icin hata firlatir.
     */
    // @author Semih Tuncel
    private void validateKey(K key) {
        if (key == null) {
            throw new IllegalArgumentException("Key cannot be null.");
        }
    }

    /**
     * Null deger gelirse get sonucunu belirsiz yapmamasi icin hata firlatir.
     */
    // @author Semih Tuncel
    private void validateValue(V value) {
        if (value == null) {
            throw new IllegalArgumentException("Value cannot be null.");
        }
    }

    /**
     * Entry, bir anahtar ile bir degeri ayni bucket zincirinde saklar.
     */
    private static class Entry<K, V> {

        private final K key;
        private V value;

        /**
         * Bir anahtar ile bir degeri ayni kayitta tutar.
         */
        // @author Semih Tuncel
        private Entry(K key, V value) {
            this.key = key;
            this.value = value;
        }
    }
}
