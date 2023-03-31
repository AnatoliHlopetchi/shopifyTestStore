export function fetchCart() {
  return fetch(`${window.Phill.routes.cart}.js`, {
    method: 'GET',
    credentials: 'include',
  }).then(res => res.json());
}

export function fetchCartMarkup() {
  return fetch(`${window.Phill.routes.cart}?sections=cart-drawer`, {
    method: 'GET',
    credentials: 'include',
  }).then(res => res.json());
}

function changeAddon(id, quantity) {
  window.app.emit('cart:updating');

  return fetch(`${window.Phill.routes.cartChange}.js`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id, quantity, sections: 'cart-drawer' }),
  })
    .then(res => res.json())
    .then(async cart => {
      window.app.emit(['cart:updated', 'cart:render'], { cart });
      return cart;
    });
}

export function clearCart() {
  window.app.emit('cart:updating');

  return fetch(`${window.Phill.routes.cartClear}.js`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sections: 'cart-drawer' }),
  })
    .then(r => r.json())
    .then(cart => {
      window.app.emit(['cart:updated', 'cart:render'], { cart });
      return cart;
    });
}

export function addItemsById(items = []) {
  window.app.emit('cart:updating');

  return fetch(`${window.Phill.routes.cartAdd}.js`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ items }),
  })
    .then(r => r.json())
    .then(async item => {
      if (item.status) {
        window.app.emit(['cart:updated', 'cart:error'], null, item);
        return { item, cart: window.app.getState().cart, error: item?.description };
      }

      const [cart, cartMarkup] = await Promise.all([fetchCart(), fetchCartMarkup()]);

      cart.sections = cartMarkup;

      window.app.emit(['cart:updated', 'cart:render'], { cart });

      return {
        item,
        cart,
      };
    });
}

export function addVariant(variant, quantity, properties = {}) {
  return addItemsById([{ id: variant.id, quantity, properties }]);
}

export function addVariantById(variantId, quantity, properties) {
  return addItemsById([{ id: variantId, quantity, properties }]);
}

export function updateAddon(key, quantity) {
  return changeAddon(key, quantity);
}

export function removeAddon(key) {
  return updateAddon(key, 0);
}
