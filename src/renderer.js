// src/renderer.js

/**
 * Handles all 2D canvas drawing operations for EnglishScript UI elements.
 */
export class CanvasRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
  }

  // Resizes the target canvas element
  resize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  // Clears the viewport frame
  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  // Iterates over UI memory state and renders each primitive/element
  render(uiElements) {
    this.clear();

    for (const element of uiElements) {
      switch (element.type) {
        case 'box':
          this.drawBox(element);
          break;
        case 'text':
          this.drawText(element);
          break;
        case 'button':
          this.drawButton(element);
          break;
      }
    }
  }

  // Renders filled rectangle primitive
  drawBox(box) {
    this.ctx.fillStyle = box.color || '#333333';
    this.ctx.fillRect(box.x, box.y, box.w, box.h);
  }

  // Renders text block primitive
  drawText(text) {
    this.ctx.fillStyle = text.color || '#ffffff';
    this.ctx.font = '16px monospace';
    this.ctx.textAlign = 'left';
    this.ctx.textBaseline = 'alphabetic';
    this.ctx.fillText(text.text, text.x, text.y);
  }

  // Renders interactive button with centered text label
  drawButton(btn) {
    // Draw button background
    this.ctx.fillStyle = btn.color || '#007acc';
    this.ctx.fillRect(btn.x, btn.y, btn.w, btn.h);

    // Draw button label centered inside boundaries
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 14px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(btn.text, btn.x + btn.w / 2, btn.y + btn.h / 2);

    // Reset alignment settings for downstream draw calls
    this.ctx.textAlign = 'left';
    this.ctx.textBaseline = 'alphabetic';
  }
}
