const STORAGE_KEY = "arrayQuestDay1Progress_v12";

const missions = [
  { id: "landing", title: "Check-In" },
  { id: "mission1", title: "What is a List?" },
  { id: "mission2", title: "Index Starts at 0" },
  { id: "mission3", title: "Code Lab" },
  { id: "mission4", title: "Index Raider" },
  { id: "mission5", title: "Inventory Builder 1" },
  { id: "mission6", title: "Inventory Builder 2" },
  { id: "mission7", title: "Inventory Builder 3" },
  { id: "mission8", title: "KL Arena" },
  { id: "exit", title: "Exit Ticket" }
];

const defaultProgress = {
  name: "",
  className: "",
  path: "Beginner Path",
  current: "landing",
  xp: 0,
  completed: {},
  badges: {},
  answers: {},
  code: {},
  startedAt: null,
  updatedAt: null
};

let state = loadProgress();
let currentCodeTask = 0;
let tapQuestionIndex = 0;
let raider = { round: 1, score: 0, lives: 3, active: true, target: 0, items: [], question: null };

function isTeacherName(value) {
  return (value || "").trim().toLowerCase() === "teacher";
}

function isTeacherMode() {
  return isTeacherName(state.name);
}

const codeTasks = [
  {
    title: "1. Create a list",
    skill: "Create",
    learningGoal: "Use square brackets to store several values in one variable.",
    syntaxName: "Create syntax",
    syntaxPattern: 'variable_name = ["item 1", "item 2", "item 3"]',
    reading: "A list is a container. It can hold many values, and each value is separated by a comma. Text values must be inside quotation marks.",
    exampleTitle: "Worked example: snacks list",
    exampleCode: 'snacks = ["chips", "apple", "juice"]\nprint(snacks)',
    exampleOutput: '[\'chips\', \'apple\', \'juice\']',
    playPrompt: "Play first: change one snack, then add one more snack inside the square brackets. Run it in the web Python editor and compare your output.",
    playCode: 'snacks = ["chips", "apple", "juice"]\nprint(snacks)',
    challengeTitle: "Pet team list",
    challengeBrief: "Create a list called pets with four animals. Then print the whole list.",
    starter: '# Your challenge: create a pets list\n# Replace each TODO with your own animal.\n\npets = [TODO, TODO, TODO, TODO]\n\nprint(TODO)',
    target: "Your output should show one Python list containing four animal names.",
    hints: ["Text values need quotation marks, for example \"cat\".", "The variable name must be pets.", "To print the list, use print(pets)."],
    checks: [
      { label: "Replaces TODOs in runnable code", test: code => !hasTodoInExecutableCode(code) },
      { label: "Creates a list called pets", test: code => /pets\s*=\s*\[[\s\S]*\]/.test(code) },
      { label: "Includes at least four text items", test: code => (code.match(/[\"'][^\"']+[\"']/g) || []).length >= 4 },
      { label: "Prints the pets list", test: code => /print\s*\(\s*pets\s*\)/.test(code) }
    ]
  },
  {
    title: "2. Access one item",
    skill: "Index",
    learningGoal: "Use an index number to read one item from a list.",
    syntaxName: "Access syntax",
    syntaxPattern: 'list_name[index_number]',
    reading: "Python starts counting at 0. The first item is index 0, the second item is index 1, and the third item is index 2.",
    exampleTitle: "Worked example: snack positions",
    exampleCode: 'snacks = ["chips", "apple", "juice"]\nprint(snacks[0])\nprint(snacks[2])',
    exampleOutput: 'chips\njuice',
    playPrompt: "Play first: change the index numbers. Try snacks[1]. What happens if you try snacks[3]?",
    playCode: 'snacks = ["chips", "apple", "juice"]\n\nprint(snacks[0])',
    challengeTitle: "Character selector",
    challengeBrief: "Use index numbers to print the first character and the last character from the list.",
    starter: 'characters = ["mage", "knight", "archer", "healer"]\n\n# Print the first character\nprint(characters[TODO])\n\n# Print the last character\nprint(characters[TODO])',
    target: "The output should print mage first, then healer on the next line.",
    hints: ["The first item is index 0.", "There are four items, so the last index is 3.", "Use characters[0] and characters[3]."],
    checks: [
      { label: "Replaces TODOs in runnable code", test: code => !hasTodoInExecutableCode(code) },
      { label: "Uses index [0] for the first item", test: code => /characters\s*\[\s*0\s*\]/.test(code) },
      { label: "Uses index [3] for the last item", test: code => /characters\s*\[\s*3\s*\]/.test(code) },
      { label: "Uses at least two print commands", test: code => (code.match(/print\s*\(/g) || []).length >= 2 }
    ]
  },
  {
    title: "3. Change an item",
    skill: "Update",
    learningGoal: "Use an index to replace one list item with a new value.",
    syntaxName: "Update syntax",
    syntaxPattern: 'list_name[index_number] = "new item"',
    reading: "Lists can be changed after they are created. Choose the position with an index, then use = to replace the old value.",
    exampleTitle: "Worked example: update a snack",
    exampleCode: 'snacks = ["chips", "apple", "juice"]\nsnacks[1] = "sandwich"\nprint(snacks)',
    exampleOutput: '[\'chips\', \'sandwich\', \'juice\']',
    playPrompt: "Play first: change snacks[1] to another food. Then try changing snacks[0].",
    playCode: 'snacks = ["chips", "apple", "juice"]\n\nsnacks[1] = "sandwich"\nprint(snacks)',
    challengeTitle: "Upgrade the school kit",
    challengeBrief: "The item at index 1 is pencil. Change it into another school item, then print the updated list.",
    starter: 'tools = ["pen", "pencil", "ruler", "eraser"]\n\n# Change pencil into another school item\ntools[TODO] = TODO\n\nprint(tools)',
    target: "The output should show the tools list with pencil replaced by your new item.",
    hints: ["pencil is at index 1.", "The new value must be text, so use quotation marks.", "Example structure: tools[1] = \"highlighter\"."],
    checks: [
      { label: "Replaces TODOs in runnable code", test: code => !hasTodoInExecutableCode(code) },
      { label: "Changes an item using tools[1]", test: code => /tools\s*\[\s*1\s*\]\s*=/.test(code) },
      { label: "Assigns a text value using quotation marks", test: code => /tools\s*\[\s*1\s*\]\s*=\s*[\"'][^\"']+[\"']/.test(code) },
      { label: "Prints the updated tools list", test: code => /print\s*\(\s*tools\s*\)/.test(code) }
    ]
  },
  {
    title: "4. Append an item",
    skill: "Append",
    learningGoal: "Use .append() to add new values to the end of a list.",
    syntaxName: "Append syntax",
    syntaxPattern: 'list_name.append("new item")',
    reading: ".append() means add to the end. You do not need to choose an index because Python places the new item after the current last item.",
    exampleTitle: "Worked example: add a snack",
    exampleCode: 'snacks = ["chips", "apple", "juice"]\nsnacks.append("cookie")\nprint(snacks)',
    exampleOutput: '[\'chips\', \'apple\', \'juice\', \'cookie\']',
    playPrompt: "Play first: append two different snacks. Notice that they are added to the end.",
    playCode: 'snacks = ["chips", "apple", "juice"]\n\nsnacks.append("cookie")\nprint(snacks)',
    challengeTitle: "Backpack expansion",
    challengeBrief: "Start with two backpack items. Use .append() twice to add two more items, then print the backpack.",
    starter: 'backpack = ["notebook", "water bottle"]\n\n# Add two new items to the backpack\nbackpack.append(TODO)\nbackpack.append(TODO)\n\nprint(backpack)',
    target: "The output should show four backpack items in one list.",
    hints: ["Each appended item should be text in quotation marks.", "Use backpack.append(\"item\") twice.", "Do not write backpack = backpack.append(...)."],
    checks: [
      { label: "Replaces TODOs in runnable code", test: code => !hasTodoInExecutableCode(code) },
      { label: "Uses .append() at least twice", test: code => (code.match(/backpack\.append\s*\(/g) || []).length >= 2 },
      { label: "Appends text values using quotation marks", test: code => (code.match(/backpack\.append\s*\(\s*[\"'][^\"']+[\"']\s*\)/g) || []).length >= 2 },
      { label: "Prints the backpack list", test: code => /print\s*\(\s*backpack\s*\)/.test(code) }
    ]
  },
  {
    title: "5. Count items",
    skill: "Length",
    learningGoal: "Use len() to count how many items are in a list.",
    syntaxName: "Length syntax",
    syntaxPattern: 'len(list_name)',
    reading: "len() returns the length of a list. The length means how many items are currently stored inside it.",
    exampleTitle: "Worked example: count snacks",
    exampleCode: 'snacks = ["chips", "apple", "juice"]\nprint(len(snacks))',
    exampleOutput: '3',
    playPrompt: "Play first: add another snack to the list and check how the length changes.",
    playCode: 'snacks = ["chips", "apple", "juice"]\n\nprint(len(snacks))',
    challengeTitle: "Level counter",
    challengeBrief: "Add one new level to the list. Then print how many levels are now stored.",
    starter: 'levels = ["forest", "cave", "castle"]\n\n# Add one new level\nlevels.append(TODO)\n\n# Print how many levels there are\nprint(TODO)',
    target: "The output should be 4 because the list starts with 3 levels and you append 1 more.",
    hints: ["Use levels.append(\"new level\") first.", "Use len(levels) to count the items.", "Put len(levels) inside print()."],
    checks: [
      { label: "Replaces TODOs in runnable code", test: code => !hasTodoInExecutableCode(code) },
      { label: "Appends one new level", test: code => /levels\.append\s*\(\s*[\"'][^\"']+[\"']\s*\)/.test(code) },
      { label: "Uses len(levels)", test: code => /len\s*\(\s*levels\s*\)/.test(code) },
      { label: "Prints the length", test: code => /print\s*\(\s*len\s*\(\s*levels\s*\)\s*\)/.test(code) }
    ]
  }
];

const tapQuestions = [
  { code: 'inventory[0]', answer: 'sword', items: ['sword', 'potion', 'shield', 'map'] },
  { code: 'inventory[2]', answer: 'shield', items: ['sword', 'potion', 'shield', 'map'] },
  { code: 'animals[1]', answer: 'dog', items: ['cat', 'dog', 'rabbit', 'hamster'] },
  { code: 'treasure[3]', answer: 'coin', items: ['gem', 'potion', 'key', 'coin'] },
  { code: 'treasure[1]', answer: 'potion', items: ['gem', 'potion', 'key', 'coin'] },
  { code: 'inventory[3]', answer: 'map', items: ['sword', 'potion', 'shield', 'map'] },
  { code: 'animals[0]', answer: 'cat', items: ['cat', 'dog', 'rabbit', 'hamster'] },
  { code: 'treasure[2]', answer: 'key', items: ['gem', 'potion', 'key', 'coin'] }
];

const TAP_TOTAL = tapQuestions.length;
const RAIDER_ROUNDS = 12;

const raiderQuestions = [
  {
    type: "Index Access",
    items: ["gem", "potion", "key", "shield", "coin"],
    code: 'treasure = ["gem", "potion", "key", "shield", "coin"]\nprint(treasure[2])',
    question: "What will this program print?",
    answer: "key",
    options: ["gem", "potion", "key", "shield"],
    explanation: "Index 2 is the third item because Python starts counting at 0."
  },
  {
    type: "Index Access",
    items: ["sword", "apple", "map", "torch", "ring"],
    code: 'inventory = ["sword", "apple", "map", "torch", "ring"]\nprint(inventory[0])',
    question: "What is the output?",
    answer: "sword",
    options: ["0", "sword", "apple", "inventory"],
    explanation: "inventory[0] accesses the first item."
  },
  {
    type: "Syntax Choice",
    items: ["mage", "knight", "archer", "healer"],
    code: 'characters = ["mage", "knight", "archer", "healer"]',
    question: "Which line correctly prints the last item?",
    answer: "print(characters[3])",
    options: ["print(characters[4])", "print(characters(3))", "print(characters[3])", "print[characters[3]]"],
    explanation: "There are 4 items, so the last index is 3."
  },
  {
    type: "Update Item",
    items: ["stick", "potion", "map"],
    code: 'inventory = ["stick", "potion", "map"]\ninventory[0] = "sword"\nprint(inventory[0])',
    question: "What will be printed after the update?",
    answer: "sword",
    options: ["stick", "sword", "potion", "0"],
    explanation: "inventory[0] was changed from stick to sword before printing."
  },
  {
    type: "Append",
    items: ["wood", "stone"],
    code: 'materials = ["wood", "stone"]\nmaterials.append("iron")\nprint(materials)',
    question: "Which list matches the final output?",
    answer: "['wood', 'stone', 'iron']",
    options: ["['iron', 'wood', 'stone']", "['wood', 'stone', 'iron']", "['wood', 'iron']", "['stone', 'iron']"],
    explanation: ".append() adds the new item to the end of the list."
  },
  {
    type: "Length",
    items: ["forest", "cave", "castle"],
    code: 'levels = ["forest", "cave", "castle"]\nprint(len(levels))',
    question: "What number is printed?",
    answer: "3",
    options: ["2", "3", "4", "levels"],
    explanation: "len(levels) counts how many items are in the list."
  },
  {
    type: "Length After Append",
    items: ["red", "blue", "green"],
    code: 'colours = ["red", "blue", "green"]\ncolours.append("yellow")\nprint(len(colours))',
    question: "What is the output after appending one item?",
    answer: "4",
    options: ["3", "4", "yellow", "len"],
    explanation: "The list starts with 3 items and append adds 1 more, so the length is 4."
  },
  {
    type: "Spot the Error",
    items: ["map", "key"],
    code: 'items = ["map", "key"]\nprint(items[2])',
    question: "Why will this code cause an error?",
    answer: "Index 2 does not exist",
    options: ["Index 2 does not exist", "Lists cannot store text", "print() is not allowed", "The list needs curly brackets"],
    explanation: "The two items are at index 0 and index 1 only."
  },
  {
    type: "Choose the Syntax",
    items: ["cat", "dog", "rabbit"],
    code: 'animals = ["cat", "dog", "rabbit"]',
    question: "Which line correctly changes dog into fox?",
    answer: 'animals[1] = "fox"',
    options: ['animals[1] = "fox"', 'animals.append["fox"]', 'animals(1) = "fox"', 'animals = [1] "fox"'],
    explanation: "dog is at index 1, and list[index] = value replaces it."
  },
  {
    type: "Predict Output",
    items: ["Ali", "Ben", "Chloe"],
    code: 'players = ["Ali", "Ben", "Chloe"]\nplayers[1] = "Dina"\nplayers.append("Evan")\nprint(players[3])',
    question: "What is printed?",
    answer: "Evan",
    options: ["Ben", "Dina", "Chloe", "Evan"],
    explanation: "Evan is appended to the end, which becomes index 3."
  },
  {
    type: "KL Bronze Style",
    items: ["10", "25", "15", "30", "20"],
    code: 'scores = [10, 25, 15, 30, 20]\nprint(scores[2] + scores[4])',
    question: "What is the output?",
    answer: "35",
    options: ["45", "35", "50", "15"],
    explanation: "scores[2] is 15 and scores[4] is 20. 15 + 20 = 35."
  },
  {
    type: "Syntax Check",
    items: ["notebook", "water", "pen"],
    code: 'bag = ["notebook", "water", "pen"]',
    question: "Which line correctly adds pencil to the end?",
    answer: 'bag.append("pencil")',
    options: ['bag.append("pencil")', 'bag[append] = "pencil"', 'append.bag("pencil")', 'bag.add["pencil"]'],
    explanation: "Use list_name.append(value) with round brackets."
  }
];

const inventoryStarter = `# Inventory Builder 1: guided inventory
# Replace every TODO with your own code.

# 1. Create your own list with at least 4 items
inventory = [TODO, TODO, TODO, TODO]

# 2. Print a message and the full list
print("Your inventory:")
print(TODO)

# 3. Print one item using an index
print("Selected item:")
print(TODO)

# 4. Change one item using an index
inventory[TODO] = TODO

# 5. Add one new item to the end
inventory.append(TODO)

# 6. Count the items
print("Total items:")
print(TODO)`;

const inventory2Starter = `# Inventory Builder 2: Cafe Order Update
# Less scaffolded. Use the variable name order.

# 1. Create a cafe order list with at least 4 items
order = []

# 2. Print the full order

# 3. Print the item at index 2

# 4. Replace one item using an index

# 5. Append one new dessert or drink

# 6. Print the total number of items`;

const inventory3Starter = `# Inventory Builder 3: Game Shop Stock Tracker
# Least scaffolded. Use the variable name stock.
# Write the full program yourself from the requirements.

`;


function stripPythonComments(code) {
  return String(code || "").split(/\r?\n/).map(line => {
    let quote = null;
    let escaped = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (escaped) {
        escaped = false;
        continue;
      }
      if (ch === "\\") {
        escaped = true;
        continue;
      }
      if (quote) {
        if (ch === quote) quote = null;
        continue;
      }
      if (ch === '"' || ch === "'") {
        quote = ch;
        continue;
      }
      if (ch === "#") return line.slice(0, i);
    }
    return line;
  }).join("\n");
}

function hasTodoInExecutableCode(code) {
  return /TODO/i.test(stripPythonComments(code));
}

function codeForStructureChecks(code) {
  return stripPythonComments(code);
}

const itemIcons = {
  sword: "⚔️", potion: "🧪", key: "🗝️", shield: "🛡️", coin: "🪙", gem: "💎",
  apple: "🍎", map: "🗺️", torch: "🔥", ring: "💍", cat: "🐱", dog: "🐶", rabbit: "🐰", owl: "🦉", fox: "🦊",
  red: "🔴", blue: "🔵", green: "🟢", yellow: "🟡", purple: "🟣", "10": "🔟", "25": "🏅", "15": "⭐", "30": "🏆", "20": "🎯",
  Ali: "🧑", Ben: "🧑‍💻", Chloe: "👩‍💻", Dina: "🧑‍🎨", Evan: "🧑‍🚀"
};


let pyodideReadyPromise = null;

function getPyodideReady() {
  if (typeof loadPyodide !== "function") return null;
  if (!pyodideReadyPromise) {
    pyodideReadyPromise = loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/" });
  }
  return pyodideReadyPromise;
}

async function runPythonCode(code) {
  const cleaned = String(code || "").replace(/TODO/g, "___TODO___");
  const pyodidePromise = getPyodideReady();
  if (!pyodidePromise) {
    return runMiniPythonFallback(cleaned);
  }
  try {
    const pyodide = await pyodidePromise;
    pyodide.globals.set("_student_code", cleaned);
    const runner = `
import sys, io, traceback
_stdout = io.StringIO()
_stderr = io.StringIO()
_oldout, _olderr = sys.stdout, sys.stderr
sys.stdout, sys.stderr = _stdout, _stderr
try:
    exec(_student_code, {})
except Exception:
    traceback.print_exc()
finally:
    sys.stdout, sys.stderr = _oldout, _olderr
_result = _stdout.getvalue() + _stderr.getvalue()
`;
    await pyodide.runPythonAsync(runner);
    const result = pyodide.globals.get("_result");
    return result || "Program ran with no printed output.";
  } catch (error) {
    return `Web Python could not start. Basic runner message:\n${runMiniPythonFallback(cleaned)}\n\nTechnical note: ${error.message}`;
  }
}

function runMiniPythonFallback(code) {
  const output = [];
  const vars = {};
  const lines = String(code || "").split(/\r?\n/).map(line => line.trim()).filter(line => line && !line.startsWith("#"));
  try {
    for (const line of lines) {
      if (/___TODO___/.test(line)) throw new Error("Replace every TODO before running.");
      let m;
      if ((m = line.match(/^(\w+)\s*=\s*(\[[\s\S]*\])$/))) {
        vars[m[1]] = parsePythonLiteral(m[2]);
      } else if ((m = line.match(/^(\w+)\s*\[\s*(\d+)\s*\]\s*=\s*(.+)$/))) {
        const arr = vars[m[1]];
        if (!Array.isArray(arr)) throw new Error(`${m[1]} is not a list.`);
        const idx = Number(m[2]);
        if (idx < 0 || idx >= arr.length) throw new Error(`IndexError: list index ${idx} out of range`);
        arr[idx] = parsePythonLiteral(m[3]);
      } else if ((m = line.match(/^(\w+)\.append\s*\((.+)\)$/))) {
        const arr = vars[m[1]];
        if (!Array.isArray(arr)) throw new Error(`${m[1]} is not a list.`);
        arr.push(parsePythonLiteral(m[2]));
      } else if ((m = line.match(/^print\s*\((.*)\)$/))) {
        output.push(formatPythonValue(evalMiniExpression(m[1], vars)));
      } else if ((m = line.match(/^(\w+)\s*=\s*(-?\d+(?:\.\d+)?)$/))) {
        vars[m[1]] = Number(m[2]);
      } else {
        throw new Error(`Basic fallback cannot run this line: ${line}`);
      }
    }
    return output.join("\n") || "Program ran with no printed output.";
  } catch (error) {
    return `Error: ${error.message}`;
  }
}

function parsePythonLiteral(text) {
  const trimmed = String(text).trim();
  if (/^['"][\s\S]*['"]$/.test(trimmed)) return trimmed.slice(1, -1);
  if (/^-?\d+(?:\.\d+)?$/.test(trimmed)) return Number(trimmed);
  if (/^\[[\s\S]*\]$/.test(trimmed)) {
    return JSON.parse(trimmed.replace(/'/g, '"'));
  }
  throw new Error(`Cannot read value: ${trimmed}`);
}

function evalMiniExpression(expr, vars) {
  const trimmed = String(expr).trim();
  let m;
  if (/^['"][\s\S]*['"]$/.test(trimmed)) return trimmed.slice(1, -1);
  if (/^-?\d+(?:\.\d+)?$/.test(trimmed)) return Number(trimmed);
  if ((m = trimmed.match(/^len\s*\(\s*(\w+)\s*\)$/))) return (vars[m[1]] || []).length;
  if ((m = trimmed.match(/^sum\s*\(\s*(\w+)\s*\)$/))) return (vars[m[1]] || []).reduce((a, b) => a + Number(b), 0);
  if ((m = trimmed.match(/^(\w+)\s*\[\s*(\d+)\s*\]$/))) {
    const arr = vars[m[1]];
    const idx = Number(m[2]);
    if (!Array.isArray(arr)) throw new Error(`${m[1]} is not a list.`);
    if (idx < 0 || idx >= arr.length) throw new Error(`IndexError: list index ${idx} out of range`);
    return arr[idx];
  }
  if ((m = trimmed.match(/^(\w+)\s*\[\s*(\d+)\s*\]\s*\+\s*(\w+)\s*\[\s*(\d+)\s*\]$/))) {
    return evalMiniExpression(`${m[1]}[${m[2]}]`, vars) + evalMiniExpression(`${m[3]}[${m[4]}]`, vars);
  }
  if (vars.hasOwnProperty(trimmed)) return vars[trimmed];
  throw new Error(`Cannot read expression: ${trimmed}`);
}

function formatPythonValue(value) {
  if (Array.isArray(value)) return `[${value.map(v => typeof v === "string" ? `'${v}'` : String(v)).join(", ")}]`;
  return String(value);
}

async function runEditorCode(editorId, outputId) {
  const editor = document.getElementById(editorId);
  const output = document.getElementById(outputId);
  if (!editor || !output) return;
  output.classList.remove("hidden", "error-output");
  output.textContent = "Running web Python...";
  const result = await runPythonCode(editor.value);
  output.textContent = result;
  if (/Traceback|Error:|SyntaxError|NameError|IndexError|TypeError/i.test(result)) {
    output.classList.add("error-output");
  }
}

async function runCodeString(code, outputId) {
  const output = document.getElementById(outputId);
  if (!output) return;
  output.classList.remove("hidden", "error-output");
  output.textContent = "Running web Python...";
  const result = await runPythonCode(code);
  output.textContent = result;
  if (/Traceback|Error:|SyntaxError|NameError|IndexError|TypeError/i.test(result)) {
    output.classList.add("error-output");
  }
}


function isCodeTaskComplete(index) {
  return !!state.completed[`codeTask${index}`];
}

function isCodeLabComplete() {
  return codeTasks.every((_, index) => isCodeTaskComplete(index));
}

function canOpenCodeTask(index) {
  if (index === 0) return true;
  return isCodeTaskComplete(index) || isCodeTaskComplete(index - 1);
}

function getTapProgress() {
  const progress = Number(state.answers.tapProgress || 0);
  return Math.max(0, Math.min(TAP_TOTAL, progress));
}

function isTapComplete() {
  return getTapProgress() >= TAP_TOTAL;
}

function lockMessageFor(id) {
  const targetIndex = missions.findIndex(m => m.id === id);
  const tapIndex = missions.findIndex(m => m.id === "mission2");
  const codeLabIndex = missions.findIndex(m => m.id === "mission3");
  if (targetIndex > tapIndex && !isTapComplete()) return "Complete the Index Tap Practice first.";
  if (targetIndex > codeLabIndex && !isCodeLabComplete()) return "Complete all 5 Code Lab skills before moving to the next mission.";
  if ((id === "mission6" || id === "mission7" || id === "mission8") && !state.completed.mission5) return "Complete Inventory Builder 1 first.";
  if ((id === "mission7" || id === "mission8") && !state.completed.mission6) return "Complete Inventory Builder 2 first.";
  if (id === "mission8" && !state.completed.mission7) return "Complete Inventory Builder 3 first.";
  return "";
}

function isMissionLocked(id) {
  if (isTeacherMode()) return false;
  return !!lockMessageFor(id);
}

function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return { ...defaultProgress, ...saved, completed: { ...(saved?.completed || {}) }, badges: { ...(saved?.badges || {}) }, answers: { ...(saved?.answers || {}) }, code: { ...(saved?.code || {}) } };
  } catch {
    return { ...defaultProgress };
  }
}

function saveProgress() {
  state.updatedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  renderShell();
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2300);
}

function awardXP(amount, completionId, badgeId = null) {
  if (!state.completed[completionId]) {
    state.completed[completionId] = true;
    state.xp = Math.min(700, state.xp + amount);
    if (badgeId) state.badges[badgeId] = true;
    saveProgress();
    showToast(`+${amount} XP unlocked${badgeId ? ` · Badge: ${badgeId}` : ""}`);
  }
}

function renderShell() {
  const studentCard = document.getElementById("studentCard");
  if (state.name) {
    if (isTeacherMode()) {
      studentCard.innerHTML = `<strong>Teacher Mode</strong><span>All missions unlocked</span><br><span class="muted">Use this to check pages quickly.</span>`;
    } else {
      studentCard.innerHTML = `<strong>${escapeHtml(state.name)}</strong><span>${escapeHtml(state.className || "No class")}</span><br><span class="muted">${escapeHtml(state.path)}</span>`;
    }
  } else {
    studentCard.innerHTML = `<span class="muted">No adventurer yet</span>`;
  }
  document.getElementById("xpText").textContent = `${state.xp || 0} / 700`;
  document.getElementById("xpFill").style.width = `${Math.min(100, ((state.xp || 0) / 700) * 100)}%`;

  const nav = document.getElementById("missionList");
  nav.innerHTML = missions.map((m, i) => {
    const locked = isMissionLocked(m.id);
    return `
    <button class="mission-btn ${state.current === m.id ? "active" : ""} ${state.completed[m.id] ? "done" : ""} ${locked ? "locked" : ""}" data-view="${m.id}" ${locked ? 'aria-disabled="true"' : ""}>
      <span class="mission-number">${locked ? "🔒" : i}</span>
      <span class="mission-title">${m.title}</span>
      <span class="mission-status">${locked ? "Locked" : (state.completed[m.id] ? "✓" : "")}</span>
    </button>`;
  }).join("");

  nav.querySelectorAll("button").forEach(btn => btn.addEventListener("click", () => showView(btn.dataset.view)));
  updateBottomNav();
}

function showView(id) {
  if (isMissionLocked(id)) {
    showToast(lockMessageFor(id));
    return;
  }
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  state.current = id;
  saveProgress();
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (id === "mission2") renderTapGame();
  if (id === "mission3") renderCodeLab();
  if (id === "mission4") renderRaider();
}

function updateBottomNav() {
  const currentIndex = missions.findIndex(m => m.id === state.current);
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  prevBtn.disabled = currentIndex <= 0;
  nextBtn.classList.remove("locked-next");

  if (isTeacherMode()) {
    if (state.current === "mission3" && currentCodeTask < codeTasks.length - 1) {
      nextBtn.textContent = `Teacher: Next Skill ${currentCodeTask + 2} →`;
      nextBtn.disabled = false;
      return;
    }
    nextBtn.textContent = currentIndex >= missions.length - 1 ? "End of Course" : "Teacher: Next Mission →";
    nextBtn.disabled = currentIndex >= missions.length - 1;
    return;
  }

  if (state.current === "mission2" && !isTapComplete()) {
    const progress = getTapProgress();
    nextBtn.textContent = `Complete Index Tap ${progress} / ${TAP_TOTAL}`;
    nextBtn.disabled = true;
    nextBtn.classList.add("locked-next");
    return;
  }

  if (state.current === "mission3") {
    const currentDone = isCodeTaskComplete(currentCodeTask);
    const completedCount = codeTasks.filter((_, index) => isCodeTaskComplete(index)).length;
    if (!currentDone) {
      nextBtn.textContent = `Complete Skill ${currentCodeTask + 1} to continue`;
      nextBtn.disabled = true;
      nextBtn.classList.add("locked-next");
      return;
    }
    if (currentCodeTask < codeTasks.length - 1) {
      nextBtn.textContent = `Next Skill ${currentCodeTask + 2} →`;
      nextBtn.disabled = false;
      return;
    }
    if (completedCount < codeTasks.length) {
      nextBtn.textContent = `Complete ${codeTasks.length - completedCount} more skill${codeTasks.length - completedCount === 1 ? "" : "s"}`;
      nextBtn.disabled = true;
      nextBtn.classList.add("locked-next");
      return;
    }
    nextBtn.textContent = "Next Mission →";
    nextBtn.disabled = false;
    return;
  }

  if (["mission5", "mission6", "mission7"].includes(state.current) && !state.completed[state.current]) {
    const levelName = state.current === "mission5" ? "Inventory Builder 1" : state.current === "mission6" ? "Inventory Builder 2" : "Inventory Builder 3";
    nextBtn.textContent = `Complete ${levelName} to continue`;
    nextBtn.disabled = true;
    nextBtn.classList.add("locked-next");
    return;
  }

  const nextMission = missions[currentIndex + 1];
  if (!nextMission) {
    nextBtn.textContent = "Next Mission →";
    nextBtn.disabled = true;
    return;
  }
  if (isMissionLocked(nextMission.id)) {
    nextBtn.textContent = lockMessageFor(nextMission.id) || "Locked";
    nextBtn.disabled = true;
    nextBtn.classList.add("locked-next");
    return;
  }
  nextBtn.textContent = "Next Mission →";
  nextBtn.disabled = currentIndex >= missions.length - 1;
}

function setupLanding() {
  const name = document.getElementById("studentName");
  const classInput = document.getElementById("studentClass");
  const path = document.getElementById("studentPath");
  name.value = state.name || "";
  classInput.value = state.className || "";
  path.value = state.path || "Beginner Path";

  const continueBox = document.getElementById("continueBox");
  if (state.name) {
    continueBox.classList.remove("hidden");
    continueBox.innerHTML = `
      <strong>Saved session found:</strong> ${escapeHtml(state.name)} (${escapeHtml(state.className || "No class")})<br>
      <span class="muted">If this is not you, backup and reset before starting.</span>
      <div class="button-row">
        <button class="ghost" id="continueSession">Continue this session</button>
        <button class="ghost danger" id="backupAndReset">Backup and reset</button>
      </div>`;
    document.getElementById("continueSession").onclick = () => showView(state.current || "mission1");
    document.getElementById("backupAndReset").onclick = () => { downloadBackup(); resetSession(false); };
  }

  document.getElementById("startBtn").onclick = () => {
    const enteredName = name.value.trim();
    const teacherLogin = isTeacherName(enteredName);
    if (!enteredName || (!teacherLogin && !classInput.value.trim())) {
      showToast(teacherLogin ? "Teacher mode ready." : "Please enter your name and class before starting.");
      return;
    }
    state.name = enteredName;
    state.className = teacherLogin ? (classInput.value.trim() || "Teacher Mode") : classInput.value.trim();
    state.path = teacherLogin ? "Teacher Mode" : path.value;
    state.startedAt = state.startedAt || new Date().toISOString();
    awardXP(25, "landing");
    saveProgress();
    if (teacherLogin) showToast("Teacher Mode active: all pages unlocked.");
    showView("mission1");
  };
}

function setupQuizButtons() {
  document.querySelectorAll(".q button").forEach(btn => {
    btn.addEventListener("click", () => {
      btn.parentElement.querySelectorAll("button").forEach(b => b.classList.remove("selected", "correct", "wrong"));
      btn.classList.add("selected");
    });
  });
  document.querySelectorAll(".check-quiz").forEach(btn => {
    btn.addEventListener("click", () => {
      const quizName = btn.dataset.quiz;
      const quiz = document.querySelector(`.quiz[data-quiz="${quizName}"]`);
      const questions = [...quiz.querySelectorAll(".q")];
      let correct = 0;
      questions.forEach(q => {
        const answer = q.dataset.answer;
        const selected = q.querySelector("button.selected");
        q.querySelectorAll("button").forEach(b => {
          b.classList.toggle("correct", b.textContent.trim() === answer);
          if (selected && b === selected && b.textContent.trim() !== answer) b.classList.add("wrong");
        });
        if (selected && selected.textContent.trim() === answer) correct++;
      });
      document.getElementById(`feedback-${quizName}`).textContent = `You scored ${correct}/${questions.length}. ${correct === questions.length ? "Badge progress unlocked." : "Fix the red answer and try again."}`;
      if (correct === questions.length) awardXP(80, quizName, "Index Explorer");
    });
  });
}

function renderTapGame() {
  const wrapper = document.getElementById("tapGame");
  const feedback = document.getElementById("tapFeedback");
  const progress = getTapProgress();

  if (progress >= TAP_TOTAL) {
    wrapper.innerHTML = `
      <div class="tap-complete-card">
        <div class="success-icon">✓</div>
        <h3>Index Tap Practice complete</h3>
        <p>You answered all ${TAP_TOTAL} index questions. You can now move to Code Lab.</p>
        <div class="tap-progress-card complete">
          <strong>Progress</strong>
          <span>${TAP_TOTAL} / ${TAP_TOTAL} complete</span>
          <div class="tap-progress-bar"><div style="width: 100%"></div></div>
        </div>
        <button class="ghost" id="practiceTapAgain">Practise again</button>
      </div>`;
    feedback.textContent = "Mission 2 complete. Use Next Mission to continue.";
    const again = document.getElementById("practiceTapAgain");
    if (again) {
      again.onclick = () => {
        state.answers.tapProgress = 0;
        saveProgress();
        renderTapGame();
      };
    }
    updateBottomNav();
    return;
  }

  const q = tapQuestions[progress];
  wrapper.innerHTML = `
    <div class="tap-progress-card">
      <div class="tap-progress-top">
        <strong>Index Tap progress</strong>
        <span>Question ${progress + 1} / ${TAP_TOTAL}</span>
      </div>
      <div class="tap-progress-bar"><div style="width: ${(progress / TAP_TOTAL) * 100}%"></div></div>
    </div>
    <div class="tap-question">What is <code>${q.code}</code>?</div>
    <div class="index-table mini">
      ${q.items.map((item, i) => `<div class="index-cell index-number">${i}</div>`).join("")}
      ${q.items.map(item => `<div class="index-cell item">${item}</div>`).join("")}
    </div>
    <div class="tap-options">${q.items.map(item => `<button class="tap-item">${item}</button>`).join("")}</div>`;

  feedback.textContent = `Answer all ${TAP_TOTAL} questions to unlock Code Lab.`;
  wrapper.querySelectorAll(".tap-item").forEach(btn => {
    btn.addEventListener("click", () => {
      wrapper.querySelectorAll(".tap-item").forEach(b => b.classList.remove("selected", "wrong"));
      btn.classList.add("selected");
      if (btn.textContent.trim() === q.answer) {
        const nextProgress = progress + 1;
        state.answers.tapProgress = nextProgress;
        if (nextProgress >= TAP_TOTAL) {
          awardXP(90, "mission2", "Index Explorer");
          feedback.textContent = "Correct. Index Tap Practice complete.";
          setTimeout(renderTapGame, 650);
        } else {
          saveProgress();
          feedback.textContent = `Correct. ${nextProgress} / ${TAP_TOTAL} complete.`;
          setTimeout(renderTapGame, 650);
        }
      } else {
        btn.classList.add("wrong");
        feedback.textContent = "Not yet. Count from 0 and try again.";
      }
    });
  });
}

function renderCodeLab() {
  if (!canOpenCodeTask(currentCodeTask)) {
    currentCodeTask = codeTasks.findIndex((_, index) => !isCodeTaskComplete(index));
    if (currentCodeTask < 0) currentCodeTask = codeTasks.length - 1;
  }

  const tabs = document.getElementById("codeTabs");
  tabs.innerHTML = codeTasks.map((task, i) => {
    const done = isCodeTaskComplete(i);
    const locked = !canOpenCodeTask(i);
    return `<button class="tab-btn ${i === currentCodeTask ? "active" : ""} ${done ? "done" : ""} ${locked ? "locked" : ""}" data-code-tab="${i}" ${locked ? "disabled" : ""}>${done ? "✓ " : locked ? "🔒 " : ""}Skill ${i + 1}: ${task.skill}</button>`;
  }).join("");
  tabs.querySelectorAll("button").forEach(btn => btn.onclick = () => {
    const target = Number(btn.dataset.codeTab);
    if (!canOpenCodeTask(target)) {
      showToast("Complete the previous Code Lab skill first.");
      return;
    }
    currentCodeTask = target;
    renderCodeLab();
  });

  const progressPanel = document.getElementById("codeProgressPanel");
  const completedCount = codeTasks.filter((_, index) => isCodeTaskComplete(index)).length;
  progressPanel.innerHTML = `
    <strong>Code Lab progress:</strong> ${completedCount} / ${codeTasks.length} skills completed.
    ${isCodeLabComplete()
      ? "All Code Lab skills are complete. You may move to Index Raider."
      : "Complete each skill check to unlock the next skill and the next mission."}
  `;
  progressPanel.classList.toggle("complete", isCodeLabComplete());

  const task = codeTasks[currentCodeTask];
  const challengeKey = `task${currentCodeTask}`;
  const playKey = `play${currentCodeTask}`;
  const predictKey = `predict${currentCodeTask}`;
  const savedChallenge = state.code[challengeKey] || task.starter;
  const savedPlay = state.code[playKey] || task.playCode;
  const savedPrediction = state.answers[predictKey] || "";

  document.getElementById("codeLab").innerHTML = `
    <div class="code-lab-top">
      <div>
        <h2>${escapeHtml(task.title)}</h2>
        <p class="lead-small">${escapeHtml(task.learningGoal)}</p>
      </div>
      <div class="skill-pill">Skill ${currentCodeTask + 1} / ${codeTasks.length}</div>
    </div>

    <div class="code-lab-flow">
      <section class="lesson-block syntax-block">
        <div class="step-badge">Read</div>
        <h3>${escapeHtml(task.syntaxName)}</h3>
        <p>${escapeHtml(task.reading)}</p>
        <pre><code>${escapeHtml(task.syntaxPattern)}</code></pre>
        <div class="think-card"><strong>Think:</strong> Which part is the variable name? Which part is the value or index?</div>
      </section>

      <section class="lesson-block example-block">
        <div class="step-badge">Explore</div>
        <h3>${escapeHtml(task.exampleTitle)}</h3>
        <p>Read this example. Before running it, predict what it will output.</p>
        <pre><code>${escapeHtml(task.exampleCode)}</code></pre>
        <label>My prediction before running it
          <textarea id="predictBox" class="reflection-box" placeholder="Write what you think the output will be...">${escapeHtml(savedPrediction)}</textarea>
        </label>
        <div class="button-row">
          <button class="primary" id="runExampleCode">Run example in web Python</button>
          <button class="ghost" id="showExampleOutput">Reveal expected output</button>
        </div>
        <div id="exampleRunOutput" class="python-output hidden"></div>
        <div id="exampleOutput" class="output-box hidden"></div>
      </section>

      <section class="lesson-block playground-block">
        <div class="step-badge">Play</div>
        <h3>Safe sample to edit</h3>
        <p>${escapeHtml(task.playPrompt)}</p>
        <textarea id="playEditor" class="code-editor small-editor" spellcheck="false">${escapeHtml(savedPlay)}</textarea>
        <div class="button-row">
          <button class="primary" id="runPlayCode">Run play code</button>
          <button class="ghost" id="savePlay">Save play code</button>
          <button class="ghost" id="resetPlay">Reset play sample</button>
        </div>
        <div id="playOutput" class="python-output hidden"></div>
        <div class="callout"><strong>Learning tip:</strong> This section is for experimenting. Run it below, then come back for the challenge.</div>
      </section>

      <section class="lesson-block challenge-block">
        <div class="step-badge">Create</div>
        <h3>Your challenge: ${escapeHtml(task.challengeTitle)}</h3>
        <p>${escapeHtml(task.challengeBrief)}</p>
        <div class="target-card"><strong>Target output:</strong> ${escapeHtml(task.target)}</div>
        <textarea id="taskEditor" class="code-editor" spellcheck="false">${escapeHtml(savedChallenge)}</textarea>
        <div class="button-row">
          <button class="primary" id="runChallengeCode">Run challenge code</button>
          <button class="ghost" id="checkTask">Check structure</button>
          <button class="ghost" id="showHints">Show hints</button>
          <button class="ghost" id="resetChallenge">Reset challenge</button>
          <button class="ghost" id="saveTask">Save challenge</button>
        </div>
        <div id="taskOutput" class="python-output hidden"></div>
        <div id="hintBox" class="hint-box hidden"></div>
        <div id="taskResults" class="result-list"></div>
      </section>
    </div>

    <div class="callout evidence-callout"><strong>Evidence reminder:</strong> Run your final challenge in the web Python editor. Screenshot your code and output. The website checks structure first, and the web editor lets you test whether the code actually runs.</div>`;

  const editor = document.getElementById("taskEditor");
  const playEditor = document.getElementById("playEditor");
  const predictBox = document.getElementById("predictBox");

  editor.addEventListener("input", () => {
    state.code[challengeKey] = editor.value;
    saveProgress();
  });
  playEditor.addEventListener("input", () => {
    state.code[playKey] = playEditor.value;
    saveProgress();
  });
  predictBox.addEventListener("input", () => {
    state.answers[predictKey] = predictBox.value;
    saveProgress();
  });

  document.getElementById("saveTask").onclick = () => { state.code[challengeKey] = editor.value; saveProgress(); showToast("Challenge code saved in this browser."); };
  document.getElementById("savePlay").onclick = () => { state.code[playKey] = playEditor.value; saveProgress(); showToast("Play code saved in this browser."); };
  document.getElementById("resetPlay").onclick = () => { playEditor.value = task.playCode; state.code[playKey] = task.playCode; saveProgress(); };
  document.getElementById("resetChallenge").onclick = () => { editor.value = task.starter; state.code[challengeKey] = task.starter; document.getElementById("taskResults").innerHTML = ""; saveProgress(); };

  document.getElementById("runExampleCode").onclick = () => runCodeString(task.exampleCode, "exampleRunOutput");
  document.getElementById("runPlayCode").onclick = () => runEditorCode("playEditor", "playOutput");
  document.getElementById("runChallengeCode").onclick = () => runEditorCode("taskEditor", "taskOutput");
  document.getElementById("showExampleOutput").onclick = () => {
    const box = document.getElementById("exampleOutput");
    box.textContent = task.exampleOutput;
    box.classList.toggle("hidden");
  };
  document.getElementById("showHints").onclick = () => {
    const box = document.getElementById("hintBox");
    box.innerHTML = `<strong>Hints, not the full solution:</strong><ol>${task.hints.map(h => `<li>${escapeHtml(h)}</li>`).join("")}</ol>`;
    box.classList.toggle("hidden");
  };
  document.getElementById("checkTask").onclick = () => {
    const runnableCode = codeForStructureChecks(editor.value);
    const results = task.checks.map(c => ({ label: c.label, pass: c.test(runnableCode) }));
    document.getElementById("taskResults").innerHTML = results.map(r => `<div class="result-item ${r.pass ? "pass" : "fail"}">${r.pass ? "✓" : "✗"} ${escapeHtml(r.label)}</div>`).join("");
    if (results.every(r => r.pass)) {
      awardXP(50, `codeTask${currentCodeTask}`);
      if (isCodeLabComplete()) {
        awardXP(90, "mission3", "Inventory Builder");
      } else {
        showToast("Skill complete. Use the bottom button to move to the next Code Lab skill.");
      }
      renderCodeLab();
      updateBottomNav();
    }
  };
  updateBottomNav();
}

function startRaider() {
  raider = { round: 1, score: 0, lives: 3, active: true, target: 0, items: [], question: null };
  nextRaiderQuestion();
}

function currentRaiderQuestion() {
  return raider.question || raiderQuestions[(raider.round - 1) % raiderQuestions.length];
}

function nextRaiderQuestion() {
  raider.question = raiderQuestions[(raider.round - 1) % raiderQuestions.length];
  raider.items = [...(raider.question.items || [])];
  renderRaider();
}

function renderRaider() {
  const q = currentRaiderQuestion();
  document.getElementById("raiderScore").textContent = raider.score;
  document.getElementById("raiderLives").textContent = raider.lives;
  document.getElementById("raiderRound").textContent = `${Math.min(raider.round, RAIDER_ROUNDS)} / ${RAIDER_ROUNDS}`;

  const treasureRow = document.getElementById("treasureRow");
  treasureRow.innerHTML = q.items?.length ? q.items.map((item, i) => `
    <div class="treasure-card"><div class="idx">${i}</div><div class="icon">${itemIcons[item] || "🎒"}</div><strong>${escapeHtml(item)}</strong></div>
  `).join("") : `<div class="syntax-arena-card">Read the Python code carefully. This round is testing syntax and prediction, not just matching an item.</div>`;

  document.getElementById("raiderQuestion").innerHTML = `
    <span class="raider-type">${escapeHtml(q.type)}</span>
    <span>${escapeHtml(q.question)}</span>
    <pre class="raider-code"><code>${escapeHtml(q.code)}</code></pre>
  `;

  document.getElementById("raiderOptions").innerHTML = shuffle([...q.options]).map(item => `<button data-answer="${escapeAttr(item)}">${escapeHtml(item)}</button>`).join("");
  document.getElementById("raiderFeedback").textContent = "";
  document.querySelectorAll("#raiderOptions button").forEach(btn => btn.onclick = handleRaiderAnswer);
}

function handleRaiderAnswer(e) {
  if (!raider.active) return;
  const q = currentRaiderQuestion();
  const selected = e.currentTarget.dataset.answer;
  const correct = q.answer;
  if (selected === correct) {
    raider.score += 20;
    document.getElementById("raiderFeedback").textContent = `Correct. ${q.explanation}`;
    e.currentTarget.classList.add("correct");
    document.querySelectorAll("#raiderOptions button").forEach(btn => btn.disabled = true);
    if (raider.round >= RAIDER_ROUNDS) {
      raider.active = false;
      awardXP(140, "mission4", "Index Explorer");
      document.getElementById("raiderFeedback").textContent = "Victory. You completed the programming-style Index Raider quiz and unlocked the Index Explorer badge.";
    } else {
      raider.round++;
      setTimeout(nextRaiderQuestion, 1200);
    }
  } else {
    raider.lives--;
    e.currentTarget.classList.add("wrong");
    e.currentTarget.disabled = true;
    if (raider.lives <= 0) {
      raider.active = false;
      document.getElementById("raiderFeedback").textContent = `Game over. Correct answer: ${correct}. ${q.explanation}`;
      document.querySelectorAll("#raiderOptions button").forEach(btn => btn.disabled = true);
    } else {
      document.getElementById("raiderFeedback").textContent = "Not yet. Lose 1 life. Read the code again and use the index/syntax carefully.";
    }
  }
  document.getElementById("raiderScore").textContent = raider.score;
  document.getElementById("raiderLives").textContent = raider.lives;
}

function setupInventoryChallenge() {
  setupInventoryBuilder({
    editorId: "inventoryCode",
    outputId: "inventoryOutput",
    checklistId: "inventoryChecklist",
    runId: "runInventoryCode",
    checkId: "checkInventoryCode",
    saveId: "saveInventoryCode",
    resetId: "resetInventoryStarter",
    stateKey: "inventory",
    starter: inventoryStarter,
    resetMessage: "Inventory Builder 1 scaffold reset. Replace the TODOs with your own ideas.",
    saveMessage: "Inventory Builder 1 code saved.",
    xp: 120,
    completionId: "mission5",
    badgeId: "Inventory Builder",
    checks: code => {
      const runnableCode = codeForStructureChecks(code);
      const quotedItems = runnableCode.match(/["'][^"']+["']/g) || [];
      return [
        { label: "Replaces TODOs in runnable code", pass: !hasTodoInExecutableCode(code) },
        { label: "Creates a list using square brackets", pass: /\w+\s*=\s*\[[\s\S]*,\s*[\s\S]*,\s*[\s\S]*,\s*[\s\S]*\]/.test(runnableCode) },
        { label: "Uses at least 4 text items across the program", pass: quotedItems.length >= 4 },
        { label: "Prints the full inventory list", pass: /print\s*\(\s*inventory\s*\)/.test(runnableCode) },
        { label: "Prints one item using an index such as inventory[0]", pass: /print\s*\(\s*inventory\s*\[\s*\d+\s*\]\s*\)/.test(runnableCode) },
        { label: "Changes an item using inventory[index] = value", pass: /inventory\s*\[\s*\d+\s*\]\s*=\s*["'][^"']+["']/.test(runnableCode) },
        { label: "Uses inventory.append() to add one item", pass: /inventory\.append\s*\(\s*["'][^"']+["']\s*\)/.test(runnableCode) },
        { label: "Uses print(len(inventory)) to count the items", pass: /print\s*\(\s*len\s*\(\s*inventory\s*\)\s*\)/.test(runnableCode) }
      ];
    }
  });

  setupInventoryBuilder({
    editorId: "inventory2Code",
    outputId: "inventory2Output",
    checklistId: "inventory2Checklist",
    runId: "runInventory2Code",
    checkId: "checkInventory2Code",
    saveId: "saveInventory2Code",
    resetId: "resetInventory2Starter",
    stateKey: "inventory2",
    starter: inventory2Starter,
    resetMessage: "Inventory Builder 2 reset. Build the cafe order with less scaffolding.",
    saveMessage: "Inventory Builder 2 code saved.",
    xp: 90,
    completionId: "mission6",
    badgeId: null,
    checks: code => {
      const runnableCode = codeForStructureChecks(code);
      const orderListMatch = runnableCode.match(/order\s*=\s*\[([\s\S]*?)\]/);
      const orderItems = orderListMatch ? ((orderListMatch[1].match(/["'][^"']+["']/g) || [])) : [];
      return [
        { label: "Creates a list called order", pass: /order\s*=\s*\[[\s\S]*\]/.test(runnableCode) },
        { label: "Includes at least 4 cafe items in order", pass: orderItems.length >= 4 },
        { label: "Prints the full order list", pass: /print\s*\(\s*order\s*\)/.test(runnableCode) },
        { label: "Prints the item at index 2", pass: /print\s*\(\s*order\s*\[\s*2\s*\]\s*\)/.test(runnableCode) },
        { label: "Replaces one order item using an index", pass: /order\s*\[\s*\d+\s*\]\s*=\s*["'][^"']+["']/.test(runnableCode) },
        { label: "Uses order.append() to add a dessert or drink", pass: /order\.append\s*\(\s*["'][^"']+["']\s*\)/.test(runnableCode) },
        { label: "Prints len(order) to count the order", pass: /print\s*\(\s*len\s*\(\s*order\s*\)\s*\)/.test(runnableCode) }
      ];
    }
  });

  setupInventoryBuilder({
    editorId: "inventory3Code",
    outputId: "inventory3Output",
    checklistId: "inventory3Checklist",
    runId: "runInventory3Code",
    checkId: "checkInventory3Code",
    saveId: "saveInventory3Code",
    resetId: "resetInventory3Starter",
    stateKey: "inventory3",
    starter: inventory3Starter,
    resetMessage: "Inventory Builder 3 reset. Write the full stock tracker yourself.",
    saveMessage: "Inventory Builder 3 code saved.",
    xp: 110,
    completionId: "mission7",
    badgeId: null,
    checks: code => {
      const runnableCode = codeForStructureChecks(code);
      const stockListMatch = runnableCode.match(/stock\s*=\s*\[([\s\S]*?)\]/);
      const stockItems = stockListMatch ? ((stockListMatch[1].match(/["'][^"']+["']/g) || [])) : [];
      const usesLastIndex = /print\s*\(\s*stock\s*\[\s*4\s*\]\s*\)/.test(runnableCode) || /print\s*\(\s*stock\s*\[\s*len\s*\(\s*stock\s*\)\s*-\s*1\s*\]\s*\)/.test(runnableCode);
      return [
        { label: "Creates a list called stock", pass: /stock\s*=\s*\[[\s\S]*\]/.test(runnableCode) },
        { label: "Includes at least 5 shop items in stock", pass: stockItems.length >= 5 },
        { label: "Prints the last item using an index", pass: usesLastIndex },
        { label: "Replaces a sold-out item using an index", pass: /stock\s*\[\s*\d+\s*\]\s*=\s*["'][^"']+["']/.test(runnableCode) },
        { label: "Uses stock.append() for a new arrival", pass: /stock\.append\s*\(\s*["'][^"']+["']\s*\)/.test(runnableCode) },
        { label: "Prints the final stock list", pass: /print\s*\(\s*stock\s*\)/.test(runnableCode) },
        { label: "Prints len(stock) to count the stock", pass: /print\s*\(\s*len\s*\(\s*stock\s*\)\s*\)/.test(runnableCode) }
      ];
    }
  });
}

function setupInventoryBuilder(config) {
  const textarea = document.getElementById(config.editorId);
  if (!textarea) return;
  textarea.value = state.code[config.stateKey] || config.starter;
  textarea.addEventListener("input", () => {
    state.code[config.stateKey] = textarea.value;
    saveProgress();
  });
  const runBtn = document.getElementById(config.runId);
  if (runBtn) runBtn.onclick = () => runEditorCode(config.editorId, config.outputId);
  const saveBtn = document.getElementById(config.saveId);
  if (saveBtn) saveBtn.onclick = () => {
    state.code[config.stateKey] = textarea.value;
    saveProgress();
    showToast(config.saveMessage);
  };
  const resetBtn = document.getElementById(config.resetId);
  if (resetBtn) resetBtn.onclick = () => {
    textarea.value = config.starter;
    state.code[config.stateKey] = config.starter;
    saveProgress();
    const checklist = document.getElementById(config.checklistId);
    if (checklist) checklist.innerHTML = "";
    const output = document.getElementById(config.outputId);
    if (output) output.classList.add("hidden");
    showToast(config.resetMessage);
  };
  const checkBtn = document.getElementById(config.checkId);
  if (checkBtn) checkBtn.onclick = () => {
    const checks = config.checks(textarea.value);
    document.getElementById(config.checklistId).innerHTML = checks.map(c => `<div class="result-item ${c.pass ? "pass" : "fail"}">${c.pass ? "✓" : "✗"} ${c.label}</div>`).join("");
    if (checks.every(c => c.pass)) awardXP(config.xp, config.completionId, config.badgeId);
  };
}

const klChallenges = {
  kl1: {
    answer: "47",
    starter: `# Bronze Gate 1: sum positive supplies
supplies = [12, -5, 7, 0, -3, 20, 8]

# TODO: create a total variable
# TODO: loop through supplies
# TODO: add only values greater than 0
# TODO: print the total`,
    checks: [
      { label: "No TODOs left in runnable code", test: code => !hasTodoInExecutableCode(code) },
      { label: "Uses a loop to inspect the list", test: code => /for\s+\w+\s+in\s+supplies/.test(code) },
      { label: "Uses a condition to check positive values", test: code => /if[\s\S]*>\s*0/.test(code) },
      { label: "Prints the final total", test: code => /print\s*\(/.test(code) }
    ]
  },
  kl2: {
    answer: "315",
    starter: `# Bronze Gate 2: product of odd numbers
numbers = [2, 9, 4, 5, 7, 10]

# TODO: start product at 1
# TODO: loop through the numbers
# TODO: if a number is odd, multiply it into the product
# TODO: print the product`,
    checks: [
      { label: "No TODOs left in runnable code", test: code => !hasTodoInExecutableCode(code) },
      { label: "Uses a loop", test: code => /for\s+\w+\s+in\s+numbers/.test(code) },
      { label: "Uses modulo to test odd numbers", test: code => /%\s*2/.test(code) },
      { label: "Multiplies into a running product", test: code => /\*=|=\s*\w+\s*\*|=\s*\w+\s*\*/.test(code) }
    ]
  },
  kl3: {
    answer: "4",
    starter: `# Bronze Gate 3: peak detector
numbers = [4, 9, 3, 7, 6, 8, 2, 8, 1]

# TODO: count values that are bigger than both neighbours
# Hint: do not check index 0 or the last index
# TODO: print the count`,
    checks: [
      { label: "No TODOs left in runnable code", test: code => !hasTodoInExecutableCode(code) },
      { label: "Uses range() to avoid first and last positions", test: code => /range\s*\(/.test(code) },
      { label: "Compares with the previous neighbour", test: code => /\[\s*\w+\s*-\s*1\s*\]/.test(code) },
      { label: "Compares with the next neighbour", test: code => /\[\s*\w+\s*\+\s*1\s*\]/.test(code) }
    ]
  },
  kl4: {
    answer: "4",
    starter: `# Gate 4: points inside or on a circle
r = 5
coordinates = [[3, 4], [5, 0], [4, 4], [0, 0], [-6, 0], [2, -2]]

# TODO: loop through each coordinate
# TODO: get x and y from each pair
# TODO: check x*x + y*y <= r*r
# TODO: print the count`,
    checks: [
      { label: "No TODOs left in runnable code", test: code => !hasTodoInExecutableCode(code) },
      { label: "Loops through the 2D coordinate list", test: code => /for\s+\w+\s+in\s+coordinates/.test(code) },
      { label: "Accesses x and y values from each pair", test: code => /\[\s*0\s*\]/.test(code) && /\[\s*1\s*\]/.test(code) },
      { label: "Uses the circle rule", test: code => /<=/.test(code) && (/r\s*\*\s*r/.test(code) || /r\s*\*\*\s*2/.test(code)) }
    ]
  },
  kl5: {
    answer: "Banshee",
    starter: `# Silver Gate 5: sort entities by power
entities = [["Banshee", 5], ["Wraith", 8], ["Ghost", 3], ["Vampire", 7], ["Zombie", 4]]

# TODO: sort by power level in descending order
# TODO: find the middle index
# TODO: print the name of the middle entity`,
    checks: [
      { label: "No TODOs left in runnable code", test: code => !hasTodoInExecutableCode(code) },
      { label: "Uses sort() or sorted()", test: code => /\.sort\s*\(|sorted\s*\(/.test(code) },
      { label: "Sorts using the power level", test: code => /\[\s*1\s*\]/.test(code) },
      { label: "Finds a middle index", test: code => /len\s*\(\s*entities\s*\)\s*\/\/\s*2|\/\/\s*2/.test(code) }
    ]
  },
  kl6: {
    answer: "2",
    starter: `# Gold Preview Gate 6: target sum regions in one row
k = 2
row = [1, 1, 3, -1]

# TODO: check every start position
# TODO: check every end position
# TODO: keep a running sum
# TODO: count how many regions add up to k
# TODO: print the count`,
    checks: [
      { label: "No TODOs left in runnable code", test: code => !hasTodoInExecutableCode(code) },
      { label: "Uses at least two loops", test: code => (code.match(/for\s+/g) || []).length >= 2 },
      { label: "Uses indexes or slices to check regions", test: code => /\[/.test(code) && /\]/.test(code) },
      { label: "Compares a region sum with k", test: code => /==\s*k|k\s*==/.test(code) }
    ]
  }
};

function setupKL() {
  Object.keys(klChallenges).forEach(id => {
    const el = document.getElementById(id);
    const answerEl = document.getElementById(`${id}Answer`);
    if (!el) return;
    el.value = state.code[id] || klChallenges[id].starter;
    if (answerEl) answerEl.value = state.answers[`${id}Answer`] || "";
    el.addEventListener("input", () => { state.code[id] = el.value; saveProgress(); });
    if (answerEl) answerEl.addEventListener("input", () => { state.answers[`${id}Answer`] = answerEl.value; saveProgress(); });
  });

  document.querySelectorAll(".kl-run").forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.target;
      runEditorCode(id, `${id}Output`);
    };
  });

  document.querySelectorAll(".kl-check").forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.target;
      const challenge = klChallenges[id];
      const code = (document.getElementById(id)?.value || "").trim();
      const runnableCode = codeForStructureChecks(code);
      const output = (document.getElementById(`${id}Answer`)?.value || "").trim();
      const feedback = document.getElementById(`${id}Feedback`);
      const checks = challenge.checks.map(c => ({ label: c.label, pass: c.test(runnableCode) }));
      const answerPass = output.toLowerCase() === challenge.answer.toLowerCase();
      checks.push({ label: "Final output matches the visible test", pass: answerPass });
      if (feedback) {
        feedback.innerHTML = checks.map(c => `<div class="result-item ${c.pass ? "pass" : "fail"}">${c.pass ? "✓" : "✗"} ${c.label}</div>`).join("");
      }
      if (checks.every(c => c.pass)) {
        awardXP(id === "kl6" ? 110 : 80, id, "KL Challenger");
      } else {
        showToast("Not yet. Improve the algorithm and check the output again.");
      }
    };
  });
}

function setupExit() {
  ["exit1", "exit2", "exit3", "exit4", "reflection"].forEach(id => {
    const el = document.getElementById(id);
    el.value = state.answers[id] || "";
    el.addEventListener("input", () => { state.answers[id] = el.value; saveProgress(); });
  });
  document.getElementById("submitExit").onclick = () => {
    ["exit1", "exit2", "exit3", "exit4", "reflection"].forEach(id => state.answers[id] = document.getElementById(id).value.trim());
    const a1 = state.answers.exit1.toLowerCase();
    const a2 = state.answers.exit2.toLowerCase();
    const a3 = state.answers.exit3.toLowerCase();
    let score = 0;
    if (a1.includes("0") || a1.includes("zero")) score++;
    if (a2.includes("dog")) score++;
    if (a3.includes("add") || a3.includes("end") || a3.includes("new")) score++;
    if ((state.answers.exit4 || "").length > 6) score++;
    if ((state.answers.reflection || "").length > 12) score++;
    renderSummary(score);
    awardXP(95, "exit", score >= 4 ? "Bug Spotter" : null);
  };
  document.getElementById("printSummary").onclick = () => { renderSummary(); window.print(); };
}

function renderSummary(score = null) {
  const summary = document.getElementById("summary");
  summary.classList.remove("hidden");
  summary.innerHTML = `
    <h2>Array Quest Day 1 Summary</h2>
    <p><strong>Name:</strong> ${escapeHtml(state.name || "")} · <strong>Class:</strong> ${escapeHtml(state.className || "")} · <strong>Path:</strong> ${escapeHtml(state.path || "")}</p>
    <p><strong>XP:</strong> ${state.xp || 0} / 700 ${score !== null ? `· <strong>Exit score:</strong> ${score}/5` : ""}</p>
    <p><strong>Badges:</strong> ${Object.keys(state.badges).length ? Object.keys(state.badges).map(escapeHtml).join(", ") : "No badges yet"}</p>
    <hr>
    <p><strong>Q1:</strong> ${escapeHtml(state.answers.exit1 || "")}</p>
    <p><strong>Q2:</strong> ${escapeHtml(state.answers.exit2 || "")}</p>
    <p><strong>Q3:</strong> ${escapeHtml(state.answers.exit3 || "")}</p>
    <p><strong>Game example:</strong> ${escapeHtml(state.answers.exit4 || "")}</p>
    <p><strong>Reflection:</strong> ${escapeHtml(state.answers.reflection || "")}</p>`;
}

function setupGlobalButtons() {
  document.getElementById("prevBtn").onclick = () => {
    const index = missions.findIndex(m => m.id === state.current);
    if (index > 0) showView(missions[index - 1].id);
  };
  document.getElementById("nextBtn").onclick = () => {
    const index = missions.findIndex(m => m.id === state.current);

    if (state.current === "mission3") {
      if (!isTeacherMode() && !isCodeTaskComplete(currentCodeTask)) {
        showToast("Complete the current Code Lab skill check first.");
        return;
      }
      if (currentCodeTask < codeTasks.length - 1) {
        currentCodeTask++;
        renderCodeLab();
        updateBottomNav();
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      if (!isTeacherMode() && !isCodeLabComplete()) {
        showToast("Complete all 5 Code Lab skills before moving on.");
        return;
      }
    }

    if (index < missions.length - 1) {
      const nextId = missions[index + 1].id;
      if (isMissionLocked(nextId)) {
        showToast(lockMessageFor(nextId));
        return;
      }
      showView(nextId);
    }
  };
  document.getElementById("backupBtn").onclick = downloadBackup;
  document.getElementById("resetBtn").onclick = () => resetSession(true);
  document.getElementById("restartRaider").onclick = startRaider;
}

function downloadBackup() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const safeName = (state.name || "student").replace(/[^a-z0-9]/gi, "_").toLowerCase();
  a.href = url;
  a.download = `array-quest-day1-${safeName}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast("Backup downloaded.");
}

function resetSession(confirmFirst = true) {
  if (confirmFirst && !confirm("Reset this browser session? Backup first if this is not your work.")) return;
  localStorage.removeItem(STORAGE_KEY);
  state = { ...defaultProgress };
  location.reload();
}

function shuffle(arr) {
  return arr.map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value);
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>'"]/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "'":"&#39;", '"':"&quot;" }[c]));
}
function escapeAttr(value) { return escapeHtml(value).replace(/`/g, "&#96;"); }

function init() {
  renderShell();
  setupLanding();
  setupQuizButtons();
  setupInventoryChallenge();
  setupKL();
  setupExit();
  setupGlobalButtons();
  if (!raider.items.length) startRaider();
  showView(state.current || "landing");
}

document.addEventListener("DOMContentLoaded", init);
