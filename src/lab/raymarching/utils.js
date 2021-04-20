export function degToRad(deg) {
  return deg * (Math.PI / 180);
}

export function radToDeg(rad) {
  return rad * (180 / Math.PI);
}

export function truncateBetween(val, min, max) {
  return Math.max(min, Math.min(val, max));
}

export function getVectorModulus([x, y]) {
  return Math.sqrt(x ** 2 + y ** 2);
}

export function getNormalizedVector([x, y]) {
  const mod = getVectorModulus([x, y]);

  return [x / mod, y / mod];
}

export function getDistanceBetweenPoints([x1, y1], [x2, y2]) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

export function signedDistanceToCircle([px, py], { center: [cx, cy], radius }) {
  return getDistanceBetweenPoints([cx, cy], [px, py]) - radius;
}

export function getSegmentVector([x1, y1], [x2, y2]) {
  return [x2 - x1, y2 - y1];
}

export function getDistanceBetweenPointRect(p, r) {
  const dx = Math.max(r.origin[0] - p[0], 0, p[0] - (r.origin[0] + r.size[0]));
  const dy = Math.max(r.origin[1] - p[1], 0, p[1] - (r.origin[1] + r.size[1]));

  return Math.sqrt(dx ** 2 + dy ** 2);
}
