import MainBubble from './MainBubble';
import SubBubble from './SubBubble';

class BubbleContainer {
  constructor() {
    this.subBubbleColors = ['#FF6B6B', '#4ECDC4', '#45B7D1'];
    this.isExpanded = false;
    
    this.init();
    this.setupMessageListener();
  }

  init() {
    // Create container for sub-bubbles
    this.subBubblesContainer = document.createElement('div');
    this.subBubblesContainer.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 2147483646;
    `;

    // Initialize main bubble
    this.mainBubble = new MainBubble();
    this.mainBubble.element.appendChild(this.subBubblesContainer);
    
    // Set up click handler for main bubble
    this.mainBubble.onClick = () => this.toggleSubBubbles();
    this.mainBubble.onDragStart = () => this.hideSubBubbles();
    this.mainBubble.onDragEnd = () => {
      if (this.isExpanded) {
        this.showSubBubblesWithDelay();
      }
    };

    // Initialize sub-bubbles
    this.subBubbles = this.subBubbleColors.map((color, index) => 
      new SubBubble(color, index, this.subBubblesContainer)
    );
  }

  toggleSubBubbles() {
    const position = this.mainBubble.getPosition();
    const isOnLeftEdge = position.left < 100;
    const isOnRightEdge = window.innerWidth - position.right < 100;
    const isCenter = !isOnLeftEdge && !isOnRightEdge;
    
    if (!this.isExpanded) {
      this.mainBubble.setScale(1.5);
      this.showSubBubbles(isCenter, isOnLeftEdge, isOnRightEdge);
    } else {
      this.mainBubble.setScale(1);
      this.hideSubBubbles();
    }
    
    this.isExpanded = !this.isExpanded;
  }

  showSubBubbles(isCenter, isOnLeftEdge, isOnRightEdge) {
    this.subBubbles.forEach((subBubble, index) => {
      let angle;
      const radius = 80;
      
      if (isCenter) {
        angle = -Math.PI / 2 + (Math.PI / (this.subBubbles.length - 1)) * index;
      } else if (isOnLeftEdge) {
        angle = -Math.PI / 4 + (Math.PI / 2 / (this.subBubbles.length - 1)) * index;
      } else {
        angle = 3 * Math.PI / 4 + (Math.PI / 2 / (this.subBubbles.length - 1)) * index;
      }
      
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      subBubble.setPosition(x, y);
    });
  }

  hideSubBubbles() {
    this.subBubbles.forEach(subBubble => {
      subBubble.hide();
    });
  }

  showSubBubblesWithDelay() {
    setTimeout(() => {
      const position = this.mainBubble.getPosition();
      const isOnLeftEdge = position.left < 100;
      const isOnRightEdge = window.innerWidth - position.right < 100;
      const isCenter = !isOnLeftEdge && !isOnRightEdge;
      
      this.showSubBubbles(isCenter, isOnLeftEdge, isOnRightEdge);
    }, 100);
  }

  setupMessageListener() {
    chrome.runtime.onMessage.addListener((request) => {
      if (request.action === 'toggle') {
        this.mainBubble.toggle();
        if (this.isExpanded) {
          this.toggleSubBubbles();
        }
      }
    });
  }
}

export default BubbleContainer; 