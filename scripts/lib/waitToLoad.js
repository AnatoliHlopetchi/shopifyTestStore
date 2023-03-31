const waitToLoad = scriptName =>
  new Promise(res => {
    if (window?.hasLoaded?.scripts?.[scriptName]) res();
    else window.app.on(`${scriptName}:loaded`, res);
  });

export default waitToLoad;
