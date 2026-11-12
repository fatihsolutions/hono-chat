2. Proje yapımız nasıl olacak?
Şöyle bir dosya yapısı oluşturacağız:
hono-chat/

src/

index.ts

Hono backend


public/

index.html

Sayfa yapısı

style.css

Figma tasarımı

script.js

DOM ve mesajlaşma


package.json

tsconfig.json



Hono'da serveStatic kullanarak public klasöründeki dosyaları tarayıcıya sunacağız.
3. Figma tasarımını hangi sırayla yapacağız?
1

HTML

Sidebar, chat header, mesaj kutuları ve input oluşturma


2

CSS

Flexbox, renkler, genişlikler, padding, margin ve responsive tasarım


3

JavaScript

Mesaj yazma, gönderme ve DOM'a yeni mesaj ekleme


4

Hono + WebSocket

İki farklı tarayıcı arasında gerçek zamanlı mesajlaşma



Şimdi ilk görevimiz
Terminalde npm create hono@latest komutunu çalıştır ve Node.js template seç.

Henüz Figma'nın oluşturduğu App.tsx veya index.css dosyalarını kopyalama. Biz kendi HTML, CSS ve JavaScript dosyalarımızı yazacağız.

Bir önemli soru: Daha önce oluşturduğun min-hono-app projesinde devam etmek mi istiyorsun, yoksa hono-chat adında tamamen yeni bir proje mi açalım?

Ben yeni proje açmanı öneriyorum. Böylece eski Hono çalışmaların da korunur.