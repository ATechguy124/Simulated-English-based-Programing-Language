export class EventManager {
  constructor(canvas, onClickCallback, onRedrawCallback) {
    this.canvas = canvas;
    this.onClick = onClickCallback;
    this.onRedraw = onRedrawCallback;
    this.currentRenderList = [];
    this.dragTarget = null;
    this.dragOffset = { x: 0, y: 0 };

    this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    window.addEventListener('mouseup', () => this.handleMouseUp());
  }

  getCanvasCoords(e) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (this.canvas.width / rect.width),
      y: (e.clientY - rect.top) * (this.canvas.height / rect.height)
    };
  }

  handleMouseDown(e) {
    const { x, y } = this.getCanvasCoords(e);

    for (let i = this.currentRenderList.length - 1; i >= 0; i--) {
      const el = this.currentRenderList[i];
      if (el.hidden) continue;

      const width = el.w || 100;
      const height = el.h || 30;

      if (x >= el.x && x <= el.x + width && y >= el.y && y <= el.y + height) {
        this.currentRenderList.splice(i, 1);
        this.currentRenderList.push(el);

        if (el.draggable) {
          this.dragTarget = el;
          this.dragOffset.x = x - el.x;
          this.dragOffset.y = y - el.y;
        }

        if (el.type === 'button') {
          this.onClick(el.id);
        }

        this.onRedraw();
        break;
      }
    }
  }

  handleMouseMove(e) {
    if (!this.dragTarget) return;
    const { x, y } = this.getCanvasCoords(e);
    this.dragTarget.x = x - this.dragOffset.x;
    this.dragTarget.y = y - this.dragOffset.y;
    this.onRedraw();
  }

  handleMouseUp() {
    this.dragTarget = null;
  }

  updateRenderList(elements) {
    this.currentRenderList = elements;
  }
}
