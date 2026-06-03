package com.grup15.socialnetwork.seed;

import com.grup15.socialnetwork.model.Edge;
import com.grup15.socialnetwork.model.EdgeType;
import com.grup15.socialnetwork.datastructures.graph.Graph;
import com.grup15.socialnetwork.datastructures.trie.Trie;
import com.grup15.socialnetwork.model.Node;
import com.grup15.socialnetwork.datastructures.NodeRegistry;
import com.grup15.socialnetwork.model.NodeType;

import java.util.Locale;

/**
 * 200 düğümlü gerçekçi sosyal ağ seed'i.
 *
 * Düğüm dağılımı:
 *   80 USER  (ID  1 –  80)
 *   70 POST  (ID 81 – 150)
 *   25 PHOTO (ID 151 – 175)
 *   25 EVENT (ID 176 – 200)
 *   ──────────────────────
 *   Toplam: 200 düğüm
 *
 * Kenar dağılımı (yaklaşık):
 *   FRIEND  ≈ 200  (halka + atlama-5 + atlama-17)
 *   POSTED  =  95  (70 post + 25 foto)
 *   LIKES   = 240  (her kullanıcı × 3)
 *   ATTENDS = 160  (her kullanıcı × 2)
 *   ──────────────────────
 *   Toplam  ≈ 695 kenar
 */
// @author Semih Tuncel
public final class FixedSocialNetworkSeed {

    // ── DÜĞÜM (NODE) SAYILARI VE ID ARALIKLARI ──

    static final int USER_FIRST_ID = 1;
    static final int USER_COUNT = 80;
    static final int USER_LAST_ID = USER_FIRST_ID + USER_COUNT - 1; // 80

    static final int POST_FIRST_ID = USER_LAST_ID + 1; // 81
    static final int POST_COUNT = 70;
    static final int POST_LAST_ID = POST_FIRST_ID + POST_COUNT - 1; // 150

    static final int PHOTO_FIRST_ID = POST_LAST_ID + 1; // 151
    static final int PHOTO_COUNT = 25;
    static final int PHOTO_LAST_ID = PHOTO_FIRST_ID + PHOTO_COUNT - 1; // 175

    static final int EVENT_FIRST_ID = PHOTO_LAST_ID + 1; // 176
    static final int EVENT_COUNT = 25;
    static final int EVENT_LAST_ID = EVENT_FIRST_ID + EVENT_COUNT - 1; // 200


    // ── KENAR (EDGE) SAYILARI ──

    static final int FRIEND_EDGE_COUNT = 200;
    static final int POSTED_EDGE_COUNT = 95;
    static final int LIKES_EDGE_COUNT = 240;
    static final int ATTENDS_EDGE_COUNT = 160;

    static final int TOTAL_EDGE_COUNT = FRIEND_EDGE_COUNT + POSTED_EDGE_COUNT + LIKES_EDGE_COUNT + ATTENDS_EDGE_COUNT; // Toplam: 695


    // ── ÖZELLİK SABİTLERİ VE YARDIMCILAR ──

    static final String TEAM_MEMBER_PROPERTY = "teamMember";
    static final String TEAM_MEMBER_ASCII_PROPERTY = "teamMemberNameAscii";

    private static final int CONTENT_COUNT = POST_COUNT + PHOTO_COUNT; // 95

    // ── Takım üyeleri (ilk 5 kullanıcı) ───────────────────────────────────────

    static final String[] TEAM_MEMBER_NAMES = {
            "Semih Tuncel",
            "Ahmet Efe Gencel",
            "Arda Asan",
            "Fatih Soyer",
            "Murat Kutku",
    };

    // ── 80 gerçekçi Türk kullanıcı ismi ───────────────────────────────────────

