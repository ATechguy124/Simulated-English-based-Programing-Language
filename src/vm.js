// src/vm.js

/**
 * Manages runtime memory, variable storage, expression evaluation,
 * and UI state trees for the EnglishScript Virtual Machine.
 */
export class MemoryStore {
  constructor() {
    this.variables = {};
    this.uiElements = [];
  }

  // Resets runtime memory and UI elements
  clear() {
    this.variables = {};
    this.uiElements = [];
  }

  // Store variable in memory
  set(name, value) {
    this.variables[name] = value;
  }

  // Increment numeric variable in memory
  increment(name, byAmount = 1) {
    const currentVal = Number(this.variables[name]) || 0;
    this.variables[name] = currentVal + byAmount;
  }

  // Update text property of an existing UI element by ID
  updateText(elementId, textValue) {
    const element = this.uiElements.find(item => item.id === elementId);
    if (element) {
      element.text = String(textValue);
    }
  }

  // Add or update a UI element in display memory
  addUIElement(elementPayload) {
    const existingIndex = this.uiElements.findIndex(item => item.id === elementPayload.id);
    if (existingIndex !== -1) {
      this.uiElements[existingIndex] = { ...elementPayload };
    } else {
      this.uiElements.push({ ...elementPayload });
    }
  }

  // Return full array of registered UI elements for rendering
  getRenderList() {
    return this.uiElements;
  }

  // Evaluates strings, numbers, variables, or basic string concatenations
  evaluate(expression) {
    if (typeof expression !== 'string') {
      return expression;
    }

    const trimmed = expression.trim();

    // Parse addition and string concatenation (e.g. "Clicks: " + count)
    if (trimmed.includes('+')) {
      const parts = trimmed.split('+').map(part => part.trim());
      return parts.map(part => this.evaluate(part)).join('');
    }

    // Parse literal quoted strings
    if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
      return trimmed.slice(1, -1);
    }

    // Parse numeric literals
    if (!isNaN(trimmed) && trimmed !== '') {
      return Number(trimmed);
    }

    // Parse variable references
    if (Object.prototype.hasOwnProperty.call(this.variables, trimmed)) {
      return this.variables[trimmed];
    }

    return trimmed;
  }
}
