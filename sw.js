let staticItems = [
  "/",
  "index.html",
  "offline.html",
  "/assets/materialize/css/materialize.min.css",
  "/assets/css/util.css",
  "/assets/css/style.css",
  "/assets/js/app.js",
  "https://fonts.googleapis.com/icon?family=Material+Icons",
];

let STATIC_CHACHE = "static-v1";
let DYNAMIC_CHACHE = "dynamic-v1";

self.addEventListener("install", function (e) {
  //  caches کردن اولیه فایل هامون

  e.waitUntil(
    caches.open(STATIC_CHACHE).then((cache) => {
      //   cache.add("/");
      //   cache.add("/index.html");
      cache.addAll(staticItems);
    })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key != STATIC_CHACHE && key != DYNAMIC_CHACHE) {
            return caches.delete(key);
          }
        })
      );
    })
  );

  //  برای اطمینان از این موضوع که هیچ عملیاتی در این رویداد و چرخه باقی نمانده میایم و از این حالت استفاده میکنیم
  return self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => {
      return (
        res ||
        fetch(e.request)
          .then((fetchRes) => {
            return caches.open(DYNAMIC_CHACHE).then((cache) => {
              // cach.put اضافه کردن یک مقدار جدید
              cache.put(e.request, fetchRes.clone());
              return fetchRes;
            });
          })
          .catch((err) => {
            return caches.open(STATIC_CHACHE).then((cache) => {
              if (e.request.headers.get("accept").includes("text/html")) {
                return cache.match("offline.html");
              }
            });
          })
      );
    })
  );
});