    private static final String[] USER_NAMES = {
            /* 00 */ "Semih Tuncel",
            /* 01 */ "Ahmet Efe Gencel",
            /* 02 */ "Arda Asan",
            /* 03 */ "Fatih Soyer",
            /* 04 */ "Murat Kutku",
            /* 05 */ "Zeynep Arslan",
            /* 06 */ "Elif Kaya",
            /* 07 */ "Ayşe Demir",
            /* 08 */ "Mehmet Yılmaz",
            /* 09 */ "Emre Çelik",
            /* 10 */ "Selin Öztürk",
            /* 11 */ "Can Şahin",
            /* 12 */ "Deniz Aydın",
            /* 13 */ "Berk Koç",
            /* 14 */ "Pınar Doğan",
            /* 15 */ "Ali Yıldız",
            /* 16 */ "Merve Şimşek",
            /* 17 */ "Oğuz Kurt",
            /* 18 */ "Ceren Erdoğan",
            /* 19 */ "Burak Özdemir",
            /* 20 */ "Tuğba Çakır",
            /* 21 */ "Serkan Güneş",
            /* 22 */ "Hande Polat",
            /* 23 */ "Volkan Aksoy",
            /* 24 */ "Gizem Kaplan",
            /* 25 */ "Kaan Akar",
            /* 26 */ "Dilan Bulut",
            /* 27 */ "Ege Demirci",
            /* 28 */ "Yasemin Göktaş",
            /* 29 */ "Mert Kılıç",
            /* 30 */ "Seda Yalçın",
            /* 31 */ "Onur Tekin",
            /* 32 */ "Ece Özer",
            /* 33 */ "Taha Uysal",
            /* 34 */ "Nida Başaran",
            /* 35 */ "Alper Türk",
            /* 36 */ "Şeyma Güler",
            /* 37 */ "Uğur Çavuş",
            /* 38 */ "Dilara Işık",
            /* 39 */ "Kemal Saygın",
            /* 40 */ "Rüya Uçar",
            /* 41 */ "Barış Ercan",
            /* 42 */ "Nazlı Pekcan",
            /* 43 */ "Tolga Güven",
            /* 44 */ "Leyla Bozkurt",
            /* 45 */ "Cem Bayram",
            /* 46 */ "İrem Altun",
            /* 47 */ "Furkan Soydan",
            /* 48 */ "Sevgi Karadağ",
            /* 49 */ "Hüseyin Aktaş",
            /* 50 */ "Esra Önder",
            /* 51 */ "Doruk Seçkin",
            /* 52 */ "Aysun Yavuz",
            /* 53 */ "Cihan Özkan",
            /* 54 */ "Simge Korkmaz",
            /* 55 */ "Bekir Atan",
            /* 56 */ "Funda Küçük",
            /* 57 */ "Yasin Erdem",
            /* 58 */ "Neslihan Çetin",
            /* 59 */ "İlker Durmaz",
            /* 60 */ "Burcu Sever",
            /* 61 */ "Çağrı Bostan",
            /* 62 */ "Tülin Arsoy",
            /* 63 */ "Haluk Memiş",
            /* 64 */ "Arzu Gürbüz",
            /* 65 */ "Koray Temel",
            /* 66 */ "Serap Dinçer",
            /* 67 */ "Mustafa Boz",
            /* 68 */ "Vildan Yurtsever",
            /* 69 */ "Aydın Tokat",
            /* 70 */ "Hatice Sarıkaya",
            /* 71 */ "Selim Pala",
            /* 72 */ "Yağmur Ergin",
            /* 73 */ "Engin Başar",
            /* 74 */ "İlknur Avcı",
            /* 75 */ "Ramazan Topçu",
            /* 76 */ "Gülay Şen",
            /* 77 */ "Tarık Ölmez",
            /* 78 */ "Nihal Duman",
            /* 79 */ "Ozan Kıraç",
    };

    // ── 70 gerçekçi paylaşım başlığı ──────────────────────────────────────────

