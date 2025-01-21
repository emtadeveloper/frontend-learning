if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("./sw.js")
    .then(function (res) {
      console.log("SW registerd ....");
      console.log(res);
    })
    .catch(function (e) {
      console.log(e.message);
    });
}

// =================================================================================

/*

از این تیکه کد برای این استفاده میکنیم که  وقتی کاربر وارد سایت ما شد بهش بگیم آیا قصد نصب برنامه

مارو دارد یا خیر PWA

chrome://inspect/#devices  معرفی برای چک کردن گوشی موبایل امون که وصل هستش

*/

var deferredPrompt;

window.addEventListener("beforeinstallprompt", (e) => {
  console.log("beforinstallprompt ...");
  e.preventDefault();
  deferredPrompt = e;
  console.log(e);
  return false;
});

document.getElementById("install-prompt").addEventListener("click", () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoise.then((choiceRes) => {
      console.log(choiceRes.outcome);
      if (choiceRes.outcome === "accepted") {
        console.log("user accepted the install prompt .");
      } else if (choiceRes.outcome === "dismissed") {
        console.log("User  dissmissed the install prompt");
      }
    });
    deferredPrompt = null;
  }
});

// =================================================================================

// منتظر می‌ماند تا محتوای HTML صفحه به طور کامل بارگذاری شود
document.addEventListener("DOMContentLoaded", function () {
  // بررسی می‌کند که آیا برنامه در حالت مستقل (standalone) اجرا می‌شود یا خیر
  if (!window.matchMedia("(display-mode: standalone)").matches) {
    // اگر برنامه به عنوان وب‌اپلیکیشن نصب نشده باشد، پس از 5 ثانیه
    setTimeout(() => {
      // عنصر با شناسه "install-prompt" را پیدا می‌کند و کلاس "show" را به آن اضافه می‌کند
      // این کار برای نمایش پیام نصب انجام می‌شود
      document.getElementById("install-prompt").classList.add("show");
    }, 5000);
  }
});

// =================================================================================

// Check browser------------------
navigator.sayswho = () => {
  var N = Navigator.appName,
    ua = navigator.userAgent,
    tem,
    M = ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*([\d\.]+)/i);
  if (M && (tem = ua.match(/version\/([\.\d]+)/i)) != null) M[2] = tem[1];
  M = M ? [M[1], M[2]] : [N, Navigator.appVersion, "-?"];
  return M.join(" ");
};
if (!navigator.sayswho().includes("Chrome")) alert("لطفا از مرورگر کروم استفاده کنید");

// install prompt-------------
var deferredPrompt;
window.addEventListener("beforeinstallprompt", (e) => {
  if (!window.matchMedia("(display-mode: standalone)").matches) {
    setTimeout(() => {
      document.getElementById("install-prompt")?.classList.add("show");
    }, 5000);
  }
  e.preventDefault();
  deferredPrompt = e;
  return false;
});

const isIos = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent);
};

const isInStandaloneMode = () => "standalone" in window.navigator && window.navigator.standalone;

// Checks if should display install popup notification:
if (isIos() && !isInStandaloneMode()) {
  // this.setState({ showInstallMessage: true });
  this.popupIos = true;
}

document.getElementById("install-prompt")?.addEventListener("click", (e) => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    e.target.classList.remove("show");
    deferredPrompt.userChoice.then((choiceRes) => {
      console.log(choiceRes.outcome);
      if (choiceRes.outcome === "accepted") {
        console.log("User accepted the install prompt.");
      } else if (choiceRes.outcome === "dismissed") {
        console.log("User dismissed the install prompt");
      }
    });
    deferredPrompt = null;
  }
});

document.addEventListener("DOMContentLoaded", function () {
  var elems = document.querySelectorAll(".sidenav");
  var instances = M.Sidenav.init(elems, {
    edge: "right",
  });
});

// Push notification-------------------
if (Notification.permission == "default") {
  setTimeout(() => {
    document.getElementById("notification_bell_box")?.classList.remove("dis-none");
  }, 10000);
}

const showConfirmNotify = () => {
  if ("serviceWorker" in navigator) {
    // const options = {
    //   body: "ممنون از شما بخاطر تایید اعلانات...!",
    //   icon: "/assets/images/codeyadIcon.png",
    //   image: "/assets/images/office.jpg",
    //   dir: "ltr",
    //   vibrate: [100, 50, 200],
    //   badge: "/assets/images/codeyadIcon.png",
    //   tag: "group1",
    //   renotify: true,
    //   actions: [
    //     {action: "confirm", title: "تایید", icon:"/assets/images/confirm.png"},
    //     {action: "cancel", title: "انصراف", icon:"/assets/images/cancel.png"}
    //   ]
    // }
    navigator.serviceWorker.ready.then((sw) => {
      // sw.showNotification('ممنون از شما...!', options)
      sw.pushManager
        .subscribe({
          userVisibleOnly: true,
          applicationServerKey:
            "BNbqX8M5NJJfs_IcL_5Gfisx7FkOYHtYniD4QMJq1RB4DeQsOmGo3lO-zzurFEqTUwtrqQHKb62p_TzxPU552yI",
        })
        .then((subscription) => {
          fetch("https://pushnotif.azhadev.ir/api/push-subscribe", {
            method: "post",
            body: JSON.stringify(subscription),
          })
            .then((res) => {
              return res.json();
            })
            .then((response) => {
              console.log(response);
              alert("این کد رو ذخیره کنید : " + response.user_code);
            });
        });
    });
  }
};

document.getElementById("notification_bell_box")?.addEventListener("click", () => {
  Notification.requestPermission((res) => {
    if (res == "granted") {
      showConfirmNotify();
    } else {
      console.log("Blocked...!");
    }
  });
});

// network status------------------------

const setnetworkStatus = (status) => {
  const iconElem = document.querySelector("#network_status i");
  if (status == 1) {
    iconElem?.classList.add("green-text");
    iconElem?.classList.remove("red-text");
  } else {
    iconElem?.classList.remove("green-text");
    iconElem?.classList.add("red-text");
  }
};

if (navigator.onLine) setnetworkStatus(1);
else setnetworkStatus(0);

window.addEventListener("online", () => setnetworkStatus(1));
window.addEventListener("offline", () => setnetworkStatus(0));
