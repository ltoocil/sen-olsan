(function () {
  var valueLabels = {
    ifade: "İfade özgürlüğü",
    ozerklik: "Bireysel özerklik",
    esit: "Eşit muamele",
    mahremiyet: "Mahremiyet"
  };
  var peopleLabels = {
    kayit: {
      selma: "Selma, konuşmacı",
      emre: "Emre, şoför",
      leyla: "Leyla, evdeki üye",
      salon: "Salondaki komşular"
    },
    kulup: {
      kerem: "Kerem, konuşmacı",
      defne: "Defne, itiraz eden öğrenci",
      diger: "Kulüp üyeleri",
      kurul: "Murat, öğrenci işleri"
    },
    vardiya: {
      aylin: "Aylin, voleybol kaptanı",
      tarik: "Tarık, basketbol antrenörü",
      hakan: "Hakan, müdür",
      genc: "Takımlardaki gençler"
    }
  };
  var baseline = {
    kayit: {
      values: { ifade: 50, ozerklik: 50, esit: 50, mahremiyet: 50 },
      people: { selma: 60, emre: 40, leyla: 40, salon: 55 }
    },
    kulup: {
      values: { ifade: 50, ozerklik: 50, esit: 50, mahremiyet: 50 },
      people: { kerem: 50, defne: 40, diger: 55, kurul: 50 }
    },
    vardiya: {
      values: { ifade: 50, ozerklik: 50, esit: 45, mahremiyet: 50 },
      people: { aylin: 40, tarik: 60, hakan: 60, genc: 50 }
    }
  };

  /* Puan değişimleri artık doğrudan senaryo seçeneklerinde (deltas) yazılıdır. */
  var base = {};

  function clamp(n) { return Math.max(0, Math.min(100, n)); }

  function attachBase(scenarios) {
    scenarios.forEach(function (scenario) {
      var pack = base[scenario.id] || {};
      Object.keys(scenario.nodes).forEach(function (nodeId) {
        scenario.nodes[nodeId].options.forEach(function (option) {
          if (!option.deltas && pack[option.id]) option.deltas = pack[option.id];
        });
      });
    });
  }

  function compute(scenario, ids) {
    var start = baseline[scenario.id];
    var values = Object.assign({}, start.values);
    var people = Object.assign({}, start.people);
    var steps = [];
    var valueChain = [];
    var finalPeopleWhy = {};
    var node = scenario.nodes.start;
    ids.forEach(function (id) {
      var option = node.options.find(function (item) { return item.id === id; });
      if (!option) return;
      var deltas = option.deltas || { v: {}, p: {}, vw: "", pw: {} };
      Object.keys(deltas.v || {}).forEach(function (key) { values[key] = clamp(values[key] + deltas.v[key]); });
      Object.keys(deltas.p || {}).forEach(function (key) { people[key] = clamp(people[key] + deltas.p[key]); });
      steps.push({ vw: deltas.vw || "", pw: deltas.pw || {}, v: deltas.v || {}, p: deltas.p || {} });
      if (deltas.vw) valueChain.push(deltas.vw);
      Object.keys(deltas.pw || {}).forEach(function (key) { finalPeopleWhy[key] = deltas.pw[key]; });
      if (option.next) node = scenario.nodes[option.next];
    });
    Object.keys(start.people).forEach(function (key) {
      if (!finalPeopleWhy[key]) finalPeopleWhy[key] = "Bu rotadaki kararlar bu kişinin memnuniyetini değiştirmedi.";
    });
    return {
      baseline: { values: Object.assign({}, start.values), people: Object.assign({}, start.people) },
      current: { values: values, people: people },
      steps: steps,
      valueChain: valueChain,
      finalPeopleWhy: finalPeopleWhy
    };
  }

  function line(scenario, ids) {
    var scored = compute(scenario, ids);
    var values = Object.keys(valueLabels).map(function (key) {
      return valueLabels[key] + " " + scored.current.values[key];
    }).join(", ");
    var people = Object.keys(peopleLabels[scenario.id]).map(function (key) {
      return peopleLabels[scenario.id][key] + " " + scored.current.people[key];
    }).join(", ");
    return "Değer göstergeleri: " + values + ". Kurmaca memnuniyet: " + people + ".";
  }

  window.SEN_SCORE = {
    meta: {
      valueLabels: valueLabels,
      peopleLabels: peopleLabels,
      separate: "Memnuniyet, hakkın korunup korunmadığı demek değildir. Bir grup memnunken bir kişinin mahremiyeti veya eşit muamele düşebilir."
    },
    baseline: baseline,
    attachBase: attachBase,
    compute: compute,
    line: line
  };
})();
