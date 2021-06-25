// cache名, 在控制台Application的CaChe下可以看到
const cacheName = "watermark";
// cache文件
const cacheFiles = ["/", "/index.html", "/manifest.json"];

/**
 * 安装 Service Worker
 * install事件是 Service Worker 执行的第一个事件,同一个 Service Worker 只会调用一次,
 * 即使 Service Worker 脚本文件只有一个字节不同,浏览器也将视为一个新的 Service Worker。
 */
// eslint-disable-next-line no-restricted-globals
self.addEventListener("install", (e) => {
  // eslint-disable-next-line no-restricted-globals
  self.skipWaiting();
  e.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(cacheFiles);
    })
  );
});

/**
 * 激活 Service Worker
 * Service Worker 安装成功之后,会触发activate事件
 * 在这个阶段我们一般做一些清理旧缓存相关的工作
 */
// eslint-disable-next-line no-restricted-globals
self.addEventListener("activate", (e) => {
  // e.waitUntil(caches.delete(cacheName));
  e.waitUntil(
    caches
      .keys()
      .then((keys) => {
        return Promise.all(
          // eslint-disable-next-line array-callback-return
          keys.map((key) => {
            // 清理缓存
            if (cacheName !== key) {
              return caches.delete(key);
            }
          })
        );
      })
      .then(() => {
        console.log("cache deleted");
      })
  );
});

// service worker发生更新后,刷新页面
// eslint-disable-next-line no-restricted-globals
self.addEventListener('controllerchange', () => {
  window.location.reload();
})

// eslint-disable-next-line no-restricted-globals
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches
      .open(cacheName)
      .then((cache) =>
        cache.match(e.request, {
          ignoreSearch: true,
        })
      )
      .then((response) => {
        return response || fetch(e.request);
      })
  );
});