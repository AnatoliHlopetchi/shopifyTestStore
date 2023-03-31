import { clearCart } from '../../lib/cart';
import choozy from '../../lib/choozy';
import escKey from '../../lib/listeners';

export default window.component((node, ctx) => {
  const parent = node.parentNode;
  const el = node;
  const { toggle, clear, focusEl } = choozy(node, null);

  const toggleDrawer = ({ cartOpen }) => {
    node.classList[cartOpen ? 'add' : 'remove']('open');
    if (cartOpen) {
      el.tabIndex = '0';
      (focusEl || node).focus();
    } else {
      el.tabIndex = '-1';
    }
  };

  toggle.forEach(btn => {
    btn.addEventListener('click', () =>
      ctx.emit('cart:toggle', ({ cartOpen }) => ({ cartOpen: !cartOpen ?? true }))
    );
  });

  toggleDrawer(ctx.getState());

  if (clear) clear.addEventListener('click', () => clearCart());

  node.addEventListener('keyup', e => escKey(e, { type: 'cart:toggle', boolean: 'cartOpen' }));

  ctx.on('cart:render', ({ cart }) => {
    if (parent)
      document.getElementById('shopify-section-cart-drawer').outerHTML =
        cart.sections['cart-drawer'];
    window.app.unmount();
    window.app.mount();
  });

  ctx.on('cart:toggle', toggleDrawer);

  return () => {
    ctx.on(['cart:toggle', 'cart:render'], () => {})();
    node.removeEventListener('keyup', e => escKey(e, { type: 'cart:toggle', boolean: 'cartOpen' }));
  };
});
