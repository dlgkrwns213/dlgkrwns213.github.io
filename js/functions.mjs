import Queue from "./queue.mjs";
import MinHeap from "./minHeap.mjs";


// 그래프 만들기
function makeGraph(n, lineGraph) {
  const graph = Array(n+1).fill().map(() => []);

  for (let line of lineGraph) {
    let u = line[0];
    let v = line[1];
    let w = line[2];

    graph[u].push([v, w]);
    graph[v].push([u, w]);
  }

  console.log(graph)
  graph.forEach(line => line.sort((a, b) => a[0]-b[0]));

  return graph;
}


// bfs 구현
function bfs(nodes, lineGraph, startIdx=1) {
  const n = nodes.length;
  const graph = makeGraph(n, lineGraph);

  const q = new Queue();
  q.push([startIdx, 0]);

  const visited = Array(n+1).fill(false);
  visited[startIdx] = true;

  let level = 0;
  const sameLevel = [];
  const orderIdx = [];
  const levels = [];
  while (!q.isEmpty()) {
    let now = q.pop();
    let nowIdx = now[0];
    let nowLevel = now[1];

    if (level != nowLevel) {
      level = nowLevel;
      levels.push([...sameLevel]);
      sameLevel.length = 0;
    }

    sameLevel.push(nowIdx);
    orderIdx.push(nowIdx);
    
    for (let nxt of graph[nowIdx]) {
      let nxtIdx = nxt[0];
      if (!visited[nxtIdx]) {
        visited[nxtIdx] = true;
        q.push([nxtIdx, nowLevel+1]);
      }
    }
  }

  levels.push([...sameLevel]);

  return {levels, orderIdx};
}


// dfs 구현
function dfs(nodes, lineGraph, startIdx=1) {
  let n = nodes.length;
  const graph = makeGraph(n, lineGraph);

  let dfsNodeOrder = [];
  let visited = Array(n+1).fill(false);
  visited[startIdx] = true;

  dfs_recur(startIdx, dfsNodeOrder, visited, graph);

  return dfsNodeOrder;
}

function dfs_recur(nowIdx, dfsNodeOrder, visited, graph) {
  dfsNodeOrder.push(nowIdx);

  for (let nxt of graph[nowIdx]) {
    let nxtIdx = nxt[0];
    if (!visited[nxtIdx]) {
      visited[nxtIdx] = true;
      dfs_recur(nxtIdx, dfsNodeOrder, visited, graph);
    }
  }
}


// dijkstra 구현
function dijkstra(nodes, lineGraph, startIdx=1) {
  const INF = Infinity;

  let n = nodes.length;
  const graph = makeGraph(n, lineGraph);

  let hq = new MinHeap();
  hq.push([0, startIdx]);

  let distances = Array(n+1).fill(INF);
  distances[startIdx] = 0;

  let nodeOrder = []
  while (!hq.isEmpty()) {
    let now = hq.pop();
    let dist = now[0];
    let nowIdx = now[1];

    if (distances[nowIdx] < dist)
      continue;
    nodeOrder.push(nowIdx);

    for (let nw of graph[nowIdx]) {
      let nxtIdx = nw[0];
      let nxtDist = dist + nw[1];

      if (distances[nxtIdx] > nxtDist) {
        distances[nxtIdx] = nxtDist;
        hq.push([nxtDist, nxtIdx]);
      }
    }
  }

  console.log(nodeOrder)
  return nodeOrder;
}

export { bfs, dfs, dijkstra };