import './style.css';

class Parallax {
  constructor() {
    this.handleScroll = this.handleScroll.bind(this);

    this.callbacks = [];
    this.parallaxConfigs = [];
    this.scrollTop = 0;

    this.init();
  };

  // setup
  init() {
    const elements = document.querySelectorAll('[data-parallax]');

    this.findTargetPosition();
    this.parallaxConfigs = this.setupParallaxes(elements, this.scrollTop);

    addEventListener('scroll', () => {
      window.requestAnimationFrame(this.handleScroll);
    });
    addEventListener('resize', () => {
      window.requestAnimationFrame(this.handleScroll);
    });
  };

  setupParallaxes(elements) {
    return Array.prototype.map.call(elements, element => {
      element.parentElement.style.perspective = '1000px';

      const parentBoundary = element.parentElement.getBoundingClientRect();
      const parentMidpt = (parentBoundary.top + parentBoundary.bottom) / 2;
      const offset = this.scrollTop + parentMidpt;

      let constrain = element.dataset.constrain;
      if(constrain === undefined) { constrain = false; }
      else if(constrain === '') { constrain = 'normal'; }

      return {
        constrain, element, offset,
        transforms: this.setupTransformConfig(element)
      };
    });
  };

  setupTransformConfig(element) {
    const animations = ['translateX', 'translateY', 'translateZ', 'rotateX', 'rotateY', 'rotateZ'];

    return animations.filter(animation => element.dataset[animation])
      .map(animation => {
        const rate = Number(element.dataset[animation]);
        return { animation, rate };
      });
  };

  // scroller
  buildTransform(config, frame) {
    return config.transforms.reduce((newTransform, transform) => {
      const pos = transform.rate * frame;
      const unit = transform.animation.substring(0, 9) === 'translate' ? 'px' : 'deg';
      return `${newTransform} ${transform.animation}(${pos}${unit})`;
    }, '');
  };

  checkConstraints(config) {
    if(!config.constrain) { return true; }

    const elementBoundary = config.element.getBoundingClientRect();
    const elementMiddleX = elementBoundary.left + (elementBoundary.width / 2);
    const elementMiddleY = elementBoundary.top + (elementBoundary.height / 2);
    const parentBoundary = config.element.parentElement.getBoundingClientRect();

    const isBound = elementMiddleX > parentBoundary.left
       && elementMiddleX < parentBoundary.right
       && elementMiddleY > parentBoundary.top
       && elementMiddleY < parentBoundary.bottom;

    return config.constrain === 'normal' ? isBound : !isBound;
  };

  findTargetPosition() {
    const windowMidpt = window.innerHeight / 2;
    this.scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    this.targetPosition = this.scrollTop + windowMidpt;

    this.runCallbacks();
  };

  handleScroll() {
    this.findTargetPosition();

    this.parallaxConfigs.forEach(config => {
      const frame = this.targetPosition - config.offset;
      config.element.style.webkitTransform = this.buildTransform(config, frame);
      config.element.style.visibility = this.checkConstraints(config) ? 'visible' : 'hidden';
    });
  };

  // actions
  hideParallaxes() {
    this.parallaxConfigs.forEach(config => {
      config.element.classList.remove('show_parallax');
      config.element.parentElement.classList.remove('show_parallax_container');
    });
  };

  showParallaxes() {
    this.parallaxConfigs.forEach(config => {
      config.element.classList.add('show_parallax');
      config.element.parentElement.classList.add('show_parallax_container');
    });
  };

  // getters
  getElements() {
    return this.parallaxConfigs.map(config => config.element);
  };

  getScrollTop() {
    return this.scrollTop;
  };

  getTargetPosition() {
    return this.targetPosition;
  };

  // callbacks
  registerCallback(cb) {
    this.callbacks.push(cb);
  };

  runCallbacks() {
    this.callbacks.forEach(cb => cb(this.targetPosition, this.scrollTop));
  };
}

new Parallax;
