const escKey = ({ keyCode }, { type, boolean }) => {
  if (keyCode === 27 && type && boolean) window.app.emit(type, { [boolean]: false });
};

export default escKey;
