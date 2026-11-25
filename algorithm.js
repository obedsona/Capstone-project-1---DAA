/**
 * Reconstructs path from source to target using parent/prev map.
 */
function reconstructPath(prev, sourceId, targetId) {
  if (sourceId === targetId) return [sourceId];
  const path = [];
  let curr = targetId;
  const visited = new Set();

  while (curr !== undefined && curr !== null) {
    if (visited.has(curr)) return [];
    visited.add(curr);
    path.push(curr);
    if (curr === sourceId) break;
    curr = prev[curr];
  }

  if (path[path.length - 1] !== sourceId) return [];
  return path.reverse();
}

/**
 * Dijkstra's Shortest Path Algorithm
 * Works for non-negative edge weights. Warns if negative weights are present.
 */
function runDijkstra(nodes, edges, sourceId, targetId) {
  const startTime = performance.now();
  const hasNegativeWeight = edges.some((e) => Number(e.weight) < 0);

  const dist = {};
  const prev = {};
  const visited = new Set();
  const steps = [];
  let operations = 0;

  const adj = {};
  for (const n of nodes) {
    dist[n.id] = Infinity;
    prev[n.id] = null;
    adj[n.id] = [];
  }

  for (const e of edges) {
    const w = Number(e.weight);
    adj[e.from].push({ to: e.to, weight: w, edgeId: e.id });
    if (!e.directed) {
      adj[e.to].push({ to: e.from, weight: w, edgeId: e.id });
    }
  }

  dist[sourceId] = 0;
  steps.push(`Initialized distance(${sourceId}) = 0; all other junctions = ∞.`);

  const unvisited = new Set(nodes.map((n) => n.id));

  while (unvisited.size > 0) {
    let u = null;
    let bestDist = Infinity;
    for (const id of unvisited) {
      operations++;
      if (dist[id] < bestDist) {
        bestDist = dist[id];
        u = id;
      }
    }

    if (u === null || dist[u] === Infinity) break;

    unvisited.delete(u);
    visited.add(u);

    if (steps.length < 35) {
      steps.push(`Visited ${u} (current shortest cost: ${dist[u]}).`);
    }

    if (u === targetId && !hasNegativeWeight) break;

    for (const neighbor of adj[u] || []) {
      operations++;
      if (visited.has(neighbor.to)) continue;
      const alt = dist[u] + neighbor.weight;
      if (alt < dist[neighbor.to]) {
        dist[neighbor.to] = alt;
        prev[neighbor.to] = u;
        if (steps.length < 35) {
          steps.push(`  Relaxed edge ${u} → ${neighbor.to} (w=${neighbor.weight}): new cost = ${alt}.`);
        }
      }
    }
  }

  const elapsedMs = performance.now() - startTime;
  const path = dist[targetId] === Infinity ? [] : reconstructPath(prev, sourceId, targetId);

  return {
    algorithm: "Dijkstra",
    cost: dist[targetId],
    path,
    steps,
    operations,
    elapsedMs,
    hasNegativeWeight,
    negativeCycle: false
  };
}

/**
 * Bellman-Ford Shortest Path Algorithm
 * Supports negative edge weights and detects reachable negative cycles.
 */
function runBellmanFord(nodes, edges, sourceId, targetId) {
  const startTime = performance.now();
  const dist = {};
  const prev = {};
  const steps = [];
  let operations = 0;

  for (const n of nodes) {
    dist[n.id] = Infinity;
    prev[n.id] = null;
  }
  dist[sourceId] = 0;

  const directedEdges = [];
  for (const e of edges) {
    const w = Number(e.weight);
    directedEdges.push({ from: e.from, to: e.to, weight: w });
    if (!e.directed) {
      directedEdges.push({ from: e.to, to: e.from, weight: w });
    }
  }

  const vCount = nodes.length;
  for (let i = 1; i <= vCount - 1; i++) {
    let updatedInPass = false;
    for (const e of directedEdges) {
      operations++;
      if (dist[e.from] !== Infinity && dist[e.from] + e.weight < dist[e.to]) {
        dist[e.to] = dist[e.from] + e.weight;
        prev[e.to] = e.from;
        updatedInPass = true;
        if (steps.length < 35) {
          steps.push(`Pass ${i}: Relaxed ${e.from} → ${e.to} (w=${e.weight}) => cost ${dist[e.to]}.`);
        }
      }
    }
    if (!updatedInPass) {
      steps.push(`Converged early at Pass ${i} (no further relaxations).`);
      break;
    }
  }

  let negativeCycle = false;
  for (const e of directedEdges) {
    operations++;
    if (dist[e.from] !== Infinity && dist[e.from] + e.weight < dist[e.to]) {
      negativeCycle = true;
      steps.push(`Negative cycle detected along ${e.from} → ${e.to}! Shortest path is undefined.`);
      break;
    }
  }

  const elapsedMs = performance.now() - startTime;
  const path =
    negativeCycle || dist[targetId] === Infinity ? [] : reconstructPath(prev, sourceId, targetId);

  return {
    algorithm: "Bellman-Ford",
    cost: negativeCycle ? -Infinity : dist[targetId],
    path,
    steps,
    operations,
    elapsedMs,
    negativeCycle
  };
}

/**
 * Generates synthetic weighted graphs of size V for benchmarking.
 */
function generateSyntheticGraph(vCount, extraEdgesRatio = 1.6) {
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
    const key = [a, b].sort().join("--");
    edgeSet.add(key);
    edges.push({
      id: `E_${a}_${b}`,
      from: a,
      to: b,
      weight: ((i * 7) % 15) + 3,
      directed: false
    });
  }

  const targetEdges = Math.min(
    (vCount * (vCount - 1)) / 2,
    Math.floor(vCount * extraEdgesRatio)
  );

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
    edges.push({
      id: `E_${a}_${b}`,
      from: a,
      to: b,
      weight: Math.floor(rand() * 25) + 2,
      directed: false
    });
  }

  return {
    nodes,
    edges,
    sourceId: nodes[0].id,
    targetId: nodes[nodes.length - 1].id
  };
}