export const toCamelCase = function camalize(str) {
  return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
};

export const getCamelCase = obj => {
  return Object.entries(obj).reduce((o, [key, value]) => {
    const object = o;
    object[toCamelCase(key)] = value;
    return object;
  }, {});
};

export const getString = string => {
  /**
   * Get string from window.Phill.theme.strings
   * @param {String} string seperate keys, by . just like in liquid
   */

  return (
    string.split('.').reduce((obj, str) => obj?.[str], window?.Phill?.theme?.strings) ||
    `Missing translation for ${string} in window.Phill`
  );
};
