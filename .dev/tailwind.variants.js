const plugin = require('tailwindcss/plugin');

module.exports = plugin(({ addVariant, e }) => {
  addVariant('group-open', ({ modifySelectors, separator }) => {
    modifySelectors(
      ({ className }) => `.group.open .${e(`group-open${separator}${className}`)}`
    );
  });
  addVariant('open', ({ modifySelectors, separator }) => {
    modifySelectors(({ className }) => `.${e(`open${separator}${className}`)}.open`);
  });
  addVariant('display', ({ modifySelectors, separator }) => {
    modifySelectors(({ className }) => `.${e(`display${separator}${className}`)}.display`);
  });
  addVariant('loaded', ({ modifySelectors, separator }) => {
    modifySelectors(({ className }) => `.${e(`loaded${separator}${className}`)}.is-loaded`);
  });
  addVariant('peer-loaded', ({ modifySelectors, separator }) => {
    modifySelectors(({ className }) => `.peer.is-loaded ~ .${e(`peer-loaded${separator}${className}`)}`);
  });
})