import choozy from './choozy';
import { formatMoney } from './currency';

export default (variant, element) => {
  const { price, compareAtPrice } = choozy(element, null);
  const { price: p, compare_at_price: cp } = variant;

  Array.from(price).forEach(el => {
    el.innerHTML = formatMoney(p);
  });
  Array.from(compareAtPrice).forEach(el => {
    el.innerHTML = cp > p ? formatMoney(cp) : '';
  });
};