    private static final String[] POST_TITLES = {
            /* 00 */ "İstanbul'da gün batımı – bu şehri her zaman sevdim",
            /* 01 */ "Bugün yeni bir projeye başladım, çok heyecanlıyım!",
            /* 02 */ "Kahve + kitap = mükemmel Pazar sabahı",
            /* 03 */ "Yılın en güzel konseri dün geceydi",
            /* 04 */ "Sınavlar bitti, sonunda nefes alabiliyorum",
            /* 05 */ "Boğaz'da tekne turu – bu manzaraya doyum olmaz",
            /* 06 */ "Yeni tarif denedim: ev yapımı mercimek çorbası",
            /* 07 */ "Spor salonunda kişisel rekorum kırdım",
            /* 08 */ "Annem pişirdi, teşekkürler anne",
            /* 09 */ "Üniversite anıları bitmek bilmiyor, 4 yıl çabuk geçti",
            /* 10 */ "Film önerisi: Babam ve Oğlum – herkese izleyin",
            /* 11 */ "Doğa yürüyüşü yaptım, ruhum yerine geldi",
            /* 12 */ "Yeni iş yerim harika, ekip muhteşem",
            /* 13 */ "Ramazan pidesi kuyruğu 2 saat ama değdi",
            /* 14 */ "Tatil planları yapıyorum – Kapadokya mı, Bodrum mu?",
            /* 15 */ "Mezuniyet fotoğraflarım nihayet hazır",
            /* 16 */ "Trafik berbat bugün, 2 saat yolda kaldım",
            /* 17 */ "Konsere gitmeden önce heyecan dorukta",
            /* 18 */ "Yeni roman okumaya başladım: Masumiyet Müzesi",
            /* 19 */ "Sahil kenarında sabah koşusu – tavsiye ederim",
            /* 20 */ "Kedi sahiplendim, adını Pamuq koydum",
            /* 21 */ "Arkadaşlarımla piknik – harika bir gün geçirdik",
            /* 22 */ "Kod yazarken müzik şart, bugün lo-fi playlist",
            /* 23 */ "Hava kötü ama içimde güneş var",
            /* 24 */ "Galata Kulesi'ne çıktım, İstanbul üstten bambaşka",
            /* 25 */ "Nohutlu pilav yaptım, mükemmel oldu",
            /* 26 */ "Burs aldım, ailem çok mutlu",
            /* 27 */ "Yarın final var, dua edin lütfen",
            /* 28 */ "Deniz kenarında çay içmek dünyanın en güzel şeyi",
            /* 29 */ "Yeni kulaklık aldım, ses kalitesi inanılmaz",
            /* 30 */ "Arkadaşım evlendi, düğün muhteşemdi",
            /* 31 */ "Çarşamba akşamı basketbol maçı, kazandık",
            /* 32 */ "Felsefe kitabı okuyorum, kafa çok yoruluyor",
            /* 33 */ "Şehir dışına çıktım, sessizliğe ihtiyacım vardı",
            /* 34 */ "Vegan tarif denemesi: mercimekli köfte",
            /* 35 */ "Deprem bölgesine yardım toplandı, herkese teşekkür",
            /* 36 */ "Yazılım geliştirme bootcamp'ini tamamladım",
            /* 37 */ "Balkon bahçesi kuruyorum, ilk domates filizi çıktı",
            /* 38 */ "Arkadaşlarımla Kapadokya road trip – efsane bir hafta!",
            /* 39 */ "Yağmurlu havada sıcak çorba içmek ayrı güzel",
            /* 40 */ "Yeni şarkım çıktı, dinleyin ve görüşlerinizi yazın",
            /* 41 */ "Eski İstanbul fotoğrafları – şehir ne kadar değişmiş",
            /* 42 */ "Hafta sonu seramik atölyesine katıldım, çok eğlenceliydi",
            /* 43 */ "Kütüphaneye üye oldum, artık kitap satın almıyorum",
            /* 44 */ "Futbol maçı izledik – gol geldi herkes çıldırdı",
            /* 45 */ "Sabah erken kalktım, gün çok verimli geçti",
            /* 46 */ "Tatilde çektiğim fotoğrafları düzenliyorum",
            /* 47 */ "Yoga yapmaya başladım, 1 ay oldu, çok iyi geliyor",
            /* 48 */ "Uzaktan çalışmak bazen zor ama bugün verimliydi",
            /* 49 */ "Anneannemin tarifiyle börek – hayatımın en güzel tadı",
            /* 50 */ "Lisemdeki öğretmenimle karşılaştım, çok duygulandım",
            /* 51 */ "Teknoloji haberleri takip ediyorum, yapay zeka çağı geldi",
            /* 52 */ "Tiyatroya gittim, oyunculuk muhteşemdi",
            /* 53 */ "Sabah rutini oluşturdum, hayat kolaylaştı",
            /* 54 */ "Kamp ateşi başında gitar çaldık – saf nostalji",
            /* 55 */ "İş görüşmesinden döndüm, parmak falan çarpıyor",
            /* 56 */ "Balık tutmaya gittim, ilk defa bir şey yakaladım",
            /* 57 */ "Koşu bandında 10 km tamamladım",
            /* 58 */ "Arkadaşlarımla trivia gecesi – çok güldük",
            /* 59 */ "Yeni bir dil öğrenmeye karar verdim: İspanyolca",
            /* 60 */ "Bu hafta sonu ormanda yürüyüş yapacağız",
            /* 61 */ "Emekliye ayrılan müdürümüze veda ettik, üzücüydü",
            /* 62 */ "Kurabiye pişirdim, hepsi bitti bile",
            /* 63 */ "Yaz okulu başladı, yoğun ama değiyor",
            /* 64 */ "Doğum günüm! 24 yaş nasıl bir his",
            /* 65 */ "Eski fotoğraf albümlerini karıştırdım, çok güldüm",
            /* 66 */ "Şirketimiz hackathon düzenledi, 2. olduk",
            /* 67 */ "Sağlıklı yaşam için ilk adım: şeker bıraktım",
            /* 68 */ "Yazın planlarım epey dolu, sabırsızlanıyorum",
            /* 69 */ "Arkadaşım şehre geldi, İstanbul'u ona gösterdim",
    };

