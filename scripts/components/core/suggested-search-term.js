export default window.component((node, ctx) => {
  const { searchTerm } = node.dataset;
  node.addEventListener('click', () =>
    ctx.emit('search:suggest-term-clicked', () => ({ searchTerm }))
  );
});
