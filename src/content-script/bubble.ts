class FloatingBubble {
  private bubble: HTMLDivElement;
  private isDragging = false;
  private currentX = 0;
  private currentY = 0;
  private initialX = 0;
  private initialY = 0;
  private xOffset = 0;
  private yOffset = 0;

  constructor() {
    console.log('FloatingBubble: Initializing...');
    this.bubble = document.createElement('div');
    this.setupBubble();
    this.attachEventListeners();
    this.hide(); // Initially hidden
    console.log('FloatingBubble: Initialization complete');
  }

  private setupBubble() {
    this.bubble.id = 'vue-extension-bubble';
    this.bubble.style.cssText = `
      position: fixed;
      width: 50px;
      height: 50px;
      background-color: #41B883;
      border-radius: 50%;
      cursor: move;
      touch-action: none;
      user-select: none;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      z-index: 2147483647;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s, background-color 0.2s, opacity 0.3s;
      top: 20px;
      right: 20px;
    `;

    // Add a visible content to the bubble
    this.bubble.innerHTML = '<div style="width: 20px; height: 20px; background: white; border-radius: 50%;"></div>';

    // Set initial position
    this.currentX = window.innerWidth - 100;
    this.currentY = 20;
    this.setTranslate(this.currentX, this.currentY);

    // Remove any existing bubble before adding the new one
    const existingBubble = document.getElementById('vue-extension-bubble');
    if (existingBubble) {
      existingBubble.remove();
    }

    document.body.appendChild(this.bubble);
    console.log('FloatingBubble: Bubble element created and added to DOM');
  }

  private attachEventListeners() {
    try {
      this.bubble.addEventListener('mousedown', this.dragStart.bind(this));
      document.addEventListener('mousemove', this.drag.bind(this));
      document.addEventListener('mouseup', this.dragEnd.bind(this));

      // Touch events for mobile
      this.bubble.addEventListener('touchstart', this.dragStart.bind(this));
      document.addEventListener('touchmove', this.drag.bind(this));
      document.addEventListener('touchend', this.dragEnd.bind(this));

      // Prevent the bubble from going outside the viewport
      window.addEventListener('resize', () => {
        this.keepInViewport();
      });

      // Listen for messages from the background script
      chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        console.log('FloatingBubble: Received message:', message);
        if (message.type === 'TOGGLE_BUBBLE') {
          if (message.isActive) {
            this.show();
          } else {
            this.hide();
          }
          sendResponse({ success: true });
        }
        return true; // Keep the message channel open for sendResponse
      });

      console.log('FloatingBubble: Event listeners attached');
    } catch (error) {
      console.error('FloatingBubble: Error attaching event listeners:', error);
    }
  }

  private show() {
    console.log('FloatingBubble: Showing bubble');
    this.bubble.style.display = 'flex';
    this.bubble.style.opacity = '1';
  }

  private hide() {
    console.log('FloatingBubble: Hiding bubble');
    this.bubble.style.opacity = '0';
    setTimeout(() => {
      this.bubble.style.display = 'none';
    }, 300);
  }

  private dragStart(e: MouseEvent | TouchEvent) {
    if (e.type === 'touchstart') {
      const touch = (e as TouchEvent).touches[0];
      this.initialX = touch.clientX - this.xOffset;
      this.initialY = touch.clientY - this.yOffset;
    } else {
      this.initialX = (e as MouseEvent).clientX - this.xOffset;
      this.initialY = (e as MouseEvent).clientY - this.yOffset;
    }

    if (e.target === this.bubble || this.bubble.contains(e.target as Node)) {
      this.isDragging = true;
      this.bubble.style.transform = this.bubble.style.transform + ' scale(1.1)';
      this.bubble.style.backgroundColor = '#34495E';
    }
  }

  private drag(e: MouseEvent | TouchEvent) {
    if (this.isDragging) {
      e.preventDefault();
      
      if (e.type === 'touchmove') {
        const touch = (e as TouchEvent).touches[0];
        this.currentX = touch.clientX - this.initialX;
        this.currentY = touch.clientY - this.initialY;
      } else {
        this.currentX = (e as MouseEvent).clientX - this.initialX;
        this.currentY = (e as MouseEvent).clientY - this.initialY;
      }

      this.xOffset = this.currentX;
      this.yOffset = this.currentY;

      this.setTranslate(this.currentX, this.currentY);
    }
  }

  private dragEnd() {
    this.initialX = this.currentX;
    this.initialY = this.currentY;
    this.isDragging = false;
    this.bubble.style.transform = `translate3d(${this.currentX}px, ${this.currentY}px, 0) scale(1)`;
    this.bubble.style.backgroundColor = '#41B883';
    this.keepInViewport();
  }

  private setTranslate(xPos: number, yPos: number) {
    this.bubble.style.transform = `translate3d(${xPos}px, ${yPos}px, 0) ${this.isDragging ? 'scale(1.1)' : ''}`;
  }

  private keepInViewport() {
    const rect = this.bubble.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (rect.right > viewportWidth) {
      this.currentX = viewportWidth - rect.width;
    }
    if (rect.left < 0) {
      this.currentX = 0;
    }
    if (rect.bottom > viewportHeight) {
      this.currentY = viewportHeight - rect.height;
    }
    if (rect.top < 0) {
      this.currentY = 0;
    }

    this.xOffset = this.currentX;
    this.yOffset = this.currentY;
    this.setTranslate(this.currentX, this.currentY);
  }
}

// Ensure the content script runs
console.log('Content script loaded, creating FloatingBubble...');
try {
  // Wait for the DOM to be fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      new FloatingBubble();
      console.log('FloatingBubble created successfully on DOMContentLoaded');
    });
  } else {
    new FloatingBubble();
    console.log('FloatingBubble created successfully immediately');
  }
} catch (error) {
  console.error('Error creating FloatingBubble:', error);
} 