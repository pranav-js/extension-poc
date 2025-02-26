<template>
  <div 
    class="sub-bubble"
    :style="bubbleStyle"
    @click.stop="handleClick"
  >
    <div class="inner-circle"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  color: {
    type: String,
    required: true
  },
  index: {
    type: Number,
    required: true
  },
  position: {
    type: Object,
    default: () => ({ x: 0, y: 0 })
  },
  visible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['click']);

const bubbleStyle = computed(() => ({
  position: 'absolute',
  width: '40px',
  height: '40px',
  backgroundColor: props.color,
  borderRadius: '50%',
  cursor: 'pointer',
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
  transition: 'all 0.3s ease',
  opacity: props.visible ? '1' : '0',
  transform: props.visible 
    ? `translate(${props.position.x}px, ${props.position.y}px) scale(1)` 
    : 'translate(0, 0) scale(0)',
  pointerEvents: 'auto'
}));

const handleClick = (e) => {
  e.stopPropagation();
  console.log(`Sub-bubble ${props.index + 1} clicked`);
  emit('click', props.index);
};
</script>

<style scoped>
.sub-bubble {
  will-change: transform, opacity;
}

.inner-circle {
  width: 16px;
  height: 16px;
  background: white;
  border-radius: 50%;
  margin: 12px;
  transition: transform 0.2s ease;
}

.sub-bubble:hover .inner-circle {
  transform: scale(0.9);
}
</style> 