
const CACHE_NAME = 'v1';
const urlsToCache = [
  // '/',
  // '/styles/main.css',
  // '/scripts/main.js'
];
import * as wasm from './index.js';

self.addEventListener('install', event => {

  self.skipWaiting(); 
  event.waitUntil(
    wasm.isReady.then(() => {
      console.log("Wasm ready");
    })
  );

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim()); // This line claims clients immediately
  console.log('Service Worker activated');
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return the response from the cached version
        if (response) {
          return response;
        }

        const url = new URL(event.request.url);
        if (event.request.method === 'GET' && url.pathname === '/shopping-list') {
            return handleGetShoppingList(event.request);
        } else if (event.request.method === 'POST' && url.pathname === '/calculate') {
            return handlePostCalculate(event.request);
        }else if (event.request.method === 'GET' && url.pathname === '/app') {
            return handleApp(event.request);
        }

        
        // Not in cache - return the result from the live server
        // and cache it
        return fetch(event.request).then(newResponse => {
          if (!newResponse || newResponse.status !== 200 || newResponse.type !== 'basic') {
            return newResponse;
          }

          var responseToCache = newResponse.clone();

         
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return newResponse;
        });
      })
  );
});
async function handleGetShoppingList(request) {
    const res = await shoppingList();
    return new Response(res, { status: 200,
        headers: { 'Content-Type': 'application/html' }
    });
}

async function handlePostCalculate(request) {
  const textData = await request.text();
  const params = new URLSearchParams(textData);
  const data = Object.fromEntries(params.entries());
  const result = await calculate(data.expression);
    return new Response(result, { status: 200,
        headers: { 'Content-Type': 'application/html' }
    });
}



function handleApp(request) {
    const app = `
        <form>
            <input type="text" id="expressionInput" name="expression"
                  hx-post="/calculate" 
                  hx-trigger="change"
                  hx-target="#result">
        </form>
        <div id="result"></div>
        <div id="shopping-list" hx-get="/shopping-list" hx-trigger="load" />
    `;

    return new Response(app, { status: 200,
        headers: { 'Content-Type': 'application/html' }
    });
}

function shoppingList(){
  return wasm.isReady.then(() => {
    let shoppingListHtml=wasm.gen_list();
    return shoppingListHtml;
  });
  // return res;
}

function calculate(expr){
  return wasm.isReady.then(() => {
    let result;
    try {
      result = wasm.expr_eval(expr);
      result = result.toString();
    } catch (error) {
      result = "Error: " + error.message;
    }
    return  `<div>${result}</div>`;
  });
}
