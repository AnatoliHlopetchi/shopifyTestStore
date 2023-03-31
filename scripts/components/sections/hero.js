import choozy from '../../lib/choozy';

export default window.component(async node => {
  const { video, source } = choozy(node, null);

  const { desktopSource, mobileSource } = video.dataset;

  const addSource = async () => {
    if (window.innerWidth >= 1024 && desktopSource && source.src !== desktopSource) {
      source.src = desktopSource;
      video.load();
      await video.play();
      video.classList.add('open');
    } else if (window.innerWidth < 1024 && mobileSource && source.src !== mobileSource) {
      source.src = mobileSource;
      video.load();
      await video.play();
      video.classList.add('open');
    }
  };

  window.addEventListener('resize', addSource, { passive: true });

  window.addEventListener(
    'load',
    () => {
      addSource();
    },
    { passive: true }
  );
});
