export const getSliderType = element => {
  const contains = string => {
    return element.classList.contains(string);
  };

  switch (true) {
    case contains('swiper-wrapper'):
      return 'Swiper';
    case contains('keen-slider'):
      return 'Keen slider';
    default:
      return null;
  }
};

export default { getSliderType };
