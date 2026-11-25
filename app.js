const STATIC_PRESETS = {
  small: {
    sourceId: "A",
    targetId: "F",
    nodes: [
      { id: "A", name: "Central Hub", x: 120, y: 150 },
      { id: "B", name: "North Gate", x: 305, y: 90 },
      { id: "C", name: "Market Sq", x: 285, y: 325 },
      { id: "D", name: "University", x: 520, y: 100 },
      { id: "E", name: "Harbor", x: 530, y: 335 },
      { id: "F", name: "Airport", x: 725, y: 220 }
    ],
    edges: [
      { id: "e1", from: "A", to: "B", weight: 6 },
      { id: "e2", from: "A", to: "C", weight: 9 },
      { id: "e3", from: "B", to: "C", weight: 4 },
      { id: "e4", from: "B", to: "D", weight: 11 },
      { id: "e5", from: "C", to: "E", weight: 7 },
      { id: "e6", from: "D", to: "E", weight: 5 },
      { id: "e7", from: "D", to: "F", weight: 8 },
      { id: "e8", from: "E", to: "F", weight: 6 }
    ]
  },
  medium: {
    sourceId: "N1",
    targetId: "N10",
    nodes: [
      { id: "N1", name: "Downtown", x: 95, y: 120 },
      { id: "N2", name: "Midtown", x: 245, y: 80 },
      { id: "N3", name: "Civic Ctr", x: 230, y: 245 },
      { id: "N4", name: "Old Town", x: 110, y: 380 },
      { id: "N5", name: "Tech Park", x: 420, y: 90 },
      { id: "N6", name: "Stadium", x: 405, y: 245 },
      { id: "N7", name: "South Mall", x: 325, y: 385 },
      { id: "N8", name: "Med City", x: 595, y: 120 },
      { id: "N9", name: "River Bridge", x: 585, y: 335 },
      { id: "N10", name: "Expo Center", x: 745, y: 225 }
    ],
    edges: [
      { id: "m1", from: "N1", to: "N2", weight: 5 },
      { id: "m2", from: "N1", to: "N3", weight: 8 },
      { id: "m3", from: "N1", to: "N4", weight: 12 },
      { id: "m4", from: "N2", to: "N5", weight: 7 },
      { id: "m5", from: "N2", to: "N3", weight: 4 },
      { id: "m6", from: "N3", to: "N6", weight: 6 },
      { id: "m7", from: "N3", to: "N7", weight: 9 },
      { id: "m8", from: "N4", to: "N7", weight: 5 },
      { id: "m9", from: "N5", to: "N8", weight: 8 },
      { id: "m10", from: "N5", to: "N6", weight: 5 },
      { id: "m11", from: "N6", to: "N8", weight: 7 },
      { id: "m12", from: "N6", to: "N9", weight: 6 },
      { id: "m13", from: "N7", to: "N9", weight: 8 },
      { id: "m14", from: "N8", to: "N10", weight: 6 },
      { id: "m15", from: "N9", to: "N10", weight: 5 }
    ]
  },
  negative: {
    sourceId: "A",
    targetId: "E",
    nodes: [
      { id: "A", name: "Start Hub", x: 115, y: 230 },
      { id: "B", name: "Green Lane", x: 295, y: 105 },
      { id: "C", name: "Toll Road", x: 295, y: 355 },
      { id: "D", name: "EV Rebate", x: 520, y: 105 },
      { id: "E", name: "Logistics", x: 730, y: 230 },
      { id: "F", name: "South Depot", x: 520, y: 355 }
    ],
    edges: [
      { id: "n1", from: "A", to: "B", weight: 10, directed: true },
      { id: "n2", from: "A", to: "C", weight: 6, directed: true },
      { id: "n3", from: "B", to: "D", weight: 4, directed: true },
      { id: "n4", from: "D", to: "B", weight: -6, directed: true },
      { id: "n5", from: "D", to: "E", weight: 7, directed: true },
      { id: "n6", from: "C", to: "F", weight: 5, directed: true },
      { id: "n7", from: "F", to: "E", weight: 9, directed: true },
      { id: "n8", from: "C", to: "D", weight: 3, directed: true }
    ]
  }
};

