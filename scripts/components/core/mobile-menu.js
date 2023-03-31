/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */

import choozy from '../../lib/choozy';

export default window.component((node, ctx) => {
  const {
    mobileMenuToggle,
    mobileMenuContainer,
    mobileNestedMenuButton,
    mobileNestedMenu,
    mobileNestedMenuBackButton,
    mobileMenu,
  } = choozy(node, null);
  const mobileMenuToggles = [].concat(mobileMenuToggle);
  const mobileNestedMenuButtons = [].concat(mobileNestedMenuButton);
  const mobileNestedMenus = [].concat(mobileNestedMenu);
  const mobileNestedMenuBackButtons = [].concat(mobileNestedMenuBackButton);

  if (mobileMenuToggles.length > 0) {
    mobileMenuToggles.forEach(toggle => {
      toggle?.addEventListener('click', () =>
        ctx.emit('mobileMenu:toggle', ({ mobileMenuOpen }) => ({
          mobileMenuOpen: !mobileMenuOpen,
        }))
      );
    });
  }

  if (mobileNestedMenuButtons.length > 0) {
    mobileNestedMenuButtons.forEach(button => {
      button?.addEventListener('click', () => {
        const { menuId } = button.dataset;
        mobileMenu.classList.add('open');
        mobileNestedMenus.forEach(menu => menu.classList.add('hidden'));
        mobileNestedMenus.find(menu => menu.id === menuId).classList.remove('hidden');
      });
    });
  }

  if (mobileNestedMenuBackButtons.length > 0) {
    mobileNestedMenuBackButtons.forEach(button => {
      button?.addEventListener('click', () => mobileMenu.classList.remove('open'));
    });
  }

  ctx.on('mobileMenu:toggle', ({ mobileMenuOpen }) => {
    ctx.emit('body:toggleScrollLock', () => ({ enable: mobileMenuOpen }));
    mobileMenuContainer.classList[mobileMenuOpen ? 'add' : 'remove']('open');
  });
});
