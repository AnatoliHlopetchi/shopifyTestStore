import choozy from '../../lib/choozy';

export default window.component((node, ctx) => {
  const { group } = node.dataset;
  const { inner, toggle } = choozy(node, null);
  const activeClass = 'open';

  const updateHeight = () => {
    node.style.setProperty('--innerHeight', `auto`);
    node.style.setProperty('--innerHeight', `${inner.scrollHeight}px`);
  };

  updateHeight();

  window.addEventListener('resize', updateHeight, { passive: true });

  toggle.addEventListener('click', () => {
    ctx.emit('accordion:toggle', null, {
      open: !node.classList.contains(activeClass),
      node,
      group,
    });
  });

  ctx.on('accordion:toggle', (state, a = {}) => {
    if (group !== a.group) return;
    node.classList[a.open && a.node === node ? 'add' : 'remove'](activeClass);
  });
});