const state = {
  presetKey: "small",
  nodes: [],
  edges: [],
  sourceId: "A",
  targetId: "F",
  selectedEdgeId: null,
  clickToggle: "source",
  lastDijkstra: null,
  lastBellman: null,
  edgeHitBoxes: []
};

const els = {
  sourceSelect: document.getElementById("sourceSelect"),
  targetSelect: document.getElementById("targetSelect"),
  algorithmSelect: document.getElementById("algorithmSelect"),
  presetSelect: document.getElementById("presetSelect"),
  edgeFrom: document.getElementById("edgeFrom"),
  edgeTo: document.getElementById("edgeTo"),
  edgeWeight: document.getElementById("edgeWeight"),
  newNodeName: document.getElementById("newNodeName"),
  mapInstruction: document.getElementById("mapInstruction"),
  graphCanvas: document.getElementById("graphCanvas"),
  alertBanner: document.getElementById("alertBanner"),
  dijkstraCost: document.getElementById("dijkstraCost"),
  dijkstraPath: document.getElementById("dijkstraPath"),
  dijkstraTime: document.getElementById("dijkstraTime"),
  dijkstraOps: document.getElementById("dijkstraOps"),
  bellmanCost: document.getElementById("bellmanCost"),
  bellmanPath: document.getElementById("bellmanPath"),
  bellmanTime: document.getElementById("bellmanTime"),
  bellmanOps: document.getElementById("bellmanOps"),
  traceLog: document.getElementById("traceLog"),
  benchmarkBars: document.getElementById("benchmarkBars"),
  benchmarkBody: document.getElementById("benchmarkBody"),
  runBtn: document.getElementById("runBtn"),
  saveEdgeBtn: document.getElementById("saveEdgeBtn"),
  removeEdgeBtn: document.getElementById("removeEdgeBtn"),
  addNodeBtn: document.getElementById("addNodeBtn"),
  benchmarkBtn: document.getElementById("benchmarkBtn"),
  resetBtn: document.getElementById("resetBtn")
};

function drawRoundedRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function ensureCoordinates(nodes) {
  return nodes.map((n, idx) => {
    const fallbackX = 110 + ((idx * 135) % 630);
    const fallbackY = 95 + ((idx * 95) % 280);
    return {
      ...n,
      x: typeof n.x === "number" && !Number.isNaN(n.x) ? n.x : fallbackX,
      y: typeof n.y === "number" && !Number.isNaN(n.y) ? n.y : fallbackY
    };
  });
}

function fallbackGenerateGraph(vCount, extraEdgesRatio = 1.8) {
  const nodes = [];
  for (let i = 0; i < vCount; i++) {
    nodes.push({
      id: `N${i + 1}`,
      name: `Zone ${i + 1}`,
      x: 85 + ((i * 97) % 670),
      y: 75 + ((i * 73) % 320)
    });
  }
  const edges = [];
  const edgeSet = new Set();
  for (let i = 0; i < vCount - 1; i++) {
    const a = nodes[i].id;
    const b = nodes[i + 1].id;
    edgeSet.add([a, b].sort().join("--"));
    edges.push({ id: `E_${a}_${b}`, from: a, to: b, weight: ((i * 7) % 15) + 3, directed: false });
  }
  const targetEdges = Math.min((vCount * (vCount - 1)) / 2, Math.floor(vCount * extraEdgesRatio));
  let seed = vCount * 31 + 7;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  while (edges.length < targetEdges) {
    const i = Math.floor(rand() * vCount);
    const j = Math.floor(rand() * vCount);
    if (i === j) continue;
    const a = nodes[i].id;
    const b = nodes[j].id;
    const key = [a, b].sort().join("--");
    if (edgeSet.has(key)) continue;
    edgeSet.add(key);
    edges.push({ id: `E_${a}_${b}`, from: a, to: b, weight: Math.floor(rand() * 25) + 2, directed: false });
  }
  return { nodes, edges, sourceId: nodes[0].id, targetId: nodes[nodes.length - 1].id };
}

