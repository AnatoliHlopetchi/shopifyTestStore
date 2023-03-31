import choozy from '../../lib/choozy';
import { getString } from '../../lib/string';

export default window.component((node, ctx) => {
  const { input, submit, error } = choozy(node, null);
  if (window.location.search.includes('customer_posted=true')) {
    node.scrollIntoView({ behavior: 'smooth' });
  }
  if (window.location.href.indexOf('&form_type=customer') > -1) {
    error.innerHTML = getString('newsletter.error');
  }

  const validateEmail = () => {
    const emailRegexp = /^[^\s()<>@,;:\/]+@\w[\w\.-]+\.[a-z]{1,}$/i;
    if (emailRegexp.test(input.value)) {
      submit.classList.add('opacity-100');
      submit.disabled = false;
    } else {
      submit.classList.remove('opacity-100');
      submit.disabled = true;
    }
  };

  input?.addEventListener('keyup', validateEmail);
});
