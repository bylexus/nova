import Laser, { LaserDirection } from "./Laser";
import { TILE_SIZE, GAME_ASSETS } from "../Constants";

export default class VLaser extends Laser {
  protected _direction: LaserDirection.DOWN | LaserDirection.UP;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    direction: LaserDirection.DOWN | LaserDirection.UP
  ) {
    super(scene, x, y, TILE_SIZE, 1, GAME_ASSETS.laserV.key);
    this.setOrigin(0.5, direction === LaserDirection.DOWN ? 0 : 1);
    this._direction = direction;
  }

  public get direction(): LaserDirection {
    return this._direction;
  }

  public grow(amount: number): void {
    this.height += amount;
  }
}
