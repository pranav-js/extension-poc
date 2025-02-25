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
    cursor: move;
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

  // Add to page
  document.body.appendChild(bubble);

  // Dragging functionality
  let isDragging = false;
  let currentX = window.innerWidth - 70; // Initial X position (right side)
  let currentY = 20; // Initial Y position
  let initialX;
  let initialY;
  let xOffset = currentX;
  let yOffset = currentY;
  const snapThreshold = 100; // Distance from edge to trigger snap

  // Set initial position
  bubble.style.left = `${currentX}px`;
  bubble.style.top = `${currentY}px`;

  function snapToEdge() {
    const rect = bubble.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const distanceToLeft = rect.left;
    const distanceToRight = viewportWidth - rect.right;

    // Determine which edge is closer
    if (distanceToLeft < distanceToRight) {
      // Snap to left edge
      currentX = 20;
    } else {
      // Snap to right edge
      currentX = viewportWidth - rect.width - 20;
    }

    // Keep vertical position within bounds
    currentY = Math.max(20, Math.min(window.innerHeight - rect.height - 20, currentY));

    // Apply the new position with smooth animation
    bubble.style.transition = 'all 0.3s ease';
    bubble.style.left = `${currentX}px`;
    bubble.style.top = `${currentY}px`;
    
    // Update offsets
    xOffset = currentX;
    yOffset = currentY;

    // Reset transition after animation
    setTimeout(() => {
      bubble.style.transition = 'transform 0.2s, background-color 0.2s';
    }, 300);
  }

  function dragStart(e) {
    e.preventDefault();
    
    if (e.type === "touchstart") {
      initialX = e.touches[0].clientX - xOffset;
      initialY = e.touches[0].clientY - yOffset;
    } else {
      initialX = e.clientX - xOffset;
      initialY = e.clientY - yOffset;
    }

    if (e.target === bubble || bubble.contains(e.target)) {
      isDragging = true;
      bubble.style.transform = 'scale(1.1)';
      bubble.style.backgroundColor = '#34495E';
      bubble.style.transition = 'transform 0.2s, background-color 0.2s';
    }
  }

  function drag(e) {
    if (isDragging) {
      e.preventDefault();

      if (e.type === "touchmove") {
        currentX = e.touches[0].clientX - initialX;
        currentY = e.touches[0].clientY - initialY;
      } else {
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
      }

      // Keep bubble within viewport bounds with padding
      currentX = Math.max(20, Math.min(window.innerWidth - 70, currentX));
      currentY = Math.max(20, Math.min(window.innerHeight - 70, currentY));

      xOffset = currentX;
      yOffset = currentY;

      // Update position without transition during drag
      bubble.style.transition = 'none';
      bubble.style.left = `${currentX}px`;
      bubble.style.top = `${currentY}px`;
    }
  }

  function dragEnd(e) {
    if (!isDragging) return;
    
    isDragging = false;
    bubble.style.transform = 'scale(1)';
    bubble.style.backgroundColor = '#41B883';

    // Snap to nearest edge
    snapToEdge();
  }

  // Event listeners
  bubble.addEventListener('mousedown', dragStart, { passive: false });
  bubble.addEventListener('touchstart', dragStart, { passive: false });
  
  document.addEventListener('mousemove', drag, { passive: false });
  document.addEventListener('touchmove', drag, { passive: false });
  
  document.addEventListener('mouseup', dragEnd);
  document.addEventListener('touchend', dragEnd);
  
  // Prevent text selection when dragging
  bubble.addEventListener('selectstart', (e) => e.preventDefault());

  // Listen for toggle message
  chrome.runtime.onMessage.addListener((request) => {
    if (request.action === 'toggle') {
      bubble.style.display = bubble.style.display === 'none' ? 'block' : 'none';
      if (bubble.style.display === 'block') {
        snapToEdge(); // Ensure proper positioning when showing
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