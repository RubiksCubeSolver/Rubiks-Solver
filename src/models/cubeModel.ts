export const FACES = {
  TOP: 0,
  BOTTOM: 1,
  LEFT: 2,
  RIGHT: 3,
  FRONT: 4,
  BACK: 5
};

export const COLORS = {
  WHITE: 'white',
  YELLOW: 'yellow',
  ORANGE: 'orange',
  RED: 'red',
  GREEN: 'green',
  BLUE: 'blue'
};

export function createSolvedCube() {
  return [
    Array(9).fill(COLORS.WHITE),
    Array(9).fill(COLORS.YELLOW),
    Array(9).fill(COLORS.ORANGE),
    Array(9).fill(COLORS.RED),
    Array(9).fill(COLORS.GREEN),
    Array(9).fill(COLORS.BLUE)
  ];
}

type CubeColor = typeof COLORS[keyof typeof COLORS];
type CubeFace = number[][];
type Cube = CubeColor[][];

interface FaceIndices {
  cornerIndices: number[];
  edgeIndices: number[];
  centerIndex: number;
}

export const getFaceIndices = (): FaceIndices => {
  return {
    cornerIndices: [0, 2, 6, 8],
    edgeIndices: [1, 3, 5, 7],
    centerIndex: 4
  };
}; 