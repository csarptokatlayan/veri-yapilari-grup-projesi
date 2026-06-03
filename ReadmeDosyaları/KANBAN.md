📌 Summary (Özet)
Mimari: Java backend/core + web frontend.

Scope Dışı: Job queue, broker, snapshot sistemi, deterministik seed engine, formal benchmark presetleri.

Definition of Done: Her task feature branch + PR ile kapanır, test kanıtı eklenir, Big-O/code defense notu güncellenir.

🔌 Interfaces (Arayüzler)

GET /nodes/search: Trie veri yapısı ile harf bazlı (prefix) hızlı arama yapar ve q parametresini alır. (Eski GET /api/search yerine)

GET /nodes/{id}/neighbors: Arayüzde bir düğüme tıklandığında sadece o düğümün 1. derece (doğrudan bağlı) komşularını döndürür. (Eski GET /api/nodes/{id}/expand yerine)

GET /traversal/dynamic-chain-bfs ve GET /traversal/dynamic-chain-dfs: Arayüzden gelen parametrelere (startId, edgeType, targetType, depth) göre kısıtlanmış akıllı arama algoritmalarıdır. (Eski POST /api/query/traverse yerine)

GET /chain/{userId}/friends-likes ve GET /chain/{userId}/friends-events: Önceden tanımlanmış zincirleme şablonları (öneri motoru) için kullanılır.

GET /traversal/bfs/{startId}, GET /traversal/dfs/{startId}, ve GET /traversal/shortest-path: Algoritma paneli işlemleri için ayrılmış GET metodlu gezinme (traversal) uçlarıdır. (Eski POST /api/algorithms/... yerine)

GET /filter/node/type/{nodeType}, GET /filter/node/property, ve GET /filter/edge/type/{edgeType}: Veri filtreleme (tip, özellik, ilişki tipi) işlemleri için kullanılan yeni uçlardır.

🚀 Epic 1: Faz 1 - Veri Yapıları
F1-US1

Task'lar: Vertex, Edge, Graph, PropertyMap; User/Post/Photo/Event type enum; directed/undirected edge; adjacency list.

Kabul Kriterleri: Core graph sıfırdan Java ile yazılır; hazır graph DB/library yoktur; adjacency Big-O rapora girer; PR zorunlu.

F1-US2

Task'lar: Custom HashTable<K,V>; collision handling; resize/load factor; node registry.

Kabul Kriterleri: Ortalama O(1) erişim sağlanır; inspector bu yapıdan veri çeker; unit test vardır.

F1-US3

Task'lar: Custom Trie; name/title indexleme; prefix search; type filtresi; index yazımı ve arama sırasında toLowerCase(Locale.ENGLISH) normalizasyonu.

Kabul Kriterleri: En az User/Post/Event arar; prefix sonucu doğru döner; büyük/küçük harf farkı aramayı bozmaz; Trie Big-O rapora eklenir.

F1-US4

Task'lar: Generic Queue; enqueue/dequeue/peek/isEmpty; BFS entegrasyonu.

Kabul Kriterleri: Hazır queue core BFS’te kullanılmaz; enqueue/dequeue O(1) açıklanır; sınır durum testleri vardır.

F1-US5

Task'lar: Sabit JSON veya Java builder ile yaklaşık 150-200 node; ilişkiler: FRIEND, LIKES, ATTENDS, POSTED.

Kabul Kriterleri: Seed engine kurulmaz; veri UI ve algoritma demosuna yeterlidir; takım üye isimleri Türkçe karakter içermeyen formatta metadata’ya eklenir.

🧠 Epic 2: Faz 2 - Algoritmalar ve Sorgular
F2-US1

Task'lar: BFS custom queue ile; DFS iterative/recursive; visited kontrolü; depth limit.

Kabul Kriterleri: Cycle durumunda takılmaz; traversal order döner; zaman/uzay karmaşıklığı raporlanır; unit test vardır.

F2-US2

Task'lar: Unweighted shortest path; predecessor tracking; degrees of separation.

Kabul Kriterleri: Path ve mesafe doğru döner; unreachable case işlenir; sonuç UI’da vurgulanır; code defense açıklaması hazırlanır.

F2-US3

Task'lar: 3-4 sabit sorgu şablonu: User -> FRIEND -> LIKES Post, User -> ATTENDS Event -> HAS Photo; basit step modeli.

Kabul Kriterleri: Genel amaçlı query language yapılmaz; kullanıcı sadece tanımlı adımları seçer; ardışık traversal çalışır; Big-O notu eklenir.

F2-US4

Task'lar: Node type filtresi; relation type filtresi; property bazlı basit filtre.

Kabul Kriterleri: Filtreli traversal doğru sonuç verir; boş sonuç durumu UI/API’da düzgün döner; test senaryosu vardır.

F2-US6

💻 Epic 3: Faz 3 - UI, DevOps ve Teslim
F3-US1

Task'lar: Üst search; sol sorgu/algoritma paneli; orta canvas; sağ inspector.

Kabul Kriterleri: İlk ekran doğrudan çalışan araçtır; sosyal medya feed’i yapılmaz.

F3-US2

Task'lar: Cytoscape.js/D3 ile render; type’a göre renk/şekil; zoom/pan; click ile expand.

Kabul Kriterleri: Algoritmalar frontend’de değil Java backend’de çalışır; ekranda aynı anda maksimum 50 node gösterilir; fazlası expand-on-click ile açılır.

F3-US3

Task'lar: Inspector panel; GET /api/nodes/{id} entegrasyonu; property table.

Kabul Kriterleri: Veri Hash Table registry’den gelir; ortalama O(1) erişim raporda belirtilir.

F3-US4

Task'lar: BFS/DFS/shortest path/degrees formları; sonuç path highlight; loading/error states.

Kabul Kriterleri: Her algoritma UI’dan çalışır; path canvas’ta vurgulanır; yanlış input case’leri test edilir.

F3-US6

Task'lar: Backend Dockerfile; frontend Dockerfile; docker-compose.yml.

Kabul Kriterleri: docker-compose up frontend ve backend’i başlatır.

F3-US7

Task'lar: README mimari; UML diyagramları; Big-O tablosu; demo video senaryosu.

Kabul Kriterleri: En fazla 10 dakikalık demo akışı hazırlanır; her ekip üyesi core veri yapılarını açıklayabilir.

🧪 Test Plan
Unit: HashTable, Trie normalizasyonu, Queue, Graph adjacency, BFS, DFS, shortest path.

Integration: Search, inspector, expand, fixed chain query, algoritma endpointleri.

UI Demo: “Ah” araması, expand-on-click, inspector fetch, BFS/DFS/path highlight.

Performance Evidence: Tek yaklaşık 150-200 node veri setinde temel çalışma gösterilir; formal benchmark değil, Big-O analizi raporda verilir.

DevOps: docker-compose up temiz ortamda denenir.

💡 Assumptions (Varsayımlar)
Java 21 ve Spring Boot API katmanı kullanılabilir; core veri yapıları sıfırdan yazılır.

Frontend web tabanlıdır; render kütüphanesi sadece görselleştirme içindir.

