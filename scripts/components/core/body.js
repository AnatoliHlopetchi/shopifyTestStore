/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */
import { initWishlist } from '../../lib/wishlist';

export default window.component(async (node, ctx) => {
  let scrollPosition = 0;
  let isScrollLockEnabled;

  ctx.on('body:toggleScrollLock', ({ enable }) => {
    if (isScrollLockEnabled === enable) return;

    if (enable) {
      scrollPosition = window.pageYOffset;
      node.style.overflow = 'hidden';
      node.style.position = 'fixed';
      node.style.top = `-${scrollPosition}px`;
      node.style.width = '100%';
    } else {
      node.style.removeProperty('overflow');
      node.style.removeProperty('position');
      node.style.removeProperty('top');
      node.style.removeProperty('width');
      window.scrollTo(0, scrollPosition);
    }

    isScrollLockEnabled = enable;
  });

  // important to start wishlist JS with this, sync local with remote before any other step
  await initWishlist();
  ctx.emit('wishlist:synced', { wishlistSynced: true });
});
