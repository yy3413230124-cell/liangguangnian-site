(function () {
  "use strict";

  var ENDPOINT =
    "https://v11enp9ok1h.feishuapp.com/app/app_17g37cdqkts/analytics/collect";
  var VISITOR_KEY = "lg_analytics_visitor_id";
  var KNOWLEDGE_MARK = "7330809570845048833";

  function randomId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }
    return (
      Date.now().toString(36) +
      "_" +
      Math.random().toString(36).slice(2, 14)
    );
  }

  function visitorId() {
    try {
      var saved = window.localStorage.getItem(VISITOR_KEY);
      if (saved) return saved;
      var created = randomId();
      window.localStorage.setItem(VISITOR_KEY, created);
      return created;
    } catch (_error) {
      return randomId();
    }
  }

  function currentPage() {
    return /\/wechat(?:\.html)?\/?$/.test(window.location.pathname)
      ? "wechat"
      : "home";
  }

  function track(eventType, target) {
    if (navigator.doNotTrack === "1") return;
    var host = window.location.hostname;
    if (host !== "yzspm.com" && host !== "www.yzspm.com") return;
    try {
      var params = new URLSearchParams({
        eventId: randomId(),
        visitorId: visitorId(),
        eventType: eventType,
        site: "yzspm",
        page: currentPage(),
        path: window.location.pathname.slice(0, 255),
        referrer: document.referrer.slice(0, 1000),
      });
      if (target) params.set("target", String(target).slice(0, 500));
      fetch(ENDPOINT + "?" + params.toString(), {
        method: "GET",
        mode: "no-cors",
        credentials: "omit",
        keepalive: true,
      }).catch(function () {});
    } catch (_error) {
      // Analytics must never block the public site.
    }
  }

  function trackPageView() {
    track("page_view");
  }

  document.addEventListener(
    "click",
    function (event) {
      var target = event.target;
      if (!target || typeof target.closest !== "function") return;
      var anchor = target.closest("a[href]");
      if (!anchor) return;
      var href = anchor.href || "";
      if (href.indexOf(KNOWLEDGE_MARK) !== -1) {
        track("knowledge_click", href);
        return;
      }
      try {
        var url = new URL(href, window.location.href);
        if (/\/wechat(?:\.html)?\/?$/.test(url.pathname)) {
          track("consult_click", url.pathname);
        }
      } catch (_error) {}
    },
    true,
  );

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", trackPageView, {
      once: true,
    });
  } else {
    trackPageView();
  }
})();
