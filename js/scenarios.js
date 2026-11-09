/* Sen Olsan? metin sürümü 3.
   Üç kurgu senaryo. Her rota tam beş karardır. Dallar sade tutuldu: her bölümde iki durum vardır
   ve her seçim bir sonraki durumu belirler. Sonuçlar mahkeme kararı değildir. */
(function () {
  function D(v, p, vw, pw) {
    return { v: v || {}, p: p || {}, vw: vw || "", pw: pw || {} };
  }
  function O(id, key, title, body, event, next, d) {
    return { id: id, key: key, title: title, body: body, event: event, next: next, deltas: d };
  }
  function E(id, key, title, body, event, outcome, d) {
    return { id: id, key: key, title: title, body: body, event: event, ending: true, outcome: outcome, deltas: d };
  }
  function OUT(o) {
    return {
      headline: o.h, protagonist: o.sen,
      others: o.others.map(function (pair) { return { who: pair[0], what: pair[1] }; }),
      gained: o.kazanc, lost: o.kayip, open: o.acik, because: o.neden, reflection: o.sorular
    };
  }
  function N(info, question, options) {
    return { info: info, question: question, options: options };
  }

  var kayit = {
    id: "kayit",
    title: "Kayıt açık mı, söz açık mı?",
    badge: "Kurgu senaryo · Mahremiyet ve bilgiye erişim",
    rights: "Bir toplantıyı kaydetmek, gelemeyenin bilgi hakkını korur; ama kayda girmek istemeyenin mahremiyetini zorlayabilir.",
    nodes: {
      start: {
        scene: "Sen Deniz’sin, Lale Mahallesi Derneği’nin sekreterisin. Bu akşam dernekte mahalleden geçen gece otobüsü konuşulacak; emekli öğretmen Selma, belediyeyle yaptığı görüşmeyi anlatacak. Dernek, toplantıları normalde kaydedip üyelerin mesaj grubunda paylaşır, çünkü yürüme güçlüğü olan üye Leyla salona çıkan merdiveni kullanamıyor ve toplantıları ancak kayıttan izleyebiliyor. Belediye otobüsünde şoför olan komşunuz Emre ise toplantıda soru sormak istiyor; ama amirleri görüntüsünü görürse işinin zora gireceğini söylüyor ve kaydedilmek istemiyor.",
        question: "Toplantı başlamadan önce kayıt konusunda ne yaparsın?",
        options: [
          O("k1a", "A", "Kaydı aç, ama kamerayı yalnızca konuşmacı Selma’ya çevir.",
            "Selma kaydedilir. Soru soranlar ve salondakiler görüntüye girmez. Kayıt gece Leyla’ya gönderilir.",
            "Kamerayı kürsüye sabitledin ve salona, soru soranların kayda girmeyeceğini duyurdun. Selma kabul etti, Emre de rahatladı. Leyla’ya kaydı gece göndereceğini yazdın. Bu seçimle hem Leyla’nın bilgiye erişimi hem de Emre’nin mahremiyeti gözetildi.",
            "k2a",
            D({ mahremiyet: 10, esit: 5 }, { selma: 5, emre: 15, leyla: 10, salon: 5 },
              "Leyla toplantıya kayıttan erişebilecek, Emre de görüntüye girmeyecek. Bu yüzden mahremiyet ve eşit muamele arttı.",
              { selma: "Kendi kaydı yapılıyor.", emre: "Görüntüye girmeyeceği söylendi.", leyla: "Kaydı gece alacak.", salon: "Kural baştan açıkça duyuruldu." })),
          O("k1b", "B", "Bu akşam hiç kayıt yapma, sonra yazılı bir özet paylaş.",
            "Kimse kaydedilmez. Leyla toplantıyı ertesi gün paylaşılacak yazılı özetten öğrenir.",
            "Salona bu akşam kayıt yapılmayacağını söyledin ve Emre rahat bir şekilde yerine oturdu. Leyla ise mesajına kırgın bir cevap yazdı: “Selma’yı kendi sesinden dinlemek isterdim.” Bu seçimle mahremiyet güçlendi, ama Leyla’nın toplantıya diğer üyelerle eşit katılımı zayıfladı.",
            "k2b",
            D({ mahremiyet: 15, esit: -10 }, { emre: 20, leyla: -15, selma: -5 },
              "Kimse kaydedilmediği için mahremiyet arttı. Leyla toplantıyı salondakiler gibi takip edemeyeceği için eşit muamele azaldı.",
              { emre: "Hiç kayıt olmayacağı için rahatladı.", leyla: "Toplantıyı yalnızca özetten öğrenecek.", selma: "Anlatımının kaydedilmemesine biraz üzüldü." }))
        ]
      },
      k2a: N("Toplantı başladı. Selma, belediyenin gece otobüsünü haftada üç geceye indirmeyi planladığını anlattı. Soru sırası gelince Emre söz aldı ve şoförlere bu karar hakkında hiçbir şey sorulmadığını söyledi. Tam o sırada ön sıradaki bir komşunun telefonunu kaldırıp Emre’yi çektiğini gördün.",
        "Kayda girmek istemeyen Emre’yi bir komşu telefonla çekiyor. Ne yaparsın?",
        [
          O("k2aa", "A", "Toplantıyı kısa süre durdur ve komşudan videoyu silmesini rica et.",
            "Kuralı herkesin önünde hatırlatırsın: Bu akşam soru soranlar kayda girmiyor.",
            "Toplantıyı bir dakikalığına durdurup kuralı hatırlattın. Komşu biraz bozuldu ama videoyu herkesin önünde sildi. Emre sorusunu tamamlayabildi. Bu seçimle Emre’nin kendi görüntüsü üzerindeki söz hakkı, yani mahremiyeti korundu.",
            "k3a",
            D({ mahremiyet: 10, ifade: -5 }, { emre: 10, salon: -5, selma: -5 },
              "Video silindiği için mahremiyet arttı. Komşunun çekim yapma isteği kısıtlandığı ve konuşma kesildiği için ifade özgürlüğü biraz azaldı.",
              { emre: "Videonun silindiğini gördü.", salon: "Toplantının kesilmesinden hoşlanmadılar.", selma: "Anlatımı yarıda kaldı." })),
          O("k2ab", "B", "Toplantıyı bölme; arada komşuyla yalnız konuşmayı bekle.",
            "Emre’nin sözü kesilmez. Ama bu sırada video başkalarına ulaşabilir.",
            "Emre sorusunu bitirdi ve toplantı akıcı biçimde sürdü. Arada komşunun yanına gittiğinde, videoyu çoktan mahallenin mesaj grubuna koyduğunu öğrendin. Bu seçimle konuşma kesilmedi, ama Emre’nin görüntüsü onun izni olmadan yayıldı.",
            "k3b",
            D({ ifade: 5, mahremiyet: -15 }, { emre: -15, salon: 5, selma: 5 },
              "Konuşma kesilmediği için ifade özgürlüğü korundu. Emre’nin görüntüsü izinsiz yayıldığı için mahremiyet belirgin biçimde düştü.",
              { emre: "Görüntüsü izni olmadan gruba düştü.", salon: "Toplantı kesilmeden sürdü.", selma: "Anlatımını rahatça bitirdi." }))
        ]),
      k2b: N("Kayıt olmadığı için toplantı rahat bir havada başladı. Selma, belediyenin gece otobüsünü haftada üç geceye indirmeyi planladığını anlattı. Emre söz alıp şoförlere bu karar hakkında hiçbir şey sorulmadığını söylerken ön sıradaki bir komşu telefonunu kaldırdı ve onu çekmeye başladı. Komşu, “Leyla da görsün diye çekiyorum” dedi.",
        "Kayıt yapılmayacağı söylenmişken bir komşu Emre’yi telefonla çekiyor. Ne yaparsın?",
        [
          O("k2ba", "A", "Toplantıyı kısa süre durdur ve bu akşam kayıt olmadığını hatırlat.",
            "Komşudan çekimi silmesini istersin. Aynı kural salondaki herkes için geçerlidir.",
            "Toplantıyı durdurup bu akşam kayıt yapılmadığını hatırlattın. Komşu iyi niyetle çektiğini söyledi ve videoyu sildi. Emre sorusunu bitirdi. Bu seçimle herkese aynı kural uygulandı ve Emre’nin mahremiyeti korundu.",
            "k3a",
            D({ mahremiyet: 10, esit: 5, ifade: -5 }, { emre: 10, salon: -5, leyla: -5 },
              "Video silindiği için mahremiyet arttı ve kural herkese aynı uygulandı. Konuşma kesildiği için ifade özgürlüğü biraz azaldı.",
              { emre: "Videonun silindiğini gördü.", salon: "Toplantının bölünmesinden hoşlanmadılar.", leyla: "Emre’nin sorusunu yine göremeyecek." })),
          O("k2bb", "B", "Toplantıyı bölme; arada komşuyla konuşmayı bekle.",
            "Konuşma akışı bozulmaz. Ama video bu sırada paylaşılabilir.",
            "Toplantı kesilmeden sürdü. Ara verildiğinde komşu, “Kayıt yok, hiç olmazsa Leyla görsün” diyerek videoyu mahallenin mesaj grubuna koymuştu bile. Bu seçimle Emre’nin sözü kesilmedi, ama görüntüsü onun izni olmadan yayıldı.",
            "k3b",
            D({ ifade: 5, mahremiyet: -15 }, { emre: -15, leyla: 5, salon: 5 },
              "Konuşma kesilmediği için ifade özgürlüğü korundu. Emre’nin görüntüsü izinsiz yayıldığı için mahremiyet belirgin biçimde düştü.",
              { emre: "Görüntüsü izni olmadan gruba düştü.", leyla: "Emre’nin sorusunu videodan izleyebildi.", salon: "Toplantı kesilmeden sürdü." }))
        ]),
      k3a: N("Toplantı bitti. Çekim yapan komşu çıkışta yanına geldi ve “Herkesin önünde konuşan biri görüntülenmeye itiraz edemez, bu düpedüz sansür” dedi. Salondaki birkaç kişi de ona hak verdi. Derneğin yönetimi, gelecek toplantılar için yazılı bir kayıt kuralı istiyor ve öneriyi senden bekliyor.",
        "Yönetime hangi kayıt kuralını önerirsin?",
        [
          O("k3aa", "A", "Soru soranların yalnızca izin verirlerse kaydedilmesini öner.",
            "Konuşmacılar kaydedilir. Salondakiler ve soru soranlar ancak açıkça “evet” derse görüntüye girer.",
            "Önerini yazdın ve yönetim kabul etti. Çekim yapan komşu kuralı yanlış buldu, ama Emre gibi kaydedilmek istemeyenler artık toplantıya rahatça gelebilecek. Bu seçimle her katılımcının kendi görüntüsü hakkında karar verme özerkliği korundu.",
            "k4a",
            D({ ozerklik: 10, mahremiyet: 5, ifade: -5 }, { emre: 10, salon: -5 },
              "Herkes kaydedilip kaydedilmeyeceğine kendisi karar vereceği için bireysel özerklik arttı. Salondakilerin serbestçe çekim yapma imkânı daraldığı için ifade özgürlüğü biraz azaldı.",
              { emre: "Kural onun endişesini karşıladı.", salon: "Bazıları kuralı fazla katı buldu." })),
          O("k3ab", "B", "Toplantıların herkese açık olduğunu, isteyenin çekim yapabileceğini öner.",
            "Kimsenin çekim yapması engellenmez. Kaydedilmek istemeyen, toplantıda söz almamayı seçer.",
            "Önerini yazdın ve yönetim kabul etti. Çekim yapan komşu ve birçok üye memnun kaldı. Emre ise “O zaman ben bu toplantılarda konuşamam” dedi. Bu seçimle salondakilerin kayıt yapma özgürlüğü genişledi, ama kaydedilmek istemeyenlerin mahremiyeti zayıfladı.",
            "k4b",
            D({ ifade: 10, mahremiyet: -10 }, { emre: -15, salon: 10, leyla: 5 },
              "Herkes çekim yapabileceği için ifade özgürlüğü arttı. Kaydedilmek istemeyenlerin seçeneği daraldığı için mahremiyet azaldı.",
              { emre: "Toplantıda konuşamayacağını düşünüyor.", salon: "Çoğu üye kuralı sevdi.", leyla: "Daha fazla video izleyebilecek." }))
        ]),
      k3b: N("Video mahallenin mesaj grubunda kırk kişiye ulaştı. Emre seni aradı: “Amirim de bu grupta. Videoyu görürse beni gece seferinden alabilirler.” Grubun yöneticisi sensin ve mesajları silme yetkin var. Bazı üyeler ise videonun silinmesine karşı çıkıyor: “Toplantıda söylenen her şey zaten herkese açık.”",
        "Gruptaki video için ne yaparsın?",
        [
          O("k3ba", "A", "Videoyu gruptan kaldır ve nedenini gruba açıkça yaz.",
            "Videoyu silersin ve “Kayda girmek istemeyen birinin görüntüsü izinsiz paylaşılmaz” diye açıklama yaparsın.",
            "Videoyu kaldırdın ve nedenini gruba yazdın. Bazı üyeler bunu sansür saydı ve itiraz etti, ama Emre’nin görüntüsü daha fazla yayılmadı. Bu seçimle, çoğunluk videoyu görmek istese de bir kişinin kendi görüntüsü üzerindeki hakkı korundu.",
            "k4a",
            D({ mahremiyet: 15, ifade: -5 }, { emre: 15, salon: -10, leyla: -5 },
              "Emre’nin görüntüsü yayılmayı bıraktığı için mahremiyet arttı. Grupta paylaşılan bir içerik kaldırıldığı için ifade özgürlüğü biraz azaldı.",
              { emre: "Videonun kaldırıldığını gördü.", salon: "Bazı üyeler silinmeye kızdı.", leyla: "Soru-cevap bölümünü hâlâ tam bilmiyor." })),
          O("k3bb", "B", "Videoyu bırak; Emre’ye gruba kendi açıklamasını yazmasını öner.",
            "İçeriği silmezsin. Emre isterse “Görüntülenmek istemedim” diye kendi sesini gruba ekler.",
            "Videoyu silmedin. Emre kısa bir mesaj yazdı: “Görüntülenmek istemedim, lütfen paylaşmayın.” Birkaç kişi özür diledi, ama video grupta kaldı. Bu seçimle paylaşım özgürlüğüne dokunulmadı, ama Emre’nin mahremiyetinin yükü yine Emre’ye kaldı.",
            "k4b",
            D({ ifade: 5, mahremiyet: -10 }, { emre: -10, salon: 5, leyla: 5 },
              "Hiçbir içerik silinmediği için ifade özgürlüğü korundu. Emre’nin videosu grupta kaldığı için mahremiyet düştü.",
              { emre: "Kendi derdini kendisi anlatmak zorunda kaldı.", salon: "Grup kendi hâlinde kaldı.", leyla: "Videoyu izleyebildi." }))
        ]),
      k4a: N("Bir hafta sonra ikinci toplantı yapılacak. Dernek, soru soranların izinleri olmadan kaydedilmemesi gerektiğini açıkça savundu. Ancak Leyla yazılı bir şikâyet gönderdi: Geçen toplantının en önemli kısmı soru-cevap bölümüydü, ama kendisi Emre’nin sorusunu ve Selma’nın cevabını tam olarak öğrenemedi. “Salondakiler her şeyi biliyor, ben yalnızca yarısını” diyor.",
        "Leyla’nın da salondakiler kadar bilgi alması için ne yaparsın?",
        [
          O("k4aa", "A", "Soruları ve cevapları, kimsenin adını yazmadan yazılı özete ekle.",
            "Toplantıdan sonra her soru ve cevap kısaca yazılır. Soru soranın adı yazılmaz.",
            "İkinci toplantıdan sonra soruları ve cevapları adsız olarak yazıp paylaştın. Leyla, Emre’nin sorusunun ne olduğunu ilk kez öğrendi. Emre’nin adı hiçbir yerde geçmedi. Bu seçimle Leyla’nın bilgiye eşit erişimi arttı ve kimsenin mahremiyeti zarar görmedi.",
            "k5a",
            D({ esit: 10, mahremiyet: 5 }, { leyla: 15, emre: 5 },
              "Leyla bilgiye diğer üyeler gibi ulaşabildiği için eşit muamele arttı. Hiçbir ad yazılmadığı için mahremiyet de korundu.",
              { leyla: "Soruların ve cevapların tamamını okudu.", emre: "Adı hiçbir yerde geçmedi." })),
          O("k4ab", "B", "Leyla’yı toplantıya canlı görüntülü aramayla bağla.",
            "Telefon kürsüye konur. Kamerada yalnızca Selma görünür, ama Leyla salondaki her sesi duyar.",
            "İkinci toplantıda Leyla’yı görüntülü aramayla bağladın. Kamerada yalnızca Selma göründü, ama Leyla bütün soruları canlı dinledi ve kendisi de bir soru sordu. Emre bu kez rahatça salona geldi. Bu seçimle Leyla toplantıya diğer üyeler gibi katıldı.",
            "k5b",
            D({ esit: 15, ifade: 5 }, { leyla: 20, emre: 5, selma: 5 },
              "Leyla toplantıya canlı katılıp soru da sorabildiği için eşit muamele ve ifade özgürlüğü arttı.",
              { leyla: "Toplantıya canlı katıldı ve soru sordu.", emre: "Görüntüye girmeden salona geldi.", selma: "Anlatımı Leyla’ya da ulaştı." }))
        ]),
      k4b: N("Bir hafta sonra ikinci toplantı yapılacak. Dernek, toplantıda çekilen görüntülere karışmama yolunu seçti. Emre bu yüzden toplantıya gelmeyeceğini söyledi, ama şoförlerin itirazının duyulmasını hâlâ istiyor. Selma da belediyeyle yapacağı ikinci görüşme için şoförlerin görüşüne ihtiyaç duyuyor.",
        "Emre gelmek istemezken itirazı toplantıya nasıl ulaşsın?",
        [
          O("k4ba", "A", "Emre’nin yazılı itirazını, adını söylemeden toplantıda sen oku.",
            "Emre itirazını yazar ve sana verir. Sen onu “Bir şoför şunu söylüyor” diyerek okursun.",
            "Emre’nin yazdığı itirazı adını vermeden okudun. Salondakiler şoförlerin neden rahatsız olduğunu ilk kez açıkça duydu. Emre evde kaldı ama sözü toplantıya ulaştı. Bu seçimle Emre hem sesini duyurdu hem de görüntüsünü korudu.",
            "k5a",
            D({ ifade: 10, mahremiyet: 5 }, { emre: 10, selma: 5, salon: 5 },
              "Emre’nin görüşü salona ulaştığı için ifade özgürlüğü arttı. Adı ve yüzü görünmediği için mahremiyet de korundu.",
              { emre: "Sözü salona ulaştı, kendisi görünmedi.", selma: "Şoförlerin görüşünü öğrendi.", salon: "Yeni bir bakış açısı duydu." })),
          O("k4bb", "B", "Toplantının son yarım saatini çekime kapat ve Emre’yi davet et.",
            "Son bölümde kimse çekim yapamaz. Emre gelir ve itirazını kendisi anlatır.",
            "Toplantının son yarım saatinin çekime kapalı olacağını duyurdun. Bazı üyeler kurala uymak zorunda kaldıkları için homurdandı. Emre geldi ve itirazını kendisi anlattı. Bu seçimle hem açık toplantı ilkesi sürdü hem de Emre’ye güvenli bir konuşma alanı açıldı.",
            "k5b",
            D({ ifade: 10, mahremiyet: 10, esit: -5 }, { emre: 15, salon: -5, leyla: -5 },
              "Emre kendi sözünü güvenle söyleyebildiği için ifade özgürlüğü ve mahremiyet arttı. Leyla son bölümü izleyemediği için eşit muamele biraz azaldı.",
              { emre: "Salonda kendi sözünü söyledi.", salon: "Çekim yasağına homurdandılar.", leyla: "Son bölümü izleyemedi." }))
        ]),
      k5a: N("İkinci toplantıdan sonra dernek, gece otobüsü itirazını belediyeye bir dilekçeyle götürmeye karar verdi. Dilekçede şoförlerin görüşü var, ama hiçbir şoförün adı yok. Belediyeden bir görevli Selma’ya, “Adı olmayan iddiaları dikkate almakta zorlanıyoruz” dedi. Emre ise adının duyulmasından hâlâ çekiniyor.",
        "Dilekçeyi belediyeye nasıl verirsin?",
        [
          E("k5aa", "A", "Dilekçeyi adsız bırak ve derneğin adıyla imzala.",
            "Şoförlerin görüşü derneğin sözü olarak verilir. Hiçbir şoförün adı geçmez.",
            "Dilekçeyi derneğin adıyla imzalayıp verdin. Belediye dilekçeyi kayda aldı, ama şoförlerin görüşünü “doğrulanamadı” diye bir kenara koydu. Emre’nin adı hiçbir yerde geçmedi.",
            OUT({
              h: "Emre korundu, ama şoförlerin itirazı belediyede zayıf kaldı.",
              sen: "Dernek adına dilekçeyi sen imzaladın. Emre’yi riske atmadın, ama belediyeyi şoförlerin görüşünün gerçek olduğuna ikna edemedin.",
              others: [["Emre, şoför", "İşi ve görüntüsü güvende kaldı. İtirazının etkisiz kalmasına ise üzüldü."], ["Selma, konuşmacı", "Belediye görüşmesinde elinde güçlü bir kanıt yoktu."], ["Leyla, evdeki üye", "Dilekçenin içeriğini okudu ve sürece dahil olduğunu hissetti."]],
              kazanc: "Kimse istemediği bir riske sokulmadı. Dernek, üyelerinin kimliğini korumaya özen gösterdi.",
              kayip: "Belediye gece otobüsü kararını değiştirmedi. Seferler haftada üç geceye indi.",
              acik: "Adı olmayan bir itirazın nasıl daha güçlü duyulabileceği sorusu çözülmedi.",
              neden: "Korunan değer mahremiyetti: Emre’nin adı ve görüntüsü onun isteği dışında hiçbir yere gitmedi. Bedeli ifade özgürlüğünün etkisi ödedi, çünkü adsız söz daha az ağırlık taşıdı. Pratik ders: Birini korumak için onun adına konuşabilirsin, ama bu sözün gücünü azaltabilir; bunu baştan açıkça hesaba katmak gerekir.",
              sorular: ["Emre’ye sormadan onun adına karar vermek doğru muydu?", "Adsız bir itirazı daha inandırıcı kılmanın başka bir yolu var mıydı?"]
            }),
            D({ mahremiyet: 10, ifade: -10 }, { emre: 5, selma: -10, leyla: 5 },
              "Emre’nin adı korunduğu için mahremiyet arttı. İtiraz belediyede etkisiz kaldığı için ifade özgürlüğünün etkisi azaldı.",
              { emre: "Güvende, ama itirazı sonuç vermedi.", selma: "Belediyede eli zayıf kaldı.", leyla: "Dilekçeyi okuyup sürece katıldı." })),
          E("k5ab", "B", "Adının dilekçede yer alıp almayacağına Emre’nin karar vermesini iste.",
            "Riskleri ve faydaları Emre’ye açıkça anlatırsın. Son kararı o verir.",
            "Emre bir gece düşündü ve iki şoför arkadaşıyla birlikte adını dilekçeye yazdırdı. Belediye, adı olan şoförlerin görüşünü dikkate aldı ve cuma ile cumartesi gece seferlerini geri ekledi. Emre’nin amiri ise onu çağırıp “Bunu bir daha bize sormadan yapma” dedi.",
            OUT({
              h: "Emre kendi kararıyla adını verdi ve iki gece seferi geri geldi.",
              sen: "Kararı riski taşıyacak kişiye bıraktın. Emre’yi zorlamadın, yalnızca bilgilendirdin. Dilekçe beklediğinden daha etkili oldu.",
              others: [["Emre, şoför", "Amirinden sözlü bir uyarı aldı, ama kendi kararını verdiği için pişman değil."], ["Selma, konuşmacı", "Belediyede adı olan tanıklarla güçlü bir görüşme yaptı."], ["Leyla, evdeki üye", "Hafta sonu gece seferlerinin geri gelmesiyle akşam dönüşleri kolaylaştı."]],
              kazanc: "İki gece seferi geri geldi. Şoförlerin sesi resmî olarak duyuldu.",
              kayip: "Emre’nin mahremiyeti onun kendi kararıyla azaldı ve işyerinde bir uyarı aldı.",
              acik: "Emre’nin amirinin bu konuyu ileride ona karşı kullanıp kullanmayacağı belli değil.",
              neden: "Korunan değer bireysel özerklikti: Riskli kararı, riski taşıyacak olan Emre verdi. Bedeli Emre’nin mahremiyeti ödedi, ama bu bedeli kendisi seçti. Pratik ders: Birini korumanın en saygılı yolu, bazen onun yerine karar vermek değil, ona doğru bilgiyi verip kararı ona bırakmaktır.",
              sorular: ["Emre amirinden ceza alsaydı bu karar yine doğru olur muydu?", "Bir dernek, üyesinin aldığı riski paylaşmak için ne yapabilir?"]
            }),
            D({ ozerklik: 15, ifade: 10, mahremiyet: -5 }, { emre: 5, selma: 15, leyla: 10 },
              "Emre kararı kendisi verdiği için bireysel özerklik arttı. Şoförlerin sesi duyulduğu için ifade özgürlüğü güçlendi. Emre’nin adı açıklandığı için mahremiyet biraz azaldı.",
              { emre: "Kararı kendisi verdi, amirinden uyarı aldı.", selma: "Belediyede güçlü bir görüşme yaptı.", leyla: "Gece seferleri geri geldi." }))
        ]),
      k5b: N("İkinci toplantıda Emre itirazını kendi sözleriyle anlattı ve salondakiler onu alkışladı. Selma, belediyeyle yapacağı görüşmeye Emre’yi de götürmek istiyor. Ancak o görüşmede Emre’nin amiri de bulunacak.",
        "Belediye görüşmesi konusunda Emre’ye ne önerirsin?",
        [
          E("k5ba", "A", "Gidip gitmemeye Emre karar versin; ona yalnızca seçenekleri anlat.",
            "Gelirse ne olabileceğini, gelmezse sözünü nasıl taşıyacağınızı anlatırsın. Kararı Emre verir.",
            "Emre seçenekleri dinledi ve görüşmeye gitmeye karar verdi. Belediyede, amirinin de bulunduğu masada sakin ama net konuştu. Belediye, cuma geceleri için deneme amaçlı bir sefer ekledi.",
            OUT({
              h: "Emre kendi isteğiyle belediyeye gitti ve bir gece seferi geri geldi.",
              sen: "Emre’ye baskı yapmadan onu bilgilendirdin. Kendi kararıyla gittiği için konuşması güçlü ve inandırıcı oldu.",
              others: [["Emre, şoför", "Amirinin önünde konuştu. Amiri bir şey söylemedi, ama Emre bundan sonraki günlerden emin değil."], ["Selma, konuşmacı", "Görüşmeye bir tanıkla gittiği için belediyeyi daha kolay ikna etti."], ["Leyla, evdeki üye", "Görüşmenin sonucunu Selma’dan dinledi ve cuma seferine sevindi."]],
              kazanc: "Cuma geceleri için deneme seferi geldi. Emre, sesini kendi seçtiği yolla duyurdu.",
              kayip: "Emre amirinin gözünde artık görünür biri ve bu ileride ona zorluk çıkarabilir.",
              acik: "Deneme seferinin kalıcı olup olmayacağı üç ay sonra belli olacak.",
              neden: "Korunan değer bireysel özerklik ve ifade özgürlüğüydü: Emre ne zaman, nerede ve nasıl konuşacağını kendisi seçti. Bedeli mahremiyet ödedi, çünkü Emre artık herkesin bildiği bir itirazcı. Pratik ders: İnsanlara cesaret vermekle onları bir yöne itmek farklıdır; seçenekleri açıkça anlatıp kararı onlara bırakmak gerekir.",
              sorular: ["Emre gitmemeye karar verseydi, dernek onun sözünü nasıl taşıyabilirdi?", "Bir kişinin cesaretini başkaları adına harcamamak için neye dikkat etmeliyiz?"]
            }),
            D({ ozerklik: 10, ifade: 10, mahremiyet: -5 }, { emre: 10, selma: 10, leyla: 5, salon: 5 },
              "Emre kendi kararıyla konuştuğu için bireysel özerklik ve ifade özgürlüğü arttı. Amirinin önünde görünür olduğu için mahremiyet biraz azaldı.",
              { emre: "Kendi seçtiği yolla konuştu.", selma: "Görüşme beklediğinden iyi geçti.", leyla: "Cuma seferinin gelmesine sevindi.", salon: "Toplantının sonuç verdiğini gördüler." })),
          E("k5bb", "B", "Selma’yla birlikte Emre’yi görüşmeye gelmeye ikna etmeye çalış.",
            "“Senin sözün çok önemli, gelmezsen boşa gider” diyerek onu cesaretlendirirsin.",
            "Selma ile birlikte Emre’yi uzun uzun ikna ettiniz ve Emre sonunda geldi. Ama görüşmede amirini görünce çok az konuştu. Belediye kararını değiştirmedi. Ertesi gün Emre, “Kendimi zorlanmış hissettim” diyerek dernek grubundan çıktı.",
            OUT({
              h: "Emre baskı hissederek gitti, az konuştu ve dernekten uzaklaştı.",
              sen: "İyi niyetle Emre’yi ikna etmeye çalıştın. Ama onun yerine karar vermiş gibi oldun ve dernek bir üyesini kaybetti.",
              others: [["Emre, şoför", "Görüşmeye istemeyerek gitti ve dernek grubundan ayrıldı."], ["Selma, konuşmacı", "Belediyeden sonuç alamadı ve Emre’yi zorladığı için üzüldü."], ["Leyla, evdeki üye", "Sonucu yazılı özetten öğrendi ve hayal kırıklığına uğradı."]],
              kazanc: "Belediye, şoförlerin bir itirazı olduğunu en azından yüz yüze duydu.",
              kayip: "Gece seferleri azaldı ve dernek, sözü değerli bir üyesini kaybetti.",
              acik: "Emre’nin derneğe geri dönüp dönmeyeceği belli değil.",
              neden: "Bu rotada ifade özgürlüğü kâğıt üzerinde kullanıldı, ama bireysel özerklik bedel ödedi: Emre’nin kararı fiilen başkaları tarafından verildi. Pratik ders: Birinin konuşmasını istemek, onu konuşmaya zorlamak anlamına gelmemeli; zorla alınan söz genellikle güçsüz kalır.",
              sorular: ["İkna etmekle baskı yapmak arasındaki çizgi nerede başlar?", "Emre’ye hangi seçenekleri sunsaydın kendini daha özgür hissederdi?"]
            }),
            D({ ozerklik: -15, ifade: -5 }, { emre: -20, selma: -5, leyla: -5, salon: -5 },
              "Emre’nin kararı baskıyla alındığı için bireysel özerklik belirgin biçimde azaldı. Görüşmede az konuşabildiği için ifade özgürlüğünün etkisi de düştü.",
              { emre: "Zorlandığını hissetti ve gruptan çıktı.", selma: "Sonuç alamadı.", leyla: "Seferlerin azalmasına üzüldü.", salon: "Bir üyenin ayrılmasına şaşırdılar." }))
        ])
    }
  };

  var kulup = {
    id: "kulup",
    title: "Konuşmacı gelsin mi?",
    badge: "Kurgu senaryo · İfade özgürlüğü ve itiraz hakkı",
    rights: "Bir fikre itiraz etmek de bir haktır; ama itirazın çokluğu, bir konuşmacının konuşma hakkını ortadan kaldırmaz.",
    nodes: {
      start: {
        scene: "Sen Ece’sin, üniversitedeki Tartışma Kulübü’nün başkanısın. Kulüp, perşembe akşamı ekonomist Kerem’i “Kira tavanı kiracıyı korur mu?” başlıklı bir konuşmaya davet etti; Kerem, kira tavanının kaldırılmasını savunuyor. Yüksek kiralar yüzünden yurt bulmakta zorlanan öğrencilerden Defne, konuşmanın iptali için iki yüz imza topladı ve “Bu fikirler bizi evsiz bırakıyor” diyor. Salonu kulübe veren öğrenci işleri görevlisi Murat ise “Olay çıkarsa salonu geri alırım” diye uyardı.",
        question: "İki yüz imzalık iptal talebi karşısında ne yaparsın?",
        options: [
          O("u1a", "A", "Konuşmayı yap; Defne’ye aynı programda karşı görüş için söz ver.",
            "Kerem konuşur, ardından Defne on beş dakika boyunca itirazlarını anlatır.",
            "Konuşmanın yapılacağını duyurdun ve Defne’ye aynı programda on beş dakika ayırdın. Defne önce şaşırdı, sonra teklifi kabul etti. Kerem de karşı görüşle aynı salonda olmaktan memnun. Bu seçimle hem konuşma hakkı hem de itiraz hakkı aynı sahnede korundu.",
            "u2a",
            D({ ifade: 15, esit: 5 }, { kerem: 10, defne: 10, diger: 5 },
              "Hem Kerem hem Defne konuşabileceği için ifade özgürlüğü arttı. İki görüşe aynı sahnede yer verildiği için eşit muamele de güçlendi.",
              { kerem: "Konuşması iptal edilmedi.", defne: "Kendi görüşü için söz aldı.", diger: "Gerçek bir tartışma izleyecekler." })),
          O("u1b", "B", "Konuşmayı iki hafta ertele ve önce iki tarafla ayrı ayrı görüş.",
            "İptal etmezsin, ama tarihi değiştirirsin. Bu sürede tarafları dinlersin.",
            "Konuşmayı iki hafta erteledin. Kerem ertelemeyi “sessiz bir iptal” olarak gördü ve sosyal medyada eleştirdi; kulübe çok sayıda tepki geldi. Defne ise ertelemeyi bir kazanım saydı. Bu seçimle iptal yapılmadı, ama kalabalığın baskısı programı fiilen değiştirdi.",
            "u2b",
            D({ ifade: -10 }, { kerem: -15, defne: 10, diger: -5, kurul: 5 },
              "Konuşma kalabalığın baskısıyla ertelendiği için ifade özgürlüğü azaldı.",
              { kerem: "Ertelemeyi sessiz bir iptal saydı.", defne: "İmzalarının etkili olduğunu düşündü.", diger: "Program belirsizleşti.", kurul: "Murat, olay riskinin azaldığını düşündü." }))
        ]
      },
      u2a: N("Defne on beş dakikalık konuşma teklifini kabul etti. Ancak ertesi gün Murat aradı: İmza kampanyası sosyal medyada büyümüş ve okul yönetimi “güvenlik” gerekçesiyle konuşmanın yalnızca kulüp üyelerine açık yapılmasını istiyor. Bu şartla, Defne’yi destekleyen ve kulübe üye olmayan öğrenciler salona giremeyecek.",
        "Okul yönetiminin “yalnızca üyeler” şartına ne cevap verirsin?",
        [
          O("u2aa", "A", "Şartı kabul etme; herkese açık olması için bir güvenlik planı sun.",
            "Kapıda görevli gönüllüler, belirlenmiş bir soru sırası ve salon kapasitesi önerirsin.",
            "Yazılı bir güvenlik planı hazırlayıp yönetime sundun. Yönetim planı kabul etti ve salon herkese açık kaldı. Murat ise “Bir sorun çıkarsa sorumlusu sensin” dedi. Bu seçimle konuşmayı dinlemek ve itiraz etmek, üye olsun olmasın her öğrenciye açık kaldı.",
            "u3a",
            D({ ifade: 10, esit: 10 }, { defne: 10, diger: 10, kurul: -10 },
              "Salon herkese açık kaldığı için hem ifade özgürlüğü hem de eşit muamele arttı.",
              { defne: "Destekçileri de salona girebilecek.", diger: "Herkes gelebilecek.", kurul: "Murat sorumluluğu sana bıraktı." })),
          O("u2ab", "B", "Şartı kabul et; salonu üyelere aç ve konuşmayı internetten yayınla.",
            "Salonda yalnızca kulüp üyeleri olur. Diğer öğrenciler konuşmayı canlı yayından izler.",
            "Şartı kabul ettin ve canlı yayın için hazırlık yaptın. Yönetim ve Murat rahatladı. Defne ise “Konuşmaya itiraz edenler salona alınmıyor” diyerek tepki gösterdi. Bu seçimle konuşma güvenceye alındı, ama salona giriş üyelik durumuna göre ayrıldı.",
            "u3b",
            D({ esit: -10, ifade: 5 }, { defne: -10, kurul: 10, kerem: 5 },
              "Konuşma kesin olarak yapılacağı için ifade özgürlüğü biraz arttı. Üye olmayanlar salona alınmayacağı için eşit muamele azaldı.",
              { defne: "Destekçileri dışarıda kalacak.", kurul: "Güvenlik şartı karşılandı.", kerem: "Konuşması güvenceye alındı." }))
        ]),
      u2b: N("Kerem’in eleştirileri ve gelen tepkiler büyüyünce, iki hafta sonra yeni bir tarih belirlemek için okul yönetimiyle görüştün. Yönetim “güvenlik” gerekçesiyle yeni konuşmanın yalnızca kulüp üyelerine açık yapılmasını istiyor. Bu şartla, Defne’yi destekleyen ve kulübe üye olmayan öğrenciler salona giremeyecek.",
        "Yeni tarih için yönetimin “yalnızca üyeler” şartına ne cevap verirsin?",
        [
          O("u2ba", "A", "Yeni tarihi duyur; herkese açık olması için bir güvenlik planı sun.",
            "Kapıda görevli gönüllüler, belirlenmiş bir soru sırası ve salon kapasitesi önerirsin.",
            "Yeni tarihi duyurdun ve yazılı bir güvenlik planı sundun. Yönetim planı kabul etti, salon herkese açık kaldı. Kerem ertelemeye rağmen gelmeyi kabul etti. Bu seçimle konuşma da itiraz da herkese açık hâle geldi.",
            "u3a",
            D({ ifade: 10, esit: 10 }, { kerem: 10, defne: 5, diger: 10, kurul: -5 },
              "Konuşma yeniden takvime girdiği ve salon herkese açık kaldığı için ifade özgürlüğü ve eşit muamele arttı.",
              { kerem: "Konuşmanın gerçekten yapılacağını gördü.", defne: "Salona girebilecek.", diger: "Herkes gelebilecek.", kurul: "Murat plana temkinli bakıyor." })),
          O("u2bb", "B", "Yeni tarihi duyur; salonu yalnızca üyelere aç ve canlı yayın yap.",
            "Salonda yalnızca kulüp üyeleri olur. Diğer öğrenciler konuşmayı canlı yayından izler.",
            "Yeni tarihi duyurdun ve yönetimin şartını kabul ettin. Kerem gelmeyi kabul etti, Murat da rahatladı. Defne ise “Önce ertelediniz, şimdi de bizi kapıda bırakıyorsunuz” dedi. Bu seçimle konuşma güvenceye alındı, ama salona giriş üyelik durumuna göre ayrıldı.",
            "u3b",
            D({ ifade: 5, esit: -10 }, { kerem: 5, defne: -15, kurul: 10 },
              "Konuşma takvime girdiği için ifade özgürlüğü biraz arttı. Üye olmayanlar salona alınmayacağı için eşit muamele azaldı.",
              { kerem: "Konuşması güvenceye alındı.", defne: "Kendini dışlanmış hissetti.", kurul: "Güvenlik şartı karşılandı." }))
        ]),
      u3a: N("Konuşma günü salon tamamen doldu. Kerem konuşmaya başladıktan birkaç dakika sonra arka sıradaki bir grup öğrenci ıslık çalıp “Evsizlik bir fikir değildir!” diye bağırmaya başladı. Kerem beş dakikadır konuşamıyor. Defne bu grubun içinde değil, ama onları tanıyor.",
        "Konuşmayı engelleyen protesto karşısında ne yaparsın?",
        [
          O("u3aa", "A", "Bağırmayı bırakırlarsa pankartlarıyla salonda kalabileceklerini söyle.",
            "Sessiz protesto serbesttir. Konuşmayı engelleyen bağırma ise serbest değildir.",
            "Mikrofonu alıp kuralı açıkladın: Pankartlar kalabilir, ama konuşmacının sözü kesilemez. Defne de gruba gidip onlarla konuştu. Grup bağırmayı bıraktı ve pankartlarıyla arka sırada oturdu. Bu seçimle hem Kerem’in konuşma hakkı hem de protestocuların itiraz hakkı korundu.",
            "u4a",
            D({ ifade: 15, ozerklik: 5 }, { kerem: 10, defne: 10, diger: 10 },
              "Hem konuşma hem de sessiz protesto sürdüğü için ifade özgürlüğü belirgin biçimde arttı.",
              { kerem: "Konuşmasını tamamlayabildi.", defne: "Arkadaşlarının salonda kalmasını sağladı.", diger: "Konuşmayı dinleyebildi." })),
          O("u3ab", "B", "Bağırmaya devam edenlerin salondan çıkarılmasını iste.",
            "Güvenlik görevlileri, uyarıya rağmen bağıran öğrencileri dışarı çıkarır.",
            "Önce uyardın, sonra güvenlik görevlilerinden bağırmaya devam eden altı öğrenciyi dışarı çıkarmalarını istedin. Kerem konuşmasını bitirdi. Ama bu sırada birisi çıkarılan öğrencileri telefonla çekti. Bu seçimle konuşma hakkı korundu, ama itiraz edenler salondan tamamen uzaklaştırıldı.",
            "u4b",
            D({ ifade: 5, ozerklik: -5 }, { kerem: 10, defne: -15, diger: 5, kurul: 5 },
              "Kerem konuşmasını bitirdiği için ifade özgürlüğü biraz arttı. Ancak itiraz edenler zorla çıkarıldığı için bireysel özerklik azaldı.",
              { kerem: "Konuşmasını bitirdi.", defne: "Arkadaşlarının çıkarılmasına öfkelendi.", diger: "Konuşmayı dinleyebildi.", kurul: "Murat, olayın büyümediğine sevindi." }))
        ]),
      u3b: N("Konuşma günü salonda yalnızca kulüp üyeleri var ve konuşma internetten canlı yayınlanıyor. Kapıda içeri alınmayan otuz kadar öğrenci toplandı ve “Bizi neden dışarıda bıraktınız?” diye slogan atıyor. Sesleri salona kadar geliyor ve Kerem konuşmasını yarıda kesmek zorunda kaldı.",
        "Kapıda bekleyen öğrenciler için ne yaparsın?",
        [
          O("u3ba", "A", "Kapıdakilerden beş kişiyi içeri al ve onlara soru hakkı ver.",
            "Kapıdakiler kendi aralarında beş temsilci seçer. Bu kişiler soru-cevap bölümünde söz alır.",
            "Kapıya çıkıp öneriyi yaptın. Öğrenciler Defne dahil beş kişiyi seçti ve sloganlar durdu. Kerem konuşmasını tamamladı, temsilciler de soru-cevapta söz aldı. Bu seçimle salon kapalı kalsa da itiraz edenlerin sesi içeri girdi.",
            "u4a",
            D({ ifade: 10, esit: 5 }, { kerem: 5, defne: 15, diger: 5, kurul: -5 },
              "İtiraz edenler de söz alabildiği için ifade özgürlüğü ve eşit muamele arttı.",
              { kerem: "Konuşmasını tamamladı.", defne: "Salona girip soru sorabildi.", diger: "Sloganlar durdu.", kurul: "Murat, şartın esnetilmesinden hoşlanmadı." })),
          O("u3bb", "B", "Güvenlikten kapı önünü boşaltmasını iste ve konuşmaya devam et.",
            "Güvenlik görevlileri öğrencileri binanın dışına çıkarır. Konuşma kaldığı yerden sürer.",
            "Güvenlik görevlileri kapı önündeki öğrencileri binanın dışına çıkardı ve konuşma kaldığı yerden sürdü. Ama bu sırada birisi uzaklaştırılan öğrencileri telefonla çekti. Bu seçimle konuşma hakkı korundu, ama itiraz edenler hiç duyulmadan uzaklaştırıldı.",
            "u4b",
            D({ ozerklik: -10, esit: -5 }, { kerem: 5, defne: -15, diger: -5, kurul: 10 },
              "Öğrenciler zorla uzaklaştırıldığı için bireysel özerklik azaldı. Yalnızca üyeler dinlenebildiği için eşit muamele de düştü.",
              { kerem: "Konuşmasına devam edebildi.", defne: "Hiç duyulmadan uzaklaştırıldı.", diger: "Olay yüzünden huzursuz oldular.", kurul: "Güvenlik planı işledi." }))
        ]),
      u4a: N("Konuşma, itiraz eden öğrencilerin de salonda olduğu hâliyle bitti. Soru-cevapta Defne ve arkadaşları sert ama saygılı sorular sordu, Kerem de hepsini yanıtladı. Ertesi gün kulübün sosyal medya hesabına yüzlerce yorum geldi. Bazı yorumlar Kerem’e ağır hakaretler içeriyor; bazıları ise Defne’nin adını, fotoğrafını ve kaldığı yurdu paylaşarak onu hedef gösteriyor.",
        "Kulübün hesabındaki yorumlar için ne yaparsın?",
        [
          O("u4aa", "A", "Yalnızca hakaret ve kişisel bilgi içeren yorumları sil, eleştirileri bırak.",
            "Sert eleştiriler kalır. Hakaretler ve Defne’nin yurdunu gösteren yorumlar silinir.",
            "Yorumları tek tek okuyup hakaret içerenleri ve Defne’nin kişisel bilgilerini paylaşanları sildin. Kulübü ve Kerem’i sertçe eleştiren yorumlar ise yerinde kaldı. Bu seçimle hem eleştiri özgürlüğü hem de Defne’nin mahremiyeti korundu.",
            "u5a",
            D({ mahremiyet: 15, ifade: 5 }, { defne: 15, kerem: 5, diger: 5 },
              "Defne’nin kişisel bilgileri kaldırıldığı için mahremiyet arttı. Eleştiriler silinmediği için ifade özgürlüğü de korundu.",
              { defne: "Hedef gösterilmekten kurtuldu.", kerem: "Hakaretler silindi.", diger: "Tartışma sayfada sürüyor." })),
          O("u4ab", "B", "Yorumları bir haftalığına tamamen kapat.",
            "Kimse yorum yazamaz. Hem hakaretler hem de eleştiriler durur.",
            "Yorumları bir haftalığına kapattın. Hakaretler ve Defne’yi hedef gösteren mesajlar durdu. Ama kulübü eleştiren öğrenciler de artık yazamıyor ve bazı üyeler “Biz de sansür yapıyoruz” dedi. Bu seçimle Defne korundu, ama meşru eleştiriler de susturuldu.",
            "u5b",
            D({ mahremiyet: 10, ifade: -10 }, { defne: 10, diger: -10, kerem: -5 },
              "Hedef gösterme durduğu için mahremiyet arttı. Eleştiriler de engellendiği için ifade özgürlüğü azaldı.",
              { defne: "Hedef gösterilmesi durdu.", diger: "Eleştirilerini yazamadılar.", kerem: "Tartışmanın kapanmasından hoşlanmadı." }))
        ]),
      u4b: N("Konuşma bitti, ama itiraz eden öğrencilerin güvenlik görevlilerince uzaklaştırıldığı video hızla yayıldı. Videoda kulüp başkanı olarak sen de görünüyorsun. Ertesi gün kulübün hesabına yüzlerce yorum geldi: Birçoğu kulübü “sansürcü” diye eleştiriyor. Bazıları ise Defne’nin adını, fotoğrafını ve kaldığı yurdu paylaşarak onu olayın sorumlusu gibi gösteriyor.",
        "Kulübün hesabındaki yorumlar için ne yaparsın?",
        [
          O("u4ba", "A", "Defne’yi hedef gösteren yorumları sil, kulübü eleştirenleri bırak.",
            "Seni ve kulübü eleştiren yorumlar kalır. Kişisel bilgi ve hakaret içerenler silinir.",
            "Defne’nin kişisel bilgilerini paylaşan ve hakaret içeren yorumları sildin. Seni “sansürcü” diye eleştiren yorumlara ise dokunmadın ve bir açıklama yazdın. Bu seçimle, kendi aleyhine olsa bile eleştiri özgürlüğünü korudun ve Defne’nin mahremiyetini savundun.",
            "u5a",
            D({ mahremiyet: 15, ifade: 10 }, { defne: 10, diger: 10, kurul: -5 },
              "Defne’nin kişisel bilgileri kaldırıldığı için mahremiyet arttı. Kulübe yönelik eleştiriler silinmediği için ifade özgürlüğü de güçlendi.",
              { defne: "Hedef gösterilmekten kurtuldu.", diger: "Eleştirilerinin yerinde kaldığını gördü.", kurul: "Murat, tartışmanın sürmesinden rahatsız." })),
          O("u4bb", "B", "Yorumları tamamen kapat ve kısa bir açıklama yayımla.",
            "Kimse yorum yazamaz. Kulüp, olayla ilgili yalnızca kendi açıklamasını paylaşır.",
            "Yorumları kapatıp kısa bir açıklama yayımladın. Defne’yi hedef gösteren mesajlar durdu. Ama kulübü eleştirenler de susturuldu ve bu kez “Hem salondan hem sayfadan attılar” diye başka hesaplarda yazmaya başladılar. Bu seçimle Defne korundu, ama kulüp eleştiriye kapandı.",
            "u5b",
            D({ mahremiyet: 10, ifade: -15 }, { defne: 5, diger: -15, kurul: 5 },
              "Hedef gösterme durduğu için mahremiyet arttı. Kulübe yönelik eleştiri yolu kapandığı için ifade özgürlüğü belirgin biçimde azaldı.",
              { defne: "Hedef gösterilmesi durdu.", diger: "Eleştirileri susturuldu.", kurul: "Murat, tartışmanın sönmesine sevindi." }))
        ]),
      u5a: N("Hedef gösteren ve hakaret içeren yorumlar silindi; kulübe yönelik sert eleştiriler ise sayfada duruyor. Bir hafta sonra Murat bir şart koydu: Kulüp gelecek dönem salon kullanmak istiyorsa, “tartışmalı” konuşmacıları önce okul yönetiminin onayına sunacak. Kulüp üyeleri bu konuda ikiye bölünmüş durumda.",
        "Murat’ın onay şartına ne cevap verirsin?",
        [
          E("u5aa", "A", "Şartı reddet; konuşmacıları kulüp üyelerinin seçeceğini yazılı bildir.",
            "Kulüp, kimi davet edeceğine kendisi karar verir. Okul yönetimi yalnızca güvenlik planını görür.",
            "Murat’a yazılı bir cevap verdin: Konuşmacıları kulüp üyeleri seçer, yönetim yalnızca güvenlik planına bakar. Murat salon kararını öğrenci konseyine götürdü. Konsey, kulübün yaşadığı olayı nasıl yönettiğini gördü ve salonu kulüpte bıraktı.",
            OUT({
              h: "Kulüp kendi konuşmacısını seçme hakkını korudu ve salonunu kaybetmedi.",
              sen: "Baskı altında bile hem konuşmayı hem itirazı korudun. Sonunda kulübün kendi programına karar verme hakkını da savundun.",
              others: [["Kerem, konuşmacı", "Konuşmasını yaptı ve hakaretlerin silinmesine teşekkür etti."], ["Defne, itiraz eden öğrenci", "Sesini salonda duyurdu ve hedef gösterilmekten korundu."], ["Murat, öğrenci işleri", "Onay şartı reddedildi, ama konseyin kararına uydu."]],
              kazanc: "Kulüp hem salonunu hem de konuşmacı seçme özgürlüğünü korudu.",
              kayip: "Murat’la ilişki gerildi ve her etkinlikte daha ayrıntılı güvenlik planı istenecek.",
              acik: "Bir sonraki tartışmalı konuşmada aynı dengenin kurulup kurulamayacağı belli değil.",
              neden: "Korunan değer ifade özgürlüğüydü: Ne iki yüz imza ne de yönetimin onay şartı, kimin konuşacağını belirledi. Bedeli Murat’la ilişki ve ek iş yükü ödedi. Pratik ders: Bir fikre itiraz edenleri susturmadan, ama onların çokluğuna da teslim olmadan, herkes için aynı kuralları uygulamak mümkündür.",
              sorular: ["Bir konuşmayı engellemek ile ona itiraz etmek arasındaki farkı nasıl anlatırsın?", "Kulübün bağımsızlığı, okulun güvenlik sorumluluğuyla nasıl dengelenmeli?"]
            }),
            D({ ifade: 10, ozerklik: 10 }, { kerem: 10, defne: 5, diger: 10, kurul: -10 },
              "Kulüp konuşmacısını kendisi seçmeye devam edeceği için ifade özgürlüğü ve bireysel özerklik arttı.",
              { kerem: "Kulübün bağımsız kaldığını gördü.", defne: "Kuralların herkese aynı işlediğini gördü.", diger: "Kulüp salonunu korudu.", kurul: "Şartı reddedildi." })),
          E("u5ab", "B", "Şartı kabul et, ama onay için açık ve yazılı ölçütler iste.",
            "Yönetim onay verir, ama yalnızca önceden yazılmış güvenlik ölçütlerine bakabilir.",
            "Şartı kabul ettin, ama yönetimden onay ölçütlerini yazmasını istedin. Yönetim üç ölçüt yazdı: salon kapasitesi, güvenlik planı ve etkinlik saati. Konuşmacının görüşleri ölçütler arasında yer almadı.",
            OUT({
              h: "Onay şartı geldi, ama konuşmacının fikirleri onay ölçütü olmaktan çıkarıldı.",
              sen: "Salonu korumak için bir şartı kabul ettin, ama o şartı yazılı ölçütlerle sınırladın. Kulüp artık her etkinlik için bir form dolduracak.",
              others: [["Kerem, konuşmacı", "Gelecek dönem başka bir tartışmaya yeniden davet edildi."], ["Defne, itiraz eden öğrenci", "Ölçütlerin yazılı olmasını olumlu buldu, ama onay sürecine şüpheyle bakıyor."], ["Murat, öğrenci işleri", "Şartı kabul edildiği için memnun."]],
              kazanc: "Salon kulüpte kaldı ve onay süreci keyfî olmaktan çıktı.",
              kayip: "Kulüp, kendi programını tek başına belirleme özerkliğinin bir kısmını kaybetti.",
              acik: "Yönetimin ileride ölçütleri değiştirip değiştirmeyeceği belli değil.",
              neden: "Korunan değer eşit muameleydi: Onay, herkese aynı yazılı ölçütlerle uygulanacak. Bedeli kulübün özerkliği ödedi. Pratik ders: Bir kurala mecbur kalınca, en azından o kuralın açık, yazılı ve herkese aynı uygulanmasını istemek gerekir.",
              sorular: ["Yazılı ölçütler, fikirlere dayalı bir yasağı gerçekten önleyebilir mi?", "Bir kulüp, salonunu korumak için ne kadar taviz vermeli?"]
            }),
            D({ esit: 10, ozerklik: -5 }, { kerem: 5, defne: 5, kurul: 10, diger: 5 },
              "Onay herkese aynı yazılı ölçütlerle uygulanacağı için eşit muamele arttı. Kulüp programını tek başına belirleyemeyeceği için bireysel özerklik biraz azaldı.",
              { kerem: "Yeniden davet edildi.", defne: "Ölçütlerin yazılı olmasını olumlu buldu.", kurul: "Şartı kabul edildi.", diger: "Salon kulüpte kaldı." }))
        ]),
      u5b: N("Yorumlar kapandı ve hesapta artık kimse yazamıyor. Hakaretler durdu, ama kulübü eleştiren öğrenciler de susturulmuş oldu; bazı üyeler “Biz de sansür yaptık” diyor. Bir hafta sonra Murat bir şart koydu: Kulüp gelecek dönem salon kullanmak istiyorsa, “tartışmalı” konuşmacıları önce okul yönetiminin onayına sunacak.",
        "Murat’ın onay şartına ne cevap verirsin?",
        [
          E("u5ba", "A", "Şartı reddet ve gelecek dönem için kampüs dışında bir salon ara.",
            "Kulüp, konuşmacı seçme özgürlüğünü korur. Ama salon için yeni bir yer ve bütçe bulması gerekir.",
            "Şartı reddettin ve kampüse yakın bir kültür merkezinde ücretli bir salon buldun. Kulüp ilk etkinliği orada yaptı, ama ulaşım zor olduğu için katılım yarıya düştü. Yorumları da yeniden açtın.",
            OUT({
              h: "Kulüp özgürlüğünü korudu, ama kampüsten çıktı ve katılım yarıya düştü.",
              sen: "Konuşmacı seçme hakkını onay şartına bağlamadın. Ama bunun bedeli olarak kulübü kampüs dışına taşıdın ve bütçe sıkıntısı yaşadın.",
              others: [["Kerem, konuşmacı", "Kulübün bağımsız kalmasını destekledi."], ["Defne, itiraz eden öğrenci", "Yorumların yeniden açılmasıyla eleştirilerini yazabildi."], ["Murat, öğrenci işleri", "Salonu başka bir kulübe verdi."]],
              kazanc: "Kulüp, kimi davet edeceğine kendisi karar vermeye devam etti.",
              kayip: "Kampüs içindeki salon ve öğrencilerin kolay katılımı kaybedildi.",
              acik: "Kulübün kampüs dışındaki salonun ücretini ne kadar süre ödeyebileceği belli değil.",
              neden: "Korunan değer bireysel özerklik ve ifade özgürlüğüydü: Kulübün programı onaya bağlanmadı. Bedeli eşit erişim ödedi, çünkü uzak salona herkes gelemiyor. Önceki adımda yorumları tamamen kapatmak da kulübün güvenilirliğini zedelemişti. Pratik ders: Özgürlüğü korumak bazen pahalıdır; bu bedeli kimin ödediğini görmek gerekir.",
              sorular: ["Kampüs dışına çıkmak yerine başka bir uzlaşma yolu var mıydı?", "Yorumları tamamen kapatmak, bu sonuca nasıl katkı yaptı?"]
            }),
            D({ ozerklik: 10, esit: -10, ifade: 5 }, { kerem: 5, defne: 5, diger: -10, kurul: -10 },
              "Kulüp programını kendi belirlediği için bireysel özerklik arttı. Uzak salona herkes gelemediği için eşit muamele azaldı.",
              { kerem: "Kulübün bağımsızlığını destekledi.", defne: "Eleştirilerini yeniden yazabildi.", diger: "Uzak salona gitmekte zorlandı.", kurul: "Salonu başka kulübe verdi." })),
          E("u5bb", "B", "Şartı olduğu gibi kabul et ki kulüp salonunu kaybetmesin.",
            "Tartışmalı konuşmacılar önce yönetimin onayına gider. Onayın ölçütü yazılı değildir.",
            "Şartı kabul ettin ve salon kulüpte kaldı. Bir ay sonra kulübün davet etmek istediği iki konuşmacı “tartışmalı” bulunarak reddedildi; ret yazısında bir gerekçe yoktu. Kulüp bundan sonra daha “güvenli” konuşmacıları seçmeye başladı.",
            OUT({
              h: "Salon kulüpte kaldı, ama kimin konuşacağına artık yönetim karar veriyor.",
              sen: "Salonu korudun ve olayı kapattın. Ama kulüp, tartışma kulübü olmanın temel özelliğini, yani farklı fikirleri dinleme imkânını kaybetti.",
              others: [["Kerem, konuşmacı", "Bir daha davet edilmedi."], ["Defne, itiraz eden öğrenci", "Kendi davet etmek istediği bir konuşmacı da reddedilince şartın herkesi etkilediğini gördü."], ["Murat, öğrenci işleri", "Kampüste olay çıkmadığı için memnun."]],
              kazanc: "Salon kulüpte kaldı ve yeni bir olay yaşanmadı.",
              kayip: "Kulüp, konuşmacı seçme özgürlüğünü ve gerekçesiz retlere itiraz etme imkânını kaybetti.",
              acik: "Hangi konuşmacının neden “tartışmalı” sayıldığı hâlâ belirsiz.",
              neden: "Bu rotada huzur korundu, ama ifade özgürlüğü ve bireysel özerklik bedel ödedi: Kimin konuşacağı, gerekçesi yazılmamış bir onaya bağlandı. Pratik ders: Bugün sevmediğin bir fikri susturmak için kabul ettiğin kural, yarın senin fikrini de susturabilir.",
              sorular: ["Defne’nin davet etmek istediği konuşmacının da reddedilmesi sana ne anlatıyor?", "Gerekçesi yazılmayan bir onay şartına nasıl itiraz edilebilir?"]
            }),
            D({ ifade: -15, ozerklik: -10 }, { kerem: -15, defne: -10, diger: -10, kurul: 15 },
              "Konuşmacılar gerekçesiz bir onaya bağlandığı için ifade özgürlüğü ve bireysel özerklik belirgin biçimde azaldı.",
              { kerem: "Bir daha davet edilmedi.", defne: "Kendi konuşmacısı da reddedildi.", diger: "Tartışmalar sönükleşti.", kurul: "Olay çıkmadığı için memnun." }))
        ])
    }
  };

  var vardiya = {
    id: "vardiya",
    title: "Cumartesi salonu kimin?",
    badge: "Kurgu senaryo · Eşit muamele ve yazılı kural",
    rights: "Ortak bir imkân dağıtılırken eski olmak ya da kalabalık olmak, yeni gelenin eşit hakkını ortadan kaldırmaz.",
    nodes: {
      start: {
        scene: "Sen Nilüfer’sin, belediyenin Gençlik Merkezi’nde salon rezervasyonlarından sorumlusun. Merkezin tek spor salonu cumartesi sabahları on yıldır Tarık’ın çalıştırdığı basketbol takımına veriliyor, ama bu hiçbir yerde yazılı bir kural değil. Bu ay kurulan kız voleybol takımının kaptanı Aylin de aynı saati istiyor, çünkü oyuncuların çoğu hafta içi okulda ya da işte. Merkezin yazılı yönetmeliği salonun bütün gruplara eşit dağıtılmasını söylüyor; müdür Hakan ise sözlü olarak “Eskiler kalsın, yeniler hafta içine gitsin” dedi.",
        question: "Cumartesi sabahını nasıl dağıtırsın?",
        options: [
          O("v1a", "A", "Yazılı yönetmeliğe uy: Cumartesiyi iki takım arasında haftalık dönüşümlü yap.",
            "Bir cumartesi basketbol, bir cumartesi voleybol salonu kullanır. Liste panoya asılır.",
            "Dönüşümlü listeyi hazırlayıp panoya astın. Aylin ve takımı çok sevindi. Tarık ise hiçbir şey söylemeden listenin fotoğrafını çekip gitti. Bu seçimle salon, kimin eski kimin yeni olduğuna bakılmadan eşit dağıtıldı.",
            "v2a",
            D({ esit: 15 }, { aylin: 20, tarik: -15, hakan: -10, genc: 5 },
              "Salon yazılı kurala göre iki takıma eşit dağıtıldığı için eşit muamele belirgin biçimde arttı.",
              { aylin: "Takımı cumartesi oynayabilecek.", tarik: "Yarı yarıya saat kaybetti.", hakan: "Sözlü talimatı uygulanmadı.", genc: "Daha fazla genç cumartesi spor yapabilecek." })),
          O("v1b", "B", "Bu ay müdürün sözüne uy; dağıtımı ay sonundaki kurula bırak.",
            "Cumartesi yine basketbolun olur. Aylin’e konunun kurulda konuşulacağını söylersin.",
            "Cumartesiyi yine basketbol takımına verdin ve Aylin’e ay sonundaki kurulu beklemesini söyledin. Tarık ve Hakan memnun kaldı. Aylin ise “Kural yazılıyken neden bir kişinin sözü geçiyor?” diye sordu. Bu seçimle düzen bozulmadı, ama yazılı eşitlik kuralı uygulanmadı.",
            "v2b",
            D({ esit: -10 }, { aylin: -15, tarik: 10, hakan: 10 },
              "Yazılı eşitlik kuralı yerine sözlü talimat uygulandığı için eşit muamele azaldı.",
              { aylin: "Takımı yine hafta içine itildi.", tarik: "Alışkın olduğu saati korudu.", hakan: "Talimatı uygulandı." }))
        ]
      },
      v2a: N("Liste asıldıktan iki gün sonra Tarık geldi: “Bu takımda yetmiş çocuk var, onlarda on iki kişi. Çoğunluk biziz.” Basketbolcu çocukların velilerinden kırk imzalı bir dilekçe de geldi. Hakan seni odasına çağırdı ve listeyi geri almanı istedi.",
        "Hakan listeyi geri almanı istiyor. Ne cevap verirsin?",
        [
          O("v2aa", "A", "Listeyi geri alma; yönetmeliği ve gerekçeni Hakan’a yazılı olarak ver.",
            "Yazılı kuralı, uygulamanın gerekçesini ve imza sayısının bir hakkı belirleyemeyeceğini yazarsın.",
            "Hakan’a yönetmeliği ve gerekçeni yazılı olarak verdin. Hakan yazılı kurala karşı bir gerekçe gösteremedi ve “Sorun çıkarsa sorumlusu sensin” diyerek listeye dokunmadı. Bu seçimle, kırk imzaya rağmen eşitlik kuralı ayakta kaldı.",
            "v3a",
            D({ esit: 10, ozerklik: 5 }, { aylin: 10, tarik: -10, hakan: -10 },
              "Kalabalığın baskısına rağmen yazılı kural uygulandığı için eşit muamele arttı.",
              { aylin: "Liste yerinde kaldı.", tarik: "Dilekçesi sonuç vermedi.", hakan: "Talimatı yazılı kurala yenildi." })),
          O("v2ab", "B", "Listeyi geri al ve Aylin’in takımına hafta içi akşam saatini öner.",
            "Cumartesi yeniden basketbolun olur. Voleybol takımı salı ve perşembe akşamları çalışır.",
            "Listeyi geri aldın ve Aylin’e salı ile perşembe akşamlarını önerdin. Aylin, oyuncularının çoğunun o saatlerde gelemeyeceğini söyledi ama başka seçeneği olmadığı için kabul etti. Bu seçimle gerilim azaldı, ama kalabalık olan grup eşitlik kuralının önüne geçti.",
            "v3b",
            D({ esit: -15 }, { aylin: -20, tarik: 15, hakan: 10, genc: -5 },
              "İmza sayısı yazılı eşitlik kuralının önüne geçtiği için eşit muamele belirgin biçimde azaldı.",
              { aylin: "Takımı hafta içine itildi.", tarik: "Cumartesiyi geri aldı.", hakan: "İsteği yerine getirildi.", genc: "Bazı kızlar artık antrenmana gelemeyecek." }))
        ]),
      v2b: N("Aylin ertesi gün yazılı bir şikâyet bıraktı: Yönetmelik eşit dağıtımı söylerken salonun sözlü bir talimatla tek takıma verilmesine itiraz ediyor. Oyuncularından üçü, hafta içi gelemedikleri için takımdan ayrılmayı düşünüyor. Kurul toplantısına ise daha üç hafta var.",
        "Aylin’in şikâyeti karşısında ne yaparsın?",
        [
          O("v2ba", "A", "Şikâyeti Hakan’a ilet ve kurulu beklemeden yönetmeliğin uygulanmasını iste.",
            "Aylin’in şikâyetini ve yazılı yönetmeliği birlikte Hakan’ın masasına koyarsın.",
            "Şikâyeti ve yönetmeliği Hakan’a götürdün. Hakan önce kızdı, ama yazılı kurala karşı bir gerekçe gösteremedi ve dönüşümlü listeye izin verdi. Tarık ise “Kural birden nereden çıktı?” diye tepki gösterdi. Bu seçimle eşitlik kuralı, geç de olsa uygulanmaya başladı.",
            "v3a",
            D({ esit: 15 }, { aylin: 20, tarik: -15, hakan: -10 },
              "Yazılı eşitlik kuralı uygulanmaya başladığı için eşit muamele belirgin biçimde arttı.",
              { aylin: "Şikâyeti sonuç verdi.", tarik: "Cumartesilerin yarısını kaybetti.", hakan: "Geri adım atmak zorunda kaldı." })),
          O("v2bb", "B", "Aylin’e bu ay için hafta içi akşam saatini öner ve kurulu bekle.",
            "Voleybol takımı salı ve perşembe akşamları çalışır. Asıl karar kurulda verilir.",
            "Aylin’e salı ve perşembe akşamlarını önerdin. Aylin, “Bu bir çözüm değil, erteleme” dedi ama takımı dağılmasın diye kabul etti. Hakan ve Tarık işlerin sakin kalmasından memnun. Bu seçimle düzen korundu, ama eşitsizlik bir ay daha sürdü.",
            "v3b",
            D({ esit: -5 }, { aylin: -10, tarik: 5, hakan: 5, genc: -5 },
              "Eşitsizlik bir ay daha sürdüğü için eşit muamele biraz azaldı.",
              { aylin: "Geçici bir çözümü mecburen kabul etti.", tarik: "Saati değişmedi.", hakan: "Ortalık sakin kaldı.", genc: "Bazı kızlar antrenmanları kaçıracak." }))
        ]),
      v3a: N("Dönüşümlü liste iki haftadır uygulanıyor. Voleybol takımı ilk cumartesisinde on iki oyuncusunun tamamıyla çalıştı. Basketbol takımı ise boş kalan cumartesi sabahı parkta çalıştı ve veliler buna kızgın. Ay sonunda merkez kurulu cumartesi saatini kalıcı olarak belirleyecek ve rezervasyon sorumlusu olarak senin önerini istiyor.",
        "Kurula hangi kalıcı kuralı önerirsin?",
        [
          O("v3aa", "A", "Cumartesinin bütün gruplar arasında eşit dönüşümle verilmesini öner.",
            "Hangi grup ne kadar eski ya da kalabalık olursa olsun, sıra herkese eşit gelir.",
            "Kurula eşit dönüşümü önerdin ve gerekçeni anlattın: Ortak bir salonda hiçbir grubun hakkı, kalabalığına göre belirlenmez. Kurul öneriyi kabul etti. Bu seçimle eşit muamele kalıcı bir kurala dönüştü.",
            "v4a",
            D({ esit: 10 }, { aylin: 10, tarik: -5, genc: 5 },
              "Eşit dönüşüm kalıcı kural olduğu için eşit muamele arttı.",
              { aylin: "Takımının hakkı kalıcı hâle geldi.", tarik: "Cumartesilerin yarısını kalıcı olarak kaybetti.", genc: "Herkes için açık bir kural var." })),
          O("v3ab", "B", "Kararın, salonu kullanan ailelerin oylamasıyla verilmesini öner.",
            "Salonu kullanan bütün aileler oy kullanır. Hangi seçenek çok oy alırsa o uygulanır.",
            "Kurula oylama önerdin, kurul da kabul etti. Oylamada basketbolcu çocukların velileri çoğunlukta olduğu için cumartesi 48’e 11 oyla tamamen basketbola verildi. Aylin, “Bir hak oylamayla elden alınamaz” diyerek itiraz edeceğini söyledi. Bu seçimle kararı çoğunluk verdi, ama azınlıktaki takımın eşit hakkı kayboldu.",
            "v4b",
            D({ esit: -20, ifade: 5 }, { aylin: -20, tarik: 15, hakan: 5, genc: -5 },
              "Herkes oy verebildiği için ifade özgürlüğü biraz arttı. Ama azınlıktaki takımın hakkı çoğunluk oyuyla elinden alındığı için eşit muamele belirgin biçimde azaldı.",
              { aylin: "Oylamada kaybetti ve hakkının oylanmasına itiraz ediyor.", tarik: "Cumartesiyi tamamen geri aldı.", hakan: "Kararı kendisi vermek zorunda kalmadı.", genc: "Kızların cumartesi spor yapma imkânı kalmadı." }))
        ]),
      v3b: N("Cumartesi hâlâ basketbol takımında. Voleybol takımı hafta içi akşamları çalışıyor, ama on iki oyuncudan yalnızca altısı gelebiliyor. Aylin, “Böyle giderse takım dağılacak” diyor. Ay sonunda merkez kurulu cumartesi saatini kalıcı olarak belirleyecek ve rezervasyon sorumlusu olarak senin önerini istiyor.",
        "Kurula hangi kalıcı kuralı önerirsin?",
        [
          O("v3ba", "A", "Cumartesinin bütün gruplar arasında eşit dönüşümle verilmesini öner.",
            "Hangi grup ne kadar eski ya da kalabalık olursa olsun, sıra herkese eşit gelir.",
            "Kurula eşit dönüşümü önerdin ve voleybol takımının yarısının antrenmanlara gelemediğini anlattın. Kurul öneriyi kabul etti. Tarık ve Hakan bu kez karşı çıkmadı, ama memnun da değiller. Bu seçimle bir ay süren eşitsizlik kalıcı bir kuralla sona erdi.",
            "v4a",
            D({ esit: 15 }, { aylin: 20, tarik: -10, hakan: -5, genc: 10 },
              "Bir ay süren eşitsizlik eşit dönüşüm kuralıyla sona erdiği için eşit muamele belirgin biçimde arttı.",
              { aylin: "Takımı cumartesiye kavuştu.", tarik: "Cumartesilerin yarısını kaybetti.", hakan: "Kurulun kararına uydu.", genc: "Bütün oyuncular antrenmana gelebilecek." })),
          O("v3bb", "B", "Kararın, salonu kullanan ailelerin oylamasıyla verilmesini öner.",
            "Salonu kullanan bütün aileler oy kullanır. Hangi seçenek çok oy alırsa o uygulanır.",
            "Kurula oylama önerdin, kurul da kabul etti. Basketbolcu çocukların velileri çoğunlukta olduğu için cumartesi 48’e 11 oyla basketbolda kaldı. Aylin, “Bir hak oylamayla elden alınamaz” diyerek itiraz edeceğini söyledi. Bu seçimle kararı çoğunluk verdi, ama azınlıktaki takımın eşit hakkı kayboldu.",
            "v4b",
            D({ esit: -15, ifade: 5 }, { aylin: -15, tarik: 10, hakan: 5, genc: -10 },
              "Herkes oy verebildiği için ifade özgürlüğü biraz arttı. Ama azınlıktaki takımın hakkı çoğunluk oyuyla belirlendiği için eşit muamele belirgin biçimde azaldı.",
              { aylin: "Oylamada kaybetti ve itiraz edecek.", tarik: "Cumartesiyi kalıcı olarak korudu.", hakan: "Kararı kendisi vermek zorunda kalmadı.", genc: "Voleybol takımı dağılma noktasına geldi." }))
        ]),
      v4a: N("Kurul eşit dönüşümü kalıcı kural yaptı. Bir hafta sonra Tarık geldi: Takımı ay sonunda il turnuvasına katılacak ve hazırlık için art arda dört cumartesi istiyor. Hakan, “Turnuva mahallenin gururu, ver gitsin” diyor. Aylin ise bu dört haftanın, takımının cumartesi hakkının yarısı demek olduğunu söylüyor.",
        "Tarık’ın turnuva için istediği istisnaya ne dersin?",
        [
          O("v4aa", "A", "İstisna verme; Tarık’a turnuva için hafta içi ek saatler öner.",
            "Cumartesi sırası bozulmaz. Basketbol takımı hazırlık için hafta içi akşamlarına ek saat alır.",
            "İstisna vermedin ve Tarık’a hafta içi üç akşam ek saat verdin. Tarık bunu yetersiz buldu ve Hakan’a şikâyet etti. Hakan, kurul kararını bozamadığı için sana kızdı. Bu seçimle yeni kural, ilk baskı anında da herkese aynı uygulandı.",
            "v5a",
            D({ esit: 10 }, { aylin: 10, tarik: -10, hakan: -15 },
              "Kural, ilk istisna talebinde bile herkese aynı uygulandığı için eşit muamele arttı.",
              { aylin: "Takımının hakkı korundu.", tarik: "Ek saati yetersiz buldu.", hakan: "Kurul kararını bozamadığı için sana kızdı." })),
          O("v4ab", "B", "İstisnayı ver; voleybol takımına sonraki ay fazladan cumartesi yaz.",
            "Basketbol dört hafta cumartesiyi alır. Voleybol bu dört haftayı sonraki ay geri alır.",
            "Tarık’a dört cumartesiyi verdin ve voleybol takımına sonraki ay için dört ek cumartesi yazdın. Hakan çok memnun kaldı. Aylin kabul etti, ama “Bu borcun ödeneceğini nereden bileceğiz?” diye sordu. Bu seçimle bir istisna yapıldı ve telafisi sözle verildi.",
            "v5b",
            D({ esit: -5, ozerklik: 5 }, { aylin: -5, tarik: 15, hakan: 15 },
              "Telafi sözü verilse de kurala ilk istisna yapıldığı için eşit muamele biraz azaldı.",
              { aylin: "Telafinin gerçekleşeceğinden emin değil.", tarik: "Turnuvaya hazırlanabilecek.", hakan: "İsteği yerine getirildi." }))
        ]),
      v4b: N("Aylin, oylamanın hakkını elinden aldığını söyleyerek belediyeye resmî itiraz hazırlıyor. Bunun için senden oylama tutanağını ve salonun son bir yıllık rezervasyon kayıtlarını istiyor. Kayıtlarda velilerin adları ve telefon numaraları da var. Hakan ise “Kurum belgelerini kimseye vermiyoruz” diyerek kayıtları paylaşmamanı söyledi.",
        "Aylin’in belge talebine ne yaparsın?",
        [
          O("v4ba", "A", "Kayıtları Aylin’e ver, ama velilerin adlarını ve telefonlarını kapat.",
            "Tutanak ve saat kayıtları verilir. Kişisel bilgiler siyah kalemle karartılır.",
            "Velilerin adlarını ve telefonlarını kapatıp kayıtları Aylin’e verdin. Kayıtlar, cumartesinin on yıldır hiçbir yazılı karar olmadan tek takıma verildiğini gösteriyordu. Hakan talimatına uymadığın için çok kızdı. Bu seçimle Aylin’in itiraz hakkı güçlendi ve kimsenin kişisel bilgisi paylaşılmadı.",
            "v5a",
            D({ esit: 10, mahremiyet: 5, ifade: 5 }, { aylin: 15, tarik: -5, hakan: -15 },
              "Aylin itirazı için gereken bilgiye ulaştığı için eşit muamele ve ifade özgürlüğü arttı. Kişisel bilgiler kapatıldığı için mahremiyet de korundu.",
              { aylin: "İtirazı için güçlü bir belge aldı.", tarik: "Eski düzenin yazılı olmadığı ortaya çıktı.", hakan: "Talimatına uyulmadığı için sana kızdı." })),
          O("v4bb", "B", "Hakan’ın talimatına uy; Aylin’e resmî başvuru yolunu anlat.",
            "Kayıtları sen vermezsin. Aylin, bilgi edinme başvurusuyla belediyeden ister.",
            "Kayıtları vermedin ve Aylin’e bilgi edinme başvurusunu nasıl yapacağını anlattın. Aylin başvurusunu yaptı, ama cevap için on beş iş günü beklemesi gerekiyor. Hakan, talimatına uyduğun için memnun. Bu seçimle kurum düzeni korundu, ama Aylin’in itirazı gecikti.",
            "v5b",
            D({ esit: -5, mahremiyet: 5 }, { aylin: -10, hakan: 15, tarik: 5 },
              "Kişisel bilgiler hiç paylaşılmadığı için mahremiyet biraz arttı. Aylin’in itirazı geciktiği için eşit muamele biraz azaldı.",
              { aylin: "İtirazı için beklemek zorunda.", hakan: "Talimatına uyuldu.", tarik: "Oylama sonucu şimdilik geçerli." }))
        ]),
      v5a: N("Son kararın Hakan’ı çok kızdırdı. Seni odasına çağırıp “Bu merkezde huzuru bozuyorsun” dedi. Gelecek ay rezervasyon görevini başka birine verebileceğini söyledi. Ama bir yol da gösterdi: Bundan sonra salon kararlarını önce ona danışırsan görevin sürebilir.",
        "Hakan’ın uyarısına nasıl karşılık verirsin?",
        [
          E("v5aa", "A", "Görevini korumak için geri adım at ve salon kararlarını Hakan’a bırak.",
            "Bundan sonra cumartesi ve diğer saatlerle ilgili her kararı önce Hakan onaylar.",
            "Hakan’a bundan sonra salon kararlarını ona danışacağını söyledin ve görevin sürdü. Sonraki aylarda salonla ilgili her itiraz ve her istisna Hakan’ın masasında, onun tercihine göre karara bağlandı. Cumartesiler fiilen yine basketbol takımında kaldı ve Aylin’in takımı dağıldı.",
            OUT({
              h: "Görevini korudun, ama kararlar yeniden müdürün sözüne bağlandı ve voleybol takımı dağıldı.",
              sen: "Önceki adımlarda eşitlik için zor kararlar aldın, ama son adımda görevini korumak için yetkini müdüre bıraktın. Görevin sürdü, kural ise kâğıtta kaldı.",
              others: [["Aylin, voleybol kaptanı", "Takımı cumartesi salonunu kaybetti ve dağıldı."], ["Tarık, basketbol antrenörü", "Cumartesileri fiilen tamamen elinde tuttu."], ["Hakan, müdür", "Salon kararları yeniden onun sözüne bağlandı."]],
              kazanc: "İşini korudun ve merkezde gerilim azaldı.",
              kayip: "Yazılı eşitlik kuralı uygulanmaz oldu ve yeni bir takım dağıldı.",
              acik: "Kurulun, kararların bir kişinin tercihine bağlanmasına tepki gösterip göstermeyeceği belli değil.",
              neden: "Bu rotada eşit muamele bedel ödedi: Yazılı kural, bir kişinin sözlü tercihine yeniden yenildi. Senin bireysel özerkliğin de daraldı. Pratik ders: Bir kural, onu uygulayan kişi baskı altında geri adım attığında kâğıtta kalır; kuralı korumak, bazen kişisel bir bedeli göze almayı gerektirir.",
              sorular: ["Görevini kaybetme riskine rağmen geri adım atmamak doğru olur muydu?", "Kurul kararlarının bir kişinin sözüyle bozulmaması için ne gerekir?"]
            }),
            D({ esit: -20, ozerklik: -10 }, { aylin: -25, tarik: 15, hakan: 20, genc: -15 },
              "Kararlar yeniden bir kişinin sözüne bağlandığı için eşit muamele ve bireysel özerklik belirgin biçimde azaldı.",
              { aylin: "Takımı dağıldı.", tarik: "Cumartesileri elinde tuttu.", hakan: "Yetkiyi yeniden eline aldı.", genc: "Kızlar cumartesi spor yapamıyor." })),
          E("v5ab", "B", "Kararının arkasında dur ve yazılı gerekçeni kurula sun.",
            "Kararını ve dayandığın kuralı yazıyla kurula iletirsin. Görevin konusunu kurul değerlendirir.",
            "Gerekçeni yazılı olarak kurula sundun. Kurul, kararlarının yazılı yönetmeliğe uygun olduğunu söyledi ve görevini sürdürmeni istedi. Cumartesi için eşit dönüşüm kesin kural olarak yönetmeliğe yazıldı. Hakan kurula uydu, ama senin fazla mesai talebini reddetti ve aranız soğudu.",
            OUT({
              h: "Kural ayakta kaldı, görevin sürdü, ama müdürle ilişkin zedelendi.",
              sen: "Baskıya rağmen kararlarının arkasında durdun ve meseleyi kişisel bir tartışma olmaktan çıkarıp kurula taşıdın. Bunun bedelini işyerinde soğuk bir ilişkiyle ödüyorsun.",
              others: [["Aylin, voleybol kaptanı", "Takımı cumartesileri düzenli olarak salonu kullanıyor ve yeni oyuncular katılıyor."], ["Tarık, basketbol antrenörü", "Cumartesilerin yarısıyla yetinmek zorunda kaldı."], ["Hakan, müdür", "Kurula uydu, ama sana karşı mesafeli."]],
              kazanc: "Eşit dönüşüm kuralı korundu ve iki takım da salonu kullanabiliyor.",
              kayip: "Müdürle ilişkin bozuldu ve fazla mesai talebin reddedildi.",
              acik: "Hakan’ın ileride başka bir yolla misilleme yapıp yapmayacağı belli değil.",
              neden: "Korunan değer eşit muameleydi: Ne eskilik, ne kalabalık, ne de müdürün sözü yazılı kuralın önüne geçti. Bedeli senin iş ilişkin ödedi. Pratik ders: Bir hakkı korurken kişisel tartışmaya girmek yerine yazılı kurala ve yetkili kurula dayanmak, kararı kişilerden bağımsız kılar.",
              sorular: ["Kurul seni desteklemeseydi ne yapardın?", "Eşitlik kuralının korunmasında kurulun rolü neden önemli?"]
            }),
            D({ esit: 10, ozerklik: 10 }, { aylin: 15, tarik: 5, hakan: -10, genc: 10 },
              "Yazılı kural kurulun desteğiyle korunduğu için eşit muamele arttı. Kararlarını kendi gerekçenle savunduğun için bireysel özerklik de güçlendi.",
              { aylin: "Takımı büyümeye devam ediyor.", tarik: "Yeni düzene alıştı.", hakan: "Kurula uydu, ama sana mesafeli.", genc: "İki takımdaki gençler de salonu kullanıyor." }))
        ]),
      v5b: N("Son kararın Hakan’ı memnun etti. Seni odasına çağırıp rezervasyon görevini kalıcı hâle getirmek istediğini söyledi. Ama bir şartı var: Hazırladığı yeni yönergeyi imzalamanı istiyor. Yönergeye göre cumartesi saatleri “kıdeme göre”, yani salonu en uzun süredir kullanan gruba verilecek.",
        "Hakan’ın kıdem yönergesini imzalar mısın?",
        [
          E("v5ba", "A", "Yönergeyi imzala; en azından kural yazılı ve herkese aynı olur.",
            "Kıdem kuralı yazılı hâle gelir. Herkes neye göre karar verildiğini bilir.",
            "Yönergeyi imzaladın ve görevin kalıcı oldu. Kurul yönergeyi onayladı. Gelecek sezon cumartesi saatlerinin tamamı basketbol takımına verildi; voleybol takımının cumartesi hakkı ancak on yıl sonra doğacak.",
            OUT({
              h: "Kural yazılı hâle geldi, ama yeni gelenlere cumartesi kapısı kapandı.",
              sen: "Görevini kalıcı hâle getirdin ve belirsizliği bitirdin. Ama yazdığın kural, eski olanı her zaman öne koyuyor.",
              others: [["Aylin, voleybol kaptanı", "Takımı hafta içine kalıcı olarak itildi ve oyuncuların yarısı ayrıldı."], ["Tarık, basketbol antrenörü", "Cumartesileri kalıcı olarak güvenceye aldı."], ["Hakan, müdür", "Sözlü tercihini yazılı bir kurala dönüştürdü."]],
              kazanc: "Kararların neye göre verildiği artık açık ve senin görevin güvencede.",
              kayip: "Yeni kurulan gruplar, ne kadar ihtiyaçları olursa olsun, cumartesi salonuna yıllarca ulaşamayacak.",
              acik: "Yönergenin yazılı eşitlik yönetmeliğine aykırı olup olmadığı tartışmalı kaldı.",
              neden: "Bu rotada bir kural yazıldı, ama eşit muamele bedel ödedi: Kural herkese aynı uygulansa bile, sonuçta hep aynı grubu kayırıyor. Pratik ders: Bir kuralın yazılı olması onu adil yapmaz; kuralın yeni gelenlere de eşit bir şans tanıyıp tanımadığına bakmak gerekir.",
              sorular: ["Herkese aynı uygulanan bir kural yine de eşitsiz olabilir mi?", "Kıdem ile eşitlik arasında nasıl bir denge kurulabilirdi?"]
            }),
            D({ esit: -15 }, { aylin: -20, tarik: 15, hakan: 15, genc: -10 },
              "Kıdem kuralı yeni gelenleri kalıcı olarak geride bıraktığı için eşit muamele belirgin biçimde azaldı.",
              { aylin: "Takımı kalıcı olarak hafta içine itildi.", tarik: "Cumartesileri güvenceye aldı.", hakan: "Tercihi yazılı kurala dönüştü.", genc: "Kızların yarısı takımdan ayrıldı." })),
          E("v5bb", "B", "Yönergeyi imzalama; kıdem kuralının yeni gruplara kapıyı kapatacağını yaz.",
            "Hakan’a ve kurula, yönergenin yazılı eşitlik yönetmeliğine aykırı olduğunu yazılı bildirirsin.",
            "Yönergeyi imzalamadın ve itirazını yazılı olarak kurula ilettin. Kurul yönergeyi onaylamadı ve cumartesi için eşit dönüşümü yeniden gündeme aldı. Hakan ise görevini kalıcı yapmaktan vazgeçti.",
            OUT({
              h: "Kıdem kuralı durduruldu, ama görevin kalıcı olmadı.",
              sen: "Daha önce Hakan’ın isteğine uymuş olsan da son adımda eşitliğe aykırı bir kuralın altına imza atmadın. Bunun bedeli, kalıcı görev fırsatını kaybetmek oldu.",
              others: [["Aylin, voleybol kaptanı", "Cumartesi hakkını yeniden konuşabilmek için umut buldu."], ["Tarık, basketbol antrenörü", "Kıdem kuralının durdurulmasına üzüldü."], ["Hakan, müdür", "Yönergesi onaylanmadı ve sana kırgın."]],
              kazanc: "Eşitliğe aykırı bir kuralın kalıcı hâle gelmesi engellendi.",
              kayip: "Görevin kalıcı olmadı ve Hakan’la ilişkin zedelendi.",
              acik: "Kurulun cumartesi için hangi kuralı seçeceği henüz belli değil.",
              neden: "Korunan değer eşit muameleydi: Eskilik, yeni gelenin hakkını kalıcı olarak geride bırakamadı. Bedeli senin kariyer fırsatın ödedi. Pratik ders: Daha önce taviz vermiş olmak, bir sonraki adımda doğru olanı yapmana engel değildir.",
              sorular: ["Önceki kararlarında Hakan’a uymasaydın bu teklif hiç gelir miydi?", "Kişisel bir fırsatı kaybetmek pahasına bir ilkeyi korumak her zaman mümkün müdür?"]
            }),
            D({ esit: 15, ozerklik: 5 }, { aylin: 15, tarik: -10, hakan: -15, genc: 10 },
              "Eşitliğe aykırı yönerge durdurulduğu için eşit muamele belirgin biçimde arttı. Baskıya rağmen kendi kararını verdiğin için bireysel özerklik de güçlendi.",
              { aylin: "Yeniden umut buldu.", tarik: "Kıdem kuralının durmasına üzüldü.", hakan: "Yönergesi onaylanmadı.", genc: "Yeni gelenlerin şansı korundu." }))
        ])
    }
  };

  var scenarios = [kayit, kulup, vardiya];

  function validateScenarios(list) {
    var errors = [];
    var headlines = {};
    var events = {};
    var protagonists = {};
    list.forEach(function (scenario) {
      var thirdTitles = {};
      var depthOf = {};
      function walk(nodeId, depth, path) {
        var node = scenario.nodes[nodeId];
        if (!node) {
          errors.push(scenario.id + " düğüm yok: " + nodeId);
          return;
        }
        /* Dallar birleşebilir: aynı düğüme ikinci kez gelinirse yalnız derinliği karşılaştır. */
        if (depthOf[nodeId] !== undefined) {
          if (depthOf[nodeId] !== depth) errors.push(scenario.id + " " + nodeId + " farklı derinlikte");
          return;
        }
        depthOf[nodeId] = depth;
        if (!node.question || !node.options || node.options.length < 2) {
          errors.push(scenario.id + " " + nodeId + " seçenek eksik");
          return;
        }
        if (depth === 1 && !node.scene) errors.push(scenario.id + " sahne yok");
        if (depth > 1 && !node.info) errors.push(scenario.id + " " + nodeId + " durum yok");
        var nexts = {};
        node.options.forEach(function (option) {
          if (!option.id || !option.title || !option.body || !option.event) {
            errors.push(scenario.id + " " + (option.id || "?") + " alan eksik");
          }
          if (!option.event || option.event.length < 40) errors.push(scenario.id + " " + option.id + " olay kısa");
          if (events[option.event]) errors.push("aynı olay: " + option.id);
          events[option.event] = option.id;
          if (depth < 5) {
            if (!option.next || option.ending) errors.push(scenario.id + " " + option.id + " sonraki yok");
            else {
              if (nexts[option.next]) errors.push(scenario.id + " " + nodeId + " kardeşler aynı düğüme çıkıyor");
              nexts[option.next] = true;
              walk(option.next, depth + 1, path + ">" + option.id);
            }
          } else {
            var outcome = option.outcome;
            if (option.next || !option.ending || !outcome) errors.push(scenario.id + " " + option.id + " sonuç yok");
            else {
              ["headline", "protagonist", "gained", "lost", "open", "because"].forEach(function (field) {
                if (!outcome[field] || String(outcome[field]).length < 20) errors.push(scenario.id + " " + option.id + " " + field);
              });
              if (!outcome.others || outcome.others.length < 2) errors.push(scenario.id + " " + option.id + " kişiler");
              if (!outcome.reflection || outcome.reflection.length < 2) errors.push(scenario.id + " " + option.id + " soru");
              if (headlines[outcome.headline]) errors.push("aynı başlık: " + option.id);
              headlines[outcome.headline] = option.id;
              if (protagonists[outcome.protagonist]) errors.push("aynı kahraman sonucu: " + option.id);
              protagonists[outcome.protagonist] = option.id;
            }
          }
        });
        if (depth === 5) {
          var key = node.options.map(function (option) { return option.title; }).join("|");
          if (thirdTitles[key]) errors.push(scenario.id + " aynı üçüncü kartlar: " + nodeId);
          thirdTitles[key] = nodeId;
        }
      }
      walk("start", 1, "start");
    });
    return errors;
  }

  window.SEN_OLSAN = { scenarios: scenarios, validate: validateScenarios };
})();
