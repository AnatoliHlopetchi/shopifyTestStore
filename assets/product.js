(()=>{"use strict";function t(t=document.body,e="js-"){const n=[...t.querySelectorAll(e?`[class*="${e}"]`:"*")],o=e?"classList":"dataset";return n.reduce(((t,n)=>([].slice.call(e?n[o]:Object.entries(n[o])).forEach((o=>{let a;e&&o.slice(0,e.length)===e?a=o.slice(e.length,o.length):e||([a]=o),a&&(t[a]=t.hasOwnProperty(a)?t[a].constructor===Array?t[a].concat(n):[t[a],n]:n)})),t)),{})}function e(t,e=window.Phill.money_format){"string"==typeof t&&(t=t.replace(".",""));let n="";const o=/\{\{\s*(\w+)\s*\}\}/;function a(t,e,n,o){if(void 0===e&&(e=2),o=","==(n=window.Phill.money_separator)?".":",",isNaN(t)||null==t)return 0;const a=(t=(t/100).toFixed(e)).split(".");return a[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g,"$1"+n)+(a[1]?o+a[1]:"")}switch(e.match(o)[1]){case"amount":case"amount_with_comma_separator":case"amount_with_space_separator":n=a(t,2);break;case"amount_no_decimals":case"amount_no_decimals_with_comma_separator":case"amount_no_decimals_with_space_separator":n=a(t,0)}return e.replace(o,n)}const n=window.component(((n,o)=>{const a=function(t,e){e={select:"[data-option-select]",radio:"[data-option-radio]",main:"[data-option-main]",...e};const n=[],o={id:null,options:[]},a=document.querySelectorAll(e.select),i=document.querySelectorAll(e.radio),r=document.querySelector(e.main);if(!r||!r.length)throw"data-option-main is missing";if(i.length>3)throw"you have more than three radio groups";if(a.length>3)throw"you have more than three select inputs";const c=[].slice.call(r.children).reduce(((t,e)=>(t[e.innerHTML]=e.value,t)),{});function d(){const t=Object.keys(c).find((t=>t.trim()===o.options.join(" / ")));o.id=c[t],r.value=o.id;for(const t of n)t(o)}return a.forEach((t=>{if("SELECT"!==t.nodeName)throw"data-option-select should be defined on the individual option selectors";const e=Number(t.getAttribute("data-index"));o.options[e]=t.value,t.addEventListener("change",(t=>{o.options[e]=t.target.value,d()}))})),i.forEach((t=>{if("INPUT"===t.nodeName)throw"data-option-radio should be defined on a parent of the radio group, not the inputs themselves";const e=Number(t.getAttribute("data-index")),n=[].slice.call(t.getElementsByTagName("input"));n.forEach((t=>{t.checked&&(o.options[e]=t.value)})),function(t,n){t.map((t=>t.onclick=t=>{return n=t.target.value,o.options[e]=n,void d();var n}))}(n)})),d(),{get selectedVariant(){return o},onUpdate:t=>(n.indexOf(t)<0&&n.push(t),()=>n.splice(n.indexOf(t),1))}}(),{product:{variants:i},selectedOrFirstAvailableVariant:r}=JSON.parse(document.querySelector(".js-product-json").innerHTML);let c=i.find((t=>t.id===r))||i.find((t=>t.available))||i[0];o.emit("variant:change",null,c),a.onUpdate((({id:a})=>{c=i.find((t=>t.id===parseInt(a,10))),((n,o)=>{const{price:a,compareAtPrice:i}=t(o,null),{price:r,compare_at_price:c}=n;Array.from(a).forEach((t=>{t.innerHTML=e(r)})),Array.from(i).forEach((t=>{t.innerHTML=c>r?e(c):""}))})(c,n),(t=>{const e=new URL(window.location.href),n=new URLSearchParams(e.search.slice(1));t.forEach((({name:t,value:e})=>{""!==e?n.set(t,encodeURIComponent(e)):n.delete(t)})),window.history.replaceState({},"",`${window.location.pathname}?${n.toString()}`)})([{name:"variant",value:a}]),o.emit("variant:change",null,c)}))}));const o=t=>t.split(".").reduce(((t,e)=>t?.[e]),window?.Phill?.theme?.strings)||`Missing translation for ${t} in window.Phill`,a={productSelection:n,productForm:window.component(((e,n)=>{const{submit:a}=t(e,null);let i={};n.on("variant:change",((t,e)=>{i=e,a.textContent=o(e.available?"product.add_to_cart":"product.sold_out"),a.disabled=!e.available})),e.addEventListener("submit",(t=>{t.preventDefault(),a.disabled=!0,a.textContent=o("product.adding_to_cart"),function(t,e,n={}){return function(t=[]){return window.app.emit("cart:updating"),fetch(`${window.Phill.routes.cartAdd}.js`,{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify({items:t})}).then((t=>t.json())).then((async t=>{if(t.status)return window.app.emit(["cart:updated","cart:error"],null,t),{item:t,cart:window.app.getState().cart,error:t?.description};const[e,n]=await Promise.all([fetch(`${window.Phill.routes.cart}.js`,{method:"GET",credentials:"include"}).then((t=>t.json())),fetch(`${window.Phill.routes.cart}?sections=cart-drawer`,{method:"GET",credentials:"include"}).then((t=>t.json()))]);return e.sections=n,window.app.emit(["cart:updated","cart:render"],{cart:e}),{item:t,cart:e}}))}([{id:t.id,quantity:e,properties:n}])}(i,e.elements.quantity.value).then((({error:t})=>{t&&alert(t),a.disabled=!0,a.textContent=o("product.added_to_cart"),setTimeout((()=>{t||n.emit("cart:toggle",{cartOpen:!0})}),0),setTimeout((()=>{a.disabled=!1,a.textContent=o("product.add_to_cart")}),t?0:1e3)}))}))}))};window.app.add(a),window.app.mount()})();