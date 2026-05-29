package com.grup15.socialnetwork.datastructures.list;

/*
@author Ahmet Efe Gençel
 */

public class CustomLinkedList<T> {

    private Node<T> head; // Listenin başı (ilk vagon)
    private Node<T> tail; // Listenin sonu (son vagon - O(1) hızında ekleme yapmak için tutuyoruz)
    private int size;     // Listenin güncel eleman sayısı

    /* * İÇ DÜĞÜM (WRAPPER) SINIFI
     * Listenin kendi iç yapısıdır. Projenin ana Node'u ile karışmaması için
     * 'private static' yapılmıştır. Dışarıdan kimse bu vagonları göremez,
     * sadece içindeki 'data' ile ilgilenir.
     */
    private static class Node<T> {
        T data;         // Vagondaki yolcu (Senin kendi Node'un veya int ID olabilir)
        Node<T> next;   // Bir sonraki vagona bağlayan kanca

        Node(T data) {
            this.data = data;
        }
    }

    // Yapıcı Metot: Liste ilk oluştuğunda boş bir tren rayı gibidir.
    public CustomLinkedList() {
        this.head = null;
        this.tail = null;
        this.size = 0;
    }

    /*
     * LİSTEYE ELEMAN EKLEME (O(1) Karmaşıklığı)
     * 'tail' (kuyruk) değişkenini tuttuğumuz için en sondaki vagonu bulmak için
     * en baştan itibaren dönmemize gerek kalmıyor. Direkt son vagonun arkasına takıyoruz.
     */
    public void add(T item) {
        Node<T> newNode = new Node<>(item);
        if (tail == null) {
            // Eğer liste tamamen boşsa, yeni gelen eleman hem baştır hem sondur.
            head = tail = newNode;
        } else {
            // Liste doluysa, son vagonun kancasını yeni vagona tak ve kuyruğu güncelle.
            tail.next = newNode;
            tail = newNode;
        }
        size++;
    }

    /*
     * İNDEKSE GÖRE ELEMAN GETİRME (O(N) Karmaşıklığı)
     * LinkedList'in doğası gereği 5. elemana direkt zıplayamayız.
     * Baştan başlayıp vagonları tek tek sayarak ilerlememiz gerekir.
     */
    public T get(int index) {
        if (index < 0 || index >= size) {
            throw new IndexOutOfBoundsException("Index: " + index);
        }
        Node<T> current = head;
        for (int i = 0; i < index; i++) {
            current = current.next; // İstenen sıraya kadar vagon atla
        }
        return current.data; // İstenen vagondaki yolcuyu ver
    }

    /*
     * LİSTEYİ TERSİNE ÇEVİRME (O(N) Karmaşıklığı)
     * BFS'de hedefi bulduğumuzda geri geri giderek "En Kısa Yolu" (Path) çizeriz.
     * Yol tersten oluştuğu için, en son bu metodu çağırıp yolu düzeltiriz.
     * Vagonların birbirine olan kancalarının yönünü tam tersine çevirir.
     */
    public void reverse() {
        Node<T> prev = null;
        Node<T> current = head;
        tail = head; // Eski baş, artık yeni kuyruk olacak

        while (current != null) {
            Node<T> next = current.next; // Bağlantıyı koparmadan önce sonrakini yedekle
            current.next = prev;         // Oku geriye doğru çevir
            prev = current;              // Bir adım ilerle
            current = next;              // Bir adım ilerle
        }
        head = prev; // En son geldiğimiz yer yeni başımız oldu
    }

    public boolean isEmpty() { return size == 0; }
    public int size() { return size; }

    /*
     * ITERATOR (YİNELEYİCİ) EKLENTİSİ
     * Bu metot sayesinde Java'nın "for (T item : customList)" döngüsünü
     * bizim kendi uydurduğumuz bu listede de hata almadan kullanabileceksin.
     */
    public java.util.Iterator<T> iterator() {
        return new java.util.Iterator<T>() {
            Node<T> current = head;

            // Sonraki vagon var mı?
            public boolean hasNext() {
                return current != null;
            }

            // İçindeki veriyi ver ve bir sonraki vagona geç
            public T next() {
                T data = current.data;
                current = current.next;
                return data;
            }
        };
    }
}