    // ── 25 gerçekçi fotoğraf başlığı ──────────────────────────────────────────

    private static final String[] PHOTO_TITLES = {
            /* 00 */ "Günbatımı — Çeşme Sahili",
            /* 01 */ "Balkon Çiçekleri — Bahar 2024",
            /* 02 */ "Uludağ Kayak Tatili — Arkadaşlarla",
            /* 03 */ "Galata Kulesi — Gece Görünümü",
            /* 04 */ "Kapadokya Balon Turu Sabahı",
            /* 05 */ "Ev Yapımı Baklava — Ramazan Özel",
            /* 06 */ "Boğaz Köprüsü — Uzun Pozlama",
            /* 07 */ "Aile Yemeği — Kurban Bayramı",
            /* 08 */ "Kamp Ateşi — Abant Gölü",
            /* 09 */ "Mezuniyet Töreni 2024",
            /* 10 */ "Stüdyo Çalışması — Müzik Kaydı",
            /* 11 */ "Emirgan Lale Bahçesi — İlkbahar",
            /* 12 */ "Sahil Sabah Koşusu",
            /* 13 */ "Pazar Yeri Meyveleri — Kadıköy",
            /* 14 */ "Dağda Gün Doğumu — Kaçkar",
            /* 15 */ "Köy Kahvaltısı — Bolu",
            /* 16 */ "Kitap Kafeden Çalışma Anı",
            /* 17 */ "Kar Altında Boğaziçi",
            /* 18 */ "El Yapımı Pizza — Akşam Yemeği",
            /* 19 */ "Yaban Hayatı — Flamingo — Manyas",
            /* 20 */ "Konser Anı — Harbiye Açık Hava",
            /* 21 */ "Belgrad Ormanı Bahar Pikniği",
            /* 22 */ "Kapalıçarşı Gezisi",
            /* 23 */ "Yeni Kedi Pamuq — İlk Gün",
            /* 24 */ "Spor Salonu — Kişisel Rekor",
    };

