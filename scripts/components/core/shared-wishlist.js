/* eslint-disable no-param-reassign */
import choozy from '../../lib/choozy';
import { getString } from '../../lib/string';
import { fetchWishlistProductsHtml } from '../../lib/wishlist';

export default window.component(async (node, ctx) => {
  const { productsGrid, itemCount, errorMessage, loader } = choozy(node, null);
  const productIdsString = new URLSearchParams(window.location.search).get('ids');
  if (productIdsString) {
    const wishlistProductsHTML = await fetchWishlistProductsHtml(productIdsString);
    if (wishlistProductsHTML) {
      const { productItem } = choozy(wishlistProductsHTML, null);
      const productItems = [].concat(productItem);
      if (productItems.length > 0) {
        let productsHtml = '';
        productItems.forEach(item => {
          if (!item) return;
          const { productId } = item.dataset;
          item.style.order = productIdsString.split(',').indexOf(productId);
          productsHtml += item.outerHTML;
        });
        productsGrid.innerHTML = productsHtml;
        itemCount.innerHTML = getString(
          productItems.length > 1 ? 'wishlist.item_count.other' : 'wishlist.item_count.one'
        ).replace('{{ count }}', productItems.length);
      }
      node.classList.add('open');
      window.app.mount();
    }
  } else {
    loader.classList.add('hidden');
    errorMessage.classList.remove('hidden');
  }
});
