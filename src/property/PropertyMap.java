package property;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * @author Semih Tuncel
 */
public class PropertyMap {

    private final Map<String, Object> properties;

    /**
     * Thread-safe hash map ile bos bir property store olusturuyor.
     */
    public PropertyMap() {
        this.properties = new ConcurrentHashMap<>();
    }

    /**
     * Bir property ekliyor veya guncelliyor.
     */
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
    public Object get(String key) {
        validateKey(key);
        return properties.get(key);
    }

    /**
     * Keyin property'ler arasinda var olup olmadigini kontrol ediyor.
     */
    public boolean has(String key) {
        validateKey(key);
        return properties.containsKey(key);
    }

    /**
     * Key ile bir propertyi siliyor.
     */
    public Object remove(String key) {
        validateKey(key);
        return properties.remove(key);
    }

    /**
     * Tum propertyleri donduruyor. Defensive copy yapiyoruz boylece disaridan propertyleri degistirilemiyor..
     */
    public Map<String, Object> getAll() {
        return new ConcurrentHashMap<>(properties);
    }

    /**
     * Null veya bos key girilmesi engelleniyor.
     */
    private void validateKey(String key) {
        if (key == null || key.trim().isEmpty()) {
            throw new IllegalArgumentException("Property key cannot be null or blank.");
        }
    }
}
