  export class VM {
  constructor() {
    this.state = {};
    this.elements = new Map();
  }

  reset() {
    this.state = {};
    this.elements.clear();
  }

  evaluate(expr) {
    const raw = expr.trim();
    // Evaluate literal string concatenation and variable interpolation
    const parts = raw.split('+').map(p => p.trim());
    return parts.map(part => {
      if (part.startsWith('"') && part.endsWith('"')) {
        return part.slice(1, -1);
      }
      if (this.state.hasOwnProperty(part)) {
        return this.state[part];
      }
      return part;
    }).join('');
  }

  execute(stmt) {
    switch (stmt.type) {
      case 'SET_VAR': {
        const val = this.evaluate(stmt.expr);
        this.state[stmt.name] = isNaN(val) ? val : Number(val);
        break;
      }
      case 'INCREMENT_VAR': {
        const current = Number(this.state[stmt.name]) || 0;
        this.state[stmt.name] = current + stmt.by;
        break;
      }
      case 'CREATE_ELEMENT': {
        this.elements.set(stmt.payload.id, { ...stmt.payload });
        break;
      }
      case 'UPDATE_ELEMENT': {
        if (this.elements.has(stmt.elementId)) {
          const el = this.elements.get(stmt.elementId);
          el.text = this.evaluate(stmt.expr);
        }
        break;
      }
    }
  }

  getRenderList() {
    return Array.from(this.elements.values());
  }
}
