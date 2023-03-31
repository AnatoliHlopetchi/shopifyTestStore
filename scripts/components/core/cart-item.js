import { updateAddon } from '../../lib/cart';
import choozy from '../../lib/choozy';

export default window.component(node => {
  const { update } = choozy(node, null);
  const { key } = node.dataset;

  [].concat(update).forEach(btn => {
    const { value } = btn.dataset;
    btn.addEventListener('click', () => updateAddon(key, value));
  });
});
