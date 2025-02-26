class MainBubble {
  constructor() {
    this.element = document.createElement('div');
    this.element.id = 'floating-bubble';
    this.isExpanded = false;
    this.isDragging = false;
    this.currentX = window.innerWidth - 70;
    this.currentY = 20;
    this.xOffset = this.currentX;
    this.yOffset = this.currentY;
    
    this.init();
    this.setupEventListeners();
    document.body.appendChild(this.element);
  }

  init() {
    this.element.style.cssText = `
      position: fixed;
      width: 50px;
      height: 50px;
      background-color: #41B883;
      border-radius: 50%;
      cursor: pointer;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      z-index: 2147483647;
      display: none;
      transition: all 0.3s ease;
      user-select: none;
      -webkit-user-select: none;
      touch-action: none;
      left: ${this.currentX}px;
      top: ${this.currentY}px;
    `;

    this.element.innerHTML = '<div style="width: 20px; height: 20px; background: white; border-radius: 50%; margin: 15px;"></div>';
  }

  setupEventListeners() {
    this.element.addEventListener('mousedown', this.dragStart.bind(this), { passive: false });
    this.element.addEventListener('touchstart', this.dragStart.bind(this), { passive: false });
    
    document.addEventListener('mousemove', this.drag.bind(this), { passive: false });
    document.addEventListener('touchmove', this.drag.bind(this), { passive: false });
    
    document.addEventListener('mouseup', this.dragEnd.bind(this));
    document.addEventListener('touchend', this.dragEnd.bind(this));
    
    this.element.addEventListener('selectstart', (e) => e.preventDefault());
    
    window.addEventListener('resize', () => {
      if (this.element.style.display !== 'none') {
        this.snapToEdge();
      }
    });
  }

  dragStart(e) {
    e.preventDefault();
    this.dragStartTime = Date.now();
    
    if (e.type === "touchstart") {
      this.initialX = e.touches[0].clientX - this.xOffset;
      this.initialY = e.touches[0].clientY - this.yOffset;
      this.dragStartX = e.touches[0].clientX;
      this.dragStartY = e.touches[0].clientY;
    } else {
      this.initialX = e.clientX - this.xOffset;
      this.initialY = e.clientY - this.yOffset;
      this.dragStartX = e.clientX;
      this.dragStartY = e.clientY;
    }

    if (e.target === this.element || this.element.contains(e.target)) {
      this.isDragging = true;
      this.element.style.transition = 'transform 0.2s, background-color 0.2s';
      this.element.style.transform = 'scale(1.1)';
      this.element.style.backgroundColor = '#34495E';
      
      if (this.onDragStart) {
        this.onDragStart();
      }
    }
  }

  drag(e) {
    if (this.isDragging) {
      e.preventDefault();

      let currentClientX, currentClientY;
      if (e.type === "touchmove") {
        currentClientX = e.touches[0].clientX;
        currentClientY = e.touches[0].clientY;
      } else {
        currentClientX = e.clientX;
        currentClientY = e.clientY;
      }

      this.currentX = currentClientX - this.initialX;
      this.currentY = currentClientY - this.initialY;

      this.currentX = Math.max(20, Math.min(window.innerWidth - 70, this.currentX));
      this.currentY = Math.max(20, Math.min(window.innerHeight - 70, this.currentY));

      this.xOffset = this.currentX;
      this.yOffset = this.currentY;

      this.element.style.transition = 'none';
      this.element.style.left = `${this.currentX}px`;
      this.element.style.top = `${this.currentY}px`;
    }
  }

  dragEnd(e) {
    if (!this.isDragging) return;

    let endX, endY;
    if (e.type === "touchend") {
      endX = e.changedTouches[0].clientX;
      endY = e.changedTouches[0].clientY;
    } else {
      endX = e.clientX;
      endY = e.clientY;
    }

    const moveDistance = Math.sqrt(
      Math.pow(endX - this.dragStartX, 2) + 
      Math.pow(endY - this.dragStartY, 2)
    );

    this.isDragging = false;
    const dragDuration = Date.now() - this.dragStartTime;

    this.element.style.transition = 'all 0.2s ease';
    this.element.style.backgroundColor = '#41B883';

    if (moveDistance < 5 && dragDuration < 200) {
      if (this.onClick) {
        this.onClick();
      }
    } else {
      this.snapToEdge();
      if (this.onDragEnd) {
        this.onDragEnd();
      }
    }
  }

  snapToEdge() {
    const rect = this.element.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const distanceToLeft = rect.left;
    const distanceToRight = viewportWidth - rect.right;

    if (distanceToLeft < distanceToRight) {
      this.currentX = 20;
    } else {
      this.currentX = viewportWidth - rect.width - 20;
    }

    this.currentY = Math.max(20, Math.min(window.innerHeight - rect.height - 20, this.currentY));

    this.element.style.transition = 'all 0.2s ease';
    this.element.style.left = `${this.currentX}px`;
    this.element.style.top = `${this.currentY}px`;
    
    this.xOffset = this.currentX;
    this.yOffset = this.currentY;
  }

  setScale(scale) {
    this.element.style.transform = `scale(${scale})`;
  }

  toggle() {
    this.element.style.display = this.element.style.display === 'none' ? 'block' : 'none';
    if (this.element.style.display === 'block') {
      this.snapToEdge();
    }
  }

  getPosition() {
    const rect = this.element.getBoundingClientRect();
    return {
      left: rect.left,
      right: rect.right,
      top: rect.top,
      bottom: rect.bottom,
      width: rect.width
    };
  }
}

export default MainBubble; 