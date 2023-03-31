/*
  The localization 'form' should have data-component: 'languageForm' and the select should have name='language_code' and data-language-select
  e.g.
  {% form 'localization', data-component: 'languageForm' %}
    <select
      name='language_code'
      data-language-select
    >
  ...
*/
import choozy from '../../lib/choozy';

export default window.component(node => {
  const { languageSelect } = choozy(node, null);
  languageSelect.addEventListener('change', () => node.submit());
});
