export default parameters => {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search.slice(1));

  parameters.forEach(({ name, value }) => {
    if (value !== '') params.set(name, encodeURIComponent(value));
    else params.delete(name);
  });

  window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
};
