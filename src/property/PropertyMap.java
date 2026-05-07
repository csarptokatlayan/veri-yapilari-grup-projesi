package property;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;


public class PropertyMap {

    private final Map<String, Object> properties;

    /**
     * Thread-safe hash map ile bos bir property store olusturuyor.
     */
    //  @author Semih Tuncel
    public PropertyMap() {
        this.properties = new ConcurrentHashMap<>();
    }

    /**
     * Bir property ekliyor veya guncelliyor.
     */
    //  @author Semih Tuncel
    public void put(String key, Object value) {
        validateKey(key);

        if (value == null) {
            throw new IllegalArgumentException("Property value cannot be null.");
        }

        properties.put(key, value);
    }

    /**
     * Key ile bir propertyin degerini donduruyor.
     */
    //  @author Semih Tuncel
    public Object get(String key) {
        validateKey(key);
        return properties.get(key);
    }

    /**
     * Keyin property'ler arasinda var olup olmadigini kontrol ediyor.
     */
    //  @author Semih Tuncel
    public boolean has(String key) {
        validateKey(key);
        return properties.containsKey(key);
    }

    /**
     * Key ile bir propertyi siliyor.
     */
    //  @author Semih Tuncel
    public Object remove(String key) {
        validateKey(key);
        return properties.remove(key);
    }

    /**
     * Tum propertyleri donduruyor. Defensive copy yapiyoruz boylece disaridan propertyleri degistirilemiyor..
     */
    //  @author Semih Tuncel
    public Map<String, Object> getAll() {
        return new ConcurrentHashMap<>(properties);
    }

    /**
     * Null veya bos key girilmesi engelleniyor.
     */
    //  @author Semih Tuncel
    private void validateKey(String key) {
        if (key == null || key.trim().isEmpty()) {
            throw new IllegalArgumentException("Property key cannot be null or blank.");
        }
    }
}
