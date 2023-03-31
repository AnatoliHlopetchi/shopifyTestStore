export default window.component(() => {
  document.addEventListener('shopify:section:load', () => {
    window.app.unmount();
    window.app.mount();
  });
});
