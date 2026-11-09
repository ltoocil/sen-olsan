# Sen Olsan?

Bu depo, 3H Hareketi’nin Sen Olsan? kavramı için hazırlanmış statik bir prototiptir. Her tamamlanan rota tam beş karardır. Kararlardan sonra kurmaca değer göstergeleri ve, onlardan ayrı, kurmaca memnuniyet puanları değişir. Açık veya koyu görünüm tarayıcıda saklanır.

Metin sürümü 3 (v6): Üç senaryo baştan yazıldı. Her senaryoda en fazla dört adlı kişi vardır; dallar her bölümde iki duruma birleşir, her rota beş karar sürer ve senaryo başına dört farklı son vardır. `node rota-kontrol.js` bütün rotaları denetler.

Birinci senaryo olan “Kayıt açık mı, söz açık mı?”, kavram notundaki kurgusal örneğin omurgasını kullanır. Diğer iki senaryo ve bütün ayrıntılı dallar, prototipin oynanabilmesi için yazılmış kurgudur. Metinler hukuki danışmanlık değildir. Sayfa üyelik istemez, dosya yüklemez ve kişisel veri toplamaz. Tamamlanan rotalar yalnız tarayıcının `localStorage` alanına yazılır.

## Nasıl çalıştırılır?

Ek paket kurmak gerekmez. Bir statik dosya sunucusu yeterlidir. Sayfayı dosya olarak çift tıklamayın; içerik güvenlik kuralı, sayfanın bir sunucudan açılmasını bekler.

```bash
python3 -m http.server 41773 --bind 127.0.0.1
```

Ardından tarayıcıda [http://127.0.0.1:41773/](http://127.0.0.1:41773/) adresini açın. Port 41773 örnektir; boş bir port da kullanılabilir.

## Bu ortamın sınırları

- Çalışma zamanı için Node, veritabanı, ücretli barındırma veya gizli anahtar gerekmez.
- JavaScript açık olmalıdır. Kapalıysa sayfa, üç senaryoyu anlatan kısa bir yedek metin gösterir ve kartlar seçilemez.
- Rota karşılaştırması `localStorage` anahtarı `sen-olsan-rotalar-v1` içindedir. Tarayıcı en fazla 24 tamamlanmış rota tutar. Yarım kalan oyun `sessionStorage` içinde kalır ve sunucuya gitmez.
- Yazı tipleri Fraunces ve Manrope, SIL Open Font License 1.1 ile `assets/fonts/` klasörüne konulmuştur. Lisans metni `assets/fonts/OFL.txt` dosyasındadır.
- Bu çalışma ortamında `ngrok` komutu yüklü değildir ve `NGROK_AUTHTOKEN` tanımlı değildir. Bu nedenle genel bir tünel açılmamıştır. Prototip yerelde `http://127.0.0.1:41773/` adresinde servis edilir. Dağıtılabilir arşiv `/opt/cursor/artifacts/sen-olsan-prototip.zip` dosyasıdır.

## English

This is a static Turkish prototype. From the project directory, run `python3 -m http.server 41773 --bind 127.0.0.1` and open `http://127.0.0.1:41773/`. Do not open `index.html` with a `file://` URL. No environment variables are required. Completed routes stay in the browser only.
