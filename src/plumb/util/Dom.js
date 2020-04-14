export const addEventListener = (el, name, fn) => {
  //todo

  el.addEventListener(name, fn);
};

export const removeEventListener = (el, name, fn) => {
  el.removeEventListener(name, fn);
};

export const removeElement = (el) => {
  if (el.parentElement) {
    el.parentElement.removeChild(el);
  }
};
