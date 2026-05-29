package com.grup15.socialnetwork.datastructures.queue;

/*
 * Insert/enqueue: O(1)
 * Delete/dequeue: O(1)
 * Peek/isEmpty: O(1)
 */
public class GenericQueue<T> {

    private QueueNode<T> front;
    private QueueNode<T> rear;

    /**
     * Bos bir queue olusturur boylece enqueue ve dequeue O(1) kalir.
     */
    // @author Semih Tuncel
    public GenericQueue() {
        this.front = null;
        this.rear = null;
    }

    /**
     * Bir deger ekler boylece FIFO siralama gerektigi icin sonuna ekler.
     */
    // @author Semih Tuncel
    public synchronized void enqueue(T value) {
        validateValue(value);

        QueueNode<T> newNode = new QueueNode<>(value);
        if (rear == null) {
            front = newNode;
            rear = newNode;
            return;
        }

        rear.next = newNode;
        rear = newNode;
    }

    /**
     * En bastaki degeri siler boylece en eski eklenen deger dondurulur.
     */
    // @author Semih Tuncel
    public synchronized T dequeue() {
        if (front == null) {
            return null;
        }

        T value = front.value;
        front = front.next;

        if (front == null) {
            rear = null;
        }

        return value;
    }

    /**
     * En bastaki degeri okur boylece en eski eklenen deger dondurulur.
     */
    // @author Semih Tuncel
    public synchronized T peek() {
        if (front == null) {
            return null;
        }

        return front.value;
    }

    /**
     * Queue bos mu diye kontrol eder boylece O(1) empty state kontrolu yapilir.
     */
    // @author Semih Tuncel
    public synchronized boolean isEmpty() {
        return front == null;
    }

    /**
     * Null degerleri reddeder boylece null bos bir dequeue veya peek sonucu temsil edebilir.
     */
    // @author Semih Tuncel
    private void validateValue(T value) {
        if (value == null) {
            throw new IllegalArgumentException("Queue value cannot be null.");
        }
    }

    /**
     * QueueNode bir degeri ve bir sonraki linki saklar boylece FIFO siralama desteklenir.
     */
    private static class QueueNode<T> {

        private final T value;
        private QueueNode<T> next;

        /**
         * Bir degeri saklar boylece nodes birbirine baglanabilir array resizing gerektirmez.
         */
        // @author Semih Tuncel
        private QueueNode(T value) {
            this.value = value;
            this.next = null;
        }
    }
}
