import { addVariant } from '../../lib/cart';
import choozy from '../../lib/choozy';
import { getString } from '../../lib/string';

export default window.component((node, ctx) => {
  const { submit } = choozy(node, null);

  let currentVariant = {};

  ctx.on('variant:change', (state, variant) => {
    currentVariant = variant;
    submit.textContent = getString(variant.available ? 'product.add_to_cart' : 'product.sold_out');
    submit.disabled = !variant.available;
  });

  node.addEventListener('submit', e => {
    e.preventDefault();

    submit.disabled = true;
    submit.textContent = getString('product.adding_to_cart');

    addVariant(currentVariant, node.elements.quantity.value).then(({ error }) => {
      // eslint-disable-next-line no-alert
      if (error) alert(error);

      submit.disabled = true;
      submit.textContent = getString('product.added_to_cart');

      setTimeout(() => {
        if (!error) ctx.emit('cart:toggle', { cartOpen: true });
      }, 0);

      setTimeout(
        () => {
          submit.disabled = false;
          submit.textContent = getString('product.add_to_cart');
        },
        error ? 0 : 1000
      );
    });
  });
});
