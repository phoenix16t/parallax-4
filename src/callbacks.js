export function registerCallback(fn, el) {
  let newCallbacks = [{ fn }];
  return ready().then(() => {
    if(el) {
      newCallbacks = this.parallaxElements
        .filter(element => element.domElement.classList.contains(el))
        .map(element => {
          return { fn, element };
        });
    }
    this.callbacks.push(...newCallbacks)
  });
};

export function runCallbacks(scrollMidpt) {
  this.callbacks.forEach(cb => {
    if(!cb.element) { return cb.fn(scrollMidpt); }
    else { return cb.fn(cb.element.frame); }
  });
};

function ready() {
  return new Promise(resolve => {
    if (document.readyState === 'complete') {
      return resolve();
    }

    document.addEventListener('DOMContentLoaded', () => {
      onReady(resolve);
    });
    window.addEventListener('load', () => {
      onReady(resolve);
    });
  });
};

function onReady(resolve) {
  document.removeEventListener('DOMContentLoaded', onReady);
  window.removeEventListener('load', onReady);
  return resolve();
};
