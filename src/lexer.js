// src/lexer.js

/**
 * Parses raw EnglishScript code into an Abstract Syntax Tree (AST) structure.
 * Returns an object with global configuration, top-level statements, and event blocks.
 */
export function parseCode(sourceCode) {
  const lines = sourceCode
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0 && !line.startsWith('#'));

  const program = {
    config: null,
    body: [],
    events: {}
  };

  let currentEventTarget = null;

  for (const line of lines) {
    // Handle block termination
    if (line === 'End') {
      currentEventTarget = null;
      continue;
    }

    // Handle event block declarations (e.g., "On click myBtn:")
    if (line.startsWith('On click')) {
      const eventMatch = line.match(/^On click\s+(\w+):$/i);
      if (eventMatch) {
        currentEventTarget = eventMatch[1];
        program.events[currentEventTarget] = { statements: [] };
      }
      continue;
    }

    // Parse individual line statement
    const statement = parseStatement(line, program);

    if (statement) {
      if (currentEventTarget) {
        program.events[currentEventTarget].statements.push(statement);
      } else {
        program.body.push(statement);
      }
    }
  }

  return program;
}

function parseStatement(line, program) {
  // 1. Create window configuration: Create window titled "Title" size 500 x 350
  let match = line.match(/^Create window titled "([^"]+)" size (\d+)\s*x\s*(\d+)$/i);
  if (match) {
    program.config = {
      title: match[1],
      width: parseInt(match[2], 10),
      height: parseInt(match[3], 10)
    };
    return null;
  }

  // 2. Set variable: Set count to 0
  match = line.match(/^Set (\w+) to (.+)$/i);
  if (match && !line.startsWith('Set text of')) {
    return {
      type: 'SET_VAR',
      name: match[1],
      value: match[2].trim()
    };
  }

  // 3. Increment variable: Increase count by 1
  match = line.match(/^Increase (\w+) by (\d+)$/i);
  if (match) {
    return {
      type: 'INCREMENT_VAR',
      name: match[1],
      by: parseInt(match[2], 10)
    };
  }

  // 4. Update element text: Set text of statusText to "Button Clicks: " + count
  match = line.match(/^Set text of (\w+) to (.+)$/i);
  if (match) {
    return {
      type: 'UPDATE_ELEMENT',
      elementId: match[1],
      value: match[2].trim()
    };
  }

  // 5. Draw box primitive: Draw box at 20, 20 size 460 x 310 filled with "rgb(30, 30, 40)" as background
  match = line.match(/^Draw box at (\d+),\s*(\d+) size (\d+)\s*x\s*(\d+) filled with "([^"]+)" as (\w+)$/i);
  if (match) {
    return {
      type: 'CREATE_BOX',
      payload: {
        id: match[6],
        type: 'box',
        x: parseInt(match[1], 10),
        y: parseInt(match[2], 10),
        w: parseInt(match[3], 10),
        h: parseInt(match[4], 10),
        color: match[5]
      }
    };
  }

  // 6. Draw text primitive: Draw text "Title" at 40, 50 colored "white" as header
  match = line.match(/^Draw text "([^"]+)" at (\d+),\s*(\d+) colored "([^"]+)" as (\w+)$/i);
  if (match) {
    return {
      type: 'CREATE_TEXT',
      payload: {
        id: match[5],
        type: 'text',
        text: match[1],
        x: parseInt(match[2], 10),
        y: parseInt(match[3], 10),
        color: match[4]
      }
    };
  }

  // 7. Draw button GUI element: Draw button "Click Me!" at 40, 130 size 140 x 45 colored "#ff0055" as myBtn
  match = line.match(/^Draw button "([^"]+)" at (\d+),\s*(\d+) size (\d+)\s*x\s*(\d+) colored "([^"]+)" as (\w+)$/i);
  if (match) {
    return {
      type: 'CREATE_BUTTON',
      payload: {
        id: match[7],
        type: 'button',
        text: match[1],
        x: parseInt(match[2], 10),
        y: parseInt(match[3], 10),
        w: parseInt(match[4], 10),
        h: parseInt(match[5], 10),
        color: match[6]
      }
    };
  }

  return null;
}
