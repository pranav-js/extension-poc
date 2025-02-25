// Create and initialize the floating bubble
function createBubble() {
  // Create the bubble element
  const bubble = document.createElement('div');
  bubble.id = 'floating-bubble';
  
  // Style the bubble
  bubble.style.cssText = `
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
  `;

  // Add inner circle
  bubble.innerHTML = '<div style="width: 20px; height: 20px; background: white; border-radius: 50%; margin: 15px;"></div>';

  // Create container for sub-bubbles
  const subBubblesContainer = document.createElement('div');
  subBubblesContainer.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 2147483646;
  `;
  bubble.appendChild(subBubblesContainer);

  // Create sub-bubbles
  const subBubbleColors = ['#FF6B6B', '#4ECDC4', '#45B7D1'];
  const subBubbles = subBubbleColors.map((color, index) => {
    const subBubble = document.createElement('div');
    subBubble.className = 'sub-bubble';
    subBubble.style.cssText = `
      position: absolute;
      width: 40px;
      height: 40px;
      background-color: ${color};
      border-radius: 50%;
      cursor: pointer;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
      transition: all 0.3s ease;
      opacity: 0;
      transform: scale(0);
      pointer-events: auto;
    `;
    subBubble.innerHTML = '<div style="width: 16px; height: 16px; background: white; border-radius: 50%; margin: 12px;"></div>';
    subBubblesContainer.appendChild(subBubble);
    return subBubble;
  });

  // Add to page
  document.body.appendChild(bubble);

  // Dragging functionality
  let isDragging = false;
  let isExpanded = false;
  let currentX = window.innerWidth - 70;
  let currentY = 20;
  let initialX;
  let initialY;
  let xOffset = currentX;
  let yOffset = currentY;
  let dragStartTime = 0;
  let dragStartX = 0;
  let dragStartY = 0;
  const snapThreshold = 100;
  const clickThreshold = 200; // ms to distinguish between click and drag
  const moveThreshold = 5; // pixels to distinguish between click and drag

  // Set initial position
  bubble.style.left = `${currentX}px`;
  bubble.style.top = `${currentY}px`;

  function toggleSubBubbles() {
    const rect = bubble.getBoundingClientRect();
    const isOnLeftEdge = rect.left < 100;
    const isOnRightEdge = window.innerWidth - rect.right < 100;
    const isCenter = !isOnLeftEdge && !isOnRightEdge;
    
    if (!isExpanded) {
      // Expand main bubble
      bubble.style.transform = 'scale(1.5)';
      
      // Show sub-bubbles with circular arrangement
      subBubbles.forEach((subBubble, index) => {
        let angle;
        let radius = 80; // Distance from main bubble
        
        if (isCenter) {
          // Semicircle arrangement when in center (180 degrees)
          angle = -Math.PI / 2 + (Math.PI / (subBubbles.length - 1)) * index;
        } else if (isOnLeftEdge) {
          // Quarter circle on right when on left edge (90 degrees)
          angle = -Math.PI / 4 + (Math.PI / 2 / (subBubbles.length - 1)) * index;
        } else {
          // Quarter circle on left when on right edge (90 degrees)
          angle = 3 * Math.PI / 4 + (Math.PI / 2 / (subBubbles.length - 1)) * index;
        }
        
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        subBubble.style.transform = `translate(${x}px, ${y}px) scale(1)`;
        subBubble.style.opacity = '1';
        
        // Make sub-bubbles clickable
        subBubble.onclick = (e) => {
          e.stopPropagation();
          console.log(`Sub-bubble ${index + 1} clicked`);
          // You can add specific functions for each sub-bubble here
        };
      });
    } else {
      // Collapse main bubble
      bubble.style.transform = 'scale(1)';
      
      // Hide sub-bubbles with animation
      subBubbles.forEach(subBubble => {
        subBubble.style.transform = 'translate(0, 0) scale(0)';
        subBubble.style.opacity = '0';
      });
    }
    
    isExpanded = !isExpanded;
  }

  function snapToEdge() {
    const rect = bubble.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const distanceToLeft = rect.left;
    const distanceToRight = viewportWidth - rect.right;

    // Determine which edge is closer
    if (distanceToLeft < distanceToRight) {
      currentX = 20;
    } else {
      currentX = viewportWidth - rect.width - 20;
    }

    // Keep vertical position within bounds
    currentY = Math.max(20, Math.min(window.innerHeight - rect.height - 20, currentY));

    // Apply the new position with smooth animation
    bubble.style.transition = 'all 0.2s ease';
    bubble.style.left = `${currentX}px`;
    bubble.style.top = `${currentY}px`;
    
    xOffset = currentX;
    yOffset = currentY;
  }

  function dragStart(e) {
    e.preventDefault();
    dragStartTime = Date.now();
    
    if (e.type === "touchstart") {
      initialX = e.touches[0].clientX - xOffset;
      initialY = e.touches[0].clientY - yOffset;
      dragStartX = e.touches[0].clientX;
      dragStartY = e.touches[0].clientY;
    } else {
      initialX = e.clientX - xOffset;
      initialY = e.clientY - yOffset;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
    }

    if (e.target === bubble || bubble.contains(e.target)) {
      isDragging = true;
      bubble.style.transition = 'transform 0.2s, background-color 0.2s';
      bubble.style.transform = 'scale(1.1)';
      bubble.style.backgroundColor = '#34495E';

      // Temporarily hide sub-bubbles during drag without changing state
      if (isExpanded) {
        subBubbles.forEach(subBubble => {
          subBubble.style.transition = 'none';
          subBubble.style.transform = 'translate(0, 0) scale(0)';
          subBubble.style.opacity = '0';
        });
      }
    }
  }

  function drag(e) {
    if (isDragging) {
      e.preventDefault();

      let currentClientX, currentClientY;
      if (e.type === "touchmove") {
        currentClientX = e.touches[0].clientX;
        currentClientY = e.touches[0].clientY;
        currentX = currentClientX - initialX;
        currentY = currentClientY - initialY;
      } else {
        currentClientX = e.clientX;
        currentClientY = e.clientY;
        currentX = currentClientX - initialX;
        currentY = currentClientY - initialY;
      }

      currentX = Math.max(20, Math.min(window.innerWidth - 70, currentX));
      currentY = Math.max(20, Math.min(window.innerHeight - 70, currentY));

      xOffset = currentX;
      yOffset = currentY;

      bubble.style.transition = 'none';
      bubble.style.left = `${currentX}px`;
      bubble.style.top = `${currentY}px`;
    }
  }

  function dragEnd(e) {
    if (!isDragging) return;

    let endX, endY;
    if (e.type === "touchend") {
      endX = e.changedTouches[0].clientX;
      endY = e.changedTouches[0].clientY;
    } else {
      endX = e.clientX;
      endY = e.clientY;
    }

    const moveDistance = Math.sqrt(
      Math.pow(endX - dragStartX, 2) + 
      Math.pow(endY - dragStartY, 2)
    );

    isDragging = false;
    const wasExpanded = isExpanded;
    const dragDuration = Date.now() - dragStartTime;

    // Reset bubble appearance immediately
    bubble.style.transition = 'all 0.2s ease';
    bubble.style.backgroundColor = '#41B883';

    // If it was a short movement and short duration, treat as click
    if (moveDistance < moveThreshold && dragDuration < clickThreshold) {
      toggleSubBubbles();
    } else {
      // Snap to edge
      snapToEdge();
      
      // Set the correct scale after snapping
      requestAnimationFrame(() => {
        bubble.style.transform = wasExpanded ? 'scale(1.5)' : 'scale(1)';
        
        // If it was expanded, restore sub-bubbles
        if (wasExpanded) {
          setTimeout(() => {
            // Re-show sub-bubbles in new position
            const rect = bubble.getBoundingClientRect();
            const isOnLeftEdge = rect.left < 100;
            const isOnRightEdge = window.innerWidth - rect.right < 100;
            const isCenter = !isOnLeftEdge && !isOnRightEdge;
            
            subBubbles.forEach((subBubble, index) => {
              subBubble.style.transition = 'all 0.2s ease';
              let angle;
              let radius = 80;
              
              if (isCenter) {
                angle = -Math.PI / 2 + (Math.PI / (subBubbles.length - 1)) * index;
              } else if (isOnLeftEdge) {
                angle = -Math.PI / 4 + (Math.PI / 2 / (subBubbles.length - 1)) * index;
              } else {
                angle = 3 * Math.PI / 4 + (Math.PI / 2 / (subBubbles.length - 1)) * index;
              }
              
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              
              subBubble.style.transform = `translate(${x}px, ${y}px) scale(1)`;
              subBubble.style.opacity = '1';
            });
          }, 100);
        }
      });
    }
  }

  // Event listeners
  bubble.addEventListener('mousedown', dragStart, { passive: false });
  bubble.addEventListener('touchstart', dragStart, { passive: false });
  
  document.addEventListener('mousemove', drag, { passive: false });
  document.addEventListener('touchmove', drag, { passive: false });
  
  document.addEventListener('mouseup', dragEnd);
  document.addEventListener('touchend', dragEnd);
  
  bubble.addEventListener('selectstart', (e) => e.preventDefault());

  // Listen for toggle message
  chrome.runtime.onMessage.addListener((request) => {
    if (request.action === 'toggle') {
      bubble.style.display = bubble.style.display === 'none' ? 'block' : 'none';
      if (bubble.style.display === 'block') {
        snapToEdge();
      } else if (isExpanded) {
        toggleSubBubbles();
      }
    }
  });

  // Handle window resize
  window.addEventListener('resize', () => {
    if (bubble.style.display !== 'none') {
      snapToEdge();
    }
  });
}

// Initialize when the page is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createBubble);
} else {
  createBubble();
} 