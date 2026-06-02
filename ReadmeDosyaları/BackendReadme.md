# 📖 Social Network API Dokümantasyonu

Bu API, sosyal ağ üzerindeki düğümler (Kullanıcı, Post, Event) ve aralarındaki ilişkiler (FRIEND, LIKES, ATTENDS) üzerinde gezinme, filtreleme ve analiz işlemleri sunar. Grafik arayüz (Cytoscape) için çıktıların çoğu `{ nodes, edges }` JSON formatında döner.

## 1. Gezinme (Traversal) Algoritmaları

Verilen bir düğümden başlayarak graf üzerindeki bağlantıları hiçbir filtreleme yapmadan sonuna kadar tarar.

* **BFS (Genişlik Öncelikli Arama)**
* **Method:** `GET`
* **Path:** `/traversal/bfs/{id}`
* **Çıktı:** `{ nodes, edges }` objesi (Map)
* **Açıklama:** Belirtilen ID'den başlayarak ağı dalga dalga (seviye seviye) tarar.


* **DFS (Derinlik Öncelikli Arama)**
* **Method:** `GET`
* **Path:** `/traversal/dfs/{id}`
* **Çıktı:** `{ nodes, edges }` objesi (Map)
* **Açıklama:** Belirtilen ID'den başlayarak ağı derinlemesine tarar.



## 2. Dinamik Ağ Keşfi (Filtreli Gezinme)

Arayüzden gelen parametrelere göre kısıtlanmış (Derinlik, İlişki Tipi, Hedef Tipi) akıllı arama algoritmalarıdır.

* **Dinamik Zincir (BFS Tabanlı)**
* **Method:** `GET`
* **Path:** `/traversal/dynamic-chain-bfs`
* **Parametreler:** `startId` (Zorunlu), `edgeType` (Ops), `targetType` (Ops), `depth` (Ops, Default: 1)
* **Örnek:** `/traversal/dynamic-chain-bfs?startId=1&depth=2&edgeType=FRIEND`
* **Çıktı:** `{ nodes, edges }` objesi (Map)


* **Dinamik Zincir (DFS Tabanlı)**
* **Method:** `GET`
* **Path:** `/traversal/dynamic-chain-dfs`
* **Parametreler:** Yukarıdaki ile birebir aynı parametreleri alır.
* **Çıktı:** `{ nodes, edges }` objesi (Map)



## 3. Zincirleme (Chain) Şablonları

Önceden tanımlanmış "A -> B -> C" şeklindeki spesifik iş kurallarını (Öneri motoru) çalıştırır.

* **Arkadaşların Beğendiği Gönderiler**
* **Method:** `GET`
* **Path:** `/chain/{userId}/friends-likes`
* **Çıktı:** `{ nodes, edges }` objesi (Map)
* **Açıklama:** Kullanıcının arkadaşlarını bulur, o arkadaşların beğendiği gönderileri getirir.


* **Arkadaşların Katıldığı Etkinlikler**
* **Method:** `GET`
* **Path:** `/chain/{userId}/friends-events`
* **Çıktı:** `{ nodes, edges }` objesi (Map)
* **Açıklama:** Kullanıcının arkadaşlarını bulur, o arkadaşların katıldığı etkinlikleri getirir.



## 4. Analiz ve Hesaplama

* **İki Düğüm Arasındaki En Kısa Yol (Shortest Path)**
* **Method:** `GET`
* **Path:** `/traversal/shortest-path`
* **Parametreler:** `from` (Başlangıç ID), `to` (Bitiş ID)
* **Örnek İstek:** `/traversal/shortest-path?from=1&to=5`
* **Çıktı:**
```json
{
  "path": [1, 2, 3, 4, 5],
  "distance": 4
}

```





## 5. Düğüm (Node) ve Arayüz İşlemleri

Frontend (React/Cytoscape) tarafındaki tıklama, sayfa yükleme ve Lazy Loading (Tembel Yükleme) aksiyonlarını yönetir.

* **Sistem Başlangıç Düğümü (Init)**
* **Method:** `GET`
* **Path:** `/api/nodes/init`
* **Çıktı:** `{ nodes, edges }` objesi (Map)
* **Açıklama:** Sayfa ilk yüklendiğinde beyaz ekran kalmaması için varsayılan merkez düğümünü (ID: 1) ve komşularını getirir.


* **Komşuları Getir (Tıklama / Expand)**
* **Method:** `GET`
* **Path:** `/api/nodes/{id}/neighbors`
* **Çıktı:** `{ nodes, edges }` objesi (Map)
* **Açıklama:** Arayüzde bir düğüme tıklandığında sadece o düğümün 1. derece (doğrudan bağlı) komşularını döndürür.



## 6. Arama (Search - Trie)

* **Method:** `GET`
* **Path:** `/api/nodes/search`
* **Parametre:** `q` (Aranan kelime)
* **Örnek İstek:** `/api/nodes/search?q=Ah`
* **Çıktı:** `[{ "id": 2, "title": "Ahmet Efe", "type": "USER" }]` (Liste)
* **Açıklama:** Trie veri yapısı ile harf bazlı (prefix) hızlı arama yapar, eşleşen düğümlerin özet bilgilerini döndürür.