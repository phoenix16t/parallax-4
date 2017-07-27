import * as actions from './actions.js';

export class ParallaxElement {
  constructor(element, scrollTop) {
    this.domElement = element;
    this.scrollTop = scrollTop;
    this.parent = this.setupParent();
    this.offset = this.setupOffset();
    this.constrain = this.setupConstraint();
    this.transforms = this.setupTransforms();
  };

  setupParent() {
    this.domElement.parentElement.style.perspective = '1000px';
    return this.domElement.parentElement;
  }

  setupOffset() {
    const parentBoundary = this.parent.getBoundingClientRect();
    const parentMidpt = (parentBoundary.top + parentBoundary.bottom) / 2;
    return this.scrollTop + parentMidpt;
  }

  setupConstraint() {
    let constrain = this.domElement.dataset.constrain;
    if(constrain === undefined) { constrain = false; }
    else if(constrain === '') { constrain = 'normal'; }
    return constrain;
  }

  setupTransforms() {
    const animations = ['translateX', 'translateY', 'translateZ', 'rotateX', 'rotateY', 'rotateZ'];

    return animations.filter(animation => this.domElement.dataset[animation])
      .map(animation => {
        const rate = Number(this.domElement.dataset[animation]);
        return { animation, rate };
      });
  };

  scroll(scrollMidpt) {
    this.frame = scrollMidpt - this.offset;
    const newTransform = this.constructTransform();
    const visibility = this.checkConstraints() ? 'visible' : 'hidden';

    actions.applyTransform(this.domElement, newTransform);
    actions.updateVisibility(this.domElement, visibility);
  };

  constructTransform() {
    return this.transforms.reduce((newTransform, transform) => {
      const pos = transform.rate * this.frame;
      const unit = transform.animation.substring(0, 9) === 'translate' ? 'px' : 'deg';
      return `${newTransform} ${transform.animation}(${pos}${unit})`;
    }, '');
  };

  checkConstraints() {
    if(!this.constrain) { return true; }

    const elementBoundary = this.domElement.getBoundingClientRect();
    const elementMiddleX = elementBoundary.left + (elementBoundary.width / 2);
    const elementMiddleY = elementBoundary.top + (elementBoundary.height / 2);
    const parentBoundary = this.parent.getBoundingClientRect();

    const isBound = elementMiddleX > parentBoundary.left
       && elementMiddleX < parentBoundary.right
       && elementMiddleY > parentBoundary.top
       && elementMiddleY < parentBoundary.bottom;

    return this.constrain === 'normal' ? isBound : !isBound;
  };
};
