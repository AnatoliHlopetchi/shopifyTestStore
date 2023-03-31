/* eslint-disable no-unused-expressions */
import choozy from '../../lib/choozy';

export default window.component(node => {
  const { deleteAddressButton, deleteAddressModal, closeModal, deleteAddressConfirm } = choozy(
    node,
    null
  );

  if (closeModal) {
    [].concat(closeModal).forEach(button =>
      button.addEventListener('click', e => {
        e.preventDefault();
        deleteAddressModal.classList.remove('open');
      })
    );
  }

  if (deleteAddressButton) {
    deleteAddressButton.addEventListener('click', e => {
      e.preventDefault();
      deleteAddressModal.classList.add('open');
    });
  }

  if (deleteAddressConfirm) {
    deleteAddressConfirm.addEventListener('click', () => {
      const targetDeleteForm = document.getElementById(
        `delete-address-form--${deleteAddressConfirm.dataset.addressId}`
      );
      targetDeleteForm.submit();
    });
  }
});
