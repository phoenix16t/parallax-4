import { ParallaxElement } from './parallax-element.js';
import { findScrollMidpt, findScrollTop } from './scroll-handler.js';
import * as actions from './actions.js';
import * as callbacks from './callbacks.js';

class Parallaxer {
  constructor() {
    this.parallaxElements = [];

    // getters
    this.getElements = () => this.elements;
    this.getScrollTop = () => findScrollTop();
    this.getScrollMidpt = () => findScrollMidpt();

    // actions
    this.hideParallaxes = actions.hideParallaxes.bind(this);
    this.showParallaxes = actions.showParallaxes.bind(this);

    // callbacks
    this.callbacks = [];
    this.registerCallback = callbacks.registerCallback.bind(this);
    this.runCallbacks = callbacks.runCallbacks.bind(this);

    document.addEventListener("DOMContentLoaded", () => {
      this.init();
    });
  };

  init() {
    const scrollTop = findScrollTop();
    this.elements = document.querySelectorAll('[data-parallax]');

    this.elements.forEach(element => {
      const parallaxElement = new ParallaxElement(element, scrollTop);
      this.parallaxElements.push(parallaxElement);
    });

    addEventListener('scroll', () => {
      window.requestAnimationFrame(() => this.scroll());
    });
    addEventListener('resize', () => {
      window.requestAnimationFrame(() => this.scroll());
    });
  }

  scroll() {
    const scrollMidpt = findScrollMidpt();
    this.parallaxElements.forEach(element => element.scroll(scrollMidpt));
    this.runCallbacks(scrollMidpt);
  };
};

const parallaxer = new Parallaxer();
export { parallaxer };
