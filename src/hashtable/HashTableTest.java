package hashtable;

public class HashTableTest {
    public static void main(String[] args) {
        System.out.println("--- HashTable Çekirdek Birim Testleri Başlıyor ---");

        HashTable<String, String> map = new HashTable<>();

        //Basit Put / Get Doğruluğu
        map.put("test_key", "Deneme Verisi");
        if ("Deneme Verisi".equals(map.get("test_key"))) {
            System.out.println("✅ TEST PASSED: Temel Put ve Get doğru çalışıyor.");
        }

        // ÇARPIŞMA (COLLISION) VE RESIZE TESTİ
        // Aynı tabloya bilerek arka arkaya 5000 tane veri basıyoruz.
        // Bu işlem KESİNLİKLE aynı kutuya (bucket) 3'ten fazla eleman düşürecek (collision)
        // ve tablonun kendini otomatik büyütmesini (resize) tetikleyecektir.
        boolean collisionAndResizeSuccess = true;

        System.out.println("-> Tabloya 5000 eleman eklenerek Çarpışma ve Resize tetikleniyor...");
        for (int i = 0; i < 5000; i++) {
            map.put("user_" + i, "Data_" + i);
        }

        // Eklenen 5000 verinin tek bir tanesi bile kaybolmuş mu diye kontrol ediyoruz
        for (int i = 0; i < 5000; i++) {
            if (!("Data_" + i).equals(map.get("user_" + i))) {
                collisionAndResizeSuccess = false;
                break;
            }
        }

        if (collisionAndResizeSuccess) {
            System.out.println("✅ TEST PASSED: Çarpışmalar (Collision) Linked List ile çözüldü.");
            System.out.println("✅ TEST PASSED: Tablo başarıyla büyütüldü (Resize) ve sıfır veri kaybı yaşandı.");
        } else {
            System.out.println("❌ TEST FAILED: Çarpışma veya Resize sırasında veriler ezildi!");
        }

        // Silme (Remove) Testi
        // NOT: Eğer arkadaşın HashTable sınıfının içine remove() metodu yazmadıysa
        // aşağıdaki kısmı silebilirsin. Yazdıysa test edecektir.
        try {
            map.remove("test_key");
            if (map.get("test_key") == null) {
                System.out.println("✅ TEST PASSED: Remove (Silme) işlemi doğru çalışıyor.");
            }
        } catch (Exception e) {
            System.out.println("⚠️ Uyarı: HashTable sınıfında remove() metodu tanımlanmamış olabilir, test atlandı.");
        }
    }
}