/* Sen Olsan? sahne görselleri (v7). Toplam 20 görsel.
   Kural: Karar 1–2 giriş görseli; karar 3–4, üçüncü kararda varılan duruma göre;
   karar 5, beşinci kararda varılan duruma göre; sonuç ekranı, varılan sona göre. */
(function () {
  var DIR = "assets/sahneler/";
  var FALLBACK = { src: "assets/hikaye-sahnesi.jpg", alt: "Kurmaca bir toplantı çizimi." };
  function G(file, alt) { return { src: DIR + file + ".jpg", alt: alt }; }

  var kayitIyi = G("kayit-son-sefer-dondu", "Gece otobüsü yeniden durakta. Şoför Emre direksiyonda gülümsüyor; Deniz, koltuk değnekli Leyla’nın otobüse binmesine yardım ediyor, Selma el sallıyor.");
  var kayitZor = G("kayit-son-bos-durak", "Gece boş bir otobüs durağı. Deniz elinde bir kâğıtla tek başına bekliyor; otobüs gelmiyor.");
  var kulupIyi = G("kulup-son-acik-tartisma", "Dolu bir kampüs salonunda Kerem ve Defne yan yana mikrofonlarda tartışıyor; Ece moderatörlük yapıyor, öğrenciler soru için el kaldırıyor.");
  var kulupZor = G("kulup-son-bos-salon", "Neredeyse boş bir etkinlik salonu. Ece elindeki dağıtılmamış broşürlerle boş sandalyelere bakıyor.");
  var vardiyaIyi = G("vardiya-son-esit-sira", "Cumartesi sabahı spor salonunda voleybol takımı antrenmanda; Aylin yeni bir oyuncuyla çak yapıyor, Nilüfer kenarda, Tarık kapıda kabullenmiş bir hâlde.");
  var vardiyaZor = G("vardiya-son-dagilan-takim", "Salonda basketbol oynanırken Aylin koridorda bir bankta, elinde toplanmış fileyle üzgün oturuyor; iki oyuncu çantalarıyla ayrılıyor.");
  var kulup5 = G("kulup-5-onay-sarti", "Öğrenci işleri odasında Murat masada bir form uzatıyor; Ece elinde telefonla düşünceli bir yüzle şartı tartıyor.");

  var MAP = {
    kayit: {
      giris: G("kayit-1-toplanti", "Dernek salonunda toplantı başlamak üzere. Deniz kamerayı yalnızca kürsüdeki Selma’ya çeviriyor; şoför Emre ikinci sırada, elinde şapkası, huzursuz."),
      d3: {
        k3a: G("kayit-3a-kural-tartismasi", "Toplantı bitmiş. Çekim yapan komşu telefonunu göstererek Deniz’e itiraz ediyor; arkada bazı komşular ona hak veriyor."),
        k3b: G("kayit-3b-video-yayildi", "Gece. Deniz evde telefonla konuşuyor, masadaki telefonda mesaj grubu açık; Emre otobüs garajında telefonda, endişeli.")
      },
      d5: {
        k5a: G("kayit-5a-dilekce", "Belediyenin danışma bankosunda Selma ve Deniz dilekçeyi anlatıyor; görevli sayfalara kuşkuyla bakıyor."),
        k5b: G("kayit-5b-emrenin-karari", "Dernek binasının önünde Selma ve Deniz, şapkasını elinde tutan Emre’ye seçenekleri anlatıyor; karar Emre’nin.")
      },
      son: { k5aa: kayitZor, k5ab: kayitIyi, k5ba: kayitIyi, k5bb: kayitZor }
    },
    kulup: {
      giris: G("kulup-1-imzalar", "Kulüp odasında Defne iptal için toplanan imzaları masaya koyuyor; Ece elinde boş bir afişle kararsız, Murat kapıda kollarını kavuşturmuş."),
      d3: {
        u3a: G("kulup-3a-salonda-protesto", "Dolu salonda Kerem kürsüde konuşamıyor; arka sıralarda öğrenciler boş pankartlarla bağırıyor, Defne ve Ece ön sıralardan bakıyor."),
        u3b: G("kulup-3b-kapidaki-ogrenciler", "Salonda yalnızca üyeler var ve kamera yayın yapıyor; cam kapının ardında Defne’nin de olduğu kalabalık slogan atıyor, Ece kapıya yürüyor.")
      },
      d5: { u5a: kulup5, u5b: kulup5 },
      son: { u5aa: kulupIyi, u5ab: kulupIyi, u5ba: kulupZor, u5bb: kulupZor }
    },
    vardiya: {
      giris: G("vardiya-1-cumartesi-salonu", "Cumartesi sabahı spor salonunda Tarık basketbolcu çocukları çalıştırıyor; Aylin ve voleybolcu kızlar kapıda bekliyor, Nilüfer elinde listeyle arada kalmış, Hakan yukarıdaki camdan izliyor."),
      d3: {
        v3a: G("vardiya-3a-donusumlu-liste", "Cumartesi sabahı salonda voleybol takımı tam kadro çalışıyor; Nilüfer kenardan izliyor, dışarıdaki parkta basketbolcular ve kızgın veliler görünüyor."),
        v3b: G("vardiya-3b-hafta-ici", "Hafta içi akşam salonunda voleybol takımının yalnızca bir kısmı var; Aylin endişeyle Nilüfer’le konuşuyor.")
      },
      d5: {
        v5a: G("vardiya-5a-mudurun-uyarisi", "Müdür Hakan odasında öfkeyle parmağını uzatıp uyarıyor; Nilüfer elinde listesiyle karşısında duruyor."),
        v5b: G("vardiya-5b-kidem-yonergesi", "Müdür Hakan gülümseyerek Nilüfer’e imzalaması için bir yönerge uzatıyor; Nilüfer kararsız.")
      },
      son: { v5aa: vardiyaZor, v5ab: vardiyaIyi, v5ba: vardiyaZor, v5bb: vardiyaIyi }
    }
  };

  /* Seçim kimliklerinden geçilen düğümleri bulur: nodes[0] = start, nodes[i] = i+1. karar düğümü. */
  function walk(scenario, ids) {
    var nodes = ["start"];
    var node = scenario.nodes.start;
    var lastOption = null;
    for (var i = 0; i < ids.length; i += 1) {
      if (!node) return null;
      var option = null;
      for (var j = 0; j < node.options.length; j += 1) if (node.options[j].id === ids[i]) option = node.options[j];
      if (!option) return null;
      lastOption = option;
      if (option.next) { nodes.push(option.next); node = scenario.nodes[option.next]; } else node = null;
    }
    return { nodes: nodes, lastOption: lastOption };
  }

  /* ids: verilmiş kararlar. ending: sonuç ekranı mı. */
  function forPath(scenario, ids, ending) {
    var m = MAP[scenario.id];
    if (!m) return FALLBACK;
    var w = walk(scenario, ids || []);
    if (!w) return m.giris || FALLBACK;
    if (ending && w.lastOption && w.lastOption.ending) return m.son[w.lastOption.id] || FALLBACK;
    var step = w.nodes.length; /* şu an gösterilen kararın numarası */
    if (step <= 2) return m.giris || FALLBACK;
    if (step <= 4) return m.d3[w.nodes[2]] || FALLBACK;
    return m.d5[w.nodes[4]] || FALLBACK;
  }

  /* Bir sonraki ekranda görünebilecek görseller (önden yükleme için). */
  function nextImages(scenario, ids) {
    var w = walk(scenario, ids || []);
    if (!w) return [];
    var node = scenario.nodes[w.nodes[w.nodes.length - 1]];
    if (!node || !node.options) return [];
    var out = [];
    node.options.forEach(function (o) {
      var img = forPath(scenario, (ids || []).concat(o.id), !!o.ending);
      if (out.indexOf(img.src) < 0) out.push(img.src);
    });
    return out;
  }

  function allImages() {
    var seen = [];
    Object.keys(MAP).forEach(function (k) {
      var m = MAP[k];
      [m.giris].concat(Object.keys(m.d3).map(function (x) { return m.d3[x]; }),
        Object.keys(m.d5).map(function (x) { return m.d5[x]; }),
        Object.keys(m.son).map(function (x) { return m.son[x]; })).forEach(function (g) {
        if (seen.indexOf(g.src) < 0) seen.push(g.src);
      });
    });
    return seen;
  }

  window.SEN_SAHNE = { forPath: forPath, nextImages: nextImages, allImages: allImages, fallback: FALLBACK, map: MAP };
})();
