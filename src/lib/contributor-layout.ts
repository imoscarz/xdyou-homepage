export interface BubblePosition {
  x: number;
  y: number;
  size: number;
}

/** Seeded best-candidate circle packing: no rows, stable on revisits and resize. */
export function scatterContributors(
  count: number,
  width: number,
  height: number,
): BubblePosition[] {
  let seed = 20260917;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const positions: BubblePosition[] = [];
  const base = Math.min(
    width < 500 ? 32 : 48,
    Math.sqrt((width * height) / Math.max(1, count)) * 0.46,
  );
  for (let index = 0; index < count; index++) {
    const size = base + random() * (base * 0.375);
    const inset = size / 2 + 12;
    let best = { x: inset, y: inset, size };
    let bestClearance = -Infinity;
    for (let attempt = 0; attempt < 600; attempt++) {
      const candidate = {
        x: inset + random() * Math.max(0, width - inset * 2),
        y: inset + random() * Math.max(0, height - inset * 2),
        size,
      };
      const clearance = positions.reduce(
        (minimum, other) =>
          Math.min(
            minimum,
            Math.hypot(candidate.x - other.x, candidate.y - other.y) -
              (size + other.size) / 2,
          ),
        Infinity,
      );
      if (clearance > bestClearance) {
        best = candidate;
        bestClearance = clearance;
      }
    }
    positions.push(best);
  }
  return positions;
}
