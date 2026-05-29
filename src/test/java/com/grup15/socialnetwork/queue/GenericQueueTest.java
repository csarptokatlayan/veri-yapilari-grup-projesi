package com.grup15.socialnetwork.queue;

import com.grup15.socialnetwork.datastructures.queue.GenericQueue;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class GenericQueueTest {

    /**
     * Yeni bir queue olusturuldugu zaman boş olmalidir.
     */
    @Test
    // @author Semih Tuncel
    public void newQueueStartsEmpty() {
        GenericQueue<String> queue = new GenericQueue<>();

        assertTrue(queue.isEmpty());
    }

    /**
     * Enqueue ve dequeue FIFO siralamayi korur boylece O(1) endpoint updates yapilir.
     */
    @Test
    // @author Semih Tuncel
    public void enqueueAndDequeuePreserveFifoOrder() {
        GenericQueue<String> queue = new GenericQueue<>();

        queue.enqueue("first");
        queue.enqueue("second");
        queue.enqueue("third");

        assertEquals("first", queue.dequeue());
        assertEquals("second", queue.dequeue());
        assertEquals("third", queue.dequeue());
    }

    /**
     * Peek en bastaki degeri dondurur boylece queue'den silinmez.
     */
    @Test
    // @author Semih Tuncel
    public void peekReturnsFrontWithoutRemovingIt() {
        GenericQueue<Integer> queue = new GenericQueue<>();

        queue.enqueue(10);
        queue.enqueue(20);

        assertEquals(10, queue.peek());
        assertFalse(queue.isEmpty());
        assertEquals(10, queue.dequeue());
    }

    /**
     * Bos peek ve dequeue null dondurur boylece queue'de node yoktur.
     */
    @Test
    // @author Semih Tuncel
    public void emptyQueuePeekAndDequeueReturnNull() {
        GenericQueue<String> queue = new GenericQueue<>();

        assertNull(queue.peek());
        assertNull(queue.dequeue());
    }

    /**
     * Sadece bir eleman silindiğinde queue'nin iki ucu da bos duruma gelir.
     */
    @Test
    // @author Semih Tuncel
    public void queueBecomesEmptyAfterSingleElementIsRemoved() {
        GenericQueue<String> queue = new GenericQueue<>();

        queue.enqueue("only");

        assertEquals("only", queue.dequeue());
        assertTrue(queue.isEmpty());
        assertNull(queue.peek());
    }

    /**
     * Null degerleri reddedilir boylece null bos bir sonucu temsil edebilir.
     */
    @Test
    // @author Semih Tuncel
    public void enqueueNullThrowsIllegalArgumentException() {
        GenericQueue<String> queue = new GenericQueue<>();

        assertThrows(IllegalArgumentException.class, () -> queue.enqueue(null));
    }
}
