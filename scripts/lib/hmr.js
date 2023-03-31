if (window.Shopify.theme && window.Shopify.theme.role === 'development') {
  const eventSource = new EventSource('/hot-reload');

  eventSource.onmessage = () => {
    setTimeout(() => {
      window.app.mount();
    }, 600);
  };
}
