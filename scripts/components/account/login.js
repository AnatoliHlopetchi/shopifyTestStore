import choozy from '../../lib/choozy';

export default window.component(node => {
  const { loginForm, toForgot, toLogin, forgotForm, forgotErrors, forgotSuccess } = choozy(
    node,
    null
  );

  // Show forgot form when there's a success or error message on the form
  if (forgotErrors || forgotSuccess) {
    loginForm.classList.add('hidden');
    forgotForm.classList.remove('hidden');
  }

  toForgot.addEventListener('click', e => {
    e.preventDefault();
    loginForm.classList.add('hidden');
    forgotForm.classList.remove('hidden');
  });

  toLogin.addEventListener('click', e => {
    e.preventDefault();
    loginForm.classList.remove('hidden');
    forgotForm.classList.add('hidden');
  });
});
