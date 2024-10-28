export function tileIndexToTile(tile) {
  const [x, y] = tile.split(",");
  return { x: parseInt(x), y: parseInt(y) };
}
