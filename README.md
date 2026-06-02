#  Property Graph Tabanlı Sosyal Ağ Modelleme Projesi

Bu proje, temel veri yapıları ve algoritmalar kullanılarak sıfırdan geliştirilmiş kapsamlı bir sosyal ağ simülasyonudur. Sistem; kullanıcılar, gönderiler (post) ve etkinlikler (event) arasındaki karmaşık ilişkileri yönlü bir **Çizge (Graph)** yapısı üzerinde modelleyerek, yüksek performanslı ağ analizleri ve sorgular yapılabilmesini sağlar.

##  Projenin Amacı ve Kapsamı

Bu projede bir sosyal medya platformunun arka planının nasıl çalıştığını modelledik. Asıl amacımız; kullanıcıya görünmeyen kısımda kurduğumuz 'Property Graph' mantığını kullanarak arkadaşlık önerileri, ilgi alanı analizleri ve içerik filtreleme gibi özellikleri analitik bir altyapıya dökmek oldu. Proje, veri tabanından bağımsız olarak sadece bellek içi (in-memory) veri yapıları kullanılarak inşa edilmiştir.

---

##  Mimari ve Veri Yapısı Tercihleri

Sosyal ağ simülasyonumuzun hızlı ve sorunsuz çalışması için arka planda kullanacağımız veri yapılarını özenle seçtik. Projenin bizden istediklerini (değerlendirme kriterlerini) göz önünde bulundurarak aldığımız mimari kararlar kısaca şöyle:
1. **Graph (Adjacency List):** Düğümler (Nodes) ve Kenarlar (Edges) arasındaki ilişkileri tutmak için matris yerine bitişiklik listesi (Adjacency List) tercih edilmiştir.Bu yapıyı seçmemizin en büyük artısı, belleği gereksiz yere şişirmemesi oldu. Kurduğumuz ağ yapısı gereği seyrek  olduğu için, bu sayede hem hafızadan ciddi tasarruf ettik hem de işlem performansımızı artırdık.
2. **Trie (Prefix Tree):** Sistemdeki kullanıcıları ve içerikleri arama çubuğunda anlık getirebilmek için Trie veri yapısı kullanılmıştır. Böylece arama yaparken tüm düğümleri tek tek gezme zahmetinden kurtulduk. Sistemde ne kadar fazla kayıt olursa olsun, kelimeyi yazdığımız anda sonuçları anında getirebilen bir altyapı kurmuş olduk.
3. **Hash Table:** Her bir düğüme ait spesifik özellikleri (isim, yaş, içerik tipi vb.) tutmak için kullanılmıştır. Bir düğümün detaylarına erişim süresi sabit hıza düşürülmüştür.

---

##  Kurulum ve Çalıştırma (Dockerization)

Projenin kurulum aşamasında altyapı gereksinimleriyle vakit kaybetmemek için sistemi baştan aşağı Dockerize ettik. Bu sayede uygulamanın çalışması için lokalinizde herhangi bir ortama (Java, Node vb.) ihtiyacınız kalmıyor; her bilgisayarda aynı standartta ve sorunsuz çalışıyor.
1. Bilgisayarınızda **Docker Desktop**'ın çalıştığından emin olun.
2. Terminali projenin ana dizininde açın ve aşağıdaki komutu çalıştırın:

```bash
docker-compose up -d
```

3. Konteynerler ayağa kalktıktan sonra sisteme şu adreslerden erişebilirsiniz:
    * **Frontend (Arayüz):** http://localhost:5173
    * **Backend (API):** http://localhost:8080

Sistemi durdurmak ve temizlemek için terminalde şu komutu kullanabilirsiniz:
```bash
docker-compose down
```

---

##  Gelişmiş Algoritmalar ve API Senaryoları

Sistemimiz sadece CRUD (Ekle/Sil) işlemleri değil, karmaşık ağ analizleri yapabilen algoritmik uç noktalara sahiptir.

### 1. Ağ Gezinme (Traversal) İşlemleri
* **Genişlik Öncelikli Arama (BFS):** `/traversal/bfs/{startId}`
    * *Senaryo:* Bir kullanıcının sosyal çevresini 1. derece, 2. derece arkadaş şeklinde dalga dalga analiz etmek için kullanılır.
* **Derinlik Öncelikli Arama (DFS):** `/traversal/dfs/{startId}`
    * *Senaryo:* Bir ilişkiler zincirinin ne kadar derine inebildiğini test etmek için kullanılır.
* **En Kısa Yol Bulma (Shortest Path):** `/traversal/shortest-path?from=X&to=Y`
    * *Senaryo:* Birbiriyle doğrudan bağlantısı olmayan iki kullanıcının, hangi ortak tanıdıklar üzerinden en kısa yoldan birbirine ulaşabileceğini hesaplar.

### 2. Akıllı Zincirleme Sorgular (Recommendation Engine)
İş kurallarına dayalı, yönlü kenarları (Directed Edges) takip eden filtreli sorgulardır.
* **Arkadaşların Beğendiği Gönderiler:** `/chain/{userId}/friends-likes`
    * *Çalışma Mantığı:* Kullanıcı -> Arkadaş -> Beğeni -> Gönderi patikasını takip ederek kullanıcıya kişiselleştirilmiş bir akış (feed) oluşturur.
* **Arkadaşların Katıldığı Etkinlikler:** `/chain/{userId}/friends-events`

### 3. Filtreleme ve Arama
* **Harf Bazlı Hızlı Arama:** `/nodes/search?q=aranacak_kelime` (Trie algoritması tetiklenir).
* **Düğüm Tipi Filtresi:** `/filter/node/type/{nodeType}` (Örn: Sadece "Etkinlik" düğümlerini getir).
* **Özellik (Property) Filtresi:** `/filter/node/property?key=age&value=21` (Örn: Sadece 21 yaşındaki kullanıcıları getir).

---

##  Big-O Zaman Karmaşıklığı Özeti

| Algoritma / İşlem | Veri Yapısı | Zaman Karmaşıklığı |
| :--- | :--- | :--- |
| **Arama Çubuğu (Autocomplete)** | Trie | $O(m)$ |
| **Düğüm Detayı Getirme** | Hash Table | $O(1)$ |
| **BFS / DFS Gezinme** | Graph | $O(V + E)$ |
| **En Kısa Yol (Shortest Path)** | Graph | $O(V + E)$ |
| **Düğüm Özelliği Filtreleme** | Hash Table | $O(V)$ |

