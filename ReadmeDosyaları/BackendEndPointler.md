# 📖 Social Network API Dokümantasyonu

Bu API, sosyal ağ üzerindeki düğümler (Kullanıcı, Post, Event) ve aralarındaki ilişkiler (FRIEND, LIKES, ATTENDS) üzerinde gezinme, filtreleme ve analiz işlemleri sunar. Grafik arayüz (Cytoscape) için çıktıların çoğu `{ nodes, edges }` JSON formatında döner.

## 1. Gezinme (Traversal) Algoritmaları

Verilen bir düğümden başlayarak graf üzerindeki bağlantıları hiçbir filtreleme yapmadan sonuna kadar tarar.

* **BFS (Genişlik Öncelikli Arama)**
* **Method:** `GET`
* **Path:** `/traversal/bfs/{startId}`
* **Çıktı:** `{ nodes, edges }` objesi (Map)
* **Açıklama:** Belirtilen ID'den başlayarak ağı dalga dalga (seviye seviye) tarar.


* **DFS (Derinlik Öncelikli Arama)**
* **Method:** `GET`
* **Path:** `/traversal/dfs/{startId}`
* **Çıktı:** `{ nodes, edges }` objesi (Map)
* **Açıklama:** Belirtilen ID'den başlayarak ağı derinlemesine tarar.



## 2. Dinamik Ağ Keşfi (Filtreli Gezinme)

Arayüzden gelen parametrelere göre kısıtlanmış (Derinlik, İlişki Tipi, Hedef Tipi) akıllı arama algoritmalarıdır.

* **Dinamik Zincir (BFS Tabanlı)**
* **Method:** `GET`
* **Path:** `/traversal/dynamic-chain-bfs`
* **Parametreler:** `startId` (Zorunlu), `edgeType` (Ops), `targetType` (Ops), `depth` (Ops, Default: 1)
* **Örnek İstek:** `http://localhost:8080/traversal/dynamic-chain-bfs?startId=1&depth=2&edgeType=FRIEND`
* **Çıktı:** `{ nodes, edges }` objesi (Map)


* **Dinamik Zincir (DFS Tabanlı)**
* **Method:** `GET`
* **Path:** `/traversal/dynamic-chain-dfs`
* **Parametreler:** Yukarıdaki ile birebir aynı parametreleri alır.
* **Örnek İstek:** `http://localhost:8080/traversal/dynamic-chain-dfs?startId=1&depth=2&edgeType=FRIEND`
* **Çıktı:** `{ nodes, edges }` objesi (Map)



## 3. Zincirleme (Chain) Şablonları

Önceden tanımlanmış "A -> B -> C" şeklindeki spesifik iş kurallarını (Öneri motoru) çalıştırır.

* **Arkadaşların Beğendiği Gönderiler**
* **Method:** `GET`
* **Path:** `/chain/{userId}/friends-likes`
* **Örnek İstek:** `http://localhost:8080/chain/1/friends-likes`
* **Çıktı:** `{ nodes, edges }` objesi (Map)
* **Açıklama:** Kullanıcının arkadaşlarını bulur, o arkadaşların beğendiği gönderileri getirir.


* **Arkadaşların Katıldığı Etkinlikler**
* **Method:** `GET`
* **Path:** `/chain/{userId}/friends-events`
* **Örnek İstek:** `http://localhost:8080/chain/1/friends-events`
* **Çıktı:** `{ nodes, edges }` objesi (Map)
* **Açıklama:** Kullanıcının arkadaşlarını bulur, o arkadaşların katıldığı etkinlikleri getirir.



## 4. Analiz ve Hesaplama

* **İki Düğüm Arasındaki En Kısa Yol (Shortest Path)**
* **Method:** `GET`
* **Path:** `/traversal/shortest-path`
* **Parametreler:** `from` (Başlangıç ID), `to` (Bitiş ID)
* **Örnek İstek:** `http://localhost:8080/traversal/shortest-path?from=1&to=5`
* **Çıktı:**
```json
{
  "path": [1, 2, 3, 4, 5],
  "distance": 4
}

```

## 5. Düğüm (Node) ve Arayüz İşlemleri

* **Komşuları Getir (Tıklama / Expand)**
* **Method:** `GET`
* **Path:** `/nodes/{id}/neighbors`
* **Örnek İstek:** `http://localhost:8080/nodes/3/neighbors`
* **Çıktı:** `{ nodes, edges }` objesi (Map)
* **Açıklama:** Arayüzde bir düğüme tıklandığında sadece o düğümün 1. derece (doğrudan bağlı) komşularını döndürür.



## 6. Arama (Search - Trie)

* **Method:** `GET`
* **Path:** `/nodes/search`
* **Parametre:** `q` (Aranan kelime)
* **Örnek İstek:** `http://localhost:8080/nodes/search?q=Ah`
* **Çıktı:** `[{ "id": 2, "title": "Ahmet Efe", "type": "USER" }]` (Liste)
* **Açıklama:** Trie veri yapısı ile harf bazlı (prefix) hızlı arama yapar, eşleşen düğümlerin özet bilgilerini döndürür.



## 7. Veri Filtreleme (Filters)

Grafik üzerindeki verileri tipine, özelliklerine veya ilişkilerine göre süzerek getiren API uçlarıdır. Aranan kriter bulunamazsa hata fırlatmaz, boş liste döner.

* **Düğüm Tipine Göre Filtreleme**
    * **Method:** `GET`
    * **Path:** `/filter/node/type/{nodeType}`
    * **Örnek İstek:** `http://localhost:8080/filter/node/type/USER`
    * **Çıktı:** `{ "nodes": [...] }` objesi
    * **Açıklama:** Graf içindeki belirtilen tipteki (USER, POST, EVENT vb.) tüm düğümleri listeler.
    * **Zaman Karmaşıklığı:** $O(V)$ - Tüm düğümler (Vertices) taranır.

* **Özelliğe (Property) Göre Filtreleme**
    * **Method:** `GET`
    * **Path:** `/filter/node/property`
    * **Parametreler:** `key` (Özellik adı), `value` (Değer)
    * **Örnek İstek:** `http://localhost:8080/filter/node/property?key=age&value=21`
    * **Çıktı:** `{ "nodes": [...] }` objesi
    * **Açıklama:** Düğümlerin Hash Table yapısında tutulan `properties` verilerine göre filtreleme yapar.
    * **Zaman Karmaşıklığı:** $O(V)$ - Düğüm sayısı kadar gezinip Hash Table üzerinde sabit $O(1)$ sürede arama yapılır.

* **İlişki (Edge) Tipine Göre Filtreleme**
    * **Method:** `GET`
    * **Path:** `/filter/edge/type/{edgeType}`
    * **Örnek İstek:** `http://localhost:8080/filter/edge/type/FRIEND`
    * **Çıktı:** `{ "edges": [...] }` objesi
    * **Açıklama:** Graf üzerindeki tüm bağlantıları tarar ve sadece istenilen türdeki ilişkileri döndürür.
    * **Zaman Karmaşıklığı:** $O(V+E)$ - Tüm düğümlerin kenar (Edge) listeleri taranır.