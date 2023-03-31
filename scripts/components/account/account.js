/* eslint-disable no-unused-expressions */
import choozy from '../../lib/choozy';

export default window.component(node => {
  const {
    addAddressButton,
    resetPageButton,
    editAddressButton,
    addAddress,
    info,
    addresses,
    editAddresses,
    editAddressForm,
    accountPageSwitcher,
  } = choozy(node, null);

  accountPageSwitcher.addEventListener('change', () => {
    window.location.href = accountPageSwitcher.value;
  });

  const resetPage = e => {
    e.preventDefault();
    info.classList.remove('hidden');
    addresses.classList.remove('hidden');
    addAddress.classList.add('hidden');
    editAddresses.classList.add('hidden');
    [].concat(editAddressForm).forEach(form => form.classList.add('hidden'));
    window.scrollTo(0, 0);
  };

  addAddressButton &&
    addAddressButton.addEventListener('click', e => {
      e.preventDefault();
      addAddress.classList.remove('hidden');
      info.classList.add('hidden');
      addresses.classList.add('hidden');
      window.scrollTo(0, 0);
    });
  resetPageButton &&
    [].concat(resetPageButton).forEach(button => {
      button.addEventListener('click', resetPage);
    });

  editAddressButton &&
    [].concat(editAddressButton).forEach(button => {
      button.addEventListener('click', e => {
        e.preventDefault();
        const { addressId } = button.dataset;
        addresses.classList.add('hidden');
        info.classList.add('hidden');

        const targetEditAddressForm = []
          .concat(editAddressForm)
          .find(form => form.dataset.addressId === addressId);

        editAddresses.classList.remove('hidden');
        targetEditAddressForm.classList.remove('hidden');

        window.scrollTo(0, 0);
      });
    });
});
