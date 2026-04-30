# Veri Yapıları Projesi - 30 Nisan Ara Raporu

## 1. Proje Yönetimi ve Koordinasyon
* Ekipçe gerçekleştirilen 3 planlama toplantısı sonucunda projenin yazılacağı dil, mimari tasarım ve ileride kullanılacak arayüz kütüphaneleri kararlaştırılmıştır.
* Görev dağılımı yapılarak **Kanban** panosu oluşturulmuş, ilk geliştirme aşaması parçalara bölünerek **US1** adı altında ekibe dağıtılmış ve an itibariyle US1 başarıyla tamamlanmıştır.
* Sürecin başındaki Git ve GitHub adaptasyon süreci başarıyla atlatılmış, ekipçe çalışma ve versiyon kontrol temelleri sağlamlaştırılmıştır. Bu sayede projenin kalan fazlarının çok daha hızlı ilerlemesi öngörülmektedir.

## 2. Teknik Geliştirmeler ve Kod Kalitesi
* Çizge (Graph) mimarisinin temellerini oluşturan `Node`, `Edge` ve eşzamanlı çalışmaya uygun `PropertyMap` yapıları kodlanmıştır.
* Ana `Graph` yöneticisi oluşturulmuştur. Bu sınıfta, aranan düğüme döngüsüz ve **O(1) zaman karmaşıklığında** erişebilmek için ID bazlı ikincil bir Map mimarisi kurulmuştur.
* Geliştirme sürecinde "Clean Code" prensiplerine sadık kalınmış, okunabilirliği artırmak ve gelecekteki arayüz entegrasyonunu kolaylaştırmak adına detaylı yorum satırları eklenmiştir.

## 3. GitHub İş Akışı ve Raporlanan Bulgular
* **Paralel Geliştirme:** Her ekip üyesi kendi özelliği (feature) için ayrı bir dal (branch) açıp izole bir şekilde çalışmıştır. Tamamlanan modüller, kod incelemesinin ardından `main` dalına **PR (Pull Request)** açılarak güvenli bir şekilde birleştirilmiştir.
* **Bulgular ve Çözümler:** 