import { spawn } from "node:child_process";

const ROOT = "C:\\Users\\Usuario\\Documents\\TaskFlow";
const server = spawn("cmd", ["/c", "npx", "-y", "@modelcontextprotocol/server-filesystem", ROOT], {
  stdio: ["pipe", "pipe", "pipe"]
});

let nextId = 1;
const pending = new Map();
let buffer = "";

server.stdout.on("data", chunk => {
  buffer += chunk.toString();
  const lines = buffer.split(/\r?\n/);
  buffer = lines.pop() ?? "";

  for (const line of lines) {
    if (!line.trim()) continue;
    const message = JSON.parse(line);
    if (typeof message.id !== "undefined" && pending.has(message.id)) {
      pending.get(message.id)(message);
      pending.delete(message.id);
    }
  }
});

server.stderr.on("data", chunk => {
  process.stderr.write(chunk.toString());
});

function send(method, params = {}) {
  const id = nextId++;
  const payload = { jsonrpc: "2.0", id, method, params };
  return new Promise(resolve => {
    pending.set(id, resolve);
    server.stdin.write(`${JSON.stringify(payload)}\n`);
  });
}

function pickToolName(names, aliases) {
  for (const alias of aliases) {
    if (names.includes(alias)) return alias;
  }
  return null;
}

async function callTool(toolName, args) {
  return send("tools/call", { name: toolName, arguments: args });
}

async function run() {
  const init = await send("initialize", {
    protocolVersion: "2024-11-05",
    capabilities: {},
    clientInfo: { name: "taskflow-mcp-check", version: "1.0.0" }
  });
  console.log("INIT_OK", Boolean(init.result));

  await send("notifications/initialized");

  const toolsResponse = await send("tools/list");
  const toolNames = (toolsResponse.result?.tools ?? []).map(tool => tool.name);
  console.log("TOOLS", toolNames.join(", "));

  const toolForAllowed = pickToolName(toolNames, ["list_allowed_directories"]);
  const toolForListDir = pickToolName(toolNames, ["list_directory"]);
  const toolForTree = pickToolName(toolNames, ["directory_tree"]);
  const toolForRead = pickToolName(toolNames, ["read_file", "read_text_file"]);
  const toolForSearch = pickToolName(toolNames, ["search_files"]);

  const results = [];

  if (toolForAllowed) {
    results.push(["Consulta 1: directorios permitidos", await callTool(toolForAllowed, {})]);
  }

  if (toolForListDir) {
    results.push(["Consulta 2: listar raiz del proyecto", await callTool(toolForListDir, { path: ROOT })]);
  }

  if (toolForSearch) {
    results.push([
      "Consulta 3: buscar app.js",
      await callTool(toolForSearch, { path: ROOT, pattern: "app.js" })
    ]);
  }

  if (toolForRead) {
    results.push([
      "Consulta 4: leer README",
      await callTool(toolForRead, { path: `${ROOT}\\README.md` })
    ]);
  }

  if (toolForTree) {
    results.push([
      "Consulta 5: arbol de docs/ai",
      await callTool(toolForTree, { path: `${ROOT}\\docs\\ai` })
    ]);
  }

  for (const [title, response] of results) {
    console.log(`\n=== ${title} ===`);
    if (response.error) {
      console.log("ERROR", JSON.stringify(response.error));
      continue;
    }
    const content = response.result?.content ?? [];
    console.log(JSON.stringify(content).slice(0, 900));
  }

  server.kill();
}

run().catch(error => {
  console.error(error);
  server.kill();
  process.exit(1);
});