    // ── 25 gerçekçi etkinlik başlığı ──────────────────────────────────────────

    private static final String[] EVENT_TITLES = {
            /* 00 */ "TechFest İstanbul 2024 — Yapay Zeka Zirvesi",
            /* 01 */ "Üniversitelerarası Yazılım Yarışması",
            /* 02 */ "Açık Hava Sinema Gecesi — Boğaz Kıyısı",
            /* 03 */ "Ramazan İftarı — Topluluk Buluşması",
            /* 04 */ "Bisiklet Turu — Adalar Günübirlik",
            /* 05 */ "Kariyer Günleri 2024 — Kampüste",
            /* 06 */ "Caz Festivali — Zorlu PSM",
            /* 07 */ "Hackathon İstanbul 48 Saat",
            /* 08 */ "Boğaz Sahili Çevre Temizliği",
            /* 09 */ "Kitap Kulübü Toplantısı — Haziran",
            /* 10 */ "Startup Weekend İstanbul",
            /* 11 */ "Kırkpınar Yağlı Güreş İzleme Etkinliği",
            /* 12 */ "Başlangıç Fotoğrafçılık Atölyesi",
            /* 13 */ "Köy Okulunda Gönüllü Ders",
            /* 14 */ "Yılbaşı Partisi — Rooftop",
            /* 15 */ "Arkadaş Ligi Futbol Turnuvası",
            /* 16 */ "Hafta Sonu Seramik Kursu",
            /* 17 */ "Belgrad Ormanı Doğa Fotoğrafçılığı",
            /* 18 */ "Boğaziçi Mezunlar Günü",
            /* 19 */ "Film Gösterimi ve Tartışma Gecesi",
            /* 20 */ "Kadıköy Gastronomi Festivali",
            /* 21 */ "Online Girişimcilik Webinarı",
            /* 22 */ "Üniversite Satranç Turnuvası",
            /* 23 */ "Kan Bağışı Kampanyası",
            /* 24 */ "Spor Salonu Açılış Etkinliği",
    };

    // ── Özellik (Property) Havuzları ──────────────────────────────────────────

    private static final String[] LOCATIONS = {
            "Bursa", "İstanbul", "Ankara", "İzmir", "Eskişehir", "Antalya", "Çanakkale"
    };

    private static final String[] OCCUPATIONS = {
            "Bilgisayar Mühendisliği Öğrencisi", "Yazılım Geliştirici", "Grafik Tasarımcı",
            "Veri Bilimcisi", "Akademisyen", "Serbest Çalışan (Freelancer)"
    };

    private static final String[] POST_CATEGORIES = {
            "Teknoloji", "Günlük Yaşam", "Eğitim", "Eğlence", "Gezi", "Kültür & Sanat"
    };

    private static final String[] CAMERAS = {
            "iPhone 14 Pro", "Canon EOS R5", "Sony A7 III", "Samsung S23 Ultra", "FujiFilm X-T4"
    };

    private static final String[] PHOTO_FILTERS = {
            "Clarendon", "Juno", "Lark", "Gingham", "Filtresiz (No Filter)"
    };

    /** Nesne oluşturmayı engeller; tüm metotlar statiktir. */
    // @author Semih Tuncel
    private FixedSocialNetworkSeed() {
    }

    // ── Ana inşa metodu ────────────────────────────────────────────────────────

    /**
     * Her düğüm ve kenar üzerinden bir kez geçerek 200 düğümlü sosyal ağı O(V + E) kurar.
     */
    // @author Semih Tuncel
    public static SeedContext build() {
        Graph graph = new Graph();
        NodeRegistry registry = new NodeRegistry();
        Trie trie = new Trie();
        trie.setNodeRegistry(registry);

        addUsers(graph, registry, trie);
        addPosts(graph, registry, trie);
        addPhotos(graph, registry, trie);
        addEvents(graph, registry, trie);

        visitPlannedEdges((sourceId, targetId, type, directed) ->
                addEdge(graph, registry, sourceId, targetId, type, directed));

        return new SeedContext(graph, registry, trie);
    }

