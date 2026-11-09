(function () {
  var data = window.SEN_OLSAN;
  var ROUTE_KEY = "sen-olsan-rotalar-v3";
  var SESSION_KEY = "sen-olsan-oturum-v3";
  var THEME_KEY = "sen-olsan-tema-v1";
  var MAX_ROUTES = 24;

  var state = {
    view: "home",
    scenarioId: "kayit",
    historyIds: [],
    pendingId: null,
    routeId: null,
    focus: null,
    announce: ""
  };

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function scenarioById(id) {
    return data.scenarios.find(function (item) { return item.id === id; }) || null;
  }

  function currentScenario() {
    return scenarioById(state.scenarioId) || data.scenarios[0];
  }

  function resolvePath(scenario, ids) {
    var steps = [];
    var node = scenario.nodes.start;
    for (var i = 0; i < ids.length; i += 1) {
      if (!node) return null;
      var option = node.options.find(function (item) { return item.id === ids[i]; });
      if (!option) return null;
      steps.push({ node: node, option: option });
      node = option.next ? scenario.nodes[option.next] : null;
    }
    return { steps: steps, current: node };
  }

  function readRoutes() {
    try {
      var parsed = JSON.parse(localStorage.getItem(ROUTE_KEY) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function writeRoutes(routes) {
    localStorage.setItem(ROUTE_KEY, JSON.stringify(routes.slice(0, MAX_ROUTES)));
  }

  function snapshot() {
    return {
      view: state.view,
      scenarioId: state.scenarioId,
      historyIds: state.historyIds.slice(),
      pendingId: state.pendingId,
      routeId: state.routeId
    };
  }

  function persistSession() {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(snapshot()));
  }

  function hashFor(snap) {
    if (snap.view === "play") return "#/oyna/" + snap.scenarioId;
    if (snap.view === "ending") return "#/sonuc/" + snap.scenarioId;
    if (snap.view === "routes") return "#/rotalar";
    return "#/";
  }

  function commit(partial, mode) {
    Object.keys(partial).forEach(function (key) { state[key] = partial[key]; });
    persistSession();
    var url = hashFor(state);
    var snap = snapshot();
    if (mode === "push") history.pushState(snap, "", url);
    else history.replaceState(snap, "", url);
    render();
  }

  function applySnap(snap) {
    state.view = snap.view || "home";
    state.scenarioId = snap.scenarioId || "kayit";
    state.historyIds = Array.isArray(snap.historyIds) ? snap.historyIds.slice() : [];
    state.pendingId = snap.pendingId || null;
    state.routeId = snap.routeId || null;
    if (!scenarioById(state.scenarioId)) {
      state.view = "home";
      state.scenarioId = "kayit";
      state.historyIds = [];
      state.pendingId = null;
    }
    var resolved = resolvePath(currentScenario(), state.historyIds);
    if (!resolved || (state.view === "play" && !resolved.current)) {
      state.view = "home";
      state.historyIds = [];
      state.pendingId = null;
    }
  }

  function shell(screen, body) {
    var count = readRoutes().length;
    return (
      '<p class="banner" role="note"><strong>Prototip.</strong> Senaryolar kurgudur. Bu sayfa hukuki danışmanlık vermez, üyelik istemez ve kişisel veri toplamaz.</p>' +
      '<header class="site-header"><div class="wrap">' +
      '<button type="button" class="wordmark" data-action="home"><span class="mark3">3H</span><span class="mark-rest">Hareketi</span></button>' +
      '<nav aria-label="Sayfa bölümleri"><button type="button" class="header-link theme-toggle" data-action="theme" aria-pressed="' +
      (themeNow() === "dark" ? "true" : "false") + '">' +
      (themeNow() === "dark" ? "Koyu görünüm açık" : "Koyu görünüm kapalı") +
      '</button><button type="button" class="header-link" data-action="routes">Rotaları karşılaştır' +
      (count ? " (" + count + ")" : "") +
      "</button></nav></div></header>" +
      '<main id="icerik" tabindex="-1" data-screen="' + esc(screen) + '"><div class="wrap">' +
      body +
      "</div></main>" +
      '<footer class="site-footer"><div class="wrap">' +
      "<p>3H Hareketi adı bu sayfada tipografik olarak kullanılmıştır. Bu prototip, kuruluşun resmî duyurusu veya onaylanmış bir programı değildir. <a href=\"https://3hhareketi.org.tr/\" rel=\"noopener noreferrer\">Kuruluşun yayımlanmış sitesi</a> ayrı bir sayfadır.</p>" +
      "<p>Metin sürümü 3. Oyun sonuçları varsayımsaldır ve aynı seçimin gerçek hayatta aynı sonucu doğuracağı söylenmez. Kartlar kişisel hukuki danışmanlık vermez. Seçimler bu tarayıcıda kalır; bir forma ad, iletişim veya dosya yazmanız istenmez.</p>" +
      "</div></footer>"
    );
  }

  function choiceList(options, pendingId) {
    var cols = options.length === 2 ? "cols-2" : "cols-3";
    return (
      '<ul class="choices ' + cols + '">' +
      options.map(function (option) {
        var selected = pendingId === option.id;
        return (
          "<li><button type=\"button\" class=\"choice" + (selected ? " is-selected" : "") +
          "\" data-action=\"choose\" data-option=\"" + esc(option.id) +
          "\" aria-pressed=\"" + (selected ? "true" : "false") + "\">" +
          '<span class="choice-key">' + esc(option.key) + "</span>" +
          '<span class="choice-title">' + esc(option.title) + "</span>" +
          '<span class="choice-body">' + esc(option.body) + "</span>" +
          (selected ? '<span class="chosen-flag">Seçildi</span>' : "") +
          "</button></li>"
        );
      }).join("") +
      "</ul>"
    );
  }

  function themeNow() {
    return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  function stepBar(step) {
    var items = [1, 2, 3, 4, 5].map(function (number) {
      var cls = number < step ? "is-done" : number === step ? "is-now" : "";
      var current = number === step ? ' aria-current="step"' : "";
      return "<li class=\"" + cls + "\"" + current + ">" + number + "</li>";
    }).join("");
    return '<ol class="stepbar" aria-label="Beş bölümün ilerlemesi">' + items +
      '<li class="step-label">Bölüm ' + step + " / 5</li></ol>";
  }

  function chapterTitle(scenario) {
    var names = { kayit: "Kayıt açık mı?", kulup: "Söz kimin?", vardiya: "Salon kimin?" };
    return names[scenario.id] || scenario.title;
  }

  function initialMark(name) {
    var raw = String(name || "?").trim();
    var letter = raw.charAt(0);
    if (letter === "i") letter = "İ";
    else letter = letter.toLocaleUpperCase("tr");
    return '<span class="initial" aria-hidden="true">' + esc(letter) + "</span>";
  }

  function portraitKey(scenarioId, personKey) {
    var map = {
      kayit: { selma: "selma", emre: "emre", leyla: "leyla", salon: "burcu", dernek: "deniz" },
      kulup: { kerem: "kerem", defne: "defne", diger: "ece", kurul: "murat" },
      vardiya: { aylin: "aylin", tarik: "tarik", mert: "mert", kidem: "feride", arayan: "pakize", hakan: "hakan" }
    };
    return (map[scenarioId] && map[scenarioId][personKey]) || "anlatici";
  }

  function valueIcon(key) {
    if (key === "mahremiyet") return '<svg class="hud-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="10" width="12" height="9" rx="2" fill="none" stroke="#2457e6" stroke-width="1.8"/><path d="M8 10 V8 a4 4 0 0 1 8 0 V10" fill="none" stroke="#2457e6" stroke-width="1.8"/></svg>';
    if (key === "esit") return '<svg class="hud-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="8" cy="9" r="2.2" fill="#2457e6"/><circle cx="16" cy="9" r="2.2" fill="#2457e6"/><path d="M4 18c1-3 3-4 4-4s3 1 4 4M12 18c1-3 3-4 4-4s3 1 4 4" fill="none" stroke="#2457e6" stroke-width="1.6"/></svg>';
    if (key === "ozerklik") return '<svg class="hud-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3" fill="#2457e6"/><path d="M6 19c1.2-3.2 3.2-4.8 6-4.8S16.8 15.8 18 19" fill="none" stroke="#2457e6" stroke-width="1.7"/></svg>';
    return '<svg class="hud-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 16c2-5 4-7 7-7s5 2 7 7" fill="none" stroke="#2457e6" stroke-width="1.7"/><circle cx="12" cy="8" r="1.4" fill="#2457e6"/></svg>';
  }

  function hudHtml(scenario, ids, pendingId) {
    var shownIds = pendingId ? ids.concat(pendingId) : ids.slice();
    var shown = scoreFor(scenario, shownIds);
    if (!shown) return "";
    var before = scoreFor(scenario, ids).current;
    var meta = window.SEN_SCORE.meta;
    var last = pendingId && shown.steps.length ? shown.steps[shown.steps.length - 1] : null;
    var values = Object.keys(meta.valueLabels).map(function (key) {
      var value = shown.current.values[key];
      var delta = value - before.values[key];
      return '<div class="hud-row"><span class="hud-ico">' + valueIcon(key) + '</span><div class="hud-mid"><div class="meter-top"><span class="meter-name">' +
        esc(meta.valueLabels[key]) + '</span><span class="meter-num">' + value + ". " + esc(deltaWords(delta)) + ".</span></div>" +
        '<div class="meter-track" aria-hidden="true"><span class="meter-fill ' + widthClass(value) + '"></span></div></div></div>';
    }).join("");
    var people = Object.keys(meta.peopleLabels[scenario.id]).map(function (key) {
      var value = shown.current.people[key];
      var delta = value - before.people[key];
      var why = last && last.pw && last.pw[key] ? last.pw[key] : "";
      var label = meta.peopleLabels[scenario.id][key];
      var short = label.split(",")[0];
      return '<div class="sat-row"><span class="sat-face">' + initialMark(short) + '</span><div class="hud-mid"><div class="meter-top"><span class="meter-name">' +
        esc(short) + '</span><span class="meter-num">' + value + ". " + esc(deltaWords(delta)) + ".</span></div>" +
        '<div class="meter-track" aria-hidden="true"><span class="meter-fill ' + widthClass(value) + '"></span></div>' +
        (why ? '<p class="meter-why">' + esc(why) + "</p>" : "") + "</div></div>";
    }).join("");
    var why = last && last.vw ? '<p class="meter-why">' + esc(last.vw) + "</p>" : "";
    return '<aside class="hud" aria-label="Göstergeler">' +
      '<section class="hud-card"><h2 class="hud-title"><span class="hud-ico">' + valueIcon("ifade") + '</span> Kararların etkisi</h2>' +
      '<p class="meter-note">Oyun içi değer göstergeleri; bilimsel ölçüm değildir.</p>' + values + why + "</section>" +
      '<section class="hud-card"><h2 class="hud-title"><span class="hud-ico">' + valueIcon("esit") + '</span> Karakterlerin memnuniyeti</h2>' +
      '<p class="meter-note">Kurmaca simülasyon puanı; gerçek anket sonucu değildir.</p>' + people +
      '<p class="meter-separate">Memnuniyet, hakkın korunduğu anlamına gelmez.</p></section></aside>';
  }

  function boardHtml(scenario, node, step, pending, ids) {
    var speaker = node.speaker || { who: "anlatici", name: "Anlatıcı", role: "Kurmaca sahne", text: "" };
    var sceneImg = sceneFor(scenario, ids, false);
    var scene = '<img class="scene-photo" src="' + esc(sceneImg.src) + '" alt="' + esc("Kurmaca sahne: " + sceneImg.alt) + '" width="1280" height="720" decoding="async">';
    var speechBody = step === 1 ? (node.scene || speaker.text) : (node.info || speaker.text);
    var confirmLabel = pending && pending.ending ? "Hikâyeyi gör" : "Kararı uygula";
    var confirm = pending
      ? '<button type="button" class="btn btn-primary btn-confirm" data-action="continue">' + confirmLabel + "</button>"
      : '<button type="button" class="btn btn-primary btn-confirm" disabled>Kararı uygula</button>';
    var eventBox = pending
      ? '<section class="panel panel-trade event-strip" id="secim-karsiligi" tabindex="-1"><p class="panel-title">Bu seçimden hemen sonra olanlar</p><p>' + esc(pending.event) + "</p></section>"
      : "";
    return '<div class="board">' +
      '<div class="board-head">' +
      '<h1 class="game-title">Sen Olsan?</h1>' +
      '<div class="chapter"><p class="chapter-label">Bölüm ' + step + " · " + esc(chapterTitle(scenario)) + "</p>" +
      stepBar(step) + "</div>" +
      '<p class="board-kicker">' + esc(scenario.badge) + "</p></div>" +
      '<div class="stage-col">' +
      '<div class="scene-frame">' + scene +
      '<div class="speech"><span class="speech-face">' + initialMark(speaker.name) + '</span><div><p class="speech-who">' +
      esc(speaker.name) + " · " + esc(speaker.role) + '</p><p class="speech-text">' + esc(speechBody) + "</p>" +
      (node.question ? '<p class="speech-text speech-question"><strong>' + esc(node.question) + "</strong></p>" : "") + "</div></div></div>" +
      '<div class="dock">' + choiceList(node.options, pending ? pending.id : null) + "</div>" +
      eventBox +
      '<div class="confirm-row"><p class="fine">Kurmaca senaryo · Kayıt veya üyelik yok</p>' + confirm + "</div>" +
      "</div>" +
      hudHtml(scenario, ids, pending ? pending.id : null) +
      "</div>";
  }

  function sceneFor(scenario, ids, ending) {
    if (window.SEN_SAHNE) return window.SEN_SAHNE.forPath(scenario, ids || [], !!ending);
    return { src: "assets/hikaye-sahnesi.jpg", alt: "Kurmaca bir toplantı çizimi." };
  }

  var lastSceneSrc = null;
  var preloaded = {};
  function afterRenderScene() {
    var img = document.querySelector("#app .scene-photo");
    if (!img) return;
    var src = img.getAttribute("src");
    img.addEventListener("error", function onErr() {
      img.removeEventListener("error", onErr);
      var fb = window.SEN_SAHNE ? window.SEN_SAHNE.fallback.src : "assets/hikaye-sahnesi.jpg";
      if (img.getAttribute("src") !== fb) img.setAttribute("src", fb);
    });
    if (lastSceneSrc !== null && lastSceneSrc !== src) {
      img.classList.add("scene-fade");
    }
    lastSceneSrc = src;
    if (!window.SEN_SAHNE) return;
    var scenario = currentScenario();
    var next = state.view === "play" || state.view === "home" ? window.SEN_SAHNE.nextImages(scenario, state.historyIds) : [];
    next.forEach(function (url) {
      if (preloaded[url]) return;
      preloaded[url] = true;
      var pre = new Image();
      pre.decoding = "async";
      pre.src = url;
    });
  }

  function viewHome() {
    var scenario = currentScenario();
    var node = scenario.nodes.start;
    var pills = data.scenarios.map(function (item) {
      var pressed = item.id === scenario.id;
      return '<li><button type="button" class="pill" data-action="scenario" data-scenario="' +
        esc(item.id) + '" aria-pressed="' + (pressed ? "true" : "false") + '">' +
        esc(item.title) + "</button></li>";
    }).join("");
    var routes = readRoutes();
    var routeNote = routes.length
      ? '<p class="hint">Bu tarayıcıda ' + routes.length +
        ' tamamlanmış rota duruyor. <button type="button" class="header-link" data-action="routes">Rotaları yan yana aç.</button></p>'
      : "";
    return shell(
      "home",
      '<ul class="switcher" aria-label="Üç kurgusal senaryo">' + pills + "</ul>" +
      boardHtml(scenario, node, 1, null, []) +
      routeNote +
      '<details class="about"><summary>Bu sayfa ne işe yarar?</summary>' +
      "<p>Sen Olsan?, gündelik bir hak anlaşmazlığında beş karar verdiğin bir kurgudur. Değer göstergeleri ile memnuniyet puanları ayrıdır. Hiçbir kart tek doğru cevap değildir. Kişisel veri istenmez.</p>" +
      "<p>" + esc(node.scene) + "</p></details>" +
      '<section class="section" aria-labelledby="nasil">' +
      '<h2 id="nasil" class="section-title">Bu sayfa ne işe yarar?</h2>' +
      '<p class="section-intro">Amaç, eşit hakları, özgür ifadeyi ve gönüllü birlikte yaşamı soyut bir ilkede bırakmadan, somut bir anlaşmazlığın içinde düşünmektir. Bir çözümü seçmek yetmez. Seçimin gerekçesi, başkasının hakkı ve itiraz yolu da görünür olmalıdır.</p>' +
      '<ol class="explain">' +
      "<li><p>Bir senaryo seçersin ve kısa durumu okursun. Aynı ekranda diğer iki kurguya geçebilirsin.</p></li>" +
      "<li><p>Her adımda en az iki savunulabilir seçenek vardır. Birini seçtiğinde, kolaylaştırıcının yalnız o seçeneğe bağlı zarfı açması gibi, yeni bilgi ekrana gelir.</p></li>" +
      "<li><p>Beş kararın sonunda önce ne olduğu yazılır. Sonra oyun içi değer göstergeleri ve, onlardan ayrı, kurmaca memnuniyet puanları gelir. Ardından kararlarının bu sonuca nasıl bağlandığı durur.</p></li>" +
      "<li><p>Aynı senaryoyu başka kartlarla yeniden oynayabilirsin. Tamamladığın rotalar yalnız bu tarayıcıda saklanır ve yan yana karşılaştırılır.</p></li>" +
      "</ol></section>" +
      '<section class="section prose" aria-labelledby="kim">' +
      '<h2 id="kim" class="section-title">Kimler kullanabilir?</h2>' +
      "<p>Kavram, gönüllü katılan yetişkinler için tarif edilmiştir. Bu sayfa yaş, ad, iletişim veya kimlik sormaz; çünkü kişisel veri toplamaz. Kimse belirli bir kimliğin temsilcisi gibi konuşmak, özel hayatını anlatmak veya istemediği bir rolü üstlenmek zorunda değildir.</p>" +
      "<p>Aynı kartlar bir grupla da okunabilir. Kolaylaştırıcı haklı tarafı ilan etmez. İsteyen bir soruyu yanıtsız bırakabilir. Oyuncu ve sahne gerektiren bir anlatım bu sayfada yoktur.</p>" +
      "</section>" +
      '<section class="section prose" aria-labelledby="degil">' +
      '<h2 id="degil" class="section-title">Bu sayfa ne değildir?</h2>' +
      "<p>Resmî bir program duyurusu, üyelik çağrısı veya bağış sayfası değildir. Siyasi bir görüşü öğretmez ve kimseyi bir partiye davet etmez.</p>" +
      "<p>Birinci senaryonun omurgası kavram notundaki kurgusal örnektir. Kararların ayrıntılı dalları ile diğer iki senaryo, prototipi oynanabilir kılmak için yazılmıştır. Hiçbiri gerçek bir kişinin, kurumun veya davanın sonucu değildir.</p>" +
      "<p>Metinler hukuki danışmanlık değildir. Kişisel bir hak sorunu için yetkili bir hukukçuya danışılmalıdır. Sayfa dosya yüklemez, form göndermez ve ziyaretçi ölçümü yapmaz.</p>" +
      "</section>"
    );
  }

  function widthClass(n) {
    var stepped = Math.max(0, Math.min(100, Math.round(n / 5) * 5));
    return "w" + stepped;
  }

  function deltaWords(n) {
    if (!n) return "değişmedi";
    if (n > 0) return n + " puan arttı";
    return Math.abs(n) + " puan azaldı";
  }

  function scoreFor(scenario, ids) {
    if (!window.SEN_SCORE) return null;
    return window.SEN_SCORE.compute(scenario, ids);
  }

  function meterBlock(title, note, rows) {
    return '<section class="meter-block"><h2 class="meter-heading">' + esc(title) + "</h2><p class=\"meter-note\">" +
      esc(note) + "</p>" + rows + "</section>";
  }

  function meterRows(labels, before, after, reasons) {
    return Object.keys(labels).map(function (key) {
      var value = after[key];
      var delta = value - before[key];
      var reason = reasons && reasons[key] ? reasons[key] : "";
      return '<div class="meter"><div class="meter-top"><span class="meter-name">' + esc(labels[key]) +
        '</span><span class="meter-num">' + value + " / 100. " + esc(deltaWords(delta)) + ".</span></div>" +
        '<div class="meter-track" aria-hidden="true"><span class="meter-fill ' + widthClass(value) + '"></span></div>' +
        (reason ? '<p class="meter-why">' + esc(reason) + "</p>" : "") + "</div>";
    }).join("");
  }

  function metersHtml(scenario, ids, pendingId, fromBaseline) {
    var shownIds = pendingId ? ids.concat(pendingId) : ids.slice();
    var shown = scoreFor(scenario, shownIds);
    if (!shown) return "";
    var before = fromBaseline ? shown.baseline : scoreFor(scenario, ids).current;
    var meta = window.SEN_SCORE.meta;
    var peopleReasons = fromBaseline ? shown.finalPeopleWhy : {};
    var valueWhy = "";
    if (pendingId && shown.steps.length) {
      var last = shown.steps[shown.steps.length - 1];
      valueWhy = last.vw || "";
      peopleReasons = last.pw || {};
    } else if (fromBaseline) {
      valueWhy = shown.valueChain.filter(Boolean).join(" ");
    }
    var valueRows = meterRows(meta.valueLabels, before.values, shown.current.values, null);
    var peopleRows = meterRows(meta.peopleLabels[scenario.id], before.people, shown.current.people, peopleReasons);
    return '<div class="meters">' +
      meterBlock("Oyun içi değer göstergeleri", "Oyun içi değer göstergeleri; bilimsel ölçüm değildir. Başlangıç sayıları bu sahne için yazılmış tabanlardır ve 5’in katlarıdır.", valueRows + (valueWhy ? '<p class="meter-why">' + esc(valueWhy) + "</p>" : "")) +
      '<p class="meter-separate">' + esc(meta.separate) + "</p>" +
      meterBlock("Kurmaca memnuniyet", "Kurmaca simülasyon puanı; gerçek anket sonucu değildir. Puan, o kurmaca kişinin son pratik durumdan memnuniyetidir.", peopleRows) +
      "</div>";
  }

  function stageHtml(node) {
    var speaker = node.speaker || { who: "anlatici", name: "Anlatıcı", role: "Kurmaca sahne", text: node.scene || node.info || "" };
    var face = window.SEN_CAST ? window.SEN_CAST.portrait(speaker.who) : "";
    return '<div class="stage"><div class="cast">' + face +
      '<p class="cast-name"><span>' + esc(speaker.name) + '</span> <span class="cast-role">' + esc(speaker.role) + " · kurmaca</span></p></div>" +
      '<blockquote class="bubble"><p>' + esc(speaker.text) + "</p></blockquote></div>";
  }

  function viewPlay() {
    var scenario = currentScenario();
    var resolved = resolvePath(scenario, state.historyIds);
    var node = resolved.current;
    var step = state.historyIds.length + 1;
    var pending = node.options.find(function (option) { return option.id === state.pendingId; }) || null;
    var historyHtml = "";
    if (resolved.steps.length) {
      historyHtml = '<ol class="history" aria-label="Şimdiye kadarki seçimler">' + resolved.steps.map(function (stepItem, index) {
        return "<li><span class=\"node\" aria-hidden=\"true\"></span><div><p class=\"history-title\">Karar " + (index + 1) +
          ". " + esc(stepItem.option.title) + "</p><p>" + esc(stepItem.option.event) + "</p></div></li>";
      }).join("") + "</ol>";
    }
    var infoHtml = "";
    if (step > 1) {
      infoHtml = '<section class="panel panel-info" aria-labelledby="yeni-bilgi-baslik" tabindex="-1" id="yeni-bilgi">' +
        '<p class="panel-title" id="yeni-bilgi-baslik">Şimdi karşına çıkan durum</p>' +
        "<p>" + esc(node.info) + "</p></section>";
    }
    var tradeHtml = "";
    if (pending) {
      tradeHtml = '<section class="panel panel-trade" id="secim-karsiligi" tabindex="-1" aria-labelledby="karsilik-baslik">' +
        '<p class="panel-title" id="karsilik-baslik">Bu seçimden hemen sonra olanlar</p><p>' + esc(pending.event) + "</p>" +
        '<div class="actions"><button type="button" class="btn btn-primary" data-action="continue">' +
        (pending.ending ? "Sonucu ve rotaları gör" : "Sonraki karara geç") +
        "</button></div></section>";
    }
    return shell(
      "play",
      boardHtml(scenario, node, step, pending, state.historyIds) +
      '<details class="about"><summary>Seçim geçmişi</summary>' + historyHtml +
      '<p><button type="button" class="btn btn-ghost" data-action="home">Başlangıca dön</button></p></details>'
    );
  }

  function savedRoute() {
    if (!state.routeId) return null;
    return readRoutes().find(function (route) { return route.id === state.routeId; }) || null;
  }

  function viewEnding() {
    var scenario = currentScenario();
    var saved = savedRoute();
    var resolved = resolvePath(scenario, state.historyIds);
    if (!resolved || resolved.steps.length !== 5) {
      return shell("ending", '<div class="error-box"><h1>Bu rota bulunamadı.</h1><p>Başlangıçtaki senaryolardan birini yeniden oynayabilirsin.</p><button type="button" class="btn btn-primary" data-action="home">Başlangıca dön</button></div>');
    }
    var steps = resolved.steps;
    var last = steps[4].option;
    var outcome = last.outcome;
    var others = outcome.others.map(function (person) {
      return "<li><strong>" + esc(person.who) + ".</strong> " + esc(person.what) + "</li>";
    }).join("");
    var chain = '<ol class="history">' + steps.map(function (item, index) {
      return "<li><span class=\"node\" aria-hidden=\"true\"></span><div><h3>Karar " + (index + 1) +
        ". " + esc(item.option.title) + "</h3><p>" + esc(item.option.event) + "</p></div></li>";
    }).join("") + "</ol>";
    var questions = outcome.reflection.map(function (question) {
      return "<li>" + esc(question) + "</li>";
    }).join("");
    var schema = "<ol class=\"schema\">" + steps.map(function (item, index) {
      var untaken = item.node.options.filter(function (option) { return option.id !== item.option.id; })
        .map(function (option) { return option.title; }).join("; ");
      return "<li><h3>Karar " + (index + 1) + "</h3><p>" + esc(item.node.question) +
        "</p><p><strong>Seçilen yol:</strong> " + esc(item.option.title) +
        "</p><p><strong>Bu adımda açılmayan yollar:</strong> " + esc(untaken) + "</p></li>";
    }).join("") + "</ol>";
    var same = readRoutes().filter(function (route) { return route.scenarioId === scenario.id; });
    var compare = "";
    if (same.length > 1) {
      compare = '<section class="section" aria-labelledby="yan-yana"><h2 id="yan-yana" class="section-title">Aynı senaryodaki rotalar</h2>' +
        "<p>Aşağıdaki özetler, bu tarayıcıda tamamladığın kurgusal rotalardır. Gerçek bir grup sonucu veya ölçüm değildir.</p>" +
        routeCards(same, state.routeId) + "</section>";
    } else {
      compare = '<section class="section prose"><h2 class="section-title">Başka bir rotayla karşılaştır</h2>' +
        "<p>Aynı senaryoyu başka kartlarla yeniden oynadığında, tamamlanan rotalar bu ekranda yan yana durur. Şu anda bu senaryoda kayıtlı tek rota, az önce bitirdiğin yoldur.</p></section>";
    }
    var when = saved ? '<p class="meta">Bu tarayıcıda tamamlanma zamanı: ' + esc(formatWhen(saved.savedAt)) + ".</p>" : "";
    return shell(
      "ending",
      '<p class="badge">' + esc(scenario.badge) + "</p>" +
      "<h1 class=\"play-question\">Kararlarının hikâyesi</h1>" +
      (function () {
        var endImg = sceneFor(scenario, state.historyIds, true);
        return '<figure class="ending-figure"><img class="scene-photo ending-photo" src="' + esc(endImg.src) + '" alt="' + esc("Kurmaca sahne: " + endImg.alt) + '" width="1280" height="720" decoding="async"></figure>';
      })() +
      "<h2 class=\"section-title\">" + esc(outcome.headline) + "</h2>" +
      "<p>Bu sonuç kurgudur. Bir mahkeme, disiplin kurulu veya kurum kararı değildir. Aynı seçimler gerçek hayatta aynı sonucu garanti etmez. Metin hukuki danışmanlık değildir.</p>" +
      when +
      '<section class="section" aria-labelledby="ne-oldu"><h2 id="ne-oldu" class="section-title">Ne oldu?</h2>' +
      '<div class="fact-grid">' +
      '<article class="fact"><h3>Sana ne oldu</h3><p>' + esc(outcome.protagonist) + "</p></article>" +
      '<article class="fact"><h3>Diğer kişilere ne oldu</h3><ul>' + others + "</ul></article>" +
      '<article class="fact"><h3>Pratik olarak kazanılan</h3><p>' + esc(outcome.gained) + "</p></article>" +
      '<article class="fact"><h3>Pratik olarak kaybedilen</h3><p>' + esc(outcome.lost) + "</p></article>" +
      "</div>" +
      '<article class="fact"><h3>Açık kalan mesele</h3><p>' + esc(outcome.open) + "</p></article></section>" +
      metersHtml(scenario, state.historyIds, null, true) +
      '<section class="section" aria-labelledby="neden"><h2 id="neden" class="section-title">Kararların bu sonuca nasıl bağlandı?</h2>' +
      "<p>" + esc(outcome.because) + "</p>" +
      chain + "</section>" +
      '<section class="section" aria-labelledby="sorular"><h2 id="sorular" class="section-title">Bu sonuç hakkında düşünmek</h2>' +
      "<p>Sorular bu rotada olanlara aittir. Cevabı bir yere yazman istenmez.</p>" +
      '<ol class="questions">' + questions + "</ol></section>" +
      '<section class="section" aria-labelledby="sema"><h2 id="sema" class="section-title">Yönlendirme şeması</h2>' +
      "<p>Seçilmeyen kartlar da savunulabilir yollardır. Sonuçlarını görmek için aynı senaryoyu o kartlarla yeniden oynayabilirsin.</p>" +
      schema + "</section>" +
      compare +
      '<div class="actions">' +
      '<button type="button" class="btn btn-primary" data-action="replay">Aynı senaryoyu başka kartlarla oyna</button>' +
      '<button type="button" class="btn btn-ghost" data-action="home">Başka senaryo seç</button>' +
      '<button type="button" class="btn btn-ghost" data-action="routes">Bütün rotaları aç</button>' +
      "</div>"
    );
  }

  function formatWhen(iso) {
    try {
      return new Intl.DateTimeFormat("tr-TR", { dateStyle: "long", timeStyle: "short" }).format(new Date(iso));
    } catch (error) {
      return iso;
    }
  }

  function routeCards(routes, currentId) {
    var cls = routes.length > 1 ? "compare two" : "compare";
    return '<ul class="' + cls + '">' + routes.map(function (route, index) {
      var current = route.id === currentId;
      var items = route.choices.map(function (choice) {
        return "<li>" + esc(choice.title) + "</li>";
      }).join("");
      return '<li><article class="route-card' + (current ? " is-current" : "") + '">' +
        '<p class="route-index">Rota ' + (index + 1) + (current ? " · Az önce bu yoldaydın" : "") + "</p>" +
        "<h3>" + esc(route.summary) + "</h3>" +
        "<ol>" + items + "</ol>" +
        "<p>" + esc(route.closing) + "</p>" +
        (route.scores ? "<p>" + esc(route.scores) + "</p>" : "") +
        '<p class="meta">' + esc(formatWhen(route.savedAt)) + "</p>" +
        '<div class="actions"><button type="button" class="btn btn-ghost" data-action="open-route" data-route="' +
        esc(route.id) + '">Bu rotayı yeniden oku</button>' +
        '<button type="button" class="btn btn-ghost" data-action="delete-route" data-route="' +
        esc(route.id) + '">Bu kaydı sil</button></div></article></li>';
    }).join("") + "</ul>";
  }

  function viewRoutes() {
    var routes = readRoutes();
    var body = '<h1 class="play-question">Denediğin rotalar</h1>' +
      "<p class=\"lead\">Burada yalnız bu tarayıcıda tamamladığın kurgusal rotalar durur. Kayıt bir sunucuya gitmez. En fazla " +
      MAX_ROUTES + " rota tutulur; yeniler eskinin yerini alır.</p>";
    if (!routes.length) {
      body += "<p>Henüz tamamlanmış bir rota yok. Bir senaryoyu beş kararın sonuna kadar oynadığında seçimler burada yan yana görünür.</p>" +
        '<div class="actions"><button type="button" class="btn btn-primary" data-action="home">Bir senaryo oyna</button></div>';
    } else {
      data.scenarios.forEach(function (scenario) {
        var group = routes.filter(function (route) { return route.scenarioId === scenario.id; });
        if (!group.length) return;
        body += '<section class="section"><h2 class="section-title">' + esc(scenario.title) + "</h2>" +
          routeCards(group, null) + "</section>";
      });
      body += '<div class="actions"><button type="button" class="btn btn-ghost" data-action="clear-routes">Bu cihazdaki rota kayıtlarını sil</button>' +
        '<button type="button" class="btn btn-primary" data-action="home">Yeni bir senaryo oyna</button></div>';
    }
    return shell("routes", body);
  }

  function viewError(messages) {
    return shell(
      "error",
      '<div class="error-box"><h1>Prototip açılamadı.</h1><p>Senaryo bağlantılarında bir kopukluk var. Sayfa yine de veri göndermez.</p><ul>' +
      messages.map(function (message) { return "<li>" + esc(message) + "</li>"; }).join("") +
      "</ul></div>"
    );
  }

  function render() {
    var errors = data.validate(data.scenarios);
    var app = document.getElementById("app");
    if (errors.length) app.innerHTML = viewError(errors);
    else if (state.view === "play") app.innerHTML = viewPlay();
    else if (state.view === "ending") app.innerHTML = viewEnding();
    else if (state.view === "routes") app.innerHTML = viewRoutes();
    else app.innerHTML = viewHome();
    afterRenderScene();

    if (state.announce) {
      var live = document.getElementById("live");
      var message = state.announce;
      state.announce = "";
      live.textContent = "";
      window.setTimeout(function () { live.textContent = message; }, 30);
    }
    if (state.focus) {
      var target = document.querySelector(state.focus);
      state.focus = null;
      if (target) target.focus();
    }
  }

  function saveCompleted(scenario, steps) {
    var routes = readRoutes().filter(function (route) {
      return !(route.scenarioId === scenario.id && route.choiceIds.join("|") === state.historyIds.join("|"));
    });
    var id = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now());
    var record = {
      id: id,
      scenarioId: scenario.id,
      scenarioTitle: scenario.title,
      savedAt: new Date().toISOString(),
      choiceIds: state.historyIds.slice(),
      choices: steps.map(function (step) {
        return { title: step.option.title };
      }),
      summary: steps[4].option.outcome.headline,
      closing: steps[4].option.outcome.protagonist,
      scores: window.SEN_SCORE ? window.SEN_SCORE.line(scenario, state.historyIds) : ""
    };
    routes.unshift(record);
    writeRoutes(routes);
    return id;
  }

  function onClick(event) {
    var el = event.target.closest("[data-action]");
    if (!el || !document.getElementById("app").contains(el)) return;
    var action = el.getAttribute("data-action");
    if (action === "theme") {
      var next = themeNow() === "dark" ? "light" : "dark";
      try { localStorage.setItem(THEME_KEY, next); } catch (ignore) { /* tema yalnız bu cihazda */ }
      document.documentElement.setAttribute("data-theme", next);
      state.announce = next === "dark" ? "Koyu görünüm açık." : "Açık görünüm açık.";
      state.focus = "[data-action=theme]";
      render();
      return;
    }
    if (action === "home") {
      commit({
        view: "home",
        historyIds: [],
        pendingId: null,
        routeId: null,
        focus: "h1",
        announce: "Başlangıç ekranındasın."
      }, "push");
      return;
    }
    if (action === "scenario") {
      commit({
        view: "home",
        scenarioId: el.getAttribute("data-scenario"),
        historyIds: [],
        pendingId: null,
        routeId: null,
        focus: ".play-question",
        announce: "Senaryo değişti."
      }, "replace");
      return;
    }
    if (action === "choose") {
      var optionId = el.getAttribute("data-option");
      if (state.view === "home") {
        commit({
          view: "play",
          historyIds: [],
          pendingId: optionId,
          routeId: null,
          focus: "#secim-karsiligi",
          announce: "Seçimin karşılığı açıldı. İstersen başka bir kart seçebilir veya sonraki karara geçebilirsin."
        }, "push");
      } else {
        commit({
          pendingId: optionId,
          focus: "#secim-karsiligi",
          announce: "Seçimin karşılığı güncellendi."
        }, "replace");
      }
      return;
    }
    if (action === "continue") {
      var scenario = currentScenario();
      var resolved = resolvePath(scenario, state.historyIds);
      var pending = resolved.current.options.find(function (option) { return option.id === state.pendingId; });
      if (!pending) return;
      var nextHistory = state.historyIds.concat(pending.id);
      if (pending.ending) {
        state.historyIds = nextHistory;
        var finished = resolvePath(scenario, nextHistory);
        var routeId = saveCompleted(scenario, finished.steps);
        commit({
          view: "ending",
          historyIds: nextHistory,
          pendingId: null,
          routeId: routeId,
          focus: "h1",
          announce: "Rota tamamlandı. Sonuç varsayımsaldır ve bu tarayıcıya kaydedildi."
        }, "push");
      } else {
        commit({
          historyIds: nextHistory,
          pendingId: null,
          focus: "#yeni-bilgi",
          announce: "Karar " + (nextHistory.length + 1) + ". Yeni bilgi açıldı."
        }, "push");
      }
      return;
    }
    if (action === "replay") {
      commit({
        view: "play",
        historyIds: [],
        pendingId: null,
        routeId: null,
        focus: "h1",
        announce: "Aynı senaryo başa döndü. Önceki rotan tarayıcıda duruyor."
      }, "push");
      return;
    }
    if (action === "routes") {
      commit({ view: "routes", focus: "h1", announce: "Rota karşılaştırma ekranı." }, "push");
      return;
    }
    if (action === "open-route") {
      var found = readRoutes().find(function (route) { return route.id === el.getAttribute("data-route"); });
      if (!found) return;
      commit({
        view: "ending",
        scenarioId: found.scenarioId,
        historyIds: found.choiceIds.slice(),
        pendingId: null,
        routeId: found.id,
        focus: "h1",
        announce: "Kayıtlı rota açıldı."
      }, "push");
      return;
    }
    if (action === "delete-route") {
      var remain = readRoutes().filter(function (route) { return route.id !== el.getAttribute("data-route"); });
      writeRoutes(remain);
      if (state.routeId === el.getAttribute("data-route")) state.routeId = null;
      commit({
        view: "routes",
        announce: "Rota bu tarayıcıdan silindi.",
        focus: "h1"
      }, "replace");
      return;
    }
    if (action === "clear-routes") {
      writeRoutes([]);
      commit({
        view: "routes",
        routeId: null,
        announce: "Bu cihazdaki rota kayıtları silindi.",
        focus: "h1"
      }, "replace");
    }
  }

  function boot() {
    try {
      localStorage.removeItem("sen-olsan-rotalar-v1");
      localStorage.removeItem("sen-olsan-rotalar-v2");
      sessionStorage.removeItem("sen-olsan-oturum-v1");
      sessionStorage.removeItem("sen-olsan-oturum-v2");
    } catch (ignore) { /* eski sürüm bu tarayıcıda yoksa sessizce geç */ }
    if (window.SEN_CAST) window.SEN_CAST.apply(data.scenarios);
    if (window.SEN_SEQUELS) window.SEN_SEQUELS.deepen(data.scenarios);
    if (window.SEN_SCORE) window.SEN_SCORE.attachBase(data.scenarios);
    var errors = data.validate(data.scenarios);
    document.addEventListener("click", onClick);
    window.addEventListener("popstate", function (event) {
      if (event.state) applySnap(event.state);
      else applySnap({ view: "home", scenarioId: "kayit", historyIds: [], pendingId: null, routeId: null });
      persistSession();
      render();
    });
    var initial = { view: "home", scenarioId: "kayit", historyIds: [], pendingId: null, routeId: null };
    try {
      var stored = JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null");
      if (stored && stored.view) initial = stored;
    } catch (error) {
      initial = { view: "home", scenarioId: "kayit", historyIds: [], pendingId: null, routeId: null };
    }
    var hash = location.hash || "";
    if (hash.indexOf("#/rotalar") === 0) initial.view = "routes";
    else if (hash.indexOf("#/oyna/") === 0) {
      initial.view = "play";
      initial.scenarioId = hash.slice("#/oyna/".length);
      if (!sessionStorage.getItem(SESSION_KEY)) {
        initial.historyIds = [];
        initial.pendingId = null;
      }
    } else if (hash.indexOf("#/sonuc/") === 0 && (!initial.historyIds || !initial.historyIds.length)) {
      initial.view = "home";
    } else if (hash === "" || hash === "#/" || hash === "#") {
      if (!sessionStorage.getItem(SESSION_KEY)) initial.view = "home";
    }
    applySnap(initial);
    if (errors.length) {
      document.getElementById("app").innerHTML = viewError(errors);
      return;
    }
    if (window.matchMedia) {
      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () {
        if (localStorage.getItem(THEME_KEY)) return;
        document.documentElement.setAttribute("data-theme", window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
        render();
      });
    }
    history.replaceState(snapshot(), "", hashFor(state));
    persistSession();
    render();
  }

  boot();
})();
