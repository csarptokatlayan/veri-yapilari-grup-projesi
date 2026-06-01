1. Gezinme (Traversal) Algoritmaları
   Bu endpointler, verilen bir düğümden (Node) başlayarak graf üzerindeki bağlantıları tarar.

BFS (Genişlik Öncelikli Arama)

Method: GET

Path: /traversal/bfs/{id}

Çıktı: List<Node>

Açıklama: Belirtilen ID'deki düğümden başlayarak tüm ağı BFS algoritması ile dalga dalga tarar ve ziyaret edilen düğümleri sırasıyla döndürür.

DFS (Derinlik Öncelikli Arama)

Method: GET

Path: /traversal/dfs/{id}

Çıktı: List<Node>

Açıklama: Belirtilen ID'deki düğümden başlayarak ağı DFS algoritması ile derinlemesine tarar ve ziyaret edilen düğümleri sırasıyla döndürür.

2. Zincirleme (Chain) Filtreli Sorgular
   Bu endpointler, birden fazla adımlı (User -> Friend -> Content) ilişkisel sorguları çalıştırır. Çıktı olarak Canvas'ta çizilmeye hazır nodes ve edges listelerini içeren bir obje (Map) döner.

Arkadaşların Beğendiği Gönderiler

Method: GET

Path: /chain/{userId}/friends-likes

Örnek İstek: http://localhost:8080/chain/1/friends-likes

Açıklama: Önce belirtilen kullanıcının arkadaşlarını bulur, ardından o arkadaşların beğendiği gönderileri (Post) getirir. Bu yolculuktaki tüm düğümleri ve aralarındaki bağlantıları (Edge) döndürür.

Arkadaşların Katıldığı Etkinlikler

Method: GET

Path: /chain/{userId}/friends-events

Örnek İstek: http://localhost:8080/chain/1/friends-events

Açıklama: Önce belirtilen kullanıcının arkadaşlarını bulur, ardından o arkadaşların katıldığı etkinlikleri (Event) getirir. Bu yolculuktaki tüm düğümleri ve aralarındaki bağlantıları (Edge) döndürür.

3. İki düğüm arasındaki en kısa yol

Method: GET

Path: /traversal/shortest-path?from={from}&to={to}

Örnek İstek: http://localhost:8080/traversal/shortest-path?from=1&to=5

Örnek çıktı: 

{
"path": [
1,
2,
3,
4,
5
],
"distance": 4
}