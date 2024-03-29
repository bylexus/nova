import Laser, { LaserDirection } from "./Laser";
import { TILE_SIZE, GAME_ASSETS, LASER_WIDTH } from "../Constants";

export default class VLaser extends Laser {
  protected _direction: LaserDirection.DOWN | LaserDirection.UP;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    direction: LaserDirection.DOWN | LaserDirection.UP
  ) {
    super(scene, x, y, LASER_WIDTH, 1, GAME_ASSETS.laserV.key);
    this.setOrigin(0.5, direction === LaserDirection.DOWN ? 0 : 1);
    this._direction = direction;
  }

  public get direction(): LaserDirection {
    return this._direction;
  }

  public grow(amount: number): void {
    this.height += amount * this.growFactor;
  }

  public get head(): Phaser.Geom.Point {
    if (this.direction === LaserDirection.DOWN) {
      // return the head x/y point of this laser when pointing down:
      return new Phaser.Geom.Point(this.x, this.y + this.height);
    } else {
      // return the head x/y point of this laser when pointing up:
      return new Phaser.Geom.Point(this.x, this.y - this.height);
    }
  }
}
