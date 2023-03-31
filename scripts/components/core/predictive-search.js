/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-expressions */
import choozy from '../../lib/choozy';
import { debounce } from '../../lib/debounce';

export default window.component((node, ctx) => {
  const { toggleButton, searchInput, dynamicContent, loader } = choozy(node, null);
  const toggleButtons = [].concat(toggleButton);
  const { debounceDelay } = node.dataset;

  toggleButtons.forEach(button => {
    button?.addEventListener('click', () =>
      ctx.emit('search:toggle', ({ searchOpen }) => ({ searchOpen: !searchOpen }))
    );
  });

  const getResults = () => {
    const query = searchInput.value;
    const queryContainsAlphanumericInput = /[a-z0-9]/i.test(query);
    if (queryContainsAlphanumericInput) {
      loader.classList.remove('hidden');
      dynamicContent.classList.add('hidden');
      let requestResponse;
      fetch(
        `${window.Shopify.routes.root}search/suggest?q=${query}&resources[type]=product&resources[options][unavailable_products]=show&resources[options][fields]=title,product_type,variants.title,variants.sku,body,tag&section_id=predictive-search`
      )
        .then(response => {
          requestResponse = response;
          return response.text();
        })
        .then(text => {
          if (!requestResponse.ok) {
            throw new Error(`${requestResponse.status}: ${text}`);
          }
          const resultsMarkup = new DOMParser().parseFromString(text, 'text/html');
          loader.classList.add('hidden');
          dynamicContent.innerHTML =
            resultsMarkup.querySelector('[data-dynamic-content]').innerHTML;
          dynamicContent.classList.remove('hidden');
          window.app.mount();
        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  /* An alternative to manually changing the CSS ourselves with JS, is to fire a section rendering API call to the predictive-search section
    The benefit of this is that we won't have to manage the logic once in liquid and another in JS, but have everything dictated by liquid
    Currently what we want to do on 'reset' is very basic, so doing an extra API call just to reset some classes is not necessary
  */
  const resetSearch = () => {
    const { searchResults, suggestedSearchTerms, featuredCollection } = choozy(node, null);
    searchResults?.classList.add('hidden');
    suggestedSearchTerms?.classList.remove('hidden');
    // data-always-hide is if liquid logic dictates we never want to show the featured products (e.g. all the featured products are OOS)
    if (featuredCollection && featuredCollection?.dataset.alwaysHide !== 'true') {
      featuredCollection.classList.remove('hidden');
    }
  };

  const handleEscKey = e => {
    if (e.key !== 'Escape') return;
    if (searchInput.value === '') {
      ctx.emit('search:toggle', ({ searchOpen }) => ({ searchOpen: !searchOpen }));
    } else {
      searchInput.value = '';
      resetSearch();
      searchInput.focus();
    }
  };

  ctx.on('search:toggle', ({ searchOpen }) => {
    ctx.emit('body:toggleScrollLock', () => ({ enable: searchOpen }));
    node.classList[searchOpen ? 'add' : 'remove']('open');

    if (searchOpen) {
      document.addEventListener('keyup', handleEscKey);
      searchInput.focus();
    } else {
      node.tabIndex = '-1';
      document.removeEventListener('keyup', handleEscKey);
    }
  });

  const handleSearchInputChange = () => {
    searchInput.value.length === 0 ? resetSearch() : getResults();
  };

  searchInput.addEventListener('keyup', debounce(handleSearchInputChange, Number(debounceDelay)));

  ctx.on('search:suggest-term-clicked', ({ searchTerm }) => {
    searchInput.value = searchTerm;
    getResults();
  });
});
