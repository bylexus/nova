import { TILE_SIZE } from "../Constants";

export function snapToGrid(pixelValue: number): number {
	return Math.round(pixelValue / TILE_SIZE) * TILE_SIZE;
}

export function snapToHalfGrid(pixelValue: number): number {
	const halfGrid = TILE_SIZE / 2;
	return Math.round(pixelValue / halfGrid) * halfGrid;
}

export function floorToGrid(pixelValue: number): number {
	return Math.floor(pixelValue / TILE_SIZE) * TILE_SIZE;
}
