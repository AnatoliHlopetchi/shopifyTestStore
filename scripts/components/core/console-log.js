export default window.component(node => {
  const { text } = node.dataset;
  console.log('console:log', text);
});
