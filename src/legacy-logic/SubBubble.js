class SubBubble {
  constructor(color, index, parentElement) {
    this.element = document.createElement('div');
    this.color = color;
    this.index = index;
    
    this.init();
    parentElement.appendChild(this.element);
  }

  init() {
    this.element.className = 'sub-bubble';
    this.element.style.cssText = `
      position: absolute;
      width: 40px;
      height: 40px;
      background-color: ${this.color};
      border-radius: 50%;
      cursor: pointer;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
      transition: all 0.3s ease;
      opacity: 0;
      transform: scale(0);
      pointer-events: auto;
    `;
    
    this.element.innerHTML = '<div style="width: 16px; height: 16px; background: white; border-radius: 50%; margin: 12px;"></div>';
    
    this.element.onclick = (e) => {
      e.stopPropagation();
      console.log(`Sub-bubble ${this.index + 1} clicked`);
      // Custom click handler can be added here
    };
  }

  setPosition(x, y) {
    this.element.style.transform = `translate(${x}px, ${y}px) scale(1)`;
    this.element.style.opacity = '1';
  }

  hide() {
    this.element.style.transform = 'translate(0, 0) scale(0)';
    this.element.style.opacity = '0';
  }

  setTransition(transition) {
    this.element.style.transition = transition;
  }
}

export default SubBubble; 