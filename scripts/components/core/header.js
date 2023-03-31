/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */

import choozy from '../../lib/choozy';

export default window.component((node, ctx) => {
  const { cartCount, cartToggle, searchToggle, wishlistToggle, navToggle, navMenuWrapper } = choozy(
    node,
    null
  );
  const navToggles = [].concat(navToggle);
  const searchToggles = [].concat(searchToggle);
  const navMenuWrappers = [].concat(navMenuWrapper);

  // Remove this if you don't need the desktop nav menus to transition in height when hovering between navToggles
  if (navToggles.length > 0) {
    navToggles.forEach(toggle => {
      toggle?.addEventListener('mouseenter', () => {
        const { navMenu: targetNavMenu } = choozy(toggle, null);
        // all wrappers should have the new targetNavMenu's scrollHeight
        navMenuWrappers?.forEach(wrapper => {
          wrapper.style.height = `${targetNavMenu.scrollHeight}px`;
        });
      });
      toggle?.addEventListener('mouseleave', () => {
        navMenuWrappers?.forEach(wrapper => {
          const { navMenu } = choozy(wrapper, null);
          /* reset navMenus' scrollHeight in case someone hovers nav B --> hover out to 'nothing' --> hover nav A 
          we don't want to transition from nav B scrollHeight to nav A scrollHeight */
          wrapper.style.height = `${navMenu.scrollHeight}px`;
        });
      });
    });
  }
  if (searchToggles.length > 0) {
    searchToggles.forEach(toggle =>
      toggle?.addEventListener('click', () =>
        ctx.emit('search:toggle', ({ searchOpen }) => ({ searchOpen: !searchOpen }))
      )
    );
  }

  wishlistToggle.addEventListener('click', () =>
    ctx.emit('wishlistDrawer:toggle', ({ drawerOpen }) => ({ drawerOpen: !drawerOpen }))
  );

  cartToggle.addEventListener('click', e => {
    e.preventDefault();
    ctx.emit('cart:toggle', ({ cartOpen }) => ({ cartOpen: !cartOpen }));
  });

  // const updateCartCount = cart => {
  //   if (!cart?.token) return;
  //   cartCount.textContent = cart.item_count;
  // };

  // ctx.on('cart:updated', ({ cart }) => updateCartCount(cart));
  // updateCartCount(ctx.getState()?.cart);
});
