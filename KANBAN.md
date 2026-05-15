📌 Summary (Özet)
Mimari: Java backend/core + web frontend. AI simülasyon motoru backend içinde @Async çalışan anlamlı bir modül olacak, ayrı servis/container kurulmayacak.

AI Kapsamı: Sade ama çalışır durumda. Graph verisine bakarak sosyal ağ senaryosu üretir, önerilen node/edge değişikliklerini ve kısa açıklamayı döner.

Scope Dışı: Job queue, broker, snapshot sistemi, deterministik seed engine, formal benchmark presetleri.

Definition of Done: Her task feature branch + PR ile kapanır, test kanıtı eklenir, Big-O/code defense notu güncellenir.

🔌 Interfaces (Arayüzler)
GET /api/search?q=&type=: Trie prefix search.

GET /api/nodes/{id}: Hash Table üzerinden inspector detayları.

GET /api/nodes/{id}/expand?depth=&limit=&relation=: Canvas node genişletme.

POST /api/query/traverse: Sınırlı zincirleme sorgu şablonları.

POST /api/algorithms/bfs|dfs|shortest-path|degrees: Algoritma paneli.

POST /api/ai/simulate: Async AI simülasyonunu başlatır.

GET /api/ai/simulate/{jobId}: Simülasyon sonucunu döner.

DTO’lar: GraphNodeDto, GraphEdgeDto, GraphViewDto, QueryRequestDto, AlgorithmResultDto, AiSimulationResultDto.

🚀 Epic 1: Faz 1 - Veri Yapıları
F1-US1

Task'lar: Vertex, Edge, Graph, PropertyMap; User/Post/Photo/Event type enum; directed/undirected edge; adjacency list.

Kabul Kriterleri: Core graph sıfırdan Java ile yazılır; hazır graph DB/library yoktur; adjacency Big-O rapora girer; PR zorunlu.

F1-US2

Task'lar: Custom HashTable<K,V>; collision handling; resize/load factor; node registry.

Kabul Kriterleri: Ortalama O(1) erişim sağlanır; core’da hazır HashMap kullanılmaz; inspector bu yapıdan veri çeker; unit test vardır.

F1-US3

Task'lar: Custom Trie; name/title indexleme; prefix search; type filtresi; index yazımı ve arama sırasında toLowerCase(Locale.ENGLISH) normalizasyonu.

Kabul Kriterleri: En az User/Post/Event arar; prefix sonucu doğru döner; büyük/küçük harf farkı aramayı bozmaz; Trie Big-O rapora eklenir.

F1-US4

Task'lar: Generic Queue; enqueue/dequeue/peek/isEmpty; BFS entegrasyonu.

Kabul Kriterleri: Hazır queue core BFS’te kullanılmaz; enqueue/dequeue O(1) açıklanır; sınır durum testleri vardır.

F1-US5

Task'lar: Sabit JSON veya Java builder ile yaklaşık 150-200 node; ilişkiler: FRIEND, LIKES, ATTENDS, POSTED.

Kabul Kriterleri: Seed engine kurulmaz; veri UI ve algoritma demosuna yeterlidir; takım üye isimleri Türkçe karakter içermeyen formatta metadata’ya eklenir.

🧠 Epic 2: Faz 2 - Algoritmalar, Sorgular ve AI Simülasyonu
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

F2-US5

Task'lar: Backend içinde AiSimulationService; @Async metot; mevcut graph’tan 5-10 önerilen sosyal etkileşim üretme; (örn. arkadaş önerisi, yeni post/event fikri, olası LIKE/ATTENDS ilişkileri); prompt ve çıktı loglama.

Kabul Kriterleri: Ayrı servis/container, broker ve snapshot sistemi kurulmaz; simülasyon async çalışır; sonuç AiSimulationResultDto ile UI’a döner; çıktı en az önerilen node/edge listesi + kısa gerekçe içerir; prompt ve response rapora eklenir.

F2-US6

Task'lar: Triadic closure arkadaş önerisi; basit degree centrality.

Kabul Kriterleri: Opsiyonel kalır; zorunlu algoritmalar tamamlanmadan başlanmaz; karmaşıklık analizi kısa şekilde rapora eklenir.

💻 Epic 3: Faz 3 - UI, DevOps ve Teslim
F3-US1

Task'lar: Üst search; sol sorgu/algoritma paneli; orta canvas; sağ inspector.

Kabul Kriterleri: İlk ekran doğrudan çalışan araçtır; sosyal medya feed’i yapılmaz; responsive temel kullanım sağlanır.

F3-US2

Task'lar: Cytoscape.js/D3 ile render; type’a göre renk/şekil; zoom/pan; click ile expand.

Kabul Kriterleri: Algoritmalar frontend’de değil Java backend’de çalışır; ekranda aynı anda maksimum 50 node gösterilir; fazlası expand-on-click ile açılır.

F3-US3

Task'lar: Inspector panel; GET /api/nodes/{id} entegrasyonu; property table.

Kabul Kriterleri: Veri Hash Table registry’den gelir; ortalama O(1) erişim raporda belirtilir; bulunamayan node hatası gösterilir.

F3-US4

Task'lar: BFS/DFS/shortest path/degrees formları; sonuç path highlight; loading/error states.

Kabul Kriterleri: Her algoritma UI’dan çalışır; path canvas’ta vurgulanır; yanlış input case’leri test edilir.

F3-US5

Task'lar: Sol panelde “AI Simülasyon” aksiyonu; async durum göstergesi; önerilen node/edge listesini canvas’a önizleme olarak ekleme.

Kabul Kriterleri: Kullanıcı simülasyonu başlatır, UI bloklanmaz; sonuçlar onay bekleyen öneriler olarak gösterilir; prompt/response log kaydı oluşur.

F3-US6

Task'lar: Backend Dockerfile; frontend Dockerfile; docker-compose.yml; backend içinde async AI simülasyon modülü.

Kabul Kriterleri: docker-compose up frontend ve backend’i başlatır; AI modülünün backend içinde async çalıştığı README’de açıklanır.

F3-US7

Task'lar: README mimari; UML diyagramları; Big-O tablosu; AI prompt/response dökümü; demo video senaryosu.

Kabul Kriterleri: En fazla 10 dakikalık demo akışı hazırlanır; her ekip üyesi core veri yapılarını ve AI simülasyon akışını açıklayabilir.

🧪 Test Plan
Unit: HashTable, Trie normalizasyonu, Queue, Graph adjacency, BFS, DFS, shortest path.

Integration: Search, inspector, expand, fixed chain query, algoritma endpointleri, async AI simülasyon endpointleri.

UI Demo: “Ah” araması, maksimum 50 node render, expand-on-click, inspector fetch, BFS/DFS/path highlight, AI öneri önizleme.

Performance Evidence: Tek yaklaşık 150-200 node veri setinde temel çalışma gösterilir; formal benchmark değil, Big-O analizi raporda verilir.

DevOps: docker-compose up temiz ortamda denenir.

💡 Assumptions (Varsayımlar)
Java 21 ve Spring Boot API katmanı kullanılabilir; core veri yapıları sıfırdan yazılır.

Frontend web tabanlıdır; render kütüphanesi sadece görselleştirme içindir.

AI simülasyonu backend içinde @Async çalışan modüldür; harici servis/container kurulmaz.

AI çıktısı, graph’a uygulanmadan önce UI’da öneri/önizleme olarak gösterilir.