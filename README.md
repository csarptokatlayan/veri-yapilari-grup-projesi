# veri-yapilari-grup-projesi
Property Graph Tabanlı Sosyal Ağ Modelleme Projesi
(sosyal medya benzeri)

## 📊 Algoritma Zaman ve Alan Karmaşıklığı (Big-O) Analiz
Proje kapsamında uygulanan grafik algoritmalarının zaman (Time Complexity) ve alan (Space Complexity) karmaşıklıkları aşağıdaki tabloda özetlenmiştir:

| Algoritma | Zaman Karmaşıklığı (Time Complexity) | Alan Karmaşıklığı (Space Complexity) | Açıklama / En Kötü Durum (Worst Case) |
| :--- | :---: | :---: | :--- |
| **BFS (Breadth-First Search)** | $O(V + E)$ | $O(V)$ | Tüm düğüm ($V$) ve kenarlar ($E$) taranır. Kuyruk (Queue) yapısı kullanılır. |
| **DFS (Depth-First Search)** | $O(V + E)$ | $O(V)$ | Derinlemesine tarama yapar. Çağrı yığını (Call Stack) hafızada yer tutar. |
| **Shortest Path (En Kısa Yol)** | $O(V + E)$ | $O(V)$ | Ağırlıksız grafiklerde BFS tabanlı en kısa yol bulma algoritmasıdır. |
| **Degrees (Düğüm Dereceleri)** | $O(V)$ veya $O(1)$ | $O(1)$ | Adjacency List yapısında dereceyi bulmak komşuluk listesinin uzunluğuna bağlıdır. |
| **Trie Prefix Search (Arama Barı)** | $O(L)$ | $O(Σ \cdot L)$ | Aranan kelimenin uzunluğu ($L$) kadar adım atılır. Alfabe boyutu ($Σ$) alan karmaşıklığını etkiler. |

> 📌 **Not:** $V$ grafikteki toplam Düğüm (Vertex) sayısını, $E$ ise toplam Bağlantı/Kenar (Edge) sayısını temsil etmektedir.