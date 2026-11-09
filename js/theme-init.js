(function () {
  var key = "sen-olsan-tema-v1";
  var theme = "light";
  try {
    var saved = localStorage.getItem(key);
    if (saved === "dark" || saved === "light") theme = saved;
    else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) theme = "dark";
  } catch (error) {
    theme = "light";
  }
  document.documentElement.setAttribute("data-theme", theme);
})();
