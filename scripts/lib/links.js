export const getShopifyLink = (fileName, location = 'asset') => {
  if (!window?.Phill?.theme?.links) return;
  const baseLink = window.Phill.theme.links[location];

  // eslint-disable-next-line consistent-return
  return baseLink.replace('XXX.XXX', fileName);
};

export default { getShopifyLink };
