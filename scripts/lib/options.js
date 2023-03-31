/* eslint-disable */
/*
  How do shopify variants work with native 'options'?
    The client adds different 'options' to a product, like "color" vs "size"
    e.g. If "color" options are "Black" and "White", and "size" options are "S", "M", "L"
    The product now has 6 variants of every possible combination, with variant titles formed with " / " in between option names
    i.e. "Black / S", "Black / M", "Black / L", "White / S", "White / M", "White / L"
    With this, we have 6 variants, each with their own variant.id and variant.title
    
    NOTE that if the client re-orders the options in the shopify product dashboard, with "size" then "color",
    then the variant titles will be "S / Black", "M / Black", etc.

  How does the starter change between variants, given the different 'options' to configure?
    data-option-select and data-option-radio are the visual inputs for users to change the options 
    (It will be either selects OR radios, depending on the customizer setting)

    data-option-main is the 'actual' <select> that controls variant is selected for the pdp <form>

    With JS, on changing the options with data-option-select/data-option-radio, 
    we assign 'selectedVariant' by finding the 'matching' variant of the given options names combination
    then update data-option-main's value with the selectedVariant's id
*/

import radio from './radio';

export default function productSelection(node, opts) {
  opts = {
    select: '[data-option-select]',
    radio: '[data-option-radio]',
    main: '[data-option-main]',
    ...opts,
  };

  const onUpdateFunctions = [];

  const selectedVariant = {
    id: null,
    options: [],
  };

  const selects = document.querySelectorAll(opts.select);
  const radios = document.querySelectorAll(opts.radio);
  const main = document.querySelector(opts.main);

  if (!main || !main.length) throw 'data-option-main is missing';
  if (radios.length > 3) throw 'you have more than three radio groups';
  if (selects.length > 3) throw 'you have more than three select inputs';

  const allVariants = [].slice.call(main.children).reduce((variantsObj, variantOption) => {
    variantsObj[variantOption.innerHTML] = variantOption.value;
    return variantsObj;
  }, {});

  function updateSelection() {
    // Make sure current selectedVariant options combination actually exists
    const selectedVariantName = Object.keys(allVariants).find((variant) => variant.trim() === selectedVariant.options.join(' / '))
    selectedVariant.id = allVariants[selectedVariantName];
    // Update main select with new selectedVariant id
    main.value = selectedVariant.id;
    // Fire all functions stored in 'onUpdateFunctions' array, passed via onUpdate
    for (const fn of onUpdateFunctions) fn(selectedVariant);
  }

  selects.forEach(select => {
    if (select.nodeName !== 'SELECT')
      throw 'data-option-select should be defined on the individual option selectors';

    const index = Number(select.getAttribute('data-index'));

    // set initial value
    selectedVariant.options[index] = select.value;

    select.addEventListener('change', e => {
      selectedVariant.options[index] = e.target.value;
      updateSelection();
    });
  });

  radios.forEach(r => {
    if (r.nodeName === 'INPUT')
      throw 'data-option-radio should be defined on a parent of the radio group, not the inputs themselves';

    const index = Number(r.getAttribute('data-index'));
    const inputs = [].slice.call(r.getElementsByTagName('input'));

    // set initial value
    inputs.forEach(r => {
      if (r.checked) selectedVariant.options[index] = r.value;
    });

    radio(inputs, value => {
      selectedVariant.options[index] = value;
      updateSelection();
    });
  });

  updateSelection();

  return {
    get selectedVariant() {
      return selectedVariant;
    },
    // onUpdate will push a function into the 'onUpdateFunctions' array, as all functions inside that array will be called on change of the options
    onUpdate(fn) {
      // Make sure the fn function is pushed into the 'onUpdateFunctions' array, if it doesn't exist yet
      onUpdateFunctions.indexOf(fn) < 0 && onUpdateFunctions.push(fn);
      return () => onUpdateFunctions.splice(onUpdateFunctions.indexOf(fn), 1);
    },
  };
}
/* eslint-enable */
