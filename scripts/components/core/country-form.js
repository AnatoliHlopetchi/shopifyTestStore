/*
  The localization 'form' should have data-component: 'countryForm' and the select should have name='country_code' and data-country-select
  e.g.
  {% form 'localization', data-component: 'countryForm' %}
    <select
      name='country_code'
      data-country-select
    >
  ...
*/
import choozy from '../../lib/choozy';

export default window.component(node => {
  const { countrySelect } = choozy(node, null);
  countrySelect.addEventListener('change', () => node.submit());
});
