import { TILE_SIZE } from "../Constants";

export function snapToGrid(pixelValue: number): number {
	return Math.round(pixelValue / TILE_SIZE) * TILE_SIZE;
}
