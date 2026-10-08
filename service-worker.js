const CACHE="saferry-v31";
const DATA_CACHE="saferry-data-v23";
const APP_SHELL=[
  "./",
  "./index.html",
  "./style.css?v=31",
  "./script.js?v=31",
  "./manifest.json",
  "./data/remote-config.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-1024.png",
  "./icons/splash-3d.png"
];
const DATA_FILES=[
  "./data/schedules.json",
  "./data/safety-tips.json",
  "./data/emergency-contacts.json",
  "./data/remote-config.json"
];

self.addEventListener("install",event=>{
  event.waitUntil(
    Promise.all([
      caches.open(CACHE).then(cache=>cache.addAll(APP_SHELL)),
      caches.open(DATA_CACHE).then(cache=>cache.addAll(DATA_FILES))
    ]).then(()=>self.skipWaiting())
  );
});

self.addEventListener("activate",event=>{
  const keep=new Set([CACHE,DATA_CACHE]);
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(key=>!keep.has(key)).map(key=>caches.delete(key))))
      .then(()=>self.clients.claim())
  );
});

function isDataRequest(url){
  return DATA_FILES.some(path=>url.pathname.endsWith(path.replace("./","")));
}

self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET") return;
  const url=new URL(event.request.url);

  if(isDataRequest(url)){
    event.respondWith(
      fetch(event.request).then(response=>{
        if(response.ok){
          const copy=response.clone();
          caches.open(DATA_CACHE).then(cache=>cache.put(event.request,copy));
        }
        return response;
      }).catch(()=>caches.match(event.request))
    );
    return;
  }

  if(event.request.mode==="navigate"){
    event.respondWith(
      fetch(event.request).catch(()=>caches.match("./index.html"))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached=>cached || fetch(event.request).then(response=>{
      if(response.ok && url.origin===self.location.origin){
        const copy=response.clone();
        caches.open(CACHE).then(cache=>cache.put(event.request,copy));
      }
      return response;
    }).catch(()=>caches.match("./index.html")))
  );
});
