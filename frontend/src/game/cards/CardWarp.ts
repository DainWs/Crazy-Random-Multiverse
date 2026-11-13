import type { Corners3D, Point2D, Rotation, Size2D } from "@/domain/Geometry";
import { WARP_DISPLACEMENT_AMOUNT } from "@/core/Constants";

/** The four corners of a card as the board shows them, in the space of the card: top left, top right, bottom right, bottom left. */
type CardQuad = [Point2D, Point2D, Point2D, Point2D];

type CardPlacement = {
  center: Point2D;
  scale: Point2D;
  quad: CardQuad;
};

type DisplacementMap = Size2D & { data: Uint8ClampedArray };

/**
 * Where to put a card so it fills the slot with `corners` (VIEW-1, VIEW-2): at the middle of the corners, turned with the slot,
 * and as big as the widest and tallest edges, so the quad that the filter draws never leaves the rectangle of the card.
 */
function calculateCardPlacement(corners: Corners3D, rotation: Rotation, cardSize: Size2D): CardPlacement {
  const { tl, tr, br, bl } = corners;
  const projected = [tl, tr, br, bl];

  const center: Point2D = {
    x: projected.reduce((sum, corner) => sum + corner.x, 0) / projected.length,
    y: projected.reduce((sum, corner) => sum + corner.y, 0) / projected.length
  };

  const rad = (rotation * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const unscaled = projected.map((corner) => {
    const dx = corner.x - center.x;
    const dy = corner.y - center.y;
    return { x: dx * cos + dy * sin, y: -dx * sin + dy * cos };
  });

  const halfWidth = Math.max(...unscaled.map((corner) => Math.abs(corner.x)));
  const halfHeight = Math.max(...unscaled.map((corner) => Math.abs(corner.y)));
  const scale: Point2D = { x: (2 * halfWidth) / cardSize.width, y: (2 * halfHeight) / cardSize.height };

  const quad = unscaled.map((corner) => ({ x: corner.x / scale.x, y: corner.y / scale.y })) as CardQuad;

  return { center, scale, quad };
}

/** Solves `matrix * x = values` by Gaussian elimination with partial pivoting. */
function solveLinearSystem(matrix: number[][], values: number[]): number[] {
  const size = values.length;

  for (let column = 0; column < size; column++) {
    let pivot = column;
    for (let row = column + 1; row < size; row++) {
      if (Math.abs(matrix[row][column]) > Math.abs(matrix[pivot][column])) {
        pivot = row;
      }
    }
    [matrix[column], matrix[pivot]] = [matrix[pivot], matrix[column]];
    [values[column], values[pivot]] = [values[pivot], values[column]];

    for (let row = column + 1; row < size; row++) {
      const factor = matrix[row][column] / matrix[column][column];
      for (let k = column; k < size; k++) {
        matrix[row][k] -= factor * matrix[column][k];
      }
      values[row] -= factor * values[column];
    }
  }

  const solution = new Array<number>(size).fill(0);
  for (let row = size - 1; row >= 0; row--) {
    let rest = values[row];
    for (let k = row + 1; k < size; k++) {
      rest -= matrix[row][k] * solution[k];
    }
    solution[row] = rest / matrix[row][row];
  }

  return solution;
}

/** The eight coefficients of the projective transform that takes each point of `from` to the one of `to`. */
function calculateHomography(from: Point2D[], to: Point2D[]): number[] {
  const matrix: number[][] = [];
  const values: number[] = [];

  for (let i = 0; i < from.length; i++) {
    const { x, y } = from[i];
    const { x: u, y: v } = to[i];
    matrix.push([x, y, 1, 0, 0, 0, -u * x, -u * y]);
    values.push(u);
    matrix.push([0, 0, 0, x, y, 1, -v * x, -v * y]);
    values.push(v);
  }

  return solveLinearSystem(matrix, values);
}

function encode(displacement: number): number {
  return 255 * (0.5 + displacement / WARP_DISPLACEMENT_AMOUNT);
}

/**
 * The map of the Displacement filter that draws a card, `cardSize` plus `padding` on every side, inside `quad`. The filter
 * reads the card at the pixel plus the displacement of the map: the red channel moves it along x and the green one along y, but
 * y goes the other way, so a positive value of the map takes the card down.
 */
function buildDisplacementMap(quad: CardQuad, cardSize: Size2D, padding: number): DisplacementMap {
  const width = cardSize.width + padding * 2;
  const height = cardSize.height + padding * 2;
  const centerX = width / 2;
  const centerY = height / 2;

  const onMap = quad.map((corner) => ({ x: centerX + corner.x, y: centerY + corner.y }));
  const cardCorners: Point2D[] = [
    { x: padding, y: padding },
    { x: padding + cardSize.width, y: padding },
    { x: padding + cardSize.width, y: padding + cardSize.height },
    { x: padding, y: padding + cardSize.height }
  ];
  const h = calculateHomography(onMap, cardCorners);

  const data = new Uint8ClampedArray(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const denominator = h[6] * x + h[7] * y + 1;
      const sourceX = (h[0] * x + h[1] * y + h[2]) / denominator;
      const sourceY = (h[3] * x + h[4] * y + h[5]) / denominator;

      const index = (y * width + x) * 4;
      data[index] = encode((sourceX - x) / width);
      data[index + 1] = encode(-(sourceY - y) / height);
      data[index + 3] = 255;
    }
  }

  return { width, height, data };
}

export { calculateCardPlacement, buildDisplacementMap };
export type { CardQuad, CardPlacement, DisplacementMap };
