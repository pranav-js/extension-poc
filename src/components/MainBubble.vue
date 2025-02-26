<template>
  <div 
    ref="bubbleRef"
    id="floating-bubble"
    :style="bubbleStyle"
    @mousedown="dragStart"
    @touchstart="dragStart"
  >
    <div class="inner-circle"></div>
    <slot></slot>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const emit = defineEmits(['click', 'dragStart', 'dragEnd', 'positionChange']);

const bubbleRef = ref(null);
const isDragging = ref(false);
const isVisible = ref(true);
const currentX = ref(window.innerWidth - 70);
const currentY = ref(20);
const xOffset = ref(currentX.value);
const yOffset = ref(currentY.value);
const dragStartTime = ref(0);
const dragStartX = ref(0);
const dragStartY = ref(0);
const initialX = ref(0);
const initialY = ref(0);
const scale = ref(1);

const bubbleStyle = computed(() => ({
  position: 'fixed',
  width: '50px',
  height: '50px',
  backgroundColor: isDragging.value ? '#34495E' : '#41B883',
  borderRadius: '50%',
  cursor: 'pointer',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  zIndex: 2147483647,
  display: isVisible.value ? 'block' : 'none',
  transition: isDragging.value ? 'transform 0.2s, background-color 0.2s' : 'all 0.3s ease',
  userSelect: 'none',
  WebkitUserSelect: 'none',
  touchAction: 'none',
  left: `${currentX.value}px`,
  top: `${currentY.value}px`,
  transform: `scale(${scale.value})`
}));

const dragStart = (e) => {
  e.preventDefault();
  dragStartTime.value = Date.now();
  
  if (e.type === "touchstart") {
    initialX.value = e.touches[0].clientX - xOffset.value;
    initialY.value = e.touches[0].clientY - yOffset.value;
    dragStartX.value = e.touches[0].clientX;
    dragStartY.value = e.touches[0].clientY;
  } else {
    initialX.value = e.clientX - xOffset.value;
    initialY.value = e.clientY - yOffset.value;
    dragStartX.value = e.clientX;
    dragStartY.value = e.clientY;
  }

  isDragging.value = true;
  scale.value = 1.1;
  emit('dragStart');
};

const drag = (e) => {
  if (isDragging.value) {
    e.preventDefault();

    let currentClientX, currentClientY;
    if (e.type === "touchmove") {
      currentClientX = e.touches[0].clientX;
      currentClientY = e.touches[0].clientY;
    } else {
      currentClientX = e.clientX;
      currentClientY = e.clientY;
    }

    currentX.value = currentClientX - initialX.value;
    currentY.value = currentClientY - initialY.value;

    currentX.value = Math.max(20, Math.min(window.innerWidth - 70, currentX.value));
    currentY.value = Math.max(20, Math.min(window.innerHeight - 70, currentY.value));

    xOffset.value = currentX.value;
    yOffset.value = currentY.value;

    // Emit position change
    emit('positionChange');
  }
};

const dragEnd = (e) => {
  if (!isDragging.value) return;

  let endX, endY;
  if (e.type === "touchend") {
    endX = e.changedTouches[0].clientX;
    endY = e.changedTouches[0].clientY;
  } else {
    endX = e.clientX;
    endY = e.clientY;
  }

  const moveDistance = Math.sqrt(
    Math.pow(endX - dragStartX.value, 2) + 
    Math.pow(endY - dragStartY.value, 2)
  );

  isDragging.value = false;
  scale.value = 1;
  const dragDuration = Date.now() - dragStartTime.value;

  if (moveDistance < 5 && dragDuration < 200) {
    emit('click');
  } else {
    snapToEdge();
    emit('dragEnd');
  }
};

const snapToEdge = () => {
  const rect = bubbleRef.value.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const distanceToLeft = rect.left;
  const distanceToRight = viewportWidth - rect.right;

  if (distanceToLeft < distanceToRight) {
    currentX.value = 20;
  } else {
    currentX.value = viewportWidth - rect.width - 20;
  }

  currentY.value = Math.max(20, Math.min(window.innerHeight - rect.height - 20, currentY.value));
  xOffset.value = currentX.value;
  yOffset.value = currentY.value;

  // Emit position change after snap
  emit('positionChange');
};

const setScale = (newScale) => {
  scale.value = newScale;
};

const toggle = () => {
  isVisible.value = !isVisible.value;
  if (isVisible.value) {
    snapToEdge();
  }
};

const getPosition = () => {
  const rect = bubbleRef.value.getBoundingClientRect();
  return {
    left: rect.left,
    right: rect.right,
    top: rect.top,
    bottom: rect.bottom,
    width: rect.width
  };
};

onMounted(() => {
  document.addEventListener('mousemove', drag);
  document.addEventListener('touchmove', drag, { passive: false });
  document.addEventListener('mouseup', dragEnd);
  document.addEventListener('touchend', dragEnd);
  window.addEventListener('resize', () => {
    if (isVisible.value) {
      snapToEdge();
    }
  });
});

onUnmounted(() => {
  document.removeEventListener('mousemove', drag);
  document.removeEventListener('touchmove', drag);
  document.removeEventListener('mouseup', dragEnd);
  document.removeEventListener('touchend', dragEnd);
  window.removeEventListener('resize', snapToEdge);
});

defineExpose({
  setScale,
  toggle,
  getPosition,
  snapToEdge
});
</script>

<style scoped>
.inner-circle {
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  margin: 15px;
}
</style> 