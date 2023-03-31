/* eslint-disable */
export default function (container = document.body, prefix = 'js-') {
  const elements = [...container.querySelectorAll(!prefix ? '*' : `[class*="${prefix}"]`)];
  const property = !prefix ? 'dataset' : 'classList';
  return elements.reduce((res, el) => {
    [].slice.call(!prefix ? Object.entries(el[property]) : el[property]).forEach(property => {
      let key;
      if (prefix && property.slice(0, prefix.length) === prefix)
        key = property.slice(prefix.length, property.length);
      else if (!prefix) [key] = property;
      if (key) {
        res[key] = res.hasOwnProperty(key)
          ? res[key].constructor === Array
            ? res[key].concat(el)
            : [res[key], el]
          : el;
      }
    });
    return res;
  }, {});
}
