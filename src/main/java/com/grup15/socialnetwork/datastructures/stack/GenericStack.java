package com.grup15.socialnetwork.datastructures.stack;

/**
 * @author Ahmet Efe Gençel
 * LIFO (Last In, First Out - Son Giren İlk Çıkar) mantığıyla çalışan
 * Generic yığıt (Stack) veri yapısı.
 */
public class GenericStack<T> {

    private Node<T> top; // Yığının en üstündeki eleman (Zirve)
    private int size;    // Yığındaki toplam eleman sayısı

    /*
     * İÇ DÜĞÜM (WRAPPER) SINIFI
     * Yığının her bir katmanını temsil eder. Dışarıdan erişime kapalıdır (private).
     */
    private static class Node<T> {
        T data;         // Katmandaki asıl veri (yolcu)
        Node<T> next;   // Bir alt katmana (önceki eklenen elemana) işaret eden kanca

        Node(T data) {
            this.data = data;
        }
    }

    /*
     * YIĞINA ELEMAN EKLEME (PUSH) - O(1) Karmaşıklığı
     * Yeni gelen eleman her zaman en üste (top) yerleşir ve
     * bir önceki zirve elemanını kendi altına alır.
     */
    public void push(T item) {
        Node<T> newNode = new Node<>(item);
        newNode.next = top; // Yeni elemanın altını, eski zirveye bağla
        top = newNode;      // Artık yeni zirve bu yeni eleman oldu
        size++;
    }

    /*
     * YIĞINDAN ELEMAN ÇIKARMA (POP) - O(1) Karmaşıklığı
     * En üstteki elemanı yığından alır ve tamamen çıkarır.
     * Zirve (top) değeri, silinen elemanın bir altındaki eleman olarak güncellenir.
     */
    public T pop() {
        if (isEmpty()) throw new RuntimeException("Stack is empty");
        T item = top.data;  // En üstteki veriyi kaybetmemek için yedekle
        top = top.next;     // Zirveyi bir alt katmana kaydır (eski zirveyi listeden kopar)
        size--;
        return item;        // Yedeklediğin veriyi döndür
    }

    /*
     * EN ÜSTTEKİ ELEMANA BAKMA (PEEK) - O(1) Karmaşıklığı
     * Pop metodundan farkı, elemanı yığından ÇIKARMAMASIDIR.
     * Sadece "Şu an zirvede kim var?" diye bakar ve veriyi okur.
     */
    public T peek() {
        if (isEmpty()) throw new RuntimeException("Stack is empty");
        return top.data;
    }

    // Yığın tamamen boş mu diye kontrol eder
    public boolean isEmpty() {
        return top == null;
    }

    // Yığının içindeki güncel eleman sayısını verir
    public int size() {
        return size;
    }
}