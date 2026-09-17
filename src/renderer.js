class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
  }

  resize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  drawRoundedRect(x, y, w, h, radius, fillStyle) {
    this.ctx.beginPath();
    this.ctx.roundRect(x, y, w, h, radius);
    this.ctx.fillStyle = fillStyle;
    this.ctx.fill();
  }

  render(elements) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    elements.forEach(el => {
      if (el.hidden) return;

      this.ctx.save();

      if (el.type === 'box') {
        // Soft drop shadow for UI panels
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
        this.ctx.shadowBlur = 12;
        this.ctx.shadowOffsetY = 4;
        this.drawRoundedRect(el.x, el.y, el.w, el.h, 10, el.color);
      } 
      else if (el.type === 'text') {
        this.ctx.fillStyle = el.color;
        this.ctx.font = '500 13px system-ui, sans-serif';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(el.text, el.x, el.y);
      } 
      else if (el.type === 'button') {
        // Interactive elevation effect
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
        this.ctx.shadowBlur = 8;
        this.ctx.shadowOffsetY = 3;
        
        // Button Base
        this.drawRoundedRect(el.x, el.y, el.w, el.h, 8, el.color);

        // Subtle Inner Border Overlay
        this.ctx.shadowColor = 'transparent';
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(el.x + 1, el.y + 1, el.w - 2, el.h - 2);

        // Button Label
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '600 12px system-ui, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(el.text, el.x + el.w / 2, el.y + el.h / 2);
        this.ctx.textAlign = 'left';
      }

      this.ctx.restore();
    });
  }
}
