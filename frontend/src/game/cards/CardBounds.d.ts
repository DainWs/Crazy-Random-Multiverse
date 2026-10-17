
type OriginalPosition = {
  x: number;
  y: number;
  z?: number;
  w?: number;
}

type OriginalSize = {
  width: number;
  height: number;
}

type OriginalScale = {
  scaleX: number;
  scaleY: number | undefined;
}

type OriginalBounds = {
  position: OriginalPosition;
  size: OriginalSize;
  scale: OriginalScale;
  depth: number;
}

export type { OriginalPosition, OriginalSize, OriginalScale, OriginalBounds };