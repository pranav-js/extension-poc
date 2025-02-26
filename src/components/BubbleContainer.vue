<template>
  <MainBubble 
    ref="mainBubbleRef" 
    @click="toggleSubBubbles" 
    @dragStart="hideSubBubbles" 
    @dragEnd="handleDragEnd"
    @positionChange="checkAndUpdatePosition"
  >
    <div 
      class="sub-bubbles-container"
      :data-edge="edgePosition"
    >
      <SubBubble
        v-for="(color, index) in subBubbleColors"
        :key="index"
        :color="color"
        :index="index"
        :position="subBubblePositions[index]"
        :visible="isExpanded"
        @click="handleSubBubbleClick"
      />
    </div>
  </MainBubble>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import MainBubble from './MainBubble.vue';
import SubBubble from './SubBubble.vue';

const mainBubbleRef = ref(null);
const isExpanded = ref(false);
const subBubbleColors = ['#FF6B6B', '#4ECDC4', '#45B7D1'];
const currentEdge = ref('unknown');

const checkAndUpdatePosition = () => {
  if (!mainBubbleRef.value) return;
  const position = mainBubbleRef.value.getPosition();
  const isOnLeftEdge = position.left < 100;
  const isOnRightEdge = window.innerWidth - position.right < 100;
  currentEdge.value = isOnLeftEdge ? 'left' : isOnRightEdge ? 'right' : 'center';
};

const edgePosition = computed(() => currentEdge.value);

const subBubblePositions = computed(() => {
  if (!mainBubbleRef.value) return subBubbleColors.map(() => ({ x: 0, y: 0 }));
  
  return subBubbleColors.map((_, index) => {
    let angle;
    const radius = 80;
    
    if (currentEdge.value === 'center') {
      // When in center, spread upward (-90° to 90°)
      angle = -Math.PI / 2 + (Math.PI / (subBubbleColors.length - 1)) * index;
    } else if (currentEdge.value === 'left') {
      // When on left edge, spread to the right (-45° to 45°)
      angle = -Math.PI / 4 + (Math.PI / 2 / (subBubbleColors.length - 1)) * index;
    } else {
      // When on right edge, spread to the left (135° to 225°)
      angle = 3 * Math.PI / 4 + (Math.PI / 2 / (subBubbleColors.length - 1)) * index;
    }
    
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius
    };
  });
});

const toggleSubBubbles = () => {
  checkAndUpdatePosition(); // Update position when toggling
  if (!isExpanded.value) {
    mainBubbleRef.value.setScale(1.5);
    isExpanded.value = true;
  } else {
    mainBubbleRef.value.setScale(1);
    isExpanded.value = false;
  }
};

const hideSubBubbles = () => {
  isExpanded.value = false;
  mainBubbleRef.value.setScale(1);
};

const handleDragEnd = () => {
  if (isExpanded.value) {
    setTimeout(() => {
      mainBubbleRef.value.setScale(1.5);
    }, 100);
  }
  // Check position after drag ends and snapping occurs
  setTimeout(checkAndUpdatePosition, 200);
};

const handleSubBubbleClick = (index) => {
  console.log(`Sub-bubble ${index + 1} clicked`);
  hideSubBubbles();
};

// Chrome extension message listener
chrome.runtime.onMessage.addListener((request) => {
  if (request.action === 'toggle') {
    mainBubbleRef.value.toggle();
    if (isExpanded.value) {
      hideSubBubbles();
    }
  }
});
</script>

<style scoped>
.sub-bubbles-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2147483646;
}
</style> 