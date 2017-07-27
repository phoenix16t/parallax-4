export function findScrollMidpt() {
  return findScrollTop() + findWindowMidpt();
};

export function findScrollTop() {
  return window.pageYOffset || document.documentElement.scrollTop;
};

function findWindowMidpt() {
  return window.innerHeight / 2;
};
