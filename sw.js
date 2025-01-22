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

const trimCache = (chachName, max) => {
  caches.open(chachName).then((cache) => {
    return cache.keys().then((keys) => {
      console.log(keys);
      if (keys.length > max) {
        cache.delete(keys[0]).then(() => {
          trimCache(chachName, max);
        });
      }
    });
  });
};

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
  if (e.request.url.indexOf("https://jsonplaceholder.typicode.com/users") > -1) {
    e.responseWith(
      caches.open(DYNAMIC_CHACHE).then((cache) => {
        return fetch(e.request).then((response) => {
          trimCache(DYNAMIC_CHACHE, 5);
          cache.put(e.request, response.clone());
        });
      })
    );
  } else {
    e.respondWith(
      caches.match(e.request).then((res) => {
        return (
          res ||
          fetch(e.request)
            .then((fetchRes) => {
              return caches.open(DYNAMIC_CHACHE).then((cache) => {
                // cach.put اضافه کردن یک مقدار جدید
                trimCache(DYNAMIC_CHACHE, 5);
                cache.put(e.request, fetchRes.clone());
                return fetchRes;
              });
            })
            .catch((err) => {
              return caches.open(STATIC_CHACHE).then((cache) => {
                if (e.request.headers.get("accept").includes("text/html")) {
                  return cache.match("/offline.html");
                }
              });
            })
        );
      })
    );
  }
});

self.addEventListener("notificationclick", (event) => {
  if (event.action == "confrim") {
    console.log("اکشن مورد نظر تایید شد");
  } else if (event.action === "cancel") {
    console.log("اکشن مورد نظر نادیده گرفته شد");
  } else {
    console.log("اکشنی انتخاب نشد");
  }
});

self.addEventListener("push", (event) => {
  const notification = event.data.json();
  const options = {
    body: notification.body,
    icon: "/assets/images/codeyadIcon.png",
    image: "/assets/images/office.jpg",
    dir: "ltr",
    vibrate: [100, 50, 200],
    badge: "/assets/images/codeyadIcon.png",
    tag: "group1",
    renotify: true,
    actions: [
      { action: "confirm", title: "تایید", icon: "/assets/images/confirm.png" },
      { action: "cancel", title: "انصراف", icon: "/assets/images/cancel.png" },
    ],
    data: {
      notifUrl: notification.url,
    },
  };
  self.registration.showNotification(notification.title, options);
});
