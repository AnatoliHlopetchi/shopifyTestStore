(()=>{"use strict";function e(e=document.body,t="js-"){const n=[...e.querySelectorAll(t?`[class*="${t}"]`:"*")],s=t?"classList":"dataset";return n.reduce(((e,n)=>([].slice.call(t?n[s]:Object.entries(n[s])).forEach((s=>{let o;t&&s.slice(0,t.length)===t?o=s.slice(t.length,s.length):t||([o]=s),o&&(e[o]=e.hasOwnProperty(o)?e[o].constructor===Array?e[o].concat(n):[e[o],n]:n)})),e)),{})}const t={hero:window.component((async t=>{const{video:n,source:s}=e(t,null),{desktopSource:o,mobileSource:i}=n.dataset,a=async()=>{window.innerWidth>=1024&&o&&s.src!==o?(s.src=o,n.load(),await n.play(),n.classList.add("open")):window.innerWidth<1024&&i&&s.src!==i&&(s.src=i,n.load(),await n.play(),n.classList.add("open"))};window.addEventListener("resize",a,{passive:!0}),window.addEventListener("load",(()=>{a()}),{passive:!0})}))},n=window.component((()=>{document.addEventListener("shopify:section:load",(()=>{window.app.unmount(),window.app.mount()}))})),s=window.component((e=>{const{text:t}=e.dataset;console.log("console:log",t)})),o=window.component(((t,n)=>{const{group:s}=t.dataset,{inner:o,toggle:i}=e(t,null),a="open",r=()=>{t.style.setProperty("--innerHeight","auto"),t.style.setProperty("--innerHeight",`${o.scrollHeight}px`)};r(),window.addEventListener("resize",r,{passive:!0}),i.addEventListener("click",(()=>{n.emit("accordion:toggle",null,{open:!t.classList.contains(a),node:t,group:s})})),n.on("accordion:toggle",((e,n={})=>{s===n.group&&t.classList[n.open&&n.node===t?"add":"remove"](a)}))})),i=window.component(((t,n)=>{const{cartCount:s,cartToggle:o,searchToggle:i,wishlistToggle:a,navToggle:r,navMenuWrapper:d}=e(t,null),c=[].concat(r),l=[].concat(i),u=[].concat(d);c.length>0&&c.forEach((t=>{t?.addEventListener("mouseenter",(()=>{const{navMenu:n}=e(t,null);u?.forEach((e=>{e.style.height=`${n.scrollHeight}px`}))})),t?.addEventListener("mouseleave",(()=>{u?.forEach((t=>{const{navMenu:n}=e(t,null);t.style.height=`${n.scrollHeight}px`}))}))})),l.length>0&&l.forEach((e=>e?.addEventListener("click",(()=>n.emit("search:toggle",(({searchOpen:e})=>({searchOpen:!e}))))))),a.addEventListener("click",(()=>n.emit("wishlistDrawer:toggle",(({drawerOpen:e})=>({drawerOpen:!e}))))),o.addEventListener("click",(e=>{e.preventDefault(),n.emit("cart:toggle",(({cartOpen:e})=>({cartOpen:!e})))}))})),a=window.component(((t,n)=>{const{mobileMenuToggle:s,mobileMenuContainer:o,mobileNestedMenuButton:i,mobileNestedMenu:a,mobileNestedMenuBackButton:r,mobileMenu:d}=e(t,null),c=[].concat(s),l=[].concat(i),u=[].concat(a),p=[].concat(r);c.length>0&&c.forEach((e=>{e?.addEventListener("click",(()=>n.emit("mobileMenu:toggle",(({mobileMenuOpen:e})=>({mobileMenuOpen:!e})))))})),l.length>0&&l.forEach((e=>{e?.addEventListener("click",(()=>{const{menuId:t}=e.dataset;d.classList.add("open"),u.forEach((e=>e.classList.add("hidden"))),u.find((e=>e.id===t)).classList.remove("hidden")}))})),p.length>0&&p.forEach((e=>{e?.addEventListener("click",(()=>d.classList.remove("open")))})),n.on("mobileMenu:toggle",(({mobileMenuOpen:e})=>{n.emit("body:toggleScrollLock",(()=>({enable:e}))),o.classList[e?"add":"remove"]("open")}))}));const r=({keyCode:e},{type:t,boolean:n})=>{27===e&&t&&n&&window.app.emit(t,{[n]:!1})},d=window.component(((t,n)=>{const s=t.parentNode,o=t,{toggle:i,clear:a,focusEl:d}=e(t,null),c=({cartOpen:e})=>{t.classList[e?"add":"remove"]("open"),e?(o.tabIndex="0",(d||t).focus()):o.tabIndex="-1"};return i.forEach((e=>{e.addEventListener("click",(()=>n.emit("cart:toggle",(({cartOpen:e})=>({cartOpen:!e??!0})))))})),c(n.getState()),a&&a.addEventListener("click",(()=>(window.app.emit("cart:updating"),fetch(`${window.Phill.routes.cartClear}.js`,{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify({sections:"cart-drawer"})}).then((e=>e.json())).then((e=>(window.app.emit(["cart:updated","cart:render"],{cart:e}),e)))))),t.addEventListener("keyup",(e=>r(e,{type:"cart:toggle",boolean:"cartOpen"}))),n.on("cart:render",(({cart:e})=>{s&&(document.getElementById("shopify-section-cart-drawer").outerHTML=e.sections["cart-drawer"]),window.app.unmount(),window.app.mount()})),n.on("cart:toggle",c),()=>{n.on(["cart:toggle","cart:render"],(()=>{}))(),t.removeEventListener("keyup",(e=>r(e,{type:"cart:toggle",boolean:"cartOpen"})))}})),c=window.component((t=>{const{update:n}=e(t,null),{key:s}=t.dataset;[].concat(n).forEach((e=>{const{value:t}=e.dataset;e.addEventListener("click",(()=>function(e,t){return function(e,t){return window.app.emit("cart:updating"),fetch(`${window.Phill.routes.cartChange}.js`,{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:e,quantity:t,sections:"cart-drawer"})}).then((e=>e.json())).then((async e=>(window.app.emit(["cart:updated","cart:render"],{cart:e}),e)))}(e,t)}(s,t)))}))})),l=()=>{try{return JSON.parse(localStorage.getItem("askphill_wishlist"))}catch(e){return localStorage.removeItem("askphill_wishlist"),null}},u=e=>{const t=document.querySelector("[data-wishlist-toggle]");t&&t.classList[(()=>{const e=l().items;return!!Object.keys(e).find((t=>e[t].inWishlist))})()?"add":"remove"]("wishlist-active")},p=e=>{localStorage.setItem("askphill_wishlist",JSON.stringify(e))},w=async({wishlist:e,email:t})=>{const n=await fetch(`${window.Phill.wishlist_endpoint}/api/wishlist`,{body:JSON.stringify({email:t,wishlist:e}),method:"POST"});n.ok||console.error("Error occured when updating remote wishlist: ",n.status)},h=e=>{const t=l().items;return!!t[e]&&t[e].inWishlist},m=async e=>{const t=await fetch(`/search?section_id=wishlist-products&q=${e}`),n=await t.text();return t.ok?(new DOMParser).parseFromString(n,"text/html"):(console.error("Error occured when fetching wishlist products: ",t.status),null)},g=window.component((async(e,t)=>{let n,s=0;t.on("body:toggleScrollLock",(({enable:t})=>{n!==t&&(t?(s=window.pageYOffset,e.style.overflow="hidden",e.style.position="fixed",e.style.top=`-${s}px`,e.style.width="100%"):(e.style.removeProperty("overflow"),e.style.removeProperty("position"),e.style.removeProperty("top"),e.style.removeProperty("width"),window.scrollTo(0,s)),n=t)})),await(async()=>{const e={lastUpdated:null,items:{}},t=l();if(!window.Phill.customer)return t||p(e),void u();const n=window.Phill.wishlist;if(!n?.lastUpdated&&!t?.lastUpdated)return p(e),void u();if(t?.lastUpdated&&!n?.lastUpdated)return u(),void await w({wishlist:t,email:window.Phill.customer});if(n.lastUpdated&&!t?.lastUpdated)return p(n),void u();if(t.lastUpdated===n.lastUpdated)return void u();const s=((e,t)=>{const n=Object.keys({...e.items,...t.items}),s={lastUpdated:e.lastUpdated>t.lastUpdated?e.lastUpdated:t.lastUpdated,items:{}};return n.forEach((n=>{if(e.items[n]&&t.items[n])if(e.items[n].updatedAt===t.items[n].updatedAt)s.items[n]={...e.items[n]};else{const o=e.items[n].updatedAt>t.items[n].updatedAt?e:t;s.items[n]={...o.items[n]}}else{const o=e.items[n]?e:t;s.items[n]={...o.items[n]}}})),s})(t,n);p(s),u(),await w({wishlist:s,email:window.Phill.customer})})(),t.emit("wishlist:synced",{wishlistSynced:!0})})),v=window.component(((t,n)=>{const{toggleButton:s,searchInput:o,dynamicContent:i,loader:a}=e(t,null),r=[].concat(s),{debounceDelay:d}=t.dataset;r.forEach((e=>{e?.addEventListener("click",(()=>n.emit("search:toggle",(({searchOpen:e})=>({searchOpen:!e})))))}));const c=()=>{const e=o.value;if(/[a-z0-9]/i.test(e)){let t;a.classList.remove("hidden"),i.classList.add("hidden"),fetch(`${window.Shopify.routes.root}search/suggest?q=${e}&resources[type]=product&resources[options][unavailable_products]=show&resources[options][fields]=title,product_type,variants.title,variants.sku,body,tag&section_id=predictive-search`).then((e=>(t=e,e.text()))).then((e=>{if(!t.ok)throw new Error(`${t.status}: ${e}`);const n=(new DOMParser).parseFromString(e,"text/html");a.classList.add("hidden"),i.innerHTML=n.querySelector("[data-dynamic-content]").innerHTML,i.classList.remove("hidden"),window.app.mount()})).catch((e=>{console.error(e)}))}},l=()=>{const{searchResults:n,suggestedSearchTerms:s,featuredCollection:o}=e(t,null);n?.classList.add("hidden"),s?.classList.remove("hidden"),o&&"true"!==o?.dataset.alwaysHide&&o.classList.remove("hidden")},u=e=>{"Escape"===e.key&&(""===o.value?n.emit("search:toggle",(({searchOpen:e})=>({searchOpen:!e}))):(o.value="",l(),o.focus()))};n.on("search:toggle",(({searchOpen:e})=>{n.emit("body:toggleScrollLock",(()=>({enable:e}))),t.classList[e?"add":"remove"]("open"),e?(document.addEventListener("keyup",u),o.focus()):(t.tabIndex="-1",document.removeEventListener("keyup",u))})),o.addEventListener("keyup",function(e,t){let n;return function(...e){clearTimeout(n),n=setTimeout((()=>{n=null,(()=>{0===o.value.length?l():c()})(...e)}),t)}}(0,Number(d))),n.on("search:suggest-term-clicked",(({searchTerm:e})=>{o.value=e,c()}))})),y=window.component(((e,t)=>{const{searchTerm:n}=e.dataset;e.addEventListener("click",(()=>t.emit("search:suggest-term-clicked",(()=>({searchTerm:n})))))})),f=e=>e.split(".").reduce(((e,t)=>e?.[t]),window?.Phill?.theme?.strings)||`Missing translation for ${e} in window.Phill`,L={sectionRendering:n,consoleLog:s,accordion:o,header:i,mobileMenu:a,cartDrawer:d,cartItem:c,body:g,predictiveSearch:v,suggestedSearchTerm:y,productItem:window.component(((t,n)=>{const{wishlistButton:s,submit:o,optionMain:i}=e(t,null),a=t.querySelector("form"),{productId:r}=t.dataset;((e,t)=>{if(!e)return;const n=()=>{const n=t=>{e.classList[t?"add":"remove"]("wishlist-active")};n(h(t)),e.addEventListener("click",(async e=>{e.stopPropagation(),h(t)?(n(!1),window.app.emit("wishlist:removeProduct",{productId:t}),await(e=>{const t=l(),n=t.items,s=Date.now();if(n[e].inWishlist=!1,n[e].updatedAt=s,t.lastUpdated=s,p(t),u(),window.Phill.customer)return w({wishlist:t,email:window.Phill.customer})})(t)):(n(!0),await(e=>{const t=l(),n=t.items,s=Date.now();if(n[e]?(n[e].inWishlist=!0,n[e].updatedAt=s,t.lastUpdated=s):(n[e]={inWishlist:!0,updatedAt:s},t.lastUpdated=s),p(t),u(),window.Phill.customer)return w({wishlist:t,email:window.Phill.customer})})(t),window.app.emit("wishlist:addProduct"))}))};window.app.getState().wishlistSynced?n():window.app.on("wishlist:synced",n)})(s,r);let d=null;a&&(i.addEventListener("change",(()=>{d=i.value,o.textContent=f("product.add_to_cart"),o.disabled=!1})),a.addEventListener("submit",(e=>{var t,s;e.preventDefault(),o.disabled=!0,o.textContent=f("product.adding_to_cart"),(t=d,s=a.elements.quantity.value,function(e=[]){return window.app.emit("cart:updating"),fetch(`${window.Phill.routes.cartAdd}.js`,{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify({items:e})}).then((e=>e.json())).then((async e=>{if(e.status)return window.app.emit(["cart:updated","cart:error"],null,e),{item:e,cart:window.app.getState().cart,error:e?.description};const[t,n]=await Promise.all([fetch(`${window.Phill.routes.cart}.js`,{method:"GET",credentials:"include"}).then((e=>e.json())),fetch(`${window.Phill.routes.cart}?sections=cart-drawer`,{method:"GET",credentials:"include"}).then((e=>e.json()))]);return t.sections=n,window.app.emit(["cart:updated","cart:render"],{cart:t}),{item:e,cart:t}}))}([{id:t,quantity:s,properties:undefined}])).then((({error:e})=>{e&&alert(e),o.disabled=!0,o.textContent=f("product.added_to_cart"),setTimeout((()=>{e||n.emit("cart:toggle",{cartOpen:!0})}),0),setTimeout((()=>{o.disabled=!1,o.textContent=f("product.add_to_cart")}),e?0:1e3)}))})))})),wishlistDrawer:window.component(((t,n)=>{let s=!1;const{toggleButton:o,productsGrid:i,wishlistContent:a,itemCount:r,loader:d,shareWishlist:c,shareWishlistSpan:l,shareWishlistSpanSuccess:u}=e(t,null);[].concat(o).forEach((e=>{e?.addEventListener("click",(()=>n.emit("wishlistDrawer:toggle",(({drawerOpen:e})=>({drawerOpen:!e})))))}));const p=()=>{d.classList.add("hidden"),a.classList.remove("hidden"),(e=>{const t=f(e>1?"wishlist.item_count.other":"wishlist.item_count.one").replace("{{ count }}",e);r.innerHTML=t})(i.childNodes.length),a.classList[i.childNodes.length?"add":"remove"]("has-items")},w=()=>{const e=localStorage.getItem("askphill_wishlist"),t=e?JSON.parse(e):null;if(null!==t){const{items:e}=t;return Object.entries(e).map((e=>(e[1].id=e[0],e[1]))).filter((e=>e.inWishlist)).sort(((e,t)=>t.updatedAt-e.updatedAt)).map((e=>e.id))}return null},h=async()=>{d.classList.remove("hidden"),a.classList.add("hidden");const t=w();if(null!==t){const n=await m(t.join());if(n){const{productItem:s}=e(n,null),o=[].concat(s);if(o.length>0){let e="";o.forEach((n=>{if(!n)return;const{productId:s}=n.dataset;n.style.order=t.indexOf(s),e+=n.outerHTML})),i.innerHTML=e}}p(),window.app.mount()}};c&&c.addEventListener("click",(()=>{const{sharedWishlistLink:e}=c.dataset,t=w();if(null!==t){const n=`${window.location.origin}${e}?view=shared-wishlist&ids=${t.join()}`;navigator.clipboard.writeText(n).then((()=>{l.classList.add("hidden"),u.classList.remove("hidden"),setTimeout((()=>{l.classList.remove("hidden"),u.classList.add("hidden")}),2500)}),(()=>{console.log("Failed to copy to clipboard")}))}}));const g=e=>{"Escape"===e.key&&n.emit("wishlistDrawer:toggle",(({drawerOpen:e})=>({drawerOpen:!e})))};n.on("wishlistDrawer:toggle",(({drawerOpen:e})=>{e&&!s&&(s=!0,n.getState().wishlistSynced&&h()),n.emit("body:toggleScrollLock",(()=>({enable:e}))),t.classList[e?"add":"remove"]("open"),e?document.addEventListener("keyup",g):document.removeEventListener("keyup",g)})),n.on("wishlist:removeProduct",(({productId:e})=>{const n=t.querySelector(`[data-product-id="${e}"]`);if(n){n.remove(),p();const t=document.querySelectorAll(`[data-product-id="${e}"]`);t.length>0&&t.forEach((e=>{e&&e.querySelector("[data-wishlist-button]")?.classList.remove("wishlist-active")}))}})),n.on("wishlist:addProduct",h),n.on("wishlist:synced",(()=>{s&&h()}))})),sharedWishlist:window.component((async(t,n)=>{const{productsGrid:s,itemCount:o,errorMessage:i,loader:a}=e(t,null),r=new URLSearchParams(window.location.search).get("ids");if(r){const n=await m(r);if(n){const{productItem:i}=e(n,null),a=[].concat(i);if(a.length>0){let e="";a.forEach((t=>{if(!t)return;const{productId:n}=t.dataset;t.style.order=r.split(",").indexOf(n),e+=t.outerHTML})),s.innerHTML=e,o.innerHTML=f(a.length>1?"wishlist.item_count.other":"wishlist.item_count.one").replace("{{ count }}",a.length)}t.classList.add("open"),window.app.mount()}}else a.classList.add("hidden"),i.classList.remove("hidden")})),languageForm:window.component((t=>{const{languageSelect:n}=e(t,null);n.addEventListener("change",(()=>t.submit()))})),countryForm:window.component((t=>{const{countrySelect:n}=e(t,null);n.addEventListener("change",(()=>t.submit()))})),footerNewsletter:window.component(((t,n)=>{const{input:s,submit:o,error:i}=e(t,null);window.location.search.includes("customer_posted=true")&&t.scrollIntoView({behavior:"smooth"}),window.location.href.indexOf("&form_type=customer")>-1&&(i.innerHTML=f("newsletter.error")),s?.addEventListener("keyup",(()=>{/^[^\s()<>@,;:\/]+@\w[\w\.-]+\.[a-z]{1,}$/i.test(s.value)?(o.classList.add("opacity-100"),o.disabled=!1):(o.classList.remove("opacity-100"),o.disabled=!0)}))}))};window.app.add(t),window.app.add(L),window.app.mount()})();