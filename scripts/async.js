import { scripts, styles } from './util/vendors';

const asyncLoad = (scriptsToLoad, stylesToLoad) => {
  const tag = document.getElementsByTagName('script')[0];

  scriptsToLoad.forEach(s => {
    if (window?.hasLoaded?.scripts[s?.name] || !s.include) return '';

    const script = document.createElement('script');

    script.type = 'text/javascript';
    script.async = true;
    script.src = s?.src;

    script.addEventListener('load', e => {
      if (window.vendors) window.vendors(s.name);
      if (s.callback) s.callback(e);

      if (window?.hasLoaded?.scripts && s?.name) window.hasLoaded.scripts[s.name] = true;
    });

    return tag.parentNode.insertBefore(script, tag);
  });

  stylesToLoad.forEach(s => {
    if (window?.hasLoaded?.styles[s?.name] || !s.include) return '';

    const script = document.createElement('link');

    script.rel = 'stylesheet';
    script.href = s?.src;

    tag.parentNode.insertBefore(script, tag);

    tag.addEventListener('load', e => {
      if (s.callback) s.callback(e);
      if (window?.hasLoaded?.styles && s?.name) window.hasLoaded.styles[s.name] = true;
    });

    return s;
  });
};

window.hasLoaded = {
  styles: {},
  scripts: {},
};

if (window.attachEvent) window.attachEvent('onload', () => asyncLoad(scripts, styles));
else window.addEventListener('load', () => asyncLoad(scripts, styles), false);

asyncLoad(
  scripts.filter(s => s.important),
  styles.filter(s => s.important)
);
