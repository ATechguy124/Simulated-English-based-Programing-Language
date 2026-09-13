// tests/parser.test.js
import { parseCode } from '../src/lexer.js';

describe('EnglishScript Lexer & Parser', () => {
  test('parses window configuration', () => {
    const code = `Create window titled "Test App" size 600 x 400`;
    const ast = parseCode(code);
    expect(ast.config).toEqual({
      title: 'Test App',
      width: 600,
      height: 400
    });
  });

  test('parses variable statements correctly', () => {
    const code = `
      Set count to 10
      Increase count by 5
      Set text of label1 to "Value: " + count
    `;
    const ast = parseCode(code);
    expect(ast.body).toEqual([
      { type: 'SET_VAR', name: 'count', value: '10' },
      { type: 'INCREMENT_VAR', name: 'count', by: 5 },
      { type: 'UPDATE_ELEMENT', elementId: 'label1', value: '"Value: " + count' }
    ]);
  });

  test('parses primitive drawing and GUI elements', () => {
    const code = `
      Draw box at 10, 20 size 100 x 50 filled with "#000000" as mainBox
      Draw text "Hello World" at 15, 30 colored "white" as mainText
      Draw button "Press" at 50, 50 size 80 x 40 colored "blue" as actionBtn
    `;
    const ast = parseCode(code);
    expect(ast.body).toEqual([
      {
        type: 'CREATE_BOX',
        payload: { id: 'mainBox', type: 'box', x: 10, y: 20, w: 100, h: 50, color: '#000000' }
      },
      {
        type: 'CREATE_TEXT',
        payload: { id: 'mainText', type: 'text', text: 'Hello World', x: 15, y: 30, color: 'white' }
      },
      {
        type: 'CREATE_BUTTON',
        payload: { id: 'actionBtn', type: 'button', text: 'Press', x: 50, y: 50, w: 80, h: 40, color: 'blue' }
      }
    ]);
  });

  test('scopes statements inside event handler blocks', () => {
    const code = `
      Draw button "Click" at 0, 0 size 10 x 10 colored "red" as myBtn
      On click myBtn:
        Increase score by 1
        Set text of scoreDisplay to "Score: " + score
      End
    `;
    const ast = parseCode(code);
    
    expect(ast.body.length).toBe(1); // Only the button declaration is top-level
    expect(ast.events.myBtn).toBeDefined();
    expect(ast.events.myBtn.statements).toEqual([
      { type: 'INCREMENT_VAR', name: 'score', by: 1 },
      { type: 'UPDATE_ELEMENT', elementId: 'scoreDisplay', value: '"Score: " + score' }
    ]);
  });

  test('ignores comments and blank lines', () => {
    const code = `
      # Main background box setup
      Draw box at 0, 0 size 100 x 100 filled with "black" as bg

      # End of layout
    `;
    const ast = parseCode(code);
    expect(ast.body.length).toBe(1);
    expect(ast.body[0].payload.id).toBe('bg');
  });
});
