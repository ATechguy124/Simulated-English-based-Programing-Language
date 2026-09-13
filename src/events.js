// src/events.js

/**
 * Manages click interactions and bounding-box collision detection
 * for interactive GUI components on the simulated canvas screen.
 */
export class EventManager {
  constructor(canvas, onTrigger) {
    this.canvas = canvas;
    this.onTrigger = onTrigger;
    this.clickables = [];

    // Attach native mouse click listener to the virtual canvas display
    this.canvas.addEventListener('click', (event) => this.handleClick(event));
  }

  // Clears registered clickable element memory
  clear() {
    this.clickables = [];
  }

  // Registers an interactive GUI element for collision testing
  registerClickable(element) {
    const existingIndex = this.clickables.findIndex(item => item.id === element.id);
    if (existingIndex !== -1) {
      this.clickables[existingIndex] = element;
    } else {
      this.clickables.push(element);
    }
  }

  // Calculates bounding-box collisions for mouse clicks
  handleClick(event) {
    const rect = this.canvas.getBoundingClientRect();
    
    // Scale click position relative to canvas coordinate space
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;

    const clickX = (event.clientX - rect.left) * scaleX;
    const clickY = (event.clientY - rect.top) * scaleY;

    for (const element of this.clickables) {
      if (
        clickX >= element.x &&
        clickX <= element.x + element.w &&
        clickY >= element.y &&
        clickY <= element.y + element.h
      ) {
        this.onTrigger(element.id);
      }
    }
  }
}
