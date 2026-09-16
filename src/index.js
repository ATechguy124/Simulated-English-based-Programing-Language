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

    this.vm.onLaunchApp = (appName) => this.loadApp(appName);
    this.vm.onRunPyFile = (fileName, outputVar) => this.loadAndRunPy(fileName, outputVar);

    this.initPyodide();
  }

  async initPyodide() {
    if (typeof loadPyodide !== 'undefined' && !window.pyodide) {
      try {
        window.pyodide = await loadPyodide();
      } catch (err) {
        console.error("Failed to initialize Pyodide:", err);
      }
    }
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

  async loadApp(appName) {
    const repoBase = 'https://cdn.jsdelivr.net/gh/ATechguy124/Simulated-English-based-Programing-Language@main/examples';
    try {
      const response = await fetch(`${repoBase}/${appName}.eng`);
      if (!response.ok) throw new Error(`App file '${appName}.eng' not found.`);
      const sourceCode = await response.text();
      this.parseAndRun(sourceCode);
    } catch (err) {
      console.error('Failed to load EnglishScript app:', err.message);
    }
  }

  async loadAndRunPy(fileName, outputVar) {
    const repoBase = 'https://cdn.jsdelivr.net/gh/ATechguy124/Simulated-English-based-Programing-Language@main/examples';
    try {
      const response = await fetch(`${repoBase}/${fileName}.py`);
      if (!response.ok) throw new Error(`File '${fileName}.py' not found.`);
      const pyCode = await response.text();

      if (window.pyodide) {
        const res = window.pyodide.runPython(pyCode);
        this.vm.state[outputVar] = res !== undefined ? String(res) : "OK";
        this.render();
      }
    } catch (err) {
      this.vm.state[outputVar] = "Fetch Error: " + err.message;
      this.render();
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
