if(!self.define){let e,s={};const n=(n,r)=>(n=new URL(n+".js",r).href,s[n]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=s,document.head.appendChild(e)}else e=n,importScripts(n),s()})).then((()=>{let e=s[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(r,c)=>{const f=e||("document"in self?document.currentScript.src:"")||location.href;if(s[f])return;let o={};const i=e=>n(e,f),a={module:{uri:f},exports:o,require:i};s[f]=Promise.all(r.map((e=>a[e]||i(e)))).then((e=>(c(...e),o)))}}define(["./workbox-9517df1b"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-4c4b02f8.css",revision:null},{url:"assets/index-bbdfc818.js",revision:null},{url:"assets/TaskNotFound-a3ec2e3a.png",revision:null},{url:"index.html",revision:"6ea2a467a778d832088f818b069962ca"},{url:"logo.svg",revision:"4386aa054e214856cf8e8bf3e9b2e40f"},{url:"logo192.png",revision:"fcbca72a681f41d6c3f629b51d9074cd"},{url:"logo256.png",revision:"f66c22751907e9d4ae31a97b0bb5a8f6"},{url:"logo384.png",revision:"b94386c4f37166a3274ebde4159f1c6d"},{url:"logo512.png",revision:"b3ae483c08f231e9dddaeb212934ae6e"},{url:"manifest.webmanifest",revision:"13162842662fe4e9c7ba0dafcf61d41c"},{url:"registerSW.js",revision:"1872c500de691dce40960bb85481de07"},{url:"screenshots/1.png",revision:"cad4629f9e35c01d26750b8b4e4ce741"},{url:"screenshots/2.png",revision:"37f1a66f8be6fb2369bb7ee2158a26d8"},{url:"screenshots/3.png",revision:"f6c5983a023b31a6bdc8760defe4b20f"},{url:"screenshots/4.png",revision:"2833c821443df6e68027593daa1ff4a4"},{url:"screenshots/5.png",revision:"5a0bd7068b2ec705ad88bd65ead6c6ff"},{url:"screenshots/6.png",revision:"33830a1d1f7c3ddee2079aba31426bc7"},{url:"screenshots/performance.png",revision:"cd333b203557410a62f29f0d984de069"},{url:"screenshots/ss1.png",revision:"1a13cf6359aa147dfcf70a6ce969198f"},{url:"screenshots/ss2.png",revision:"9919ed821dcbc9cf3d1f3d3ff94fff2f"},{url:"screenshots/ss3.png",revision:"58cbfb489baa0b3fa042f787ff90640f"},{url:"screenshots/ss4.png",revision:"696591f0c868f011ba12529c348523b2"},{url:"screenshots/ss5.png",revision:"c90633a9b655a77dd7a7bdf2c847acb2"},{url:"screenshots/ss6.png",revision:"c2028d9f43737c98471529bdc909faa7"},{url:"screenshots/sspc1.png",revision:"b3b9a08d2d8ba3a0a65ad121d15df520"},{url:"logo192.png",revision:"fcbca72a681f41d6c3f629b51d9074cd"},{url:"logo.svg",revision:"4386aa054e214856cf8e8bf3e9b2e40f"},{url:"logo256.png",revision:"f66c22751907e9d4ae31a97b0bb5a8f6"},{url:"logo384.png",revision:"b94386c4f37166a3274ebde4159f1c6d"},{url:"logo512.png",revision:"b3ae483c08f231e9dddaeb212934ae6e"},{url:"screenshots/1.png",revision:"cad4629f9e35c01d26750b8b4e4ce741"},{url:"screenshots/2.png",revision:"37f1a66f8be6fb2369bb7ee2158a26d8"},{url:"screenshots/3.png",revision:"f6c5983a023b31a6bdc8760defe4b20f"},{url:"screenshots/4.png",revision:"2833c821443df6e68027593daa1ff4a4"},{url:"screenshots/5.png",revision:"5a0bd7068b2ec705ad88bd65ead6c6ff"},{url:"screenshots/6.png",revision:"33830a1d1f7c3ddee2079aba31426bc7"},{url:"screenshots/performance.png",revision:"cd333b203557410a62f29f0d984de069"},{url:"screenshots/ss1.png",revision:"1a13cf6359aa147dfcf70a6ce969198f"},{url:"screenshots/ss2.png",revision:"9919ed821dcbc9cf3d1f3d3ff94fff2f"},{url:"screenshots/ss3.png",revision:"58cbfb489baa0b3fa042f787ff90640f"},{url:"screenshots/ss4.png",revision:"696591f0c868f011ba12529c348523b2"},{url:"screenshots/ss5.png",revision:"c90633a9b655a77dd7a7bdf2c847acb2"},{url:"screenshots/ss6.png",revision:"c2028d9f43737c98471529bdc909faa7"},{url:"screenshots/sspc1.png",revision:"b3b9a08d2d8ba3a0a65ad121d15df520"},{url:"manifest.webmanifest",revision:"13162842662fe4e9c7ba0dafcf61d41c"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