    // ── Kenar planı ───────────────────────────────────────────────────────────

    /**
     * Ayrı bir kenar listesi tutmadan sabit kenar planını yeniden yürütür.
     *
     * <p>FRIEND kenarları üç katmanlı bir yapıyla gerçekçi sosyal kümeleri simüle eder:
     * <ul>
     *   <li>Halka (ardışık): yakın çevre bağlantıları (~80 kenar)</li>
     *   <li>Atlama-5: orta yakınlıktaki arkadaşlıklar (~80 kenar)</li>
     *   <li>Atlama-17: farklı topluluklar arası köprü bağlantılar (~40 kenar)</li>
     * </ul>
     */
    // @author Semih Tuncel
    static void visitPlannedEdges(PlannedEdgeVisitor visitor) {
        if (visitor == null) {
            throw new IllegalArgumentException("Visitor cannot be null.");
        }

        // ── ARKADAŞLIK BAĞLANTILARI (Çift Yönlü - false) ─────────────────────

        // Halka: her kullanıcı bir sonrakiyle arkadaş (yakın çevre)
        for (int i = 0; i < USER_COUNT; i++) {
            visitor.visit(userIdAtIndex(i), userIdAtIndex(i + 1),
                    EdgeType.FRIEND, false);
        }

        // Atlama-5: orta uzaklıktaki arkadaşlıklar (küçük gruplar)
        for (int i = 0; i < USER_COUNT; i++) {
            visitor.visit(userIdAtIndex(i), userIdAtIndex(i + 5),
                    EdgeType.FRIEND, false);
        }

        // Atlama-17: farklı topluluklar arası köprüler (zayıf bağlar teorisi)
        for (int i = 0; i < 40; i++) {
            visitor.visit(userIdAtIndex(i), userIdAtIndex(i + 17),
                    EdgeType.FRIEND, false);
        }

        // ── PAYLAŞIM BAĞLANTILARI (Çift Yönlü - false) ───────────────────────

        // İlk 70 kullanıcının her biri 1 post paylaşır
        for (int i = 0; i < POST_COUNT; i++) {
            visitor.visit(userIdAtIndex(i), POST_FIRST_ID + i,
                    EdgeType.POSTED, false);
        }

        // 25 kullanıcı birer fotoğraf paylaşır (döngüsel eşleme)
        for (int i = 0; i < PHOTO_COUNT; i++) {
            visitor.visit(userIdAtIndex((POST_COUNT + i) % USER_COUNT),
                    PHOTO_FIRST_ID + i, EdgeType.POSTED, false);
        }

        // ── BEĞENİ BAĞLANTILARI (Çift Yönlü - false) ─────────────────────────
        for (int u = 0; u < USER_COUNT; u++) {
            int uid = userIdAtIndex(u);
            for (int k = 0; k < 3; k++) {
                int idx = Math.floorMod(u * 7 + k * 23 + k * k * 3, CONTENT_COUNT);
                visitor.visit(uid, contentIdAtIndex(idx), EdgeType.LIKES, false);
            }
        }

        // ── KATILIM BAĞLANTILARI (Çift Yönlü - false) ────────────────────────
        for (int u = 0; u < USER_COUNT; u++) {
            int uid = userIdAtIndex(u);
            for (int k = 0; k < 2; k++) {
                int idx = Math.floorMod(u * 3 + k * 11, EVENT_COUNT);
                visitor.visit(uid, eventIdAtIndex(idx), EdgeType.ATTENDS, false);
            }
        }
    }

    // ── Düğüm ekleme ──────────────────────────────────────────────────────────