function buildPresetData(key) {
  if (key === "large") {
    const genFn = typeof generateSyntheticGraph === "function" ? generateSyntheticGraph : fallbackGenerateGraph;
    const g = genFn(15, 1.8);
    g.nodes[0].name = "Core Hub";
    g.nodes[g.nodes.length - 1].name = "Smart Port";
    return {
      sourceId: g.sourceId,
      targetId: g.targetId,
      nodes: ensureCoordinates(g.nodes),
      edges: g.edges.map((e) => ({ ...e }))
    };
  }
  const src = STATIC_PRESETS[key] || STATIC_PRESETS.small;
  return {
    sourceId: src.sourceId,
    targetId: src.targetId,
    nodes: ensureCoordinates(src.nodes.map((n) => ({ ...n }))),
    edges: src.edges.map((e) => ({ ...e }))
  };
}

function loadPreset(key) {
  const data = buildPresetData(key);
  state.presetKey = STATIC_PRESETS[key] || key === "large" ? key : "small";
  state.nodes = data.nodes;
  state.edges = data.edges;
  state.sourceId = data.sourceId;
  state.targetId = data.targetId;
  state.selectedEdgeId = null;
  state.clickToggle = "source";
  updateClickInstruction();
}

function updateClickInstruction() {
  if (!els.mapInstruction) return;
  const nextLabel = state.clickToggle === "source" ? "Source (Green)" : "Destination (Red)";
  els.mapInstruction.innerHTML = `Next junction click sets: <strong>${nextLabel}</strong>. Click any road badge to load &amp; edit its weight.`;
}

function populateSelects() {
  if (!state.nodes.length) return;
  const optionsHtml = state.nodes
    .map((n) => `<option value="${n.id}">${n.id} — ${n.name}</option>`)
    .join("");

  els.sourceSelect.innerHTML = optionsHtml;
  els.targetSelect.innerHTML = optionsHtml;
  els.edgeFrom.innerHTML = optionsHtml;
  els.edgeTo.innerHTML = optionsHtml;

  const validIds = new Set(state.nodes.map((n) => n.id));
  if (!validIds.has(state.sourceId)) state.sourceId = state.nodes[0].id;
  if (!validIds.has(state.targetId)) state.targetId = state.nodes[state.nodes.length - 1].id;

  els.sourceSelect.value = state.sourceId;
  els.targetSelect.value = state.targetId;

  els.edgeFrom.value = state.nodes[0].id;
  els.edgeTo.value = state.nodes[Math.min(1, state.nodes.length - 1)].id;
}

function showAlert(message, isError = false) {
  if (!message) {
    els.alertBanner.classList.add("hidden");
    els.alertBanner.textContent = "";
    return;
  }
  els.alertBanner.textContent = message;
  els.alertBanner.className = isError ? "alert error" : "alert";
}

function getPathEdgeKeys(path) {
  const keys = new Set();
  if (!Array.isArray(path)) return keys;
  for (let i = 0; i < path.length - 1; i++) {
    keys.add(`${path[i]}->${path[i + 1]}`);
    keys.add(`${path[i + 1]}->${path[i]}`);
  }
  return keys;
}

