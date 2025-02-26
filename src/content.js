import BubbleContainer from './components/BubbleContainer';

// Initialize when the page is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new BubbleContainer());
} else {
  new BubbleContainer();
} 