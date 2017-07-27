export function hideParallaxes() {
  this.parallaxElements.forEach(element => {
    element.domElement.classList.remove('show_parallax');
    element.domElement.parentElement.classList.remove('show_parallax_container');
  });
};

export function showParallaxes() {
  this.parallaxElements.forEach(element => {
    element.domElement.classList.add('show_parallax');
    element.domElement.parentElement.classList.add('show_parallax_container');
  });
};

export function applyTransform(element, transform) {
  element.style.webkitTransform = transform;
};

export function updateVisibility(element, visibility) {
  element.style.visibility = visibility;
};
