import { createApp } from 'vue'
import BubbleContainer from './components/BubbleContainer.vue'

// Create container for the Vue app
const container = document.createElement('div')
container.id = 'floating-bubble-app'
document.body.appendChild(container)

// Initialize Vue app when the page is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp)
} else {
  initializeApp()
}

function initializeApp() {
  const app = createApp(BubbleContainer)
  app.mount('#floating-bubble-app')
} 