function drawArrowhead(ctx, fromX, fromY, toX, toY, color, radius = 19) {
  const angle = Math.atan2(toY - fromY, toX - fromX);
  const tipX = toX - Math.cos(angle) * radius;
  const tipY = toY - Math.sin(angle) * radius;
  const headLen = 10;

  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(tipX, tipY);
  ctx.lineTo(
    tipX - headLen * Math.cos(angle - Math.PI / 6),
    tipY - headLen * Math.sin(angle - Math.PI / 6)
  );
  ctx.lineTo(
    tipX - headLen * Math.cos(angle + Math.PI / 6),
    tipY - headLen * Math.sin(angle + Math.PI / 6)
  );
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function renderMap() {
  if (!els.graphCanvas) return;
  const ctx = els.graphCanvas.getContext("2d");
  if (!ctx) return;

  const w = els.graphCanvas.width;
  const h = els.graphCanvas.height;
  ctx.clearRect(0, 0, w, h);

  // Dark gradient background + coordinate grid
  const grad = ctx.createRadialGradient(w * 0.5, h * 0.45, 40, w * 0.5, h * 0.5, w * 0.65);
  grad.addColorStop(0, "#131c33");
  grad.addColorStop(1, "#060a13");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = "rgba(148, 163, 184, 0.08)";
  ctx.lineWidth = 1;
  for (let gx = 0; gx <= w; gx += 40) {
    ctx.beginPath();
    ctx.moveTo(gx, 0);
    ctx.lineTo(gx, h);
    ctx.stroke();
  }
  for (let gy = 0; gy <= h; gy += 40) {
    ctx.beginPath();
    ctx.moveTo(0, gy);
    ctx.lineTo(w, gy);
    ctx.stroke();
  }

  const algoMode = els.algorithmSelect.value;
  const dPath = state.lastDijkstra?.path || [];
  const bPath = state.lastBellman?.path || [];

  const dEdgeKeys = algoMode === "bellman-ford" ? new Set() : getPathEdgeKeys(dPath);
  const bEdgeKeys = algoMode === "dijkstra" ? new Set() : getPathEdgeKeys(bPath);
  const pathNodeIds = new Set([
    ...(algoMode !== "bellman-ford" ? dPath : []),
    ...(algoMode !== "dijkstra" ? bPath : [])
  ]);

  const nodeMap = Object.fromEntries(state.nodes.map((n) => [n.id, n]));
  state.edgeHitBoxes = [];

  // 1. Roads
  for (const edge of state.edges) {
    const a = nodeMap[edge.from];
    const b = nodeMap[edge.to];
    if (!a || !b) continue;

    const fwd = `${edge.from}->${edge.to}`;
    const rev = `${edge.to}->${edge.from}`;
    const isD = dEdgeKeys.has(fwd) || (!edge.directed && dEdgeKeys.has(rev));
    const isB = bEdgeKeys.has(fwd) || (!edge.directed && bEdgeKeys.has(rev));
    const isSelected = state.selectedEdgeId === edge.id;

    let strokeColor = "#475569";
    let lineWidth = 2.8;
    if (isSelected) {
      strokeColor = "#38bdf8";
      lineWidth = 4.6;
    } else if (isD) {
      strokeColor = "#fbbf24";
      lineWidth = 4.5;
    } else if (isB) {
      strokeColor = "#a78bfa";
      lineWidth = 4.5;
    }

    ctx.save();
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;
    if (isD || isB) {
      ctx.shadowColor = strokeColor;
      ctx.shadowBlur = 10;
    }
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
    ctx.restore();

    if (edge.directed) {
      drawArrowhead(ctx, a.x, a.y, b.x, b.y, strokeColor, 19);
    }

    // Weight pill
    const midX = (a.x + b.x) / 2;
    const midY = (a.y + b.y) / 2;
    const labelStr = `${edge.weight}${edge.directed ? " →" : ""}`;
    ctx.font = "700 11px 'JetBrains Mono', monospace";
    const textW = ctx.measureText(labelStr).width;
    const pillW = Math.max(32, textW + 14);
    const pillH = 20;

    ctx.fillStyle = isD ? "#291d04" : isB ? "#1e1338" : "#0b1222";
    ctx.strokeStyle = isSelected ? "#38bdf8" : isD ? "#fbbf24" : isB ? "#a78bfa" : "rgba(148,163,184,0.45)";
    ctx.lineWidth = 1.3;
    drawRoundedRect(ctx, midX - pillW / 2, midY - pillH / 2, pillW, pillH, 10);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#f8fafc";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(labelStr, midX, midY + 0.5);

    state.edgeHitBoxes.push({
      edgeId: edge.id,
      x: midX - pillW / 2 - 4,
      y: midY - pillH / 2 - 4,
      w: pillW + 8,
      h: pillH + 8
    });
  }

  // 2. Junctions
  for (const node of state.nodes) {
    const isSource = node.id === state.sourceId;
    const isTarget = node.id === state.targetId;
    const isOnPath = pathNodeIds.has(node.id);

    let fillStyle = "#0f172a";
    let strokeStyle = "#60a5fa";
    let lineWidth = 2.6;

    if (isSource) {
      fillStyle = "rgba(16, 185, 129, 0.25)";
      strokeStyle = "#10b981";
      lineWidth = 3.6;
    } else if (isTarget) {
      fillStyle = "rgba(244, 63, 94, 0.25)";
      strokeStyle = "#f43f5e";
      lineWidth = 3.6;
    } else if (isOnPath) {
      strokeStyle = "#fbbf24";
      lineWidth = 3.2;
    }

    ctx.save();
    ctx.fillStyle = fillStyle;
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    if (isSource || isTarget || isOnPath) {
      ctx.shadowColor = strokeStyle;
      ctx.shadowBlur = 12;
    }
    ctx.beginPath();
    ctx.arc(node.x, node.y, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = "#ffffff";
    ctx.font = "700 11.5px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(node.id, node.x, node.y + 0.5);

    ctx.font = "600 11px 'Plus Jakarta Sans', sans-serif";
    const tagW = Math.max(54, ctx.measureText(node.name).width + 14);
    ctx.fillStyle = "rgba(10, 15, 29, 0.88)";
    ctx.strokeStyle = "rgba(148, 163, 184, 0.22)";
    ctx.lineWidth = 1;
    drawRoundedRect(ctx, node.x - tagW / 2, node.y + 22, tagW, 18, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#e2e8f0";
    ctx.fillText(node.name, node.x, node.y + 31.5);
  }
}

function handleNodeClick(nodeId) {
  if (state.clickToggle === "source") {
    state.sourceId = nodeId;
    els.sourceSelect.value = nodeId;
    state.clickToggle = "target";
  } else {
    state.targetId = nodeId;
    els.targetSelect.value = nodeId;
    state.clickToggle = "source";
  }
  updateClickInstruction();
  runOptimization();
}

function selectEdge(edgeId) {
  const edge = state.edges.find((item) => item.id === edgeId);
  if (!edge) return;
  state.selectedEdgeId = edge.id;
  els.edgeFrom.value = edge.from;
  els.edgeTo.value = edge.to;
  els.edgeWeight.value = edge.weight;
  runOptimization();
}

function formatPathNames(path) {
  if (!path || path.length === 0) return "No reachable path";
  const map = Object.fromEntries(state.nodes.map((n) => [n.id, n.name]));
  return path.map((id) => `${id} (${map[id] || id})`).join(" → ");
}

function safeRunDijkstra(nodes, edges, sourceId, targetId) {
  if (typeof runDijkstra === "function") {
    return runDijkstra(nodes, edges, sourceId, targetId);
  }
  const start = performance.now();
  const dist = {};
  const prev = {};
  const adj = {};
  for (const n of nodes) {
    dist[n.id] = Infinity;
    prev[n.id] = null;
    adj[n.id] = [];
  }
  for (const e of edges) {
    const w = Number(e.weight);
    adj[e.from].push({ to: e.to, weight: w });
    if (!e.directed) adj[e.to].push({ to: e.from, weight: w });
  }
  dist[sourceId] = 0;
  const unvisited = new Set(nodes.map((n) => n.id));
  let ops = 0;
  while (unvisited.size > 0) {
    let u = null;
    let best = Infinity;
    for (const id of unvisited) {
      ops++;
      if (dist[id] < best) {
        best = dist[id];
        u = id;
      }
    }
    if (u === null || dist[u] === Infinity) break;
    unvisited.delete(u);
    for (const nb of adj[u]) {
      ops++;
      if (dist[u] + nb.weight < dist[nb.to]) {
        dist[nb.to] = dist[u] + nb.weight;
        prev[nb.to] = u;
      }
    }
  }
  const path = [];
  let c = targetId;
  while (c) {
    path.push(c);
    if (c === sourceId) break;
    c = prev[c];
  }
  return {
    cost: dist[targetId],
    path: dist[targetId] === Infinity ? [] : path.reverse(),
    steps: [`Computed shortest path from ${sourceId} to ${targetId}.`],
    operations: ops,
    elapsedMs: performance.now() - start,
    hasNegativeWeight: edges.some((e) => Number(e.weight) < 0)
  };
}

function safeRunBellmanFord(nodes, edges, sourceId, targetId) {
  if (typeof runBellmanFord === "function") {
    return runBellmanFord(nodes, edges, sourceId, targetId);
  }
  const start = performance.now();
  const dist = {};
  const prev = {};
  for (const n of nodes) {
    dist[n.id] = Infinity;
    prev[n.id] = null;
  }
  dist[sourceId] = 0;
  const allEdges = [];
  for (const e of edges) {
    const w = Number(e.weight);
    allEdges.push({ from: e.from, to: e.to, weight: w });
    if (!e.directed) allEdges.push({ from: e.to, to: e.from, weight: w });
  }
  let ops = 0;
  for (let i = 1; i < nodes.length; i++) {
    for (const e of allEdges) {
      ops++;
      if (dist[e.from] !== Infinity && dist[e.from] + e.weight < dist[e.to]) {
        dist[e.to] = dist[e.from] + e.weight;
        prev[e.to] = e.from;
      }
    }
  }
  let negCycle = false;
  for (const e of allEdges) {
    ops++;
    if (dist[e.from] !== Infinity && dist[e.from] + e.weight < dist[e.to]) {
      negCycle = true;
      break;
    }
  }
  const path = [];
  let c = targetId;
  while (c && !negCycle && dist[targetId] !== Infinity) {
    path.push(c);
    if (c === sourceId) break;
    c = prev[c];
  }
  return {
    cost: negCycle ? -Infinity : dist[targetId],
    path: negCycle || dist[targetId] === Infinity ? [] : path.reverse(),
    steps: [`Evaluated ${nodes.length - 1} relaxation passes.`],
    operations: ops,
    elapsedMs: performance.now() - start,
    negativeCycle: negCycle
  };
}

function runOptimization() {
  try {
    state.sourceId = els.sourceSelect.value;
    state.targetId = els.targetSelect.value;

    const dRes = safeRunDijkstra(state.nodes, state.edges, state.sourceId, state.targetId);
    const bRes = safeRunBellmanFord(state.nodes, state.edges, state.sourceId, state.targetId);

    state.lastDijkstra = dRes;
    state.lastBellman = bRes;

    if (bRes.negativeCycle) {
      showAlert(
        "Negative cycle detected! Bellman-Ford reports -∞ cost; Dijkstra's greedy assumption does not hold across negative cycles.",
        true
      );
    } else if (dRes.hasNegativeWeight) {
      showAlert(
        "Negative edge weight(s) present. Bellman-Ford guarantees optimal paths with negative weights; Dijkstra is best for non-negative roads.",
        false
      );
    } else if (dRes.cost === Infinity) {
      showAlert("Destination is unreachable from the selected Source junction.", true);
    } else {
      showAlert("");
    }

    els.dijkstraCost.textContent = dRes.cost === Infinity ? "∞" : `${dRes.cost}`;
    els.dijkstraPath.textContent = formatPathNames(dRes.path);
    els.dijkstraTime.textContent = `${dRes.elapsedMs.toFixed(3)} ms`;
    els.dijkstraOps.textContent = `Evaluations / Relaxations: ${dRes.operations}`;

    els.bellmanCost.textContent = bRes.negativeCycle
      ? "-∞"
      : bRes.cost === Infinity
      ? "∞"
      : `${bRes.cost}`;
    els.bellmanPath.textContent = bRes.negativeCycle
      ? "Undefined due to negative cycle"
      : formatPathNames(bRes.path);
    els.bellmanTime.textContent = `${bRes.elapsedMs.toFixed(3)} ms`;
    els.bellmanOps.textContent = `Edge Relaxations: ${bRes.operations}`;

    const mode = els.algorithmSelect.value;
    const combinedLogs = [];
    if (mode !== "bellman-ford") {
      dRes.steps.forEach((s) => combinedLogs.push(`[Dijkstra] ${s}`));
    }
    if (mode !== "dijkstra") {
      bRes.steps.forEach((s) => combinedLogs.push(`[Bellman-Ford] ${s}`));
    }

    els.traceLog.innerHTML = combinedLogs.length
      ? combinedLogs.map((line) => `<div class="trace-item">${line}</div>`).join("")
      : `<div class="muted">No steps recorded.</div>`;

    renderMap();
  } catch (err) {
    els.traceLog.innerHTML = `<div class="trace-item" style="color:#fda4af;">Runtime error: ${err.message}</div>`;
    renderMap();
  }
}

function runSizeBenchmark() {
  const sizes = [6, 12, 25, 50];
  const genFn = typeof generateSyntheticGraph === "function" ? generateSyntheticGraph : fallbackGenerateGraph;
  const results = sizes.map((vCount) => {
    const g = genFn(vCount, 2.0);
    let dSum = 0;
    let bSum = 0;
    const runs = 5;
    for (let i = 0; i < runs; i++) {
      dSum += safeRunDijkstra(g.nodes, g.edges, g.sourceId, g.targetId).elapsedMs;
      bSum += safeRunBellmanFord(g.nodes, g.edges, g.sourceId, g.targetId).elapsedMs;
    }
    return {
      vCount: g.nodes.length,
      eCount: g.edges.length,
      dAvg: dSum / runs,
      bAvg: bSum / runs
    };
  });

  const maxTime = Math.max(...results.map((r) => Math.max(r.dAvg, r.bAvg)), 0.001);

  els.benchmarkBars.innerHTML = results
    .map((r) => {
      const dPct = Math.max(6, (r.dAvg / maxTime) * 100);
      const bPct = Math.max(6, (r.bAvg / maxTime) * 100);
      return `
        <div class="bar-group">
          <div class="bar-label mono">
            <span>V=${r.vCount}, E=${r.eCount}</span>
            <span>D: ${r.dAvg.toFixed(3)}ms · BF: ${r.bAvg.toFixed(3)}ms</span>
          </div>
          <div class="bar-track">
            <div class="bar-d" style="width: ${dPct}%"></div>
            <div class="bar-b" style="width: ${bPct}%"></div>
          </div>
        </div>
      `;
    })
    .join("");

  els.benchmarkBody.innerHTML = results
    .map((r) => {
      const winner = r.dAvg <= r.bAvg ? "Dijkstra" : "Bellman-Ford";
      return `
        <tr>
          <td class="mono">V=${r.vCount}, E=${r.eCount}</td>
          <td class="mono">${r.dAvg.toFixed(3)} ms</td>
          <td class="mono">${r.bAvg.toFixed(3)} ms</td>
          <td><strong>${winner}</strong></td>
        </tr>
      `;
    })
    .join("");
}

function initApp() {
  loadPreset("small");
  populateSelects();
  renderMap();
  runOptimization();

  els.runBtn.addEventListener("click", runOptimization);
  els.sourceSelect.addEventListener("change", runOptimization);
  els.targetSelect.addEventListener("change", runOptimization);
  els.algorithmSelect.addEventListener("change", runOptimization);

  els.presetSelect.addEventListener("change", (e) => {
    loadPreset(e.target.value);
    populateSelects();
    runOptimization();
  });

  els.resetBtn.addEventListener("click", () => {
    loadPreset(state.presetKey);
    populateSelects();
    runOptimization();
  });

  els.benchmarkBtn.addEventListener("click", runSizeBenchmark);

  els.saveEdgeBtn.addEventListener("click", () => {
    const from = els.edgeFrom.value;
    const to = els.edgeTo.value;
    const weight = Number(els.edgeWeight.value);

    if (from === to) {
      showAlert("Source and destination of a road cannot be the same junction.", true);
      return;
    }
    if (Number.isNaN(weight)) {
      showAlert("Please enter a valid numeric road weight.", true);
      return;
    }

    const existing = state.edges.find(
      (e) => (e.from === from && e.to === to) || (!e.directed && e.from === to && e.to === from)
    );

    if (existing) {
      existing.weight = weight;
      if (weight < 0) existing.directed = true;
      state.selectedEdgeId = existing.id;
    } else {
      const newEdge = {
        id: `edge_${Date.now()}`,
        from,
        to,
        weight,
        directed: weight < 0
      };
      state.edges.push(newEdge);
      state.selectedEdgeId = newEdge.id;
    }

    runOptimization();
  });

  els.removeEdgeBtn.addEventListener("click", () => {
    const from = els.edgeFrom.value;
    const to = els.edgeTo.value;
    const before = state.edges.length;
    state.edges = state.edges.filter(
      (e) =>
        !(
          (e.from === from && e.to === to) ||
          (!e.directed && e.from === to && e.to === from) ||
          (state.selectedEdgeId && e.id === state.selectedEdgeId)
        )
    );
    state.selectedEdgeId = null;
    if (state.edges.length === before) {
      showAlert("No matching road found to remove.", true);
    }
    runOptimization();
  });

  els.addNodeBtn.addEventListener("click", () => {
    const rawName = els.newNodeName.value.trim();
    const nextIndex = state.nodes.length + 1;
    const id = `L${nextIndex}`;
    const name = rawName || `Location ${nextIndex}`;
    const x = 125 + ((nextIndex * 120) % 630);
    const y = 95 + ((nextIndex * 88) % 290);

    state.nodes.push({ id, name, x, y });

    if (state.nodes.length >= 2) {
      const prev = state.nodes[state.nodes.length - 2];
      state.edges.push({
        id: `edge_${prev.id}_${id}`,
        from: prev.id,
        to: id,
        weight: 7
      });
    }

    els.newNodeName.value = "";
    populateSelects();
    runOptimization();
  });

  els.graphCanvas.addEventListener("click", (e) => {
    const rect = els.graphCanvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const scaleX = els.graphCanvas.width / rect.width;
    const scaleY = els.graphCanvas.height / rect.height;
    const cx = (e.clientX - rect.left) * scaleX;
    const cy = (e.clientY - rect.top) * scaleY;

    for (const node of state.nodes) {
      if (Math.hypot(cx - node.x, cy - node.y) <= 22) {
        handleNodeClick(node.id);
        return;
      }
    }

    for (const box of state.edgeHitBoxes) {
      if (cx >= box.x && cx <= box.x + box.w && cy >= box.y && cy <= box.y + box.h) {
        selectEdge(box.edgeId);
        return;
      }
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}