export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
  }

  resize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  render(elements) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    elements.forEach(el => {
      if (el.hidden) return;

      if (el.type === 'box') {
        this.ctx.fillStyle = el.color;
        this.ctx.fillRect(el.x, el.y, el.w, el.h);
      } else if (el.type === 'text') {
        this.ctx.fillStyle = el.color;
        this.ctx.font = '14px system-ui, sans-serif';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(el.text, el.x, el.y);
      } else if (el.type === 'button') {
        this.ctx.fillStyle = el.color;
        this.ctx.fillRect(el.x, el.y, el.w, el.h);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 13px system-ui, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(el.text, el.x + el.w / 2, el.y + el.h / 2);
        this.ctx.textAlign = 'left';
      }
    });
  }
}
