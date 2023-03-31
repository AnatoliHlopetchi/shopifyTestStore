import choozy from '../../lib/choozy';
import { addVariantById } from '../../lib/cart';
import { getString } from '../../lib/string';
import { initWishlistButton } from '../../lib/wishlist';

export default window.component((node, ctx) => {
  const { wishlistButton, submit, optionMain } = choozy(node, null);
  const productForm = node.querySelector('form');
  const { productId } = node.dataset;
  initWishlistButton(wishlistButton, productId);

  let currentVariantId = null;

  /* 
    Please be aware that this is just an example of how to handle variant change + ATC in a product-item.
    Most likely in your project the design will have colour swatches, size pickers, etc. So you'll need to make adjustments similar to what's happening in the PDP form/options.js

    Recommendation: I would advise against adding another js-product-json script to host all the variant data for variant selection (like what we do in the PDP)
    This is because a page with a lot of product-items will have a lot of extra HTML to download due to the scripts being quite big (especially if there are many variants).
    Instead I would suggest using data-binding on the data-option-main for each of the select options, and we really only need its stock availabilities
  */
  if (productForm) {
    /* productForm will only be rendered if atc_enabled is true on component.product-item */
    optionMain.addEventListener('change', () => {
      /* In the starter's example, variants without stock have their select option disabled, so only in stock variants can be selected */
      currentVariantId = optionMain.value;
      submit.textContent = getString('product.add_to_cart');
      submit.disabled = false;
    });

    productForm.addEventListener('submit', e => {
      e.preventDefault();

      submit.disabled = true;
      submit.textContent = getString('product.adding_to_cart');

      addVariantById(currentVariantId, productForm.elements.quantity.value).then(({ error }) => {
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
  }
});
