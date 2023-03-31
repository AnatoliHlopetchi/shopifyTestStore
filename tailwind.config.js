/* eslint-disable func-names */
/* eslint-disable import/no-extraneous-dependencies */
const plugin = require('tailwindcss/plugin');

module.exports = {
  content: [
    './templates/*.liquid',
    './templates/customers/*.liquid',
    './sections/**/*.liquid',
    './snippets/**/*.liquid',
    './layout/**/*.liquid',
    './styles/**/*.css',
    './scripts/**/*.js',
  ],
  theme: {
    screens: {
      '26rem': '416px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
    extend: {
      transitionProperty: {
        height: 'height',
      },
      spacing: {
        mobileHeader: '64px',
        desktopHeader: '72px',
        mobileMenuFooter: '52px',
        mobileMenuHeight: 'calc(100% - 64px - 52px)', // 100% - mobileHeader - mobileMenuFooter
      },
      colors: {
        primary: '#000000',
        second: '#663B89',
        alert: '#CC0000',
        lightGrey: '#E6E6E6',
        grey: '#666666',
      },
      fontFamily: {
        circular: "'Circular', sans-serif",
      },
    },
  },
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant('open', '&.open');
      addVariant('group-open', ':merge(.group).open &');
      addVariant('group-two-open', ':merge(.group-two).open &');
      addVariant('wishlist-active', '.wishlist-active &');
      addVariant('wishlist-content-group-has-items', ':merge(.wishlist-content-group).has-items &');
    }),
  ],
};
