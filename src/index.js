// src/index.js
import { parseCode } from './lexer.js';
import { MemoryStore } from './vm.js';
import { CanvasRenderer } from './renderer.js';
import { EventManager } from './events.js';

export class EnglishVM {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      throw new Error(`Canvas element with ID "${canvasId}" was not found.`);
    }

    this.renderer = new CanvasRenderer(this.canvas);
    this.memory = new MemoryStore();
    this.events = new EventManager(this.canvas, (targetId) => this.handleEventTrigger(targetId));
    this.program = null;
  }

  // Reset internal memory, display buffer, and registered listeners
  reset() {
    this.memory.clear();
    this.events.clear();
    this.renderer.clear();
  }

  // Parses raw English source text and executes initial program instructions
  parseAndRun(sourceCode) {
    this.reset();
    
    // Convert source text into executable AST nodes and event blocks
    this.program = parseCode(sourceCode);

    // Apply window configuration if defined
    if (this.program.config) {
      this.renderer.resize(this.program.config.width, this.program.config.height);
    }

    // Execute root-level statements
    this.executeStatements(this.program.body);

    // Initial canvas render pass
    this.renderer.render(this.memory.getRenderList());
  }

  // Sequential statement handler
  executeStatements(statements) {
    for (const stmt of statements) {
      this.executeStatement(stmt);
    }
  }

  executeStatement(stmt) {
    switch (stmt.type) {
      case 'SET_VAR':
        this.memory.set(stmt.name, this.memory.evaluate(stmt.value));
        break;

      case 'INCREMENT_VAR':
        this.memory.increment(stmt.name, stmt.by);
        break;

      case 'UPDATE_ELEMENT':
        this.memory.updateText(stmt.elementId, this.memory.evaluate(stmt.value));
        break;

      case 'CREATE_BOX':
      case 'CREATE_TEXT':
        this.memory.addUIElement(stmt.payload);
        break;

      case 'CREATE_BUTTON':
        this.memory.addUIElement(stmt.payload);
        this.events.registerClickable(stmt.payload);
        break;
    }
  }

  // Callback executed by EventManager when a canvas collision occurs
  handleEventTrigger(targetId) {
    const eventHandler = this.program.events[targetId];
    if (eventHandler) {
      this.executeStatements(eventHandler.statements);
      // Re-render UI frame post state updates
      this.renderer.render(this.memory.getRenderList());
    }
  }
}

// Attach class to window scope for non-bundled browser scripts / CodePen CDN use
if (typeof window !== 'undefined') {
  window.EnglishVM = EnglishVM;
}
