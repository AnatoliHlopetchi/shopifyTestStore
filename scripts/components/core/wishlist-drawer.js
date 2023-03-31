/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-expressions */
import choozy from '../../lib/choozy';
import { getString } from '../../lib/string';
import { fetchWishlistProductsHtml } from '../../lib/wishlist';

export default window.component((node, ctx) => {
  /* Since it's a drawer rendered on every page, we want to use drawerOpenedOnce to only render wishlist items if the drawer was opened */
  let drawerOpenedOnce = false;

  const {
    toggleButton,
    productsGrid,
    wishlistContent,
    itemCount,
    loader,
    shareWishlist,
    shareWishlistSpan,
    shareWishlistSpanSuccess,
  } = choozy(node, null);
  const toggleButtons = [].concat(toggleButton);

  toggleButtons.forEach(button => {
    button?.addEventListener('click', () =>
      ctx.emit('wishlistDrawer:toggle', ({ drawerOpen }) => ({ drawerOpen: !drawerOpen }))
    );
  });

  /* Why are we updating item count with JS, when it can be done by the section rendering API?

    We wanted the wishlist to feel snappier and as fast as possible when removing items, and we do this by immediately removing
    an item with .remove() from the wishlist grid. This also means we must manually update the itemCount with JS as well.

    The alternative you can do is just re-render everything with the section rendering API only, and add a loader overlay while it's fetching the section HTML
  */
  const updateItemCount = count => {
    const newItemCountText = getString(
      count > 1 ? 'wishlist.item_count.other' : 'wishlist.item_count.one'
    ).replace('{{ count }}', count);
    itemCount.innerHTML = newItemCountText;
  };

  const updateGridState = () => {
    loader.classList.add('hidden');
    wishlistContent.classList.remove('hidden');
    updateItemCount(productsGrid.childNodes.length);
    wishlistContent.classList[productsGrid.childNodes.length ? 'add' : 'remove']('has-items');
  };

  const getProductIds = () => {
    const wishlistJson = localStorage.getItem('askphill_wishlist');
    const wishlistObj = wishlistJson ? JSON.parse(wishlistJson) : null;
    if (wishlistObj !== null) {
      /* items is an object with the productId as the keys
      example: { "11111": { "inWishlist": true, "updatedAt": 123 }, ... } */
      const { items } = wishlistObj;
      /* we want to convert it into an array with productIds inside so we can iterate with it
      productObjects - array of objects with product ID inside,
      example: [{ "inWishlist": true, "updatedAt": 123, "id": 11111 }, ... ] */
      const productObjects = Object.entries(items).map(item => {
        item[1].id = item[0];
        return item[1];
      });
      // Filter productIds in wishlist and sort by updatedAt so that products most recently added to the wishlist are at the top
      const productIds = productObjects
        .filter(item => item.inWishlist)
        .sort((a, b) => b.updatedAt - a.updatedAt)
        .map(item => item.id);

      return productIds;
    }
    return null;
  };

  const renderWishlistProducts = async () => {
    loader.classList.remove('hidden');
    wishlistContent.classList.add('hidden');
    const productIds = getProductIds();

    if (productIds !== null) {
      const wishlistSectionHtml = await fetchWishlistProductsHtml(productIds.join());
      if (wishlistSectionHtml) {
        const { productItem } = choozy(wishlistSectionHtml, null);
        const productItems = [].concat(productItem);
        if (productItems.length > 0) {
          let productsHtml = '';
          productItems.forEach(item => {
            if (!item) return;
            const { productId } = item.dataset;
            item.style.order = productIds.indexOf(productId);
            productsHtml += item.outerHTML;
          });
          productsGrid.innerHTML = productsHtml;
        }
      }
      updateGridState();
      window.app.mount();
    }
  };

  if (shareWishlist) {
    shareWishlist.addEventListener('click', () => {
      const { sharedWishlistLink } = shareWishlist.dataset;
      const productIds = getProductIds();
      if (productIds !== null) {
        const shareLink = `${
          window.location.origin
        }${sharedWishlistLink}?view=shared-wishlist&ids=${productIds.join()}`;
        navigator.clipboard.writeText(shareLink).then(
          () => {
            /* clipboard successfully set */
            shareWishlistSpan.classList.add('hidden');
            shareWishlistSpanSuccess.classList.remove('hidden');
            setTimeout(() => {
              shareWishlistSpan.classList.remove('hidden');
              shareWishlistSpanSuccess.classList.add('hidden');
            }, 2500);
          },
          () => {
            /* clipboard write failed
            Ensure you check with the client how you'd like to show the error
            */
            console.log('Failed to copy to clipboard');
          }
        );
      }
    });
  }

  const handleEscKey = e => {
    if (e.key !== 'Escape') return;
    ctx.emit('wishlistDrawer:toggle', ({ drawerOpen }) => ({ drawerOpen: !drawerOpen }));
  };

  ctx.on('wishlistDrawer:toggle', ({ drawerOpen }) => {
    if (drawerOpen && !drawerOpenedOnce) {
      drawerOpenedOnce = true;
      if (ctx.getState().wishlistSynced) {
        renderWishlistProducts();
      }
    }
    ctx.emit('body:toggleScrollLock', () => ({ enable: drawerOpen }));
    node.classList[drawerOpen ? 'add' : 'remove']('open');

    drawerOpen
      ? document.addEventListener('keyup', handleEscKey)
      : document.removeEventListener('keyup', handleEscKey);
  });

  ctx.on('wishlist:removeProduct', ({ productId }) => {
    const productItem = node.querySelector(`[data-product-id="${productId}"]`);
    if (productItem) {
      productItem.remove();
      updateGridState();
      // Ensure any other productItems of the same product also have their wishlist state updated (i.e. In search drawer, collection page, etc.)
      const allMatchingProductItems = document.querySelectorAll(`[data-product-id="${productId}"]`);
      if (allMatchingProductItems.length > 0) {
        allMatchingProductItems.forEach(matchingProductItem => {
          if (!matchingProductItem) return;
          matchingProductItem
            .querySelector('[data-wishlist-button]')
            ?.classList.remove('wishlist-active');
        });
      }
    }
  });

  ctx.on('wishlist:addProduct', renderWishlistProducts);
  ctx.on('wishlist:synced', () => {
    drawerOpenedOnce && renderWishlistProducts();
  });
});
