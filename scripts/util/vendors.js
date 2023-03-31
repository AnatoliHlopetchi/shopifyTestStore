import { getShopifyLink } from '../lib/links';

/**
 * Adding a vendor script/stylesheet, being initialised on window.load
 * @type {Object}
 * @param {String} name identify if loaded or not
 * @param {String} src link to to vendor-file
 * @param {Boolean|Element} include if truthy, include on load
 * @param {Boolean} important import before window.load event
 * @param {Function} callback run after load
 */

export const scripts = [
  {
    name: `Tag manager`,
    src: `https://www.googletagmanager.com/gtm.js?id=${window?.Phill?.scripts?.tag_manager}`,
    include: window?.Phill?.scripts?.tag_manager,
  },
  {
    name: `Google Optimize`,
    src: `https://www.googleoptimize.com/optimize.js?id=${window?.Phill?.scripts?.google_optimize}`,
    include: window?.Phill?.scripts?.google_optimize,
    important: true,
  },
  {
    name: `Swiper`,
    src: getShopifyLink('swiper.min.js'),
    include: document.querySelector('.swiper-wrapper'),
  },
  {
    name: `Keen slider`,
    src: getShopifyLink('keen-slider.min.js'),
    include: document.querySelector('.keen-slider'),
  },
];

export const styles = [
  {
    name: `Swiper`,
    src: getShopifyLink('swiper.min.css'),
    include: document.querySelector('.swiper-wrapper'),
  },
  {
    name: `Keen slider`,
    src: getShopifyLink('keen-slider.css'),
    include: document.querySelector('.keen-slider'),
  },
];