    /**
     * 80 kullanıcıyı ekler ve USER türüne özel properties (yaş, konum, meslek) atar.
     */
    // @author Semih Tuncel
    private static void addUsers(Graph graph, NodeRegistry registry, Trie trie) {
        for (int i = 0; i < USER_COUNT; i++) {
            int id = USER_FIRST_ID + i;
            String title = (i < USER_NAMES.length)
                    ? USER_NAMES[i]
                    : String.format(Locale.ENGLISH, "User %03d", id);

            Node node = new Node(id, title, NodeType.USER);

            // USER özelliklerini ekle
            node.getProperties().put("age", 18 + (i % 15)); // 18 ile 32 arası deterministik yaş
            node.getProperties().put("location", LOCATIONS[i % LOCATIONS.length]);
            node.getProperties().put("occupation", OCCUPATIONS[i % OCCUPATIONS.length]);
            node.getProperties().put("isActive", (i % 7 != 0)); // %85 ihtimalle aktif kullanıcı

            if (i < TEAM_MEMBER_NAMES.length) {
                markTeamMember(node, title);
            }
            registerNode(graph, registry, trie, node);
        }
    }

    /**
     * 70 postu ekler ve POST türüne özel properties (kategori, görüntülenme, herkese açık mı) atar.
     */
    // @author Semih Tuncel
    private static void addPosts(Graph graph, NodeRegistry registry, Trie trie) {
        for (int i = 0; i < POST_COUNT; i++) {
            int id = POST_FIRST_ID + i;
            String title = (i < POST_TITLES.length)
                    ? POST_TITLES[i]
                    : String.format(Locale.ENGLISH, "Post %03d", i + 1);

            Node node = new Node(id, title, NodeType.POST);

            // POST özelliklerini ekle
            node.getProperties().put("category", POST_CATEGORIES[i % POST_CATEGORIES.length]);
            node.getProperties().put("views", 100 + (i * 13 % 1000)); // 100-1100 arası görüntülenme
            node.getProperties().put("isPublic", (i % 5 != 0)); // %80 ihtimalle herkese açık

            registerNode(graph, registry, trie, node);
        }
    }

    /**
     * 25 fotoğrafı ekler ve PHOTO türüne özel properties (kamera, filtre, çözünürlük) atar.
     */
    // @author Semih Tuncel
    private static void addPhotos(Graph graph, NodeRegistry registry, Trie trie) {
        for (int i = 0; i < PHOTO_COUNT; i++) {
            int id = PHOTO_FIRST_ID + i;
            String title = (i < PHOTO_TITLES.length)
                    ? PHOTO_TITLES[i]
                    : String.format(Locale.ENGLISH, "Photo %03d", i + 1);

            Node node = new Node(id, title, NodeType.PHOTO);

            // PHOTO özelliklerini ekle
            node.getProperties().put("camera", CAMERAS[i % CAMERAS.length]);
            node.getProperties().put("filter", PHOTO_FILTERS[i % PHOTO_FILTERS.length]);
            node.getProperties().put("resolution", (i % 2 == 0) ? "1080x1080" : "1920x1080");

            registerNode(graph, registry, trie, node);
        }
    }

    /**
     * 25 etkinliği ekler ve EVENT türüne özel properties (tarih, kapasite, bilet fiyatı) atar.
     */
    // @author Semih Tuncel
    private static void addEvents(Graph graph, NodeRegistry registry, Trie trie) {
        for (int i = 0; i < EVENT_COUNT; i++) {
            int id = EVENT_FIRST_ID + i;
            String title = (i < EVENT_TITLES.length)
                    ? EVENT_TITLES[i]
                    : String.format(Locale.ENGLISH, "Event %03d", i + 1);

            Node node = new Node(id, title, NodeType.EVENT);

            // EVENT özelliklerini ekle
            // Tarih üretimi: Örn. "2026-06-12"
            String date = "2026-0" + (6 + (i % 4)) + "-" + (10 + (i % 20));
            node.getProperties().put("date", date);
            node.getProperties().put("capacity", 50 + (i * 10 % 500)); // 50 ile 550 arası kapasite

            // Fiyatı belirle: Her 3 etkinlikten biri ücretsiz (0.0) olsun
            double price = (i % 3 == 0) ? 0.0 : (50.0 + (i * 15 % 300));
            node.getProperties().put("ticketPrice", price);

            registerNode(graph, registry, trie, node);
        }
    }

