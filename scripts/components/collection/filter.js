const debounce = (func, timeout = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
};

const fetchHtml = async url =>
  fetch(url)
    .then(response => response.text())
    .then(responseText => new DOMParser().parseFromString(responseText, 'text/html'));

const updateURLHash = searchParams =>
  // eslint-disable-next-line no-restricted-globals
  history.pushState(
    { searchParams },
    '',
    `${window.location.pathname}${
      searchParams.includes('?') ? searchParams : '?'.concat(searchParams)
    }`
  );

const fetchFilterSection = async (searchParams, section) => {
  window.app.emit(['filter:loading']);

  const filterHtmlRender = await fetchHtml(
    `${window.location.origin + window.location.pathname}?section_id=${
      section.name
    }&${searchParams}`
  );

  window.app.emit(['filter:render'], { html: filterHtmlRender, uri: searchParams });
};

const handleFilterEvent = (event, section) => {
  event.preventDefault();
  const formFilters = new URLSearchParams(new FormData(event.target.closest('form'))).toString();
  fetchFilterSection(formFilters, section);
};

export default window.component((node, ctx) => {
  const el = node;

  const section = {
    name: 'main-collection',
    grid: '[data-product-grid]',
    loading: '[data-filter-loading]',
    controls: '[data-filter-controls]',
    selectedFilters: '[data-fiter-selected]',
  };

  el.querySelector(section.controls).addEventListener(
    'input',
    debounce(e => handleFilterEvent(e, section))
  );

  const setLoading = state => {
    el.querySelector(section.loading).style.opacity = state ? 1 : 0;
  };

  ctx.on('filter:render', ({ html, uri }) => {
    el.querySelector(section.grid).innerHTML = html.querySelector(section.grid).innerHTML;
    el.querySelector(section.controls).innerHTML = html.querySelector(section.controls).innerHTML;
    el.querySelector(section.selectedFilters).innerHTML = html.querySelector(
      section.selectedFilters
    ).innerHTML;

    updateURLHash(uri);
    window.app.mount();
    window.app.emit(['filter:loaded']);
  });

  ctx.on('filter:loading', () => setLoading(true));

  ctx.on('filter:loaded', () => setLoading(false));
});
