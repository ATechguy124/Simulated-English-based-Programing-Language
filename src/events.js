export class EventManager {
  constructor(canvas, onClickCallback) {
    this.canvas = canvas;
    this.onClick = onClickCallback;
    this.currentRenderList = [];

    this.canvas.addEventListener('click', (e) => this.handleClick(e));
  }

  handleClick(event) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;

    const clickX = (event.clientX - rect.left) * scaleX;
    const clickY = (event.clientY - rect.top) * scaleY;

    // Check top-most visible elements first
    for (let i = this.currentRenderList.length - 1; i >= 0; i--) {
      const el = this.currentRenderList[i];
      if (el.hidden) continue;

      if (el.type === 'button' || el.type === 'box') {
        if (
          clickX >= el.x &&
          clickX <= el.x + el.w &&
          clickY >= el.y &&
          clickY <= el.y + el.h
        ) {
          this.onClick(el.id);
          break;
        }
      }
    }
  }

  updateRenderList(elements) {
    this.currentRenderList = elements;
  }
}
