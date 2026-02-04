import type { Node } from "@xyflow/react";

type NodeWithMeasured = Node & {
  measured?: { width?: number; height?: number };
  width?: number;
  height?: number;
};

type Size = { w: number; h: number };
type Rect = { x1: number; y1: number; x2: number; y2: number; w: number; h: number };

export type AvoidOverlapOptions = {
  paddingX?: number;
  paddingY?: number;
  sameRowThreshold?: number;
  maxIterations?: number;
};

const DEFAULT_SIZES: Record<string, Size> = {
  // Video nodes are visually large in this project; using a conservative estimate
  video: { w: 420, h: 640 },
  start: { w: 180, h: 90 },
  end: { w: 360, h: 220 },
  api: { w: 360, h: 260 },
  leadCapture: { w: 360, h: 340 },
  default: { w: 360, h: 240 },
};

function getSize(node: Node): Size {
  const n = node as NodeWithMeasured;
  const base = (node.type && DEFAULT_SIZES[node.type]) || DEFAULT_SIZES.default;
  const w = n.measured?.width ?? n.width ?? base.w;
  const h = n.measured?.height ?? n.height ?? base.h;
  return { w, h };
}

function rectFor(node: Node): Rect {
  const { w, h } = getSize(node);
  const x1 = node.position.x;
  const y1 = node.position.y;
  return { x1, y1, x2: x1 + w, y2: y1 + h, w, h };
}

function intersects(a: Rect, b: Rect, padX: number, padY: number) {
  return !(
    a.x2 + padX <= b.x1 ||
    a.x1 >= b.x2 + padX ||
    a.y2 + padY <= b.y1 ||
    a.y1 >= b.y2 + padY
  );
}

/**
 * Moves a single node until it no longer overlaps with the given `others`.
 * Prefer shifting on X when nodes are in the same visual row.
 */
export function placeNodeAvoidingOverlaps(
  others: Node[],
  node: Node,
  options: AvoidOverlapOptions = {}
): Node {
  const {
    paddingX = 56,
    paddingY = 56,
    sameRowThreshold = 120,
    maxIterations = 250,
  } = options;

  const placed: Node = {
    ...node,
    position: { ...node.position },
  };

  let iterations = 0;
  while (iterations < maxIterations) {
    const a = rectFor(placed);
    const hit = others.find((o) => intersects(a, rectFor(o), paddingX, paddingY));
    if (!hit) break;

    const b = rectFor(hit);
    const sameRow = Math.abs(placed.position.y - hit.position.y) < sameRowThreshold;

    if (sameRow) {
      // push right past the colliding node
      placed.position.x = b.x2 + paddingX;
    } else {
      // push down past the colliding node
      placed.position.y = b.y2 + paddingY;
    }

    iterations++;
  }

  return placed;
}

/**
 * De-overlaps the full node list deterministically while preserving original order.
 */
export function resolveOverlaps(nodes: Node[], options: AvoidOverlapOptions = {}): Node[] {
  const sorted = [...nodes].sort(
    (a, b) => a.position.y - b.position.y || a.position.x - b.position.x
  );

  const placed: Node[] = [];
  for (const n of sorted) {
    placed.push(placeNodeAvoidingOverlaps(placed, n, options));
  }

  const byId = new Map(placed.map((n) => [n.id, n] as const));
  return nodes.map((n) => byId.get(n.id) ?? n);
}

/**
 * De-overlaps only one node (useful after dragging) without moving everything else.
 */
export function resolveOverlapsForNode(
  nodes: Node[],
  nodeId: string,
  options: AvoidOverlapOptions = {}
): Node[] {
  const target = nodes.find((n) => n.id === nodeId);
  if (!target) return nodes;

  const others = nodes.filter((n) => n.id !== nodeId);
  const placed = placeNodeAvoidingOverlaps(others, target, options);
  return nodes.map((n) => (n.id === nodeId ? placed : n));
}
