import choozy from '../../lib/choozy';
import waitToLoad from '../../lib/waitToLoad';

export default window.component(async node => {
  await waitToLoad('Keen slider');

  const { orderSlider } = choozy(node, null);

  if (orderSlider) {
    [].concat(orderSlider).forEach(slider => {
      const keen = new KeenSlider(slider, {
        breakpoints: {
          '(min-width: 1024px)': {
            slides: {
              perView: 5.5,
              spacing: 16,
            },
          },
        },
        slides: {
          perView: 2.8,
          spacing: 8,
        },
      });
    });
  }
});
