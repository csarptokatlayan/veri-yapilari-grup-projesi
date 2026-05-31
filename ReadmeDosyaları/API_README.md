# 🌐 Frontend & Backend API İletişim Kontratı

Bu doküman, Frontend motorunun sorunsuz çalışması için Java Spring Boot tarafında açılması gereken endpoint'leri ve JSON şemalarının kurallarını tanımlar. Frontend tarafında Cytoscape render motoru ve React bileşenleri, aşağıdaki sözleşmeye uygun gelen veriyi doğrudan kullanarak harita çizimi ve detay paneli gösterimi yapar.

## 1. Düğüm (Node) Detaylarını Getirme (RightInspector için)

### Endpoint

```http
GET /api/nodes/{id}
```

### Açıklama

Sağ paneldeki inspektör bir düğüme tıklandığında çalışır. Bu endpoint, seçilen node'un detay bilgilerini döndürmelidir.

### JSON Şeması Örneği

```json
{
  "id": "1",
  "type": "USER",
  "properties": {
    "name": "Ahmet Yılmaz",
    "username": "ahmety",
    "email": "ahmet@example.com",
    "createdAt": "2026-05-31T18:00:00"
  }
}
```

Alternatif olarak `type` yerine `nodeType` alanı da kullanılabilir:

```json
{
  "id": "1",
  "nodeType": "USER",
  "properties": {
    "name": "Ahmet Yılmaz",
    "username": "ahmety"
  }
}
```

### Alan Kuralları

| Alan | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- |
| `id` | `String` | Evet | Node kimliği. JSON içinde her zaman string dönülmelidir. |
| `type` veya `nodeType` | `String` | Evet | Node türü. Örn: `USER`, `POST`, `PHOTO`. |
| `properties` | `Object / Map` | Evet | Dinamik detay alanları. Frontend bu alanları sağ panelde tablo olarak listeler. |

> `properties` içindeki key-value değerleri sabit bir şemaya bağlı değildir. Backend, ilgili node tipine göre farklı alanlar dönebilir.

## 2. Ana Haritayı (Graph) Getirme (CenterCanvas için)

### Endpoint

```http
GET /api/graph
```

Algoritma çıktıları için de aynı JSON formatı beklenmektedir:

```http
GET /api/graph/bfs
```

### Açıklama

Haritadaki node'ları ve edge'leri çizmek için kullanılır. Frontend, bu endpoint'ten gelen `nodes` ve `edges` dizilerini Cytoscape render motoruna aktarır.

### JSON Şeması Örneği

```json
{
  "nodes": [
    {
      "id": "1",
      "title": "Ahmet Yılmaz",
      "nodeType": "USER",
      "properties": {
        "username": "ahmety",
        "email": "ahmet@example.com"
      }
    },
    {
      "id": "2",
      "title": "Tatil Fotoğrafı",
      "nodeType": "PHOTO",
      "properties": {
        "url": "https://example.com/photo/2",
        "createdAt": "2026-05-31T18:10:00"
      }
    }
  ],
  "edges": [
    {
      "source": "1",
      "target": "2",
      "type": "SHARED",
      "directed": true
    }
  ]
}
```

### `nodes` Dizisi Alan Kuralları

| Alan | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- |
| `id` | `String` | Evet | Node kimliği. Kesinlikle string formatında dönülmelidir. |
| `title` | `String` | Evet | Harita üzerinde gösterilecek kısa başlık. |
| `nodeType` | `String` | Evet | Node türü. Örn: `USER`, `POST`, `PHOTO`. |
| `properties` | `Object / Map` | Evet | Node'a ait ek veriler. Detay panelinde dinamik olarak gösterilebilir. |

### `edges` Dizisi Alan Kuralları

| Alan | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- |
| `source` | `String` | Evet | Kaynak node ID'si. JSON içinde string olmalıdır. |
| `target` | `String` | Evet | Hedef node ID'si. JSON içinde string olmalıdır. |
| `type` | `String` | Evet | İlişki adı. Örn: `FOLLOWS`, `LIKES`, `SHARED`. |
| `directed` | `boolean` | Evet | İlişkinin yönlü olup olmadığını belirtir. |

## Kritik Uyarı (Backend için)

Render motoru `Integer` veya `Long` ID değerlerinde hata verebileceği için veri tabanındaki ID tipleri ne olursa olsun JSON içinde `id`, `source` ve `target` değerleri her zaman `String` formatında dönülmelidir.

Doğru kullanım:

```json
{
  "id": "1",
  "source": "1",
  "target": "2"
}
```


