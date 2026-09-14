export function parseCode(code) {
  const lines = code.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'));
  const ast = { config: null, body: [], events: {} };
  let currentBlock = null;

  lines.forEach(line => {
    const winMatch = line.match(/^Create window titled "(.*?)" size (\d+) x (\d+)/i);
    if (winMatch) {
      ast.config = { title: winMatch[1], width: parseInt(winMatch[2]), height: parseInt(winMatch[3]) };
      return;
    }

    if (line.match(/^On tick:/i)) {
      currentBlock = { type: 'tick', statements: [] };
      ast.events['tick'] = currentBlock;
      return;
    }

    const clickMatch = line.match(/^On click (\w+):/i);
    if (clickMatch) {
      currentBlock = { type: 'click', target: clickMatch[1], statements: [] };
      ast.events[clickMatch[1]] = currentBlock;
      return;
    }

    if (line.match(/^End$/i)) {
      currentBlock = null;
      return;
    }

    const stmt = parseStatement(line);
    if (stmt) {
      if (currentBlock) {
        currentBlock.statements.push(stmt);
      } else {
        ast.body.push(stmt);
      }
    }
  });

  return ast;
}

function parseStatement(line) {
  let m = line.match(/^Set (\w+) to (.+)/i);
  if (m) return { type: 'SET_VAR', name: m[1], expr: m[2] };

  m = line.match(/^Increase (\w+) by (\d+)/i);
  if (m) return { type: 'INCREMENT_VAR', name: m[1], by: parseInt(m[2]) };

  m = line.match(/^Set text of (\w+) to (.+)/i);
  if (m) return { type: 'UPDATE_ELEMENT', elementId: m[1], expr: m[2] };

  m = line.match(/^Set color of (\w+) to "([^"]+)"/i);
  if (m) return { type: 'UPDATE_COLOR', elementId: m[1], color: m[2] };

  m = line.match(/^Hide (\w+)/i);
  if (m) return { type: 'SET_VISIBILITY', elementId: m[1], visible: false };

  m = line.match(/^Show (\w+)/i);
  if (m) return { type: 'SET_VISIBILITY', elementId: m[1], visible: true };

  m = line.match(/^Draw box at (\d+), (\d+) size (\d+) x (\d+) filled with "([^"]+)" as (\w+)/i);
  if (m) {
    return {
      type: 'CREATE_ELEMENT',
      payload: { id: m[6], type: 'box', x: +m[1], y: +m[2], w: +m[3], h: +m[4], color: m[5], hidden: false, draggable: true }
    };
  }

  m = line.match(/^Draw text "([^"]+)" at (\d+), (\d+) colored "([^"]+)" as (\w+)/i);
  if (m) {
    return {
      type: 'CREATE_ELEMENT',
      payload: { id: m[5], type: 'text', text: m[1], x: +m[2], y: +m[3], color: m[4], hidden: false }
    };
  }

  m = line.match(/^Draw button "([^"]+)" at (\d+), (\d+) size (\d+) x (\d+) colored "([^"]+)" as (\w+)/i);
  if (m) {
    return {
      type: 'CREATE_ELEMENT',
      payload: { id: m[7], type: 'button', text: m[1], x: +m[2], y: +m[3], w: +m[4], h: +m[5], color: m[6], hidden: false }
    };
  }

  return null;
}
