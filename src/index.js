import { parseCode } from './lexer.js';
import { VM } from './vm.js';
import { Renderer } from './renderer.js';
import { EventManager } from './events.js';

export class EnglishVM {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.renderer = new Renderer(this.canvas);
    this.vm = new VM();
    this.events = new EventManager(
      this.canvas,
      (targetId) => this.handleEvent(targetId),
      () => this.render()
    );
    this.program = null;
    this.clockInterval = null;
  }

  parseAndRun(sourceCode) {
    if (this.clockInterval) {
      clearInterval(this.clockInterval);
      this.clockInterval = null;
    }
    this.vm.reset();

    this.program = parseCode(sourceCode);
    if (this.program.config) {
      this.renderer.resize(this.program.config.width, this.program.config.height);
    }

    this.executeStatements(this.program.body);
    this.events.updateRenderList(this.vm.getRenderList());
    this.render();

    if (this.program.events['tick']) {
      this.clockInterval = setInterval(() => {
        this.executeStatements(this.program.events['tick'].statements);
        this.render();
      }, 1000);
    }
  }

  executeStatements(statements) {
    statements.forEach(stmt => this.vm.execute(stmt));
  }

  handleEvent(targetId) {
    if (this.program && this.program.events[targetId]) {
      this.executeStatements(this.program.events[targetId].statements);
      this.render();
    }
  }

  render() {
    this.renderer.render(this.events.currentRenderList);
  }
}

if (typeof window !== 'undefined') {
  window.EnglishVM = EnglishVM;
}
