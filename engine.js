window.SimOS = {
  async run(inputId, screenId) {
    const code = document.getElementById(inputId).value;
    const screen = document.getElementById(screenId);
    screen.innerHTML = '';
    
    let isPoweredOn = false;
    let fileSystem = {};
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

    const print = (text) => {
      screen.innerHTML += `<div>${text}</div>`;
      screen.scrollTop = screen.scrollHeight;
    };

    const lines = code.split('\n');

    for (let line of lines) {
      line = line.trim();
      if (!line) continue;
      
      let words = line.split(' ');
      let command = words[0].toLowerCase();

      try {
        if (line.toLowerCase() === 'turn on') {
          isPoweredOn = true;
          print("Booting SimOS External Kernel...");
          await sleep(600);
          print("System Ready.\n");
        } else if (!isPoweredOn) {
          throw "Computer is OFF. Type 'turn on' first.";
        } else if (line.toLowerCase() === 'turn off') {
          isPoweredOn = false;
          screen.innerHTML = '';
          break;
        } else if (line.toLowerCase() === 'clear screen') {
          screen.innerHTML = '';
        } else if (command === 'print') {
          print(line.substring(5).trim().replace(/"/g, ''));
        } else if (command === 'wait' && words[2] === 'seconds') {
          await sleep(parseFloat(words[1]) * 1000);
        } else if (command === 'create' && words[1] === 'file') {
          let filename = words[2];
          let idx = line.indexOf('containing');
          if (idx === -1) throw "Syntax error: use 'containing \"text\"'";
          fileSystem[filename] = line.substring(idx + 10).trim().replace(/"/g, '');
        } else if (command === 'read' && words[1] === 'file') {
          let filename = words[2];
          if (fileSystem[filename] !== undefined) print(`> ${fileSystem[filename]}`);
          else throw `File '${filename}' not found.`;
        } else if (line.toLowerCase() === 'list files') {
          let files = Object.keys(fileSystem);
          if (!files.length) print("No files found.");
          else files.forEach(f => print(` - ${f}`));
        } else {
          throw `Unknown command: "${command}"`;
        }
      } catch (err) {
        print(`<span style="color: #ff3333;">ERROR: ${err}</span>`);
      }
      await sleep(100);
    }
  }
};
