'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"version.json": "3cc7c5f656ed510f470e3d14bebf64a3",
"index.html": "3c99a06f66b219644990742f6c0269b2",
"/": "3c99a06f66b219644990742f6c0269b2",
"main.dart.js": "a40c06b67325bcd2e481f9ac6108e6c1",
"flutter.js": "6fef97aeca90b426343ba6c5c9dc5d4a",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"manifest.json": "749dbe24635d2e33750a67cb1ffb8976",
"assets/AssetManifest.json": "51f9c28288b7158239e22f9e907284fd",
"assets/NOTICES": "59140bcaeba620ba12da58e4154a1996",
"assets/FontManifest.json": "1b1e7812d9eb9f666db8444d7dde1b20",
"assets/packages/material_design_icons_flutter/lib/fonts/materialdesignicons-webfont.ttf": "dd74f11e425603c7adb66100f161b2a5",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/packages/flutter_dropzone_web/assets/flutter_dropzone.js": "0266ef445553f45f6e45344556cfd6fd",
"assets/shaders/ink_sparkle.frag": "f8b80e740d33eb157090be4e995febdf",
"assets/AssetManifest.bin": "a3f609e1971b3bf4f9189a5e242d5722",
"assets/fonts/MaterialIcons-Regular.otf": "e7069dfd19b331be16bed984668fe080",
"assets/assets/images/login.png": "2dae51fafde79d49f174bbb890f9cc95",
"assets/assets/images/avatar.png": "aeb094deae0ed87c8172fe5c0dba8054",
"assets/assets/icons/tools.svg": "7c261a233417ef9c3d6207b57dfd17b5",
"assets/assets/icons/model.svg": "fbe05da8699a223e88cdd91ca65253bc",
"assets/assets/icons/dashboard.png": "e47fbd4920029b4e95fdeabf52b6aa87",
"assets/assets/icons/home.svg": "8fde1496ca7403843609fcc55e325d9e",
"assets/assets/icons/menu%252012.41.13%2520AM.png": "8ea4c92d811ae4407da82b980b7e1592",
"assets/assets/icons/menu%25207.02.36%2520PM.png": "15ad45509d752d64841c10557de60bf3",
"assets/assets/icons/menu%25204.58.06%2520PM.png": "8ea4c92d811ae4407da82b980b7e1592",
"assets/assets/icons/database_FILL0_wght300_GRAD0_opsz48.svg": "b9d70ebdb778dbfe292f40d021800204",
"assets/assets/icons/show.png": "f1e2ef29b5d8bbf22101d11163cd1ce8",
"assets/assets/icons/settings.svg": "888d09fc2eed226db0f4c3938943c8a0",
"assets/assets/icons/view_list_FILL0_wght400_GRAD0_opsz48.svg": "4d7aa5a461fd455c626ba4364f039502",
"assets/assets/icons/login.svg": "237c071e457c559e676c89da86e9bf7a",
"assets/assets/icons/users%252012.41.11%2520AM.png": "4832bcc05f5d278d58c2310426450b29",
"assets/assets/icons/category.svg": "566d1a88a9e864cb1ad417e29cc53dfd",
"assets/assets/icons/dash.svg": "01157b680db9ebec6e8995dd20c3a9b7",
"assets/assets/icons/menu%25205.03.17%2520PM.png": "7ceefe91cf68aa4b9998db44ddfdf265",
"assets/assets/icons/home_FILL0_wght400_GRAD0_opsz48.svg": "8fde1496ca7403843609fcc55e325d9e",
"assets/assets/icons/users.png": "7cc4e920df01c81a1109ee19734250e2",
"assets/assets/icons/menu.png": "8ea4c92d811ae4407da82b980b7e1592",
"assets/assets/icons/menu%25205.04.54%2520PM.png": "cbf406b392b2c3797e2e717b254f221d",
"assets/assets/icons/media.svg": "b1d0286a3efe0802d1fcc210253ffefc",
"assets/assets/icons/edit.svg": "ece5c795044a1c7c7447641ffdddaf50",
"assets/assets/icons/profile.png": "055a91979264664a1ee12b9453610d82",
"assets/assets/icons/products.svg": "4d7aa5a461fd455c626ba4364f039502",
"assets/assets/icons/loginbg.png": "2dae51fafde79d49f174bbb890f9cc95",
"assets/assets/icons/products.png": "ecc3e4816b164227654976eb7d4c2f3b",
"assets/assets/icons/delete.svg": "37c8a2749683758a01d3c319e849c82a",
"assets/assets/icons/menu%25204.53.11%2520PM.png": "9fc42c25a2dc7e2293217bf76d1c50be",
"assets/assets/icons/menu%25204.59.29%2520PM.png": "7ceefe91cf68aa4b9998db44ddfdf265",
"assets/assets/icons/view.svg": "a244c996ba87dbe011792797ff7d1d07",
"assets/assets/icons/menu%25204.55.42%2520PM.png": "c5240007536c959ba20dc0acf6025e6e",
"assets/assets/icons/menu%25205.00.31%2520PM.png": "c5240007536c959ba20dc0acf6025e6e",
"assets/assets/icons/dashboard%252012.45.38%2520AM.png": "0849f2b0db1dbd04fe245da391030d11",
"assets/assets/icons/hide.png": "e68fd803889384084270f7d71fea6e38",
"assets/assets/icons/users.svg": "18c5f12ea72d873879a80688461b96e1",
"canvaskit/skwasm.js": "1df4d741f441fa1a4d10530ced463ef8",
"canvaskit/skwasm.wasm": "6711032e17bf49924b2b001cef0d3ea3",
"canvaskit/chromium/canvaskit.js": "8c8392ce4a4364cbb240aa09b5652e05",
"canvaskit/chromium/canvaskit.wasm": "fc18c3010856029414b70cae1afc5cd9",
"canvaskit/canvaskit.js": "76f7d822f42397160c5dfc69cbc9b2de",
"canvaskit/canvaskit.wasm": "f48eaf57cada79163ec6dec7929486ea",
"canvaskit/skwasm.worker.js": "19659053a277272607529ef87acf9d8a"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