    // ── Yardımcı metotlar ─────────────────────────────────────────────────────

    /**
     * Takım bilgisini düğüm üzerinde saklar; ayrı bir metadata nesnesi gerekmez.
     */
    // @author Semih Tuncel
    private static void markTeamMember(Node node, String name) {
        node.getProperties().put(TEAM_MEMBER_PROPERTY, Boolean.TRUE);
        node.getProperties().put(TEAM_MEMBER_ASCII_PROPERTY, name);
    }

    /**
     * Graph, registry ve trie'yi tutarlı kılmak için bir düğümü tüm yapılara ekler.
     */
    // @author Semih Tuncel
    private static void registerNode(Graph graph, NodeRegistry registry, Trie trie, Node node) {
        graph.ahmetEfe_addNode(node);
        registry.register(node);
        trie.insert(node.getTitle(), String.valueOf(node.getID()));
    }

    /**
     * İki uç ID'nin grafta var olduğunu doğruladıktan sonra bir kenar ekler.
     */
    // @author Semih Tuncel
    private static void addEdge(Graph graph, NodeRegistry registry,
                                int sourceId, int targetId,
                                EdgeType type, boolean directed) {
        if (!graph.ahmetEfe_nodeExist(sourceId)) {
            throw new IllegalStateException("Missing source node in graph: " + sourceId);
        }
        if (!graph.ahmetEfe_nodeExist(targetId)) {
            throw new IllegalStateException("Missing target node in graph: " + targetId);
        }

        Node source = requireNode(registry, sourceId, "source");
        Node target = requireNode(registry, targetId, "target");
        graph.ahmetEfe_addEdge(new Edge(source, target, type, directed), source, target);
    }

    /**
     * ID ile bulma ortalama O(1) olduğu için düğümü NodeRegistry üzerinden getirir.
     */
    // @author Semih Tuncel
    private static Node requireNode(NodeRegistry registry, int id, String role) {
        Node node = registry.findById(String.valueOf(id));
        if (node == null) {
            throw new IllegalStateException(
                    "Missing " + role + " node in registry: " + id);
        }
        return node;
    }

    // ── ID eşleme yardımcıları ────────────────────────────────────────────────

    /**
     * Herhangi bir tamsayı ofsetini modulo ile kullanıcı ID aralığına eşler.
     */
    // @author Semih Tuncel
    private static int userIdAtIndex(int index) {
        return USER_FIRST_ID + Math.floorMod(index, USER_COUNT);
    }

    /**
     * Beğeni hedefleri için herhangi bir tamsayı ofsetini post ve foto ID'lerine eşler.
     */
    // @author Semih Tuncel
    private static int contentIdAtIndex(int index) {
        int i = Math.floorMod(index, CONTENT_COUNT);
        return (i < POST_COUNT) ? POST_FIRST_ID + i : PHOTO_FIRST_ID + i - POST_COUNT;
    }

    /**
     * Katılım kenarları için herhangi bir tamsayı ofsetini etkinlik ID aralığına eşler.
     */
    // @author Semih Tuncel
    private static int eventIdAtIndex(int index) {
        return EVENT_FIRST_ID + Math.floorMod(index, EVENT_COUNT);
    }

    // ── Fonksiyonel arayüz ────────────────────────────────────────────────────

    @FunctionalInterface
    interface PlannedEdgeVisitor {

        /**
         * Çağıranlar aynı planı kurabilsin veya doğrulayabilsin diye
         * planlanmış bir kenarı alır.
         */
        // @author Semih Tuncel
        void visit(int sourceId, int targetId, EdgeType type, boolean directed);
    }